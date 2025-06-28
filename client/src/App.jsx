import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import StudentRegistrationPage from "./pages/StudentRegistration";
import PollCreationPage from "./pages/PollCreation";
import StudentPollPage from "./pages/StudentPollPage";
import TeacherPollPage from "./pages/TeacherPollPage";
import PollHistoryPage from "./pages/PollHistory";
import ToastProvider from "./components/common/ToastProvide";
import KickedOut from "./pages/KickedOut";
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  return (
    <Router>
      <SocketProvider>
        <ToastProvider />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/student-registration"
            element={<StudentRegistrationPage />}
          />
          <Route path="/poll-creation" element={<PollCreationPage />} />
          <Route path="/student-poll" element={<StudentPollPage />} />
          <Route path="/teacher-poll" element={<TeacherPollPage />} />
          <Route path="/teacher-poll-history" element={<PollHistoryPage />} />
          <Route path="/kicked-out" element={<KickedOut />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
};

export default App;
