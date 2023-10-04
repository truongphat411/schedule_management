const User = require('../models/user.model');
const { hash: hashPassword, compare: comparePassword } = require('../utils/password');
const { generate: generateToken } = require('../utils/token');

exports.signup = (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = hashPassword(password.trim());

    const user = new User(firstname.trim(), lastname.trim(), email.trim(), hashedPassword);

    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {
            const token = generateToken(data.id);
            res.status(201).send({
                status: "success",
                data: {
                    token,
                    data
                }
            });
        }
    });
};

exports.getUserById = (req, res) => {
    const id  = req.params.id;
    User.findById(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `User with id ${id} was not found`
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
                    data: {
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email: data.email
                    }
                });
                return;
            res.status(401).send({
                status: 'error',
                message: 'Incorrect password'
            });
        }
    });

    exports.getUserById = (req, res) => {
        const { id } = req.params.id;
        User.findById(id, (err,data) => {
            if(err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        status: 'error',
                        message: `User with email ${email} was not found`
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
                        data: {
                            id: data.id,
                            firstname: data.firstname,
                            lastname: data.lastname,
                            email: data.email
                        }
                    });
                    return;
            }
        })
    }

}