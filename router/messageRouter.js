const Message = require('../models/message'); // Import your User model

const createCrudRoutes = require('./crudRouter');

module.exports = createCrudRoutes(Message);
