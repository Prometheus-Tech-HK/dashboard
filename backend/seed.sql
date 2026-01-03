INSERT INTO "User" (username, password, name, "updatedAt") VALUES ('admin', '$2b$10$1xvdp4yaEWse.jL3TNHSgOfe4gYn8YRfUrEeKFqC6uNOjFOh/.3pG', 'Admin User', NOW()) ON CONFLICT (username) DO NOTHING;
