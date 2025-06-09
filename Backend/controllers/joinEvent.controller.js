import JoinEvent from "../models/joinEvent.model.js";

export const eventJoinRoute = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    if (!name || !email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, email, phoneNumber).",
      });
    }

    const newEntry = new JoinEvent({ name, email, phoneNumber });
    await newEntry.save();

    res.status(200).json({
      success: true,
      message: "Data saved successfully!",
    });
  } catch (error) {
    console.error("Error saving volunteer details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save data.",
    });
  }
};
