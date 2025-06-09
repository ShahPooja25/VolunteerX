import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  present: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },

  photo: { type: String },

  description: { type: String },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  skillsRequired: [String],
  volunteerCapacity: { type: Number },

  status: { type: String, enum: ['active', 'upcoming', 'past'], required: true },

  hostedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },

  attendanceRecord: [attendanceRecordSchema],
  volunteerRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }],

  approvedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }],

  totalHours: { type: Number, default: 0 } // Can also be computed dynamically
});

// Pre-save hook to calculate total hours before saving the event (if needed)
eventSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    // Calculate the total hours based on the difference between start and end date
    const totalHours = Math.abs(new Date(this.endDate) - new Date(this.startDate)) / 36e5; // 36e5 is 1 hour in milliseconds
    this.totalHours = totalHours;
  }
  next();
});

export const Event = mongoose.model('Event', eventSchema);
