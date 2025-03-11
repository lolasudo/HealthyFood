import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import './App.css';

// Заглушки для страниц
const HomePage = () => <div>Главная</div>;
const RecipesPage = () => <div>Рецепты</div>;
const ForumPage = () => <div>Форум</div>;
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
      </Routes>
    </>
  );
}

export default App;