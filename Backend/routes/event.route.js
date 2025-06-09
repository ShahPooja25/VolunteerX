import express from "express";
import { getAllEvent, getEventById, updateEvent, deleteEvent } from "../controllers/event.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// Route for getting all events
router.route("/getAllEvent").get(getAllEvent);

// Route for getting a specific event by ID (for editing purposes)
router.route("/getEventById/:id").get(getEventById);

// Route for updating a specific event
router.route("/updateEvent/:id").put(updateEvent);

// Route for deleting a specific event
router.route("/deleteEvent/:id").delete(deleteEvent);


export default router;
