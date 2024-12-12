import React, { useRef, useEffect, useState } from "react";
import "../styles/Roulette.css";
import "../styles/Global.css";

function Roulette({ product, onSpinEnd, isSpinning, setIsSpinning }) {
  const canvasRef = useRef(null);
  const [finalRotation, setFinalRotation] = useState(0); 
  const [resultIndex, setResultIndex] = useState(null); 

  const drawWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const [cw, ch] = [canvas.width / 2, canvas.height / 2];
    const radius = cw;
    const arc = Math.PI * 2 / product.length;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    product.forEach((item, index) => {
      const start = arc * index - Math.PI / 2; 
      const end = start + arc; 
  
      ctx.beginPath();
      ctx.fillStyle = `hsl(${index * (360 / product.length)}, 70%, 80%)`;
      ctx.moveTo(cw, ch);
      ctx.arc(cw, ch, radius, start, end);
      ctx.fill();
  
      ctx.save();
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.translate(cw, ch);
      ctx.rotate(start + arc / 2);
  
      const maxTextLength = 15; 
      const displayText =
        item.length > maxTextLength ? item.substring(0, maxTextLength) + "..." : item;
  
      ctx.fillText(displayText, radius * 0.7, 0); 
      ctx.restore();
    });
  };

  const rotate = () => {
    if (isSpinning || product.length === 0) return;

    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * product.length);
    setResultIndex(randomIndex);

    const arc = 360 / product.length;
    const targetAngle = randomIndex * arc + arc / 2; 
    const offset = 90; 
    const totalRotation = 360 * 10 + offset - targetAngle; 

    setFinalRotation(totalRotation); 

    setTimeout(() => {
      onSpinEnd(product[randomIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  useEffect(() => {
    drawWheel();
  }, [product]);

  return (
    <div className="roulette-container">
      <div className="roulette-figure">
        <canvas
          ref={canvasRef}
          width="400"
          height="400"
          style={{
            transform: `rotate(${finalRotation}deg)`,
            transition: isSpinning
              ? "transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)"
              : "none",
          }}
        ></canvas>
      </div>
      <button onClick={rotate} disabled={isSpinning}>
        {isSpinning ? "Spinning..." : "Spin the Wheel"}
      </button>
      {resultIndex !== null && !isSpinning && (
        <div className="result-display">
          <p>Selected Menu: {product[resultIndex]}</p>
        </div>
      )}
    </div>
  );
}

export default Roulette;
