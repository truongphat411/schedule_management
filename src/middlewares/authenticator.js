const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../utils/secrets');

exports.authenticatateJWT = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        req.user = decoded.user;

        next();
    } catch (err) {
        console.log('jwt error: ', err);
        res.status(401).json({
            errorMessage: 'Authentication Failed!',
        });
    }
};