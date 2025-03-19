import React from 'react'
import { FaTimes } from 'react-icons/fa'

function ModalRecipe({ recipe, onClose }) {
  if (!recipe) return null

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>{recipe.title}</h2>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
        />
        <p style={{ marginTop: '10px' }}>
          <strong>Время приготовления:</strong> {recipe.cookingTime}
        </p>
        <p style={{ marginTop: '10px' }}>{recipe.fullDescription}</p>

        <h3 style={{ marginTop: '20px' }}>Шаги приготовления:</h3>
        <ol>
          {recipe.steps.map((step, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default ModalRecipe
