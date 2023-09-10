import express from "express";
const Router = express.Router();

import purchaseController from "../../controllers/purchase.controller";
Router.post('/order-history', purchaseController.findGuestReceipt)
Router.post('/', purchaseController.createGuestReceipt)
export default Router;