"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  RotateCw,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronsDown,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  Share2,
} from "lucide-react";

// Standard Tetris dimensions
const COLS = 10;
const ROWS = 20;

// Tetromino definitions mapped to Brutalist Architectural Furniture
const PIECES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    name: "PANCA MONOLITICA",
    material: "Béton Brut",
    color: "#D8D8D3",
    borderColor: "#18191A",
    dotColor: "#75777A",
    subtext: "Colata in cassaforma",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    name: "POLTRONA CUBICA",
    material: "Cuoio & Ferro",
    color: "#2B2D30",
    borderColor: "#C85A17",
    dotColor: "#C85A17",
    subtext: "Volume massiccio",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    name: "TAVOLO A SBALZO",
    material: "Acciaio Corten",
    color: "#C85A17",
    borderColor: "#111213",
    dotColor: "#572506",
    subtext: "Ossidazione a fiamma",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    name: "CHAISE LONGUE",
    material: "Rovere Fossile",
    color: "#6B5848",
    borderColor: "#111213",
    dotColor: "#3F3227",
    subtext: "Massello affumicato",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    name: "LIBRERIA MODULARE",
    material: "Lamiera Piegata",
    color: "#4A525A",
    borderColor: "#111213",
    dotColor: "#22272C",
    subtext: "Profilo a sbalzo",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    name: "CONSOLLE SOSPESA",
    material: "Microcemento",
    color: "#3B424B",
    borderColor: "#111213",
    dotColor: "#6C7580",
    subtext: "Rasatura continua",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    name: "DIVISORIO SCULTOREO",
    material: "Travertino Grezzo",
    color: "#C4BBAF",
    borderColor: "#111213",
    dotColor: "#82786B",
    subtext: "Poro aperto rettificato",
  },
};

const PIECE_KEYS = Object.keys(PIECES);

function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function getRandomPieceKey() {
  return PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)];
}

