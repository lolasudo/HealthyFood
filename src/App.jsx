import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import RecipeGrid from "./components/RecipeGrid";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ForumPage from "./pages/ForumPage";
import AboutPage from "./pages/AboutPage";
import "./App.css";
import GigaChatWidget from "./components/GigaChatWidget";

// 👇 Импорт рецептов
import recipesData from "./data/recipes";

const HomePage = () => <div></div>;
const RecipesPage = () => <div>Рецепты</div>;

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  // Фильтрация по названию
  const filteredRecipes = recipesData.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<div>Страница профиля в разработке</div>} />
      </Routes>

      <div className="app-container">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main>
          <RecipeGrid recipes={filteredRecipes} />
        </main>
        <Footer />
        <GigaChatWidget />
      </div>
    </>
  );
}

export default App;
