import pino from 'pino';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const transport = pino.transport({
    targets: [
        {
            target: 'pino-pretty',
            options: {
                ignore: 'pid,hostname',
                translateTime: 'SYS:standard',
            },
            level: 'info',
        },
        {
            target: 'pino/file',
            options: {
                destination: path.join(logsDir, 'backend.log'),
                mkdir: true,
            },
            level: 'info',
        },
    ],
});

export const logger = pino(transport);
