const User = require('../models/user.model');

const checkUserName =  (req, res, next) => {
    const { username } = req.body;
    User.findByUserName(username, (_, data) => {
        if (data) {
            res.status(400).send({
                status: 'error',
                message: `A user with username '${username}' already exits`
            });
            return;
        }
        next();
    });
}

module.exports = checkUserName;