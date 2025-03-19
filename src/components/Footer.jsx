import React from 'react'
import { FaStackOverflow } from 'react-icons/fa'

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.links}>
        <a href="#recipes" style={styles.link}>Рецепты</a>
        <a href="#policy" style={styles.link}>Политика конфиденциальности</a>
        <a href="#rules" style={styles.link}>Правила</a>
        <a href="#help" style={styles.link}>Помощь</a>
      </div>
      <img src="./src/assets/FooterLine.svg" alt="Logo" style={styles.logo} />
      <p style={styles.copyright}>
        © 2000 – 2025, OOO «HealthyFoods»
      </p>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px 10px',
    textAlign: 'center'
  },
  logo: {
    height: '10px',
    width: '80vw',
    verticalalign: 'middle',
  },
  links: {
    marginBottom: '10px'
  },
  link: {
    color: '#fff',
    margin: '0 10px',
    textDecoration: 'none'
  }
}

export default Footer
