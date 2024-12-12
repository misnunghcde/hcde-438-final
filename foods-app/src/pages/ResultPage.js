import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ResultPage.css";

function ResultPage({ selectedMenu }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuImage, setMenuImage] = useState(null);

  const navigate = useNavigate();
  const API_KEY = "810d486f23144bb9b656e9f12d223a8d";

  useEffect(() => {
    if (!selectedMenu) {
      navigate("/");
      return;
    }
    fetchMenuImage();
  }, [selectedMenu, navigate]);

  const fetchMenuImage = async () => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${selectedMenu}&apiKey=${API_KEY}&number=1`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setMenuImage(data.results[0].image);
      } else {
        setMenuImage(null);
      }
    } catch (err) {
      console.error("Error fetching menu image:", err);
      setMenuImage(null);
    }
  };

  const fetchRecipe = async () => {
    setLoading(true);
    setError(null);
    setMenuImage(null); // Hide menu image on "View Recipe"
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${selectedMenu}&apiKey=${API_KEY}&number=1`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const recipeId = data.results[0].id;
        const detailsResponse = await fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
        );
        const recipeDetails = await detailsResponse.json();
        setRecipe(recipeDetails);
      } else {
        setError("No recipes found.");
      }
    } catch {
      setError("Failed to load recipe.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSearch = () => {
    window.open(`https://www.google.com/search?q=${selectedMenu}+near+me`, "_blank");
  };

  if (!selectedMenu) return null;

  return (
    <div className="result-page">
      <h1>{selectedMenu}</h1>
      {menuImage && <img className="menu-image" src={menuImage} alt={selectedMenu} />}

      <div className="initial-buttons">
        <button onClick={fetchRecipe} disabled={loading}>
          {loading ? "Loading Recipe..." : "View Recipe"}
        </button>
        <button onClick={handleRestaurantSearch}>Find Restaurants</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {recipe && (
        <div className="recipe-details">
          <div className="recipe-image-container">
            <img className="recipe-image" src={recipe.image} alt={recipe.title} />
          </div>
          <div className="recipe-content">
            <h2>{recipe.title}</h2>
            <h3>Ingredients:</h3>
            <ul>
              {recipe.extendedIngredients.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.original}</li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            <ol>
              {recipe.analyzedInstructions[0]?.steps.map((step) => (
                <li key={step.number}>{step.step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <Link to="/" className="back-link">Reroll</Link>
    </div>
  );
}

export default ResultPage;
