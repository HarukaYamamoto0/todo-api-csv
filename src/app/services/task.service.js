import {taskRepository as repo} from '../../repositories/task.repository.js';
import {v4 as uuid} from 'uuid';
import {CreateTaskSchema} from '../schemas/task.schema.js';

export const taskService = {
    create(data) {
        const task = {...data, completed: 0, id: data.id ?? uuid()};
        repo.create(task);
        return task;
    },
    list(query) {
        const {title, description, page = '1', perPage = '20'} = query;
        return repo.list({
            title,
            description,
            page: Number(page),
            perPage: Number(perPage),
        });
    },
    getById: repo.getById.bind(repo),
    update: repo.update.bind(repo),
    setCompleted: repo.setCompleted.bind(repo),
    remove: repo.remove.bind(repo),

    async importCSV(readable, parse) {
        const parser = parse({
            bom: true,
            skip_empty_lines: true,
            trim: true,
            columns: true,
        });

        const rows = [];
        const errors = [];
        let line = 1;

        readable.pipe(parser);

        for await (const record of parser) {
            const result = CreateTaskSchema.safeParse(record);
            if (!result.success)
                errors.push({line, error: result.error.errors[0].message});
            else
                rows.push({
                    id: uuid(),
                    title: result.data.title,
                    description: result.data.description,
                    completed: 0,
                });
            line++;
        }

        if (rows.length) repo.bulkInsert(rows);
        return {imported: rows.length, rejected: errors.length, sampleErrors: errors.slice(0, 5)};
    },
};
