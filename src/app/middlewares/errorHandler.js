export const errorHandler = (err, _, res, __) => {
    console.error(err);
    res.status(500).json({
        error: 'Internal error. Check the submitted CSV/JSON.',
    });
};
