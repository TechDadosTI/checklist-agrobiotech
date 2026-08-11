"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const SignaturePad = forwardRef(function SignaturePad(_props, ref) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);

  function sizeCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#20281F";
    ctxRef.current = ctx;
  }

  useEffect(() => {
    sizeCanvas();

    let resizeTimer;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const canvas = canvasRef.current;
        let snapshot = null;
        try {
          snapshot = canvas.toDataURL("image/png");
        } catch (e) {}
        sizeCanvas();
        if (snapshot) {
          const img = new Image();
          img.onload = () => {
            const rect = canvas.getBoundingClientRect();
            ctxRef.current.drawImage(img, 0, 0, rect.width, rect.height);
          };
          img.src = snapshot;
        }
      }, 200);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function pos(e) {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - r.left, y: clientY - r.top };
  }

  function start(e) {
    e.preventDefault();
    drawingRef.current = true;
    const p = pos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(p.x, p.y);
  }

  function move(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const p = pos(e);
    ctxRef.current.lineTo(p.x, p.y);
    ctxRef.current.stroke();
  }

  function end() {
    drawingRef.current = false;
  }

  useImperativeHandle(ref, () => ({
    getDataURL: () => {
      try {
        return canvasRef.current.toDataURL("image/png");
      } catch (e) {
        return "";
      }
    },
    clear: () => {
      const canvas = canvasRef.current;
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    },
  }));

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="sigpad"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <div className="sigrow">
        <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
          Assine com o dedo ou o mouse
        </span>
        <button type="button" className="linkbtn" onClick={() => ref.current?.clear()}>
          Limpar
        </button>
      </div>
    </div>
  );
});

export default SignaturePad;
