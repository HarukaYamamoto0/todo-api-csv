import { z } from 'zod';

export const CreateTaskSchema = z.object({
    title: z.string().trim().min(1, 'title is required'),
    description: z.string().trim().default(''),
});

export const UpdateTaskSchema = z
    .object({
        title: z.string().trim().min(1).optional(),
        description: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Enter at least one field to update',
    });
