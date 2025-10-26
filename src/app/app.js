import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import taskRoutes from './routes/task.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const createApp = () => {
    const app = express();
    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '1mb' }));
    app.use(morgan('dev'));

    app.use('/tasks', taskRoutes);
    app.get('/health', (_, res) => res.json({ ok: true }));
    app.use(errorHandler);

    return app;
};
