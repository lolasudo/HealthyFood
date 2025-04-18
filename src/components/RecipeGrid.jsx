import React, { useState } from 'react'
import ModalRecipe from './ModalRecipe'
import "../App.css"

const RecipeGrid = ({ recipes }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const openModal = (recipe) => {
    setSelectedRecipe(recipe)
  }

  const closeModal = () => {
    setSelectedRecipe(null)
  }

  return (
    <div style={gridStyles.container}>
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe-card"
            style={gridStyles.card}
            onClick={() => openModal(recipe)}
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              style={gridStyles.cardImage}
            />
            <h3 style={gridStyles.cardTitle}>{recipe.title}</h3>
            <p style={gridStyles.cardDescription}>
              {recipe.shortDescription || "Описание отсутствует"}
            </p>
          </div>
        ))
      ) : (
        <p>Ничего не найдено</p>
      )}

      {/* Модальное окно */}
      {selectedRecipe && (
        <ModalRecipe
          recipe={selectedRecipe}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

const gridStyles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '10px',
    cursor: 'pointer',
    transition: 'transform 0.3s',
  },
  cardImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  cardTitle: {
    fontSize: '1.1rem',
    margin: '10px 0 5px'
  },
  cardDescription: {
    fontSize: '0.9rem',
    color: '#666'
  }
}

export default RecipeGrid
