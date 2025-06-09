import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    name: "",
    location: "",
    startDate: "",
    totalHours: "",
    volunteerCapacity: "",
    description: "",
    skillsRequired: [],
    type: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Format date to YYYY-MM-DDTHH:MM for input[type="datetime-local"]
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const iso = date.toISOString();
    return iso.slice(0, 16); // Format for input type="datetime-local"
  };

  useEffect(() => {
    let isMounted = true;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/event/getEventById/${id}`);
        if (isMounted && res.data?.event) {
          const event = res.data.event;
          setEventData({
            name: event.name || "",
            location: event.location || "",
            startDate: event.startDate ? formatDateForInput(event.startDate) : "",
            totalHours: event.totalHours || "",
            volunteerCapacity: event.volunteerCapacity || "",
            description: event.description || "",
            skillsRequired: event.skillsRequired || [],
            type: event.type || "",
          });
        } else {
          toast.error("Event not found.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Error fetching event.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "skillsRequired") {
      // Split skills by comma and trim whitespaces
      const skillsArray = value.split(",").map((s) => s.trim());
      setEventData((prev) => ({ ...prev, skillsRequired: skillsArray }));
    } else {
      setEventData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (!eventData.name || !eventData.startDate) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (eventData.totalHours <= 0) {
      toast.error("Total Hours must be a positive number.");
      return;
    }

    setUpdating(true);
    try {
      const res = await axios.put(`http://localhost:3000/api/v1/event/updateEvent/${id}`, eventData);
      toast.success("Event updated successfully!");
      navigate("/your-events");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update event.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Event Name</label>
          <Input
            name="name"
            value={eventData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Location</label>
          <Input
            name="location"
            value={eventData.location}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Start Date & Time</label>
          <Input
            name="startDate"
            type="datetime-local"
            value={eventData.startDate}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Total Hours</label>
          <Input
            name="totalHours"
            type="number"
            value={eventData.totalHours}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Volunteer Capacity</label>
          <Input
            name="volunteerCapacity"
            type="number"
            value={eventData.volunteerCapacity}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <Textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Skills Required (comma-separated)</label>
          <Input
            name="skillsRequired"
            value={eventData.skillsRequired.join(", ")}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1">Event Type</label>
          <Input
            name="type"
            value={eventData.type}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>

        <Button type="submit" disabled={updating} className="mt-4">
          {updating ? "Updating..." : "Update Event"}
        </Button>
      </form>
    </div>
  );
};

export default EditEvent;
