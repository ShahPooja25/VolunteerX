import React, { useEffect, useState } from "react";

const MagicMatching = () => {
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: "Beach Cleanup Drive",
      organization: "Green Earth Initiative",
      date: "2023-06-15",
      time: "09:00 AM",
      location: "Sunset Beach",
      category: "Environment",
      description: "Join us to clean up local beaches and protect marine life.",
      skills: ["Physical Activity", "Teamwork", "Environmental Knowledge"],
      interests: ["Environment", "Conservation"],
      volunteers: 15,
      capacity: 25,
      match: 95,
    },
    {
      id: 2,
      title: "Food Distribution",
      organization: "Community Helpers",
      date: "2023-06-18",
      time: "10:00 AM",
      location: "Community Center",
      category: "Humanitarian",
      description: "Distribute food packages to local families in need.",
      skills: ["Communication", "Organization"],
      interests: ["Poverty", "Community Service"],
      volunteers: 8,
      capacity: 10,
      match: 87,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      const sorted = [...events].sort((a, b) => b.match - a.match);
      setMatchedEvents(sorted);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEventClick = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);
  const handleJoin = (event) => alert(`Joined event: ${event.title}`);

  return (
    <div style={styles.container}>
      <style>{`
        .card { border: 1px solid #ddd; padding: 1rem; border-radius: 10px; background: #fff; box-shadow: 2px 4px 10px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.2s ease; }
        .card:hover { transform: translateY(-3px); background: #f9f9f9; }
        .match-circle { width: 50px; height: 50px; border-radius: 50%; background: #4CAF50; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 10; }
        .modal-content { background: white; padding: 2rem; border-radius: 10px; width: 90%; max-width: 500px; position: relative; }
        .close-btn { position: absolute; top: 10px; right: 15px; font-size: 20px; cursor: pointer; }
        .btn { background: #007bff; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer; margin-top: 1rem; }
        .btn:hover { background: #0056b3; }
      `}</style>

      <h1 style={{ textAlign: "center" }}>✨ Magic Matching</h1>
      <p style={{ textAlign: "center", color: "#555" }}>
        Find volunteer opportunities matched to your skills and interests.
      </p>

      {isLoading ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>🔄 Finding your best matches...</p>
      ) : (
        <div style={styles.grid}>
          {matchedEvents.map((event) => (
            <div className="card" key={event.id} onClick={() => handleEventClick(event)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "bold" }}>{event.title}</span>
                <div className="match-circle">{event.match}%</div>
              </div>
              <p style={{ margin: "0.5rem 0", fontSize: "14px" }}>{event.organization}</p>
              <p style={{ fontSize: "13px", color: "#555" }}>
                📍 {event.location} | 🕒 {event.time}
              </p>
              <ul style={{ fontSize: "13px", color: "#333" }}>
                <li>Matches your skill: {event.skills[0]}</li>
                <li>Aligns with interest: {event.interests[0]}</li>
              </ul>
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedEvent.title}</h2>
            <p><strong>Organization:</strong> {selectedEvent.organization}</p>
            <p><strong>Date:</strong> {selectedEvent.date} at {selectedEvent.time}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Skills Needed:</strong> {selectedEvent.skills.join(", ")}</p>
            <p><strong>Interests:</strong> {selectedEvent.interests.join(", ")}</p>
            <button className="btn" onClick={() => handleJoin(selectedEvent)}>Join Event</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    paddingLeft: "270px", // Space for sidebar
    fontFamily: "'Segoe UI', sans-serif",
    background: "#f0f4f8",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
  },
};

export default MagicMatching;
