// crudRouter.js

const express = require("express");
const router = express.Router();

const {
  createOne,
  getAll,
  getById,
  updateOne,
  deleteOne,
} = require("./../controller/crudController");

// Create CRUD routes
const createCrudRoutes = (Model) => {
  router.post("/", createOne(Model));
  router.get("/", getAll(Model));
  router.get("/:id", getById(Model));
  router.put("/:id", updateOne(Model));
  router.delete("/:id", deleteOne(Model));
  return router;
};

module.exports = createCrudRoutes;
