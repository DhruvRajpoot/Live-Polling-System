import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import StudentRegistrationPage from "./Pages/StudentRegistration";
import PollCreationPage from "./Pages/PollCreation";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/student-registration"
          element={<StudentRegistrationPage />}
        />
        <Route path="/poll-creation" element={<PollCreationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
