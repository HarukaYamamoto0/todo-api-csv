import express from 'express';
import {v4 as uuid} from 'uuid';
import multer from 'multer';
import {Readable} from 'stream';
import {parse} from 'csv-parse';
import {CreateTaskSchema, UpdateTaskSchema} from '../schemas/task.schema.js';
import {taskService} from '../services/task.service.js';
import {badRequest, notFound} from '../../utils/http.js';

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.get('/', (req, res) => res.json(taskService.list(req.query)));

router.get('/:id', (req, res) => {
    const task = taskService.getById(req.params.id);
    if (!task) return notFound(res, 'Task not found');
    res.json(task);
});

router.post('/', (req, res) => {
    const result = CreateTaskSchema.safeParse(req.body);
    if (!result.success) return badRequest(res, result.error.errors[0].message);
    const task = taskService.create({...result.data, id: uuid()});
    res.status(201).json(task);
});

router.patch('/:id', (req, res) => {
    const result = UpdateTaskSchema.safeParse(req.body);
    if (!result.success) return badRequest(res, result.error.errors[0].message);
    const task = taskService.update(req.params.id, result.data);
    if (!task) return notFound(res, 'Task not found');
    res.json(task);
});

router.patch('/:id/complete', (req, res) => {
    const task = taskService.setCompleted(req.params.id, true);
    if (!task) return notFound(res, 'Task not found');
    res.json(task);
});

router.patch('/:id/uncomplete', (req, res) => {
    const task = taskService.setCompleted(req.params.id, false);
    if (!task) return notFound(res, 'Task not found');
    res.json(task);
});

router.delete('/:id', (req, res) => {
    const ok = taskService.remove(req.params.id);
    if (!ok) return notFound(res, 'Task not found');
    res.status(204).send();
});

router.post('/import', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) return badRequest(res, 'Upload a CSV file.');
        const readable = Readable.from(req.file.buffer);
        const result = await taskService.importCSV(readable, parse);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

export default router;
