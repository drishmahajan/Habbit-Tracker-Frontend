// src/components/ui/Particles.jsx
import { useEffect } from "react";

const Particles = () => {
  useEffect(() => {
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        d: Math.random() * 100,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
        ctx.fill();
      });
      update();
    }

    function update() {
      particles.forEach((p) => {
        p.y += 0.5;
        if (p.y > canvas.height) p.y = 0;
      });
    }

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      id="particles-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        background: "black",
      }}
    />
  );
};

export default Particles;
