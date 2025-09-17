import express from "express";
import { getAllBurcDataForFrontend, getBurc } from "../controllers/burcController.js";

const burcRouter = express.Router();
burcRouter.get("/fetch", getBurc);
burcRouter.get("/burc", getAllBurcDataForFrontend);
export default burcRouter;
