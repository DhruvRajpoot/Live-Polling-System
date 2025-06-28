import { TeacherLogin } from "./controllers/login.js";
import { getPolls, createPoll } from "./controllers/poll.js";

const setupRoutes = (app) => {
  app.get("/", (req, res) => {
    res.send("Polling System Backend");
  });

  app.post("/teacher-login", (req, res) => {
    TeacherLogin(req, res);
  });

  app.get("/polls/:teacherUsername", (req, res) => {
    getPolls(req, res);
  });

  app.post("/polls", (req, res) => {
    createPoll(req, res);
  });
};

export default setupRoutes;
