import express from "express";
import { eventJoinRoute } from "../controllers/joinEvent.controller.js";



const router = express.Router();

router.route("/event-join").post(eventJoinRoute); // Use POST instead of GET for form submission

export default router;
