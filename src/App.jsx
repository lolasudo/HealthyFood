import React from 'react';
import SearchBar from './components/SearchBar';
import RecipeGrid from './components/RecipeGrid';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ForumPage from './pages/ForumPage';
import './App.css';

// Заглушки
const HomePage = () => <div></div>;
const RecipesPage = () => <div>Рецепты</div>;
const AboutPage = () => <div>О нас</div>;

function App() {
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
          <RecipeGrid />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App;