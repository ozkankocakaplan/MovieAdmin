import React from "react";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { ProtectedLayout } from "./components/ProtectedLayout";
import Dashboard from "./pages/Dashboard";
import Anime from "./pages/Anime";
import Manga from "./pages/Manga";
import Users from "./pages/Users";
import Rosette from "./pages/Rosette";
import EditAnime from "./pages/Anime/EditAnime";
import AddAnime from "./pages/Anime/AddAnime";
import EditCategory from "./pages/Category/EditCategory";
import AddCategory from "./pages/Category/AddCategory";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import AddManga from "./pages/Manga/AddManga";
import EditManga from "./pages/Manga/EditManga";
import Complaint from "./pages/Complaint";
import Web from "./pages/Web";
import FanArts from "./pages/FanArts";


export default function App() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="anime" element={<Anime />} />
        <Route path="complaint" element={<Complaint />} />
        <Route path="fanarts" element={<FanArts />} />
        <Route path="web" element={<Web />} />
        <Route path="/anime/add" element={<AddAnime />} />
        <Route path="/anime/:id" element={<EditAnime />} />
        <Route path="manga" element={<Manga />} />
        <Route path="/manga/add" element={<AddManga />} />
        <Route path="/manga/:id" element={<EditManga />} />
        <Route path="users" element={<Users />} />
        <Route path="categories" element={<Categories />} />
        <Route path="/category/add" element={<AddCategory />} />
        <Route path="/category/:id" element={<EditCategory />} />
        <Route path="rosette" element={<Rosette />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
