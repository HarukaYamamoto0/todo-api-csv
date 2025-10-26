export const notFound = (res, msg = 'Resource not found') =>
    res.status(404).json({error: msg});

export const badRequest = (res, msg = 'Invalid request') =>
    res.status(400).json({error: msg});
