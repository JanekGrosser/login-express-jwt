const knex = require('../config/knex');

//async function, checks if provided username or email is alerady in database
exports.checkUsernameAndEmail = async (req, res, next) => {
    try {
        let userExists = await knex('users').where({ username: req.body.username });
        let emailExists = await knex('users').where({ email: req.body.email });
        if (userExists.length > 0) {
            res.status(400).json({ message: 'Username already in use' });
        } else if (emailExists.length > 0) {
            res.status(400).json({ message: 'Email already in use' });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

//async function checks if provided roles exist in database
exports.checkRoles = async (req, res, next) => {
    try {
        let roles = req.body.roles;
        let roleExists = await knex('roles').whereIn('name', roles);
        if (roleExists.length !== roles.length) {
            res.status(400).json({ message: 'One or more roles do not exist' });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
