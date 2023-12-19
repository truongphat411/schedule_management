const Account = require('../models/account.model');
const { hash: hashPassword, compare: comparePassword } = require('../utils/password');

exports.signup = (req, res) => {
    const { full_name, type_id,user_name, email, password, department_id } = req.body;
    const hashedPassword = hashPassword(password.trim());

    const user = new Account(null,full_name.trim(),parseInt(type_id),user_name.trim(), email.trim(), hashedPassword,parseInt(department_id));

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
                res.status(200).send({
                    status: 'success',
                    data
                });
                return;
        }
    });

}

exports.read = (req, res) => {
    const account_id= req.params.account_id;
    Account.findById(account_id, (err, data) => {
        if (err) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        if (data) {
            res.status(200).send({
                status: 'success',
                data
            });
            return;
        }
    });

}

exports.readAll = (req, res) => {
    Account.readAll((err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {    
            res.status(200).send({
                status: "success",
                data
            });
        }
    })
}

exports.readAllAccountType = (req, res) => {
    Account.readAllAccountType((err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {    
            res.status(200).send({
                status: "success",
                data
            });
        }
    })
}