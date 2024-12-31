const body = require('express-validator').body;

exports.postCreateValidation = [
    body('title').isLength({ min: 5 }),
    body('text').isLength({ min: 10 }),
]