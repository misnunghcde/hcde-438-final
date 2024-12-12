import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ResultPage from "./pages/ResultPage";

function App() {
  const [selectedMenu, setSelectedMenu] = useState(""); // Holds the selected menu for ResultPage

  return (
    <Router>
      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Home setSelectedMenu={setSelectedMenu} />} />
        {/* Result Page */}
        <Route path="/result" element={<ResultPage selectedMenu={selectedMenu} />} />
      </Routes>
    </Router>
  );
}

export default App;