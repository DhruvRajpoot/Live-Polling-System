import Teacher from "../models/teacher.js";

export const TeacherLogin = (req, res) => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  let teacherUsername = `teacher${randomNumber}`;
  let newTeacher = new Teacher({ username: teacherUsername });
  newTeacher.save();
  let username = newTeacher.username;
  res.status(201).json({
    status: "success",
    username,
  });
};
