import express from "express";
const Router = express.Router();
import userController from "../../controllers/user.controller";

Router.post('/', userController.register)
Router.post('/login', userController.login)

export default Router;