export default function ArchiTetris({ arConfig, brandConfig, contactsConfig, onClose }) {
  const cleanPhone = (contactsConfig?.phoneNumber || "+393294833426").replace(/[^0-9]/g, "");
  // Game states
  const [grid, setGrid] = useState(createEmptyGrid);
  const [currentPieceKey, setCurrentPieceKey] = useState(getRandomPieceKey);
  const [currentPiece, setCurrentPiece] = useState(() => PIECES[currentPieceKey].shape);
  const [currentPos, setCurrentPos] = useState({ x: 3, y: 0 });
  const [nextPieceKey, setNextPieceKey] = useState(getRandomPieceKey);
  const [scoreMq, setScoreMq] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [clearingLines, setClearingLines] = useState([]);

  // Camera & Audio
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);

  // Refs for animation & DOM
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const touchStartRef = useRef(null);
  const dropIntervalRef = useRef(null);

  const accentColor = brandConfig?.accentColor || "#C85A17";

  // Web Audio Synthesizer (zero external assets, instant brutalist tactile audio)
  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playSound = useCallback((type) => {
    if (audioMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "move") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === "rotate") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === "drop") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "line") {
        // Architectural Chord for line completion
        [440, 554.37, 659.25].forEach((freq, idx) => {
          const cOsc = ctx.createOscillator();
          const cGain = ctx.createGain();
          cOsc.type = "square";
          cOsc.frequency.setValueAtTime(freq, now + idx * 0.04);
          cGain.gain.setValueAtTime(0.1, now + idx * 0.04);
          cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          cOsc.connect(cGain);
          cGain.connect(ctx.destination);
          cOsc.start(now + idx * 0.04);
          cOsc.stop(now + 0.35);
        });
      } else if (type === "gameover") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }, [audioMuted]);

  // Haptic Feedback for physical sensation
  const triggerHaptic = useCallback((pattern = 15) => {
    if (typeof window !== "undefined" && navigator?.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore on unsupported devices
      }
    }
  }, []);

  // 1. Camera Initialization (Back-facing environment camera)
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Fotocamera non supportata dal browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch (err) {
      console.warn("Camera init error:", err);
      setCameraError("Fotocamera non disponibile. Gioca in modalità Studio.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // 2. Collision Check
  const checkCollision = useCallback(
    (piece, offset, currentGrid = grid) => {
      for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
          if (piece[r][c] !== 0) {
            const newX = offset.x + c;
            const newY = offset.y + r;
            if (newX < 0 || newX >= COLS || newY >= ROWS) {
              return true;
            }
            if (newY >= 0 && currentGrid[newY][newX] !== null) {
              return true;
            }
          }
        }
      }
      return false;
    },
    [grid]
  );

  // 3. Piece Rotation with Wall Kick
  const rotateMatrix = (matrix) => {
    const N = matrix.length;
    const result = Array.from({ length: N }, () => Array(N).fill(0));
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        result[c][N - 1 - r] = matrix[r][c];
      }
    }
    return result;
  };

  const handleRotate = useCallback(() => {
    if (gameOver || isPaused) return;
    const rotated = rotateMatrix(currentPiece);
    // Wall kick offsets to test
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      const testPos = { x: currentPos.x + kick, y: currentPos.y };
      if (!checkCollision(rotated, testPos)) {
        setCurrentPiece(rotated);
        setCurrentPos(testPos);
        playSound("rotate");
        triggerHaptic(10);
        return;
      }
    }
  }, [currentPiece, currentPos, checkCollision, gameOver, isPaused, playSound, triggerHaptic]);

  // 4. Ghost Piece Calculation (Architectural blueprint landing shadow)
  const getGhostY = useCallback(() => {
    let ghostY = currentPos.y;
    while (!checkCollision(currentPiece, { x: currentPos.x, y: ghostY + 1 })) {
      ghostY++;
    }
    return ghostY;
  }, [currentPiece, currentPos, checkCollision]);

  // 5. Piece Placement & Line Clear
  const lockPiece = useCallback(() => {
    playSound("drop");
    triggerHaptic(25);

    const newGrid = grid.map((row) => [...row]);
    let placedBlocksCount = 0;

    for (let r = 0; r < currentPiece.length; r++) {
      for (let c = 0; c < currentPiece[r].length; c++) {
        if (currentPiece[r][c] !== 0) {
          const gridY = currentPos.y + r;
          const gridX = currentPos.x + c;
          if (gridY < 0) {
            // Reached top -> Game Over
            setGameOver(true);
            playSound("gameover");
            triggerHaptic([40, 60, 80]);
            return;
          }
          newGrid[gridY][gridX] = {
            key: currentPieceKey,
            ...PIECES[currentPieceKey],
          };
          placedBlocksCount++;
        }
      }
    }

    // Check full rows
    const fullRows = [];
    for (let r = 0; r < ROWS; r++) {
      if (newGrid[r].every((cell) => cell !== null)) {
        fullRows.push(r);
      }
    }

    if (fullRows.length > 0) {
      playSound("line");
      triggerHaptic([30, 40, 70]);
      setClearingLines(fullRows);

      setTimeout(() => {
        const filteredGrid = newGrid.filter((_, idx) => !fullRows.includes(idx));
        const emptyRows = Array.from({ length: fullRows.length }, () =>
          Array(COLS).fill(null)
        );
        const finalGrid = [...emptyRows, ...filteredGrid];
        setGrid(finalGrid);
        setClearingLines([]);

        // Score Calculation (in Mq Arredati)
        const lineScores = { 1: 12, 2: 28, 3: 50, 4: 90 };
        const gainedMq = (lineScores[fullRows.length] || 15) + placedBlocksCount;
        setScoreMq((prev) => prev + gainedMq);
        setLinesCleared((prev) => {
          const total = prev + fullRows.length;
          setLevel(Math.floor(total / 4) + 1);
          return total;
        });
      }, 160);
    } else {
      setGrid(newGrid);
      setScoreMq((prev) => prev + placedBlocksCount);
    }

    // Spawn Next Piece
    const nextKey = nextPieceKey;
    const newNextKey = getRandomPieceKey();
    const newPieceMatrix = PIECES[nextKey].shape;
    const spawnPos = { x: Math.floor((COLS - newPieceMatrix[0].length) / 2), y: 0 };

    if (checkCollision(newPieceMatrix, spawnPos, newGrid)) {
      setGameOver(true);
      playSound("gameover");
      triggerHaptic([50, 70, 90]);
    } else {
      setCurrentPieceKey(nextKey);
      setCurrentPiece(newPieceMatrix);
      setCurrentPos(spawnPos);
      setNextPieceKey(newNextKey);
    }
  }, [
    grid,
    currentPiece,
    currentPieceKey,
    currentPos,
    nextPieceKey,
    checkCollision,
    playSound,
    triggerHaptic,
  ]);

  // 6. Movement actions
  const moveLeft = useCallback(() => {
    if (gameOver || isPaused) return;
    if (!checkCollision(currentPiece, { x: currentPos.x - 1, y: currentPos.y })) {
      setCurrentPos((p) => ({ ...p, x: p.x - 1 }));
      playSound("move");
      triggerHaptic(8);
    }
  }, [currentPiece, currentPos, checkCollision, gameOver, isPaused, playSound, triggerHaptic]);

  const moveRight = useCallback(() => {
    if (gameOver || isPaused) return;
    if (!checkCollision(currentPiece, { x: currentPos.x + 1, y: currentPos.y })) {
      setCurrentPos((p) => ({ ...p, x: p.x + 1 }));
      playSound("move");
      triggerHaptic(8);
    }
  }, [currentPiece, currentPos, checkCollision, gameOver, isPaused, playSound, triggerHaptic]);

  const softDrop = useCallback(() => {
    if (gameOver || isPaused) return;
    if (!checkCollision(currentPiece, { x: currentPos.x, y: currentPos.y + 1 })) {
      setCurrentPos((p) => ({ ...p, y: p.y + 1 }));
      playSound("move");
    } else {
      lockPiece();
    }
  }, [currentPiece, currentPos, checkCollision, lockPiece, gameOver, isPaused, playSound]);

  const hardDrop = useCallback(() => {
    if (gameOver || isPaused) return;
    const targetY = getGhostY();
    setCurrentPos((p) => ({ ...p, y: targetY }));
    setTimeout(() => {
      lockPiece();
    }, 20);
  }, [getGhostY, lockPiece, gameOver, isPaused]);

  // 7. Dynamic Game Tick Loop
  useEffect(() => {
    if (gameOver || isPaused) {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
      return;
    }

    const speed = Math.max(140, 750 - (level - 1) * 65);
    dropIntervalRef.current = setInterval(() => {
      softDrop();
    }, speed);

    return () => {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    };
  }, [softDrop, gameOver, isPaused, level]);

  // 8. Keyboard Controls (for desktop testing & accessibility)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        e.preventDefault();
        moveLeft();
      } else if (e.key === "ArrowRight" || e.key === "d") {
        e.preventDefault();
        moveRight();
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "r") {
        e.preventDefault();
        handleRotate();
      } else if (e.key === "ArrowDown" || e.key === "s") {
        e.preventDefault();
        softDrop();
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        hardDrop();
      } else if (e.key === "p") {
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveLeft, moveRight, handleRotate, softDrop, hardDrop, gameOver]);

  // 9. Touch Gestures on Canvas
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current || !e.changedTouches || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Tap to Rotate
    if (absDx < 15 && absDy < 15 && dt < 250) {
      handleRotate();
      return;
    }

    // Horizontal Swipe
    if (absDx > absDy && absDx > 25) {
      if (dx > 0) moveRight();
      else moveLeft();
    } else if (absDy > absDx && absDy > 30) {
      // Downward swipe
      if (dy > 0) {
        if (absDy > 100) hardDrop();
        else softDrop();
      }
    }
    touchStartRef.current = null;
  };

  // 10. Canvas Render Engine (Brutalist Tile Renderer with Tactile Details)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Adapt to display scale
    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / COLS;
    const cellH = height / ROWS;

    ctx.clearRect(0, 0, width, height);

    // A. Architectural Grid Background (Technical Blueprint Mesh)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;

    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellW, 0);
      ctx.lineTo(c * cellW, height);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(width, r * cellH);
      ctx.stroke();
    }

    // Helper: Draw a Brutalist Architectural Tile
    const drawBrutalistTile = (x, y, pieceInfo, isGhost = false, isFlash = false) => {
      const px = x * cellW;
      const py = y * cellH;

      if (isFlash) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(px, py, cellW, cellH);
        return;
      }

      if (isGhost) {
        // Ghost Piece Projection
        ctx.strokeStyle = pieceInfo.color;
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px + 1.5, py + 1.5, cellW - 3, cellH - 3);
        ctx.fillStyle = pieceInfo.color + "22";
        ctx.fillRect(px + 1.5, py + 1.5, cellW - 3, cellH - 3);
        ctx.setLineDash([]);
        return;
      }

      // Concrete / Corten / Steel Solid Block
      ctx.fillStyle = pieceInfo.color;
      ctx.fillRect(px, py, cellW, cellH);

      // Brutalist Heavy Border
      ctx.strokeStyle = pieceInfo.borderColor || "#111213";
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 1, py + 1, cellW - 2, cellH - 2);

      // Subtle Industrial Corner Rivets / Cassaforma Holes
      ctx.fillStyle = pieceInfo.dotColor || "#000000";
      const dotRadius = Math.max(1, cellW * 0.05);
      const dotPad = cellW * 0.18;
      
      ctx.beginPath();
      ctx.arc(px + dotPad, py + dotPad, dotRadius, 0, Math.PI * 2);
      ctx.arc(px + cellW - dotPad, py + dotPad, dotRadius, 0, Math.PI * 2);
      ctx.arc(px + dotPad, py + cellH - dotPad, dotRadius, 0, Math.PI * 2);
      ctx.arc(px + cellW - dotPad, py + cellH - dotPad, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      // Industrial Inner Bevel
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px + 2, py + cellH - 2);
      ctx.lineTo(px + 2, py + 2);
      ctx.lineTo(px + cellW - 2, py + 2);
      ctx.stroke();
    };

    // B. Draw Placed Grid
    for (let r = 0; r < ROWS; r++) {
      const isClearing = clearingLines.includes(r);
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        if (cell) {
          drawBrutalistTile(c, r, cell, false, isClearing);
        }
      }
    }

    // C. Draw Ghost Piece (Drop Blueprint projection)
    if (!gameOver && !isPaused) {
      const ghostY = getGhostY();
      const activeInfo = PIECES[currentPieceKey];
      for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[r].length; c++) {
          if (currentPiece[r][c] !== 0) {
            const gx = currentPos.x + c;
            const gy = ghostY + r;
            if (gy >= 0) {
              drawBrutalistTile(gx, gy, activeInfo, true);
            }
          }
        }
      }
    }

    // D. Draw Active Falling Piece
    if (!gameOver && !isPaused) {
      const activeInfo = PIECES[currentPieceKey];
      for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[r].length; c++) {
          if (currentPiece[r][c] !== 0) {
            const gx = currentPos.x + c;
            const gy = currentPos.y + r;
            if (gy >= 0) {
              drawBrutalistTile(gx, gy, activeInfo, false);
            }
          }
        }
      }
    }
  }, [
    grid,
    currentPiece,
    currentPieceKey,
    currentPos,
    clearingLines,
    gameOver,
    isPaused,
    getGhostY,
  ]);

  // Restart Game
  const restartGame = () => {
    setGrid(createEmptyGrid());
    const firstKey = getRandomPieceKey();
    const secondKey = getRandomPieceKey();
    setCurrentPieceKey(firstKey);
    setCurrentPiece(PIECES[firstKey].shape);
    setCurrentPos({ x: 3, y: 0 });
    setNextPieceKey(secondKey);
    setScoreMq(0);
    setLinesCleared(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
  };

  const currentPieceData = PIECES[currentPieceKey];
  const nextPieceData = PIECES[nextPieceKey];

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center bg-[#111213] text-white border-2 border-[#111213] overflow-hidden select-none"
    >
      {/* ------------------------------------------------------------- */}
      {/* CAMERA VIDEO STREAM BACKGROUND (WEBAR REALITY BACKDROP)       */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#18191B]">
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          webkit-playsinline="true"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            cameraActive ? "opacity-75" : "opacity-0"
          }`}
        />
        {/* Architectural Vignette & High Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111213]/90 via-[#111213]/40 to-[#111213]/95 pointer-events-none" />
        
        {/* Subtle Concrete Grid Watermark if camera is disabled */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/60 mb-2">
              [ MODALITÀ STUDIO // SENZA CAMERA ]
            </span>
            <div className="w-32 h-32 border border-white/20 border-dashed animate-pulse" />
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER: BRAND, METRICS & UTILITIES CONTROLS               */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 w-full p-2.5 sm:p-3 bg-[#111213]/95 border-b-2 border-white/20 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 border border-white"
              style={{ backgroundColor: accentColor }}
            />
            <span className="font-mono font-bold text-[11px] sm:text-xs tracking-widest uppercase text-white">
              ARCHI-TETRIS // I WAALDDEI
            </span>
          </div>

          {/* Quick Toolbar (Camera & Audio Toggles) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                initAudio();
                if (cameraActive) stopCamera();
                else startCamera();
              }}
              aria-label="Attiva o disattiva fotocamera"
              className={`p-1.5 border font-mono text-[10px] flex items-center gap-1 transition-colors ${
                cameraActive
                  ? "bg-[#C85A17] text-white border-white/50"
                  : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
              }`}
            >
              {cameraActive ? <Camera className="w-3 h-3" /> : <CameraOff className="w-3 h-3" />}
              <span className="text-[9px] font-bold hidden sm:inline">
                {cameraActive ? "CAM ON" : "CAM OFF"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                initAudio();
                setAudioMuted((m) => !m);
              }}
              aria-label="Attiva o disattiva audio"
              className="p-1.5 border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {audioMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-white" />}
            </button>
          </div>
        </div>

        {/* Live Architectural Metrics HUD */}
        <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
          <div className="bg-[#1C1F22] border border-white/15 p-1.5 flex flex-col">
            <span className="text-[8px] text-gray-400 uppercase tracking-wider">
              MQ ARREDATI
            </span>
            <span className="font-bold text-sm sm:text-base text-white tracking-tight" style={{ color: accentColor }}>
              {scoreMq} m²
            </span>
          </div>

          <div className="bg-[#1C1F22] border border-white/15 p-1.5 flex flex-col">
            <span className="text-[8px] text-gray-400 uppercase tracking-wider">
              FASE / LIVELLO
            </span>
            <span className="font-bold text-sm sm:text-base text-white">
              0{level}
            </span>
          </div>

          <div className="bg-[#1C1F22] border border-white/15 p-1.5 flex flex-col justify-between">
            <span className="text-[8px] text-gray-400 uppercase tracking-wider">
              CAMPATE
            </span>
            <span className="font-bold text-sm sm:text-base text-white">
              {linesCleared} LINEE
            </span>
          </div>
        </div>

        {/* Current Active Furniture Piece Badge */}
        <div className="w-full bg-[#181A1D] border border-white/15 px-2 py-1 flex items-center justify-between text-[9px] font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-none border border-black/40 flex-shrink-0" style={{ backgroundColor: currentPieceData?.color }} />
            <span className="font-bold text-white uppercase truncate">
              IN POSA: {currentPieceData?.name}
            </span>
            <span className="text-gray-400 uppercase hidden sm:inline">
              [{currentPieceData?.material}]
            </span>
          </div>

          <div className="flex items-center gap-1 text-[8px] text-gray-400 uppercase pl-2 flex-shrink-0">
            <span>PROX:</span>
            <span className="text-white font-bold">{nextPieceData?.name.split(" ")[0]}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN PLAYFIELD: GAME CANVAS OVER CAMERA FEED                  */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 w-full flex justify-center py-2 px-2">
        <div
          className="relative border-2 border-white/30 shadow-[4px_4px_0px_rgba(0,0,0,0.8)] bg-[#111213]/40 backdrop-blur-[2px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Canvas resolution matches 10x20 cell aspect ratio */}
          <canvas
            ref={canvasRef}
            width={260}
            height={468}
            className="block max-w-full h-auto cursor-pointer"
            style={{ width: "260px", height: "468px" }}
          />

          {/* PAUSE OVERLAY */}
          {isPaused && (
            <div className="absolute inset-0 bg-[#111213]/85 flex flex-col items-center justify-center gap-3">
              <span className="font-mono text-sm font-bold tracking-widest uppercase text-white">
                CANTIERE IN PAUSA
              </span>
              <button
                type="button"
                onClick={() => setIsPaused(false)}
                className="px-4 py-2 bg-[#C85A17] text-white font-mono text-xs font-bold uppercase border border-white"
              >
                RIPRENDI
              </button>
            </div>
          )}

          {/* GAME OVER OVERLAY */}
          {gameOver && (
            <div className="absolute inset-0 bg-[#111213]/95 p-4 flex flex-col justify-between text-center border-2 border-[#C85A17] animate-fade-in">
              <div>
                <span className="font-mono text-[9px] text-[#C85A17] font-bold tracking-widest uppercase block mb-1">
                  [ RAPPORTO DI COLLAUDO ]
                </span>
                <h4 className="font-mono text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                  SPAZIO SATURO
                </h4>
                <div className="w-12 h-0.5 bg-[#C85A17] mx-auto my-2" />
                <p className="font-mono text-[10px] text-gray-300 uppercase leading-snug">
                  Hai arredato con successo <span className="text-[#C85A17] font-bold">{scoreMq} m²</span> con i pezzi brutalisti I WAALDDEI.
                </p>
              </div>

              {/* Stats Box */}
              <div className="bg-[#1C1F22] border border-white/20 p-2.5 my-2 flex flex-col gap-1 font-mono text-[9px] text-left">
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-gray-400 uppercase">SUPERFICIE TOTALE:</span>
                  <span className="font-bold text-white">{scoreMq} m²</span>
                </div>
                <div className="flex justify-between border-b border-white/10 py-1">
                  <span className="text-gray-400 uppercase">CAMPATE CHIUSE:</span>
                  <span className="font-bold text-white">{linesCleared} RIGHE</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-400 uppercase">LIVELLO RAGGIUNTO:</span>
                  <span className="font-bold text-[#C85A17]">FASE 0{level}</span>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col gap-2">
                {/* WhatsApp Direct Share / Lead Generator */}
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Ciao I WAALDDEI! Ho appena arredato ${scoreMq} m² ad ARCHI-TETRIS AR sulla vostra placca NFC. Vorrei informazioni per un progetto di interior design.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#C85A17] hover:bg-[#A84910] text-white font-mono font-bold text-[10px] uppercase tracking-wider border border-white shadow-[2px_2px_0px_#FFFFFF] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>PARLANE CON LO STUDIO</span>
                </a>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={restartGame}
                    className="flex-1 py-2 bg-[#282B2E] hover:bg-white hover:text-black text-white font-mono font-bold text-[9px] uppercase tracking-wider border border-white/30 transition-colors flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>RIGIOCA</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2 bg-[#18191B] hover:bg-white hover:text-black text-white font-mono font-bold text-[9px] uppercase tracking-wider border border-white/30 transition-colors"
                  >
                    CHIUDI
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM CONTROLLER: INDUSTRIAL TACTILE THUMB CONTROLS          */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 w-full p-2.5 bg-[#111213] border-t-2 border-white/20 flex flex-col gap-2">
        {/* Main Touch Controls Bar */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {/* Left Button */}
          <button
            type="button"
            onClick={moveLeft}
            aria-label="Sposta pezzo a sinistra"
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-[#1C1F22] hover:bg-white hover:text-black border-2 border-white/30 text-white font-mono active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[8px] font-bold mt-0.5">SIN</span>
          </button>

          {/* Rotate Button (Hero Action) */}
          <button
            type="button"
            onClick={handleRotate}
            aria-label="Ruota pezzo"
            className="col-span-1 flex flex-col items-center justify-center p-2.5 sm:p-3 bg-[#C85A17] hover:bg-[#E0671C] border-2 border-white text-white font-mono active:scale-95 transition-all shadow-[2px_2px_0px_#FFFFFF]"
          >
            <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span className="text-[8px] font-bold mt-0.5">RUOTA</span>
          </button>

          {/* Right Button */}
          <button
            type="button"
            onClick={moveRight}
            aria-label="Sposta pezzo a destra"
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-[#1C1F22] hover:bg-white hover:text-black border-2 border-white/30 text-white font-mono active:scale-95 transition-all"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[8px] font-bold mt-0.5">DES</span>
          </button>

          {/* Soft Drop Button */}
          <button
            type="button"
            onClick={softDrop}
            aria-label="Scendi pezzo"
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-[#1C1F22] hover:bg-white hover:text-black border-2 border-white/30 text-white font-mono active:scale-95 transition-all"
          >
            <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[8px] font-bold mt-0.5">GIÙ</span>
          </button>

          {/* Hard Drop Button (Instant Slam) */}
          <button
            type="button"
            onClick={hardDrop}
            aria-label="Cala istantaneamente pezzo"
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-[#2E3338] hover:bg-white hover:text-black border-2 border-white/50 text-white font-mono active:scale-95 transition-all"
          >
            <ChevronsDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD700]" />
            <span className="text-[8px] font-bold mt-0.5 text-[#FFD700]">CALA</span>
          </button>
        </div>

        {/* Minimal Instructions / Gesture Hint */}
        <div className="flex items-center justify-between text-[8px] font-mono text-gray-400 px-1">
          <span>TOUCH: SWIPE / TAP PER RUOTARE</span>
          <span className="text-gray-500">I WAALDDEI ED. 2026</span>
        </div>
      </div>
    </div>
  );
}
