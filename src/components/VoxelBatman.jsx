import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function VoxelBatman({ style, className }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const isExploded = useRef(false);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationId;

    const img = new Image();
    img.src = `${import.meta.env.BASE_URL}f4.png`;
    img.onload = () => {

      const resize = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        initParticles();
      };

      const initParticles = () => {
        particles.current = [];

        // Draw image to offscreen canvas to sample pixels
        const offscreen = document.createElement('canvas');
        const oCtx = offscreen.getContext('2d');
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;

        // Calculate object-fit: contain (aligned right, bottom)
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX, offsetY;
        // Reduce Batman's physical size
        const scaleMultiplier = 0.95;

        if (canvasRatio > imgRatio) {
          // Canvas is wider than image aspect ratio
          drawHeight = canvas.height * scaleMultiplier;
          drawWidth = img.width * (canvas.height / img.height) * scaleMultiplier;
        } else {
          // Image is wider than canvas aspect ratio
          drawWidth = canvas.width * scaleMultiplier;
          drawHeight = img.height * (canvas.width / img.width) * scaleMultiplier;
        }

        // Shift Batman moderately to the right
        offsetX = (canvas.width - drawWidth) + 80;
        offsetY = canvas.height - drawHeight; // Align to the bottom

        oCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Voxel resolution (higher step = fewer particles = better performance)
        const step = 8;
        const imageData = oCtx.getImageData(0, 0, canvas.width, canvas.height).data;

        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            const index = (y * canvas.width + x) * 4;
            const alpha = imageData[index + 3];

            if (alpha > 40) { // Only capture visible pixels
              const r = imageData[index];
              const g = imageData[index + 1];
              const b = imageData[index + 2];

              particles.current.push({
                ox: x,
                oy: y,
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                color: `rgba(${r}, ${g}, ${b}, ${alpha / 255})`,
                size: step - 1.5, // 1.5px gap to make them look like distinct blocks

                // Pre-calculate a 3D scatter destination (an explosive cloud around the image)
                tx: x + (Math.random() - 0.5) * 1200,
                ty: y + (Math.random() - 0.5) * 1200,
                speed: Math.random() * 0.04 + 0.02
              });
            }
          }
        }
      };

      window.addEventListener('resize', resize);
      resize();

      // High Performance Rendering Physics Loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const mx = mouse.current.x;
        const my = mouse.current.y;
        const hoverRadius = 45; // Increased interactive brush size

        for (let i = 0; i < particles.current.length; i++) {
          const p = particles.current[i];

          // Calculate distance from mouse to particle
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < hoverRadius) {
            // Particle is near mouse: Repel it to create a smooth "pop up/scatter" effect
            const force = (hoverRadius - dist) / hoverRadius; // Stronger closer to the center
            const angle = Math.atan2(dy, dx);

            // Push away from mouse (sharper force since the brush is so small)
            p.vx -= Math.cos(angle) * force * 3.5;
            p.vy -= Math.sin(angle) * force * 3.5;

            // Add subtle random floaty jitter
            p.vx += (Math.random() - 0.5) * 1.5;
            p.vy += (Math.random() - 0.5) * 1.5;
          } else {
            // Spring back to original image position smoothly
            p.vx += (p.ox - p.x) * 0.08;
            p.vy += (p.oy - p.y) * 0.08;
          }

          // Smooth Damping/Friction
          p.vx *= 0.85;
          p.vy *= 0.85;

          // Apply velocity
          p.x += p.vx;
          p.y += p.vy;

          // Render voxel
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        animationId = requestAnimationFrame(animate);
      };

      animate();
    };

    return () => {
      window.removeEventListener('resize', () => { });
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouse.current.x = e.clientX - rect.left;
    mouse.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouse.current.x = -9999;
    mouse.current.y = -9999;
  };

  const handleTouchStart = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];

    if (isExploded.current) {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
      isExploded.current = false;
    } else {
      mouse.current.x = touch.clientX - rect.left;
      mouse.current.y = touch.clientY - rect.top;
      isExploded.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.current.x = touch.clientX - rect.left;
    mouse.current.y = touch.clientY - rect.top;
  };

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        height: '100vh',
        pointerEvents: 'auto', // Must allow pointer events to trigger hover
        cursor: 'crosshair',
        touchAction: 'pan-y' // Allow vertical scrolling, but catch touch coordinates
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </motion.div>
  );
}
