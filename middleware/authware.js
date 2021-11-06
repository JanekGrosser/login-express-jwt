const knex = require('../config/knex');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * @asyncexport checks if the user is authenticated
 * @param {string} config.jwtSecret - the secret used to sign the token
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next function
 * @returns {object} - returns the response object
 * @memberof authware
 */
exports.isAuthenticated = async (req, res, next) => {
    try{
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({message: 'Unauthorized'});
        }
        let decoded = await jwt.verify(token, config.jwtSecret);
        let user = await knex('users').where({ id: decoded.id }).first();
        if (!user) {
            return res.status(401).send({message: 'Unauthorized'});
        };
        req.user = user;
        return next();
    }catch(err){
        return res.status(500).send({message: 'Server error'});
    }
};

/**
 * @asyncexport checks if the user has a specified role, uses users and roles many to many relationship
 * @param {string} role - the role to check
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next function
 * @returns {object} - returns the response object
 * @memberof authware
 */
exports.isAuthorized = async (role, req, res, next) => {
    try{
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({
                message: 'Unauthorized'
            });
        };
        let decoded = await jwt.verify(token, config.jwtSecret);
        let user = await knex('users').where({ id: decoded.id }).first();
        if (!user) {
            return res.status(401).send({
                message: 'Unauthorized'
            });
        };
        let roleId = await knex('roles').where({ name: role }).first();
        if (!roleId) {
            return res.status(403).send({
                message: 'No such role'
            });
        };
        let userRole = await knex('user_roles').where({ user_id: user.id, role_id: roleId.id }).first();
        if (!userRole) {
            return res.status(403).send({
                message: 'Forbidden'
            });
        };
        req.user = user;
        return next();
    }catch(err){
        return res.status(500).send({message: 'Server error'});
    }
};
