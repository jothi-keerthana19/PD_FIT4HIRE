import React, { useEffect, useRef } from 'react';
import './NeuralBackground.css';

const NeuralBackground = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const nodes = [];
    
    // Create 40 neural nodes with connections
    for (let i = 0; i < 40; i++) {
      const node = document.createElement('div');
      node.classList.add('neural-node');
      
      // Enhanced random positioning
      node.style.left = `${Math.random() * 98 + 1}%`;
      node.style.top = `${Math.random() * 98 + 1}%`;
      
      // Varied sizes for depth effect
      const size = Math.random() * 8 + 3;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
      
      // More dynamic animations
      const floatDuration = Math.random() * 15 + 8;
      const pulseDuration = Math.random() * 3 + 2;
      node.style.animationDuration = `${pulseDuration}s, ${floatDuration}s`;
      
      // Randomized delays for more natural movement
      const delay = Math.random() * 8;
      node.style.animationDelay = `${delay}s, ${delay}s`;
      
      // Add glow effect based on size
      node.style.boxShadow = `0 0 ${size * 2}px rgba(100, 255, 218, ${0.3 + size * 0.05})`;
      
      container.appendChild(node);
      nodes.push(node);
    }
    
    // Create connections between nearby nodes
    const canvas = document.createElement('canvas');
    canvas.classList.add('neural-connections');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    const updateConnections = () => {
      if (!canvas.parentElement) return;
      
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      ctx.strokeStyle = 'rgba(100, 255, 218, 0.1)';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      nodes.forEach((node, i) => {
        const rect1 = node.getBoundingClientRect();
        const x1 = rect1.left + rect1.width / 2 - container.getBoundingClientRect().left;
        const y1 = rect1.top + rect1.height / 2 - container.getBoundingClientRect().top;
        
        nodes.slice(i + 1).forEach(otherNode => {
          const rect2 = otherNode.getBoundingClientRect();
          const x2 = rect2.left + rect2.width / 2 - container.getBoundingClientRect().left;
          const y2 = rect2.top + rect2.height / 2 - container.getBoundingClientRect().top;
          
          const distance = Math.hypot(x2 - x1, y2 - y1);
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.globalAlpha = 1 - (distance / 150);
            ctx.stroke();
          }
        });
      });
    };
    
    const animationFrame = setInterval(updateConnections, 50);
    window.addEventListener('resize', updateConnections);
    
    // Enhanced cleanup
    return () => {
      clearInterval(animationFrame);
      window.removeEventListener('resize', updateConnections);
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);
  
  return <div ref={containerRef} className="neural-network"></div>;
};

export default NeuralBackground;