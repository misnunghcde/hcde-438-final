import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Roulette from "../components/Roulette";
import "../styles/Home.css";
import "../styles/Global.css";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Home({ setSelectedMenu }) {
  const [product, setProduct] = useState([]);
  const [newMenu, setNewMenu] = useState(""); 
  const [randomMenus, setRandomMenus] = useState([]); 
  const [isSpinning, setIsSpinning] = useState(false); 
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();
  const rouletteCollection = collection(db, "rouletteItems"); 

  const API_KEY = "810d486f23144bb9b656e9f12d223a8d"; 


  useEffect(() => {
    const fetchRouletteItems = async () => {
      try {
        const querySnapshot = await getDocs(rouletteCollection);
        const items = querySnapshot.docs.map((doc) => doc.data().name);
        setProduct(items);
      } catch (error) {
        console.error("Error fetching roulette items:", error);
      }
    };
    fetchRouletteItems();
  }, []);

  const fetchRandomMenus = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/random?number=40&apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch random menus.");
      }
      const data = await response.json();
      const randomTitles = data.recipes.map((recipe) => recipe.title);
      setRandomMenus(randomTitles);
    } catch (error) {
      console.error("Failed to fetch random menus:", error);
      alert("Unable to fetch random menus. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = async (menu) => {
    const trimmedMenu = menu.trim();
    if (trimmedMenu === "") {
      alert("Menu cannot be empty.");
      return;
    }
    if (product.includes(trimmedMenu)) {
      alert("This menu already exists in the roulette.");
      return;
    }
    if (product.length >= 20) {
      alert("Max number of menus is 20.");
      return;
    }

    try {
      await addDoc(rouletteCollection, { name: trimmedMenu });
      setProduct((prev) => [...prev, trimmedMenu]);
    } catch (error) {
      console.error("Failed to add menu to Firestore:", error);
      alert("Failed to add menu. Please try again.");
    }
  };

  const handleSpinEnd = (result) => {
    setSelectedMenu(result);
    navigate("/result");
  };

  return (
    <div className="home">
      <h1>Lunch Roulette</h1>
      <Roulette
        product={product}
        onSpinEnd={handleSpinEnd}
        isSpinning={isSpinning}
        setIsSpinning={setIsSpinning}
      />

      <div className="add-menu-container">
        <input
          type="text"
          placeholder="Type a menu"
          value={newMenu}
          onChange={(e) => setNewMenu(e.target.value)}
        />
        <button onClick={() => handleAddMenu(newMenu)}>Add Menu</button>
      </div>

      <div className="random-menu-container">
        <button onClick={fetchRandomMenus} disabled={loading}>
          {loading ? "Loading..." : "Fetch Random Menus"}
        </button>
        {randomMenus.length > 0 && (
          <div className="random-menu-buttons">
            {randomMenus.map((menu, index) => (
              <button
                key={index}
                onClick={() => handleAddMenu(menu)}
                className="random-menu-button"
              >
                {menu}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;