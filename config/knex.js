const config = require('./config.js');
const knex = require('knex')(config.knex);

module.exports = knex;