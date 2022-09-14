import React from "react";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { ProtectedLayout } from "./components/ProtectedLayout";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="dashboard"  element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
