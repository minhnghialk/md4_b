import express from "express";
const Router = express.Router();

import userApi from './apis/user.api'
Router.use('/users', userApi)

import authApi from './apis/auth.api'
Router.use('/auth', authApi)

export default Router;