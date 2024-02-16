// userRouter.js
const User = require('../models/user'); // Import your User model

const createCrudRoutes = require('./crudRouter');

const router = createCrudRoutes(User);

module.exports = router;
