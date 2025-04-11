import React, { useState, useEffect } from "react";
import SearchBar from './components/SearchBar';
import RecipeGrid from './components/RecipeGrid';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ForumPage from './pages/ForumPage';
import AboutPage from "./pages/AboutPage";
import './App.css';
import './styles/gigachat.css';
// import GigaChat from "./components/GigaChat";
import GigaChatWidget from "./components/GigaChatWidget";


// Заглушки
const HomePage = () => <div></div>;
const RecipesPage = () => <div>Рецепты</div>;

function App() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    // Загрузка рецептов из локального JSON; при необходимости адаптируйте источник (API, бэкенд)
    fetch("/data/recipes.json")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Ошибка загрузки рецептов:", error));
  }, []);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<div>Страница профиля в разработке</div>} /><Route path="/profile" element={<div>Страница профиля в разработке</div>} />
      </Routes>
      <div className="app-container">
        <SearchBar />
        <main>
        <section className="recipes-section">
        </section>
        {/* <aside className="chat-section">
          <GigaChat />
        </aside> */}
          <RecipeGrid />
        </main>
        <Footer />
        <GigaChatWidget />
      </div>
    </>
  )
}

export default App;