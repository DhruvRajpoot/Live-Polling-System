import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  username: String,
}, {
  timestamps: true,
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

export default Teacher;
