import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { categorizeTransaction } from "../utils/categorizer.js";
import { logger } from "../utils/logger.js";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function importCsv(filePath: string, projectName: string) {
    const results: any[] = [];

    logger.info(`Reading CSV from: ${filePath} for project: ${projectName}`);

    // Ensure project exists
    const project = await prisma.project.upsert({
        where: { name: projectName },
        update: {},
        create: { name: projectName },
    });

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("error", (err) => {
                logger.error(err, "Error reading CSV:");
                reject(err);
            })
            .on("end", async () => {
                logger.info(`Parsed ${results.length} rows. Starting import stage...`);

                let importedCount = 0;
                let skippedCount = 0;

                for (const row of results) {
                    // Clean keys to handle potential BOM issues
                    const getRowValue = (key: string) => {
                        const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
                        const target = normalize(key);
                        const cleanKey = Object.keys(row).find(k => normalize(k).includes(target));
                        return cleanKey ? row[cleanKey] : undefined;
                    };

                    const rawTransDate = getRowValue("Transaction Date");
                    const rawValueDate = getRowValue("Value Date");

                    const parseCustomDate = (dateStr: string | undefined): Date | null => {
                        if (!dateStr) return null;
                        
                        // Try splitting by /, ., or -
                        const parts = dateStr.trim().split(/[./-]/);
                        if (parts.length !== 3) return null;

                        const day = parseInt((parts[0] || "").trim());
                        const month = parseInt((parts[1] || "").trim());
                        let year = parseInt((parts[2] || "").trim());

                        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
                        
                        // Handle 2-digit year (assume 20xx for now)
                        if (year < 100) {
                            year += 2000;
                        }

                        const date = new Date(year, month - 1, day);
                        return isNaN(date.getTime()) ? null : date;
                    };

                    const transactionDate = parseCustomDate(rawTransDate);
                    const valueDate = parseCustomDate(rawValueDate) || transactionDate;

                    if (!transactionDate || !valueDate) {
                        logger.warn({ row, rawTransDate }, "Invalid date format, skipping row.");
                        skippedCount++;
                        continue;
                    }

                    const parseCurrency = (val: any) => {
                        if (val === undefined || val === null) return 0;
                        const str = String(val).trim();
                        if (str === "" || str === "-" || str === " ") return 0;
                        const parsed = parseFloat(str.replace(/,/g, ""));
                        return isNaN(parsed) ? 0 : parsed;
                    };

                    const moneyOut = Math.abs(parseCurrency(getRowValue("Money Out")));
                    const moneyIn = parseCurrency(getRowValue("Money  In"));
                    const balance = parseCurrency(getRowValue("Ledger Balance"));
                    const details = getRowValue("Transaction Details") || "";
                    const reference = getRowValue("Bank Reference Number") || null;

                    const category = categorizeTransaction(details, moneyIn);
                    const type = moneyIn > 0 ? "INCOME" : "EXPENSE";


                    try {
                        await prisma.transaction.create({
                            data: {
                                transactionDate,
                                valueDate,
                                details,
                                moneyOut,
                                moneyIn,
                                balance,
                                reference,
                                category,
                                type,
                                projectId: project.id,
                            },
                        });
                        importedCount++;
                    } catch (e) {
                        logger.error(e, "Error inserting row into DB:");
                        skippedCount++;
                    }
                }

                logger.info(`Import summary: Imported: ${importedCount}, Skipped: ${skippedCount}`);
                await prisma.$disconnect();
                await pool.end();
                resolve();
            });
    });
}

const args = process.argv.slice(2);
const filePath = args[0];
const projectName = args[1];

if (!filePath || !projectName) {
    logger.error("Usage: bun run src/scripts/import-csv.ts <path-to-csv> <project-name>");
    process.exit(1);
}

await importCsv(filePath, projectName);
logger.info("Script finished successfully.");
process.exit(0);
