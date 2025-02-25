module.exports = (req, res, next) => {
    req.userId = 'user123'; // Simulated authenticated user
    next();
};
