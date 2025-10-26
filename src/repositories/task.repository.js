import {db} from '../config/db.js';

const TABLE = 'tasks';

export const taskRepository = {
    create(task) {
        db.prepare(`
            INSERT INTO ${TABLE} (id, title, description, completed)
            VALUES (@id, @title, @description, @completed)
        `).run(task);
    },

    list({title, description, page = 1, perPage = 20}) {
        const filters = [];
        const params = {};
        if (title) {
            filters.push('LOWER(title) LIKE LOWER(@title)');
            params.title = `%${title}%`;
        }
        if (description) {
            filters.push('LOWER(description) LIKE LOWER(@description)');
            params.description = `%${description}%`;
        }
        const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

        const total = db.prepare(`SELECT COUNT(*) AS count
                                  FROM ${TABLE} ${where}`).get(params).count;
        const data = db.prepare(`
            SELECT *
            FROM ${TABLE} ${where}
            ORDER BY created_at DESC LIMIT @limit
            OFFSET @offset
        `).all({...params, limit: perPage, offset: (page - 1) * perPage});

        return {data, total, page, perPage, pages: Math.ceil(total / perPage)};
    },

    getById: (id) => db.prepare(`SELECT *
                                 FROM ${TABLE}
                                 WHERE id = ?`).get(id),

    update(id, fields) {
        const allowed = ['title', 'description'];
        const updates = [];
        const params = {id};

        for (const key of allowed) {
            if (fields[key] !== undefined) {
                updates.push(`${key} = @${key}`);
                params[key] = fields[key];
            }
        }

        if (!updates.length) return this.getById(id);
        updates.push(`updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ','now'))`);

        db.prepare(`UPDATE ${TABLE}
                    SET ${updates.join(', ')}
                    WHERE id = @id`).run(params);
        return this.getById(id);
    },

    setCompleted(id, completed) {
        db.prepare(`
            UPDATE ${TABLE}
            SET completed  = @completed,
                updated_at = (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            WHERE id = @id
        `).run({id, completed: completed ? 1 : 0});
        return this.getById(id);
    },

    remove(id) {
        const result = db.prepare(`DELETE
                                   FROM ${TABLE}
                                   WHERE id = ?`).run(id);
        return result.changes > 0;
    },

    bulkInsert(rows) {
        const insert = db.prepare(`
            INSERT INTO ${TABLE} (id, title, description, completed)
            VALUES (@id, @title, @description, @completed)
        `);
        db.transaction((items) => items.forEach((r) => insert.run(r)))(rows);
    },
};
