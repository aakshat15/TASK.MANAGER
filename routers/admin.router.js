import express from "express";
import {  singInPage , signIn } from "../controller/admin.controller.js";

const router = express.Router();

router.get("/sign-in",singInPage);
router.post("/sign-in",signIn);

export default router;