import React from "react";
import "./App.scss";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import TeamDashboard from "./Pages/TeamDashboard/TeamDashboard";
import CreateTeam from "./Pages/CreateTeam/CreateTeam";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="Signup/:id" element={<Signup />} />
          <Route path="Login" element={<Login />} />
          <Route path="TeamDashboard" element={<TeamDashboard />} />
          <Route path="CreateTeam/:id" element={<CreateTeam />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
