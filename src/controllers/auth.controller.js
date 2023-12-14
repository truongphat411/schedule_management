const Account = require('../models/account.model');
const { hash: hashPassword, compare: comparePassword } = require('../utils/password');

exports.signup = (req, res) => {
    const { full_name, type_id,user_name, email, password } = req.body;
    const hashedPassword = hashPassword(password.trim());

    const user = new Account(null,full_name.trim(),type_id,user_name.trim(), email.trim(), hashedPassword);

    Account.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {
            res.status(200).send({
                status: "sign up successfully"
            });
        }
    });
};

exports.signin = (req, res) => {
    const { user_name, password } = req.body;
    Account.findByUserName(user_name.trim(), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `User with ${user_name} was not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        if (data) {
            if (comparePassword(password.trim(), data[0].password)) {
                res.status(200).send({
                    status: 'success',
                    data
                });
                return;
            }
            res.status(401).send({
                status: 'error',
                message: 'Incorrect password'
            });
        }
    });

}