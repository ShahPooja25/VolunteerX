import { Event } from "../models/event.model.js";
// Fetch all events
export const getAllEvent = async (req, res) => {
  try {
    const events = await Event.find({});
    return res.status(200).json({
      success: true,
      message: "All events fetched successfully",
      events,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Fetch a single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params; // Extract event ID from URL
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Format startDate and endDate for frontend (datetime-local input)
    event.startDate = event.startDate.toISOString().slice(0, 16);
    event.endDate = event.endDate.toISOString().slice(0, 16);

    res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      event,
    });
  } catch (error) {
    console.error("Get Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Update an event by ID
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params; // Get event ID from URL
    const updatedData = req.body; // Get updated data from request body

    // Basic validation
    if (!updatedData.name || !updatedData.startDate) {
      return res.status(400).json({
        success: false,
        message: "Event name and start date are required",
      });
    }

    // Find and update the event
    const event = await Event.findByIdAndUpdate(id, updatedData, { new: true });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete an event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

