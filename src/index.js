import { applyMigrations } from './config/migrate.js';
import { createApp } from './app/app.js';

applyMigrations();

const PORT = process.env.PORT ?? 3333;
createApp().listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
);
