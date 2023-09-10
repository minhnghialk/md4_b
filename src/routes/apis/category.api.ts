import express from "express";
const Router = express.Router();

import categoryController from "../../controllers/category.controller";
Router.get('/', categoryController.findMany)

export default Router;