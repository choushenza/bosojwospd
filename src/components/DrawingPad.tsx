import React, { useRef, useState, useEffect } from 'react';
import { AKSARA_NGLEGENA, SANDHANGAN_SWARA, SANDHANGAN_PANYIGEG, AksaraItem } from '../data/aksaraData';
import { RotateCcw, Volume2, PenTool, Eraser, CheckCircle2 } from 'lucide-react';
import { playClickSound, speakWord } from '../utils/audio';

export const DrawingPad: React.FC = () => {
  const allItems = [...AKSARA_NGLEGENA, ...SANDHANGAN_SWARA, ...SANDHANGAN_PANYIGEG];
  const [selectedItem, setSelectedItem] = useState<AksaraItem>(AKSARA_NGLEGENA[0]);
  const [color, setColor] = useState('#78350f'); // Warm amber-900 batik brown
  const [lineWidth, setLineWidth] = useState(8);
  const [isEraser, setIsEraser] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showLines, setShowLines] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Initialize and clear canvas
  const clearCanvas = () => {
    playClickSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Re-clear on character change
  useEffect(() => {
    clearCanvas();
  }, [selectedItem]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isEraser ? lineWidth * 2.5 : lineWidth;
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasDrawn) setHasDrawn(true);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header Info */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Gladhen Nulis (Latihan Menulis)
          </span>
          <h2 className="font-child text-xl sm:text-2xl font-bold text-amber-950">
            Papan Coretan & Niru Aksara Jawa
          </h2>
          <p className="text-xs sm:text-sm text-amber-800/80 mt-1">
            Tiru guratan aksara ing papan kanvas kanthi nggunakake driji utawa kursor mouse!
          </p>
        </div>

        {/* Selected Aksara Cue */}
        <div className="flex items-center gap-3 bg-amber-50 p-2.5 rounded-2xl border border-amber-200">
          <div className="w-12 h-12 rounded-xl bg-white border border-amber-300 flex items-center justify-center font-jawa text-2xl font-bold text-amber-950">
            {selectedItem.char}
          </div>
          <div>
            <h3 className="font-child font-bold text-sm text-amber-950">{selectedItem.name}</h3>
            <p className="text-xs text-amber-700">{selectedItem.latin}</p>
          </div>
          <button
            onClick={() => speakWord(selectedItem.latin.replace(/[()\-]/g, ''))}
            aria-label="Bunyikan Aksara"
            className="p-2 rounded-xl bg-amber-200 text-amber-800 hover:bg-amber-600 hover:text-white transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aksara Selection Carousel / Picker */}
      <div className="bg-white rounded-2xl border border-amber-200 p-3 shadow-xs">
        <span className="text-xs font-bold text-amber-900 block mb-2 px-1">
          Pilih Aksara sing pengin ditulis:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {allItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                playClickSound();
                setSelectedItem(item);
              }}
              className={`px-3 py-2 rounded-xl flex flex-col items-center justify-center min-w-[56px] border-2 transition-all ${
                selectedItem.id === item.id
                  ? 'bg-amber-600 text-white border-amber-700 shadow-sm scale-105'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950 hover:bg-amber-100'
              }`}
            >
              <span className="font-jawa text-xl font-bold">{item.char}</span>
              <span className="text-[10px] font-semibold mt-0.5">{item.latin.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative bg-white rounded-3xl border-2 border-amber-300 shadow-md p-4 flex flex-col items-center overflow-hidden">
        {/* Background Notebook Ruled Lines (Buku Tulis Halus 3 Baris) */}
        {showLines && (
          <div className="absolute inset-0 flex flex-col justify-center px-8 pointer-events-none select-none z-0 opacity-40">
            <div className="w-full border-b border-rose-400 mb-8" />
            <div className="w-full border-b-2 border-sky-600 mb-8" />
            <div className="w-full border-b border-rose-400" />
          </div>
        )}

        {/* Background Watermark Guide (The Aksara to Trace) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span className="font-jawa text-[180px] sm:text-[240px] text-amber-900/10 font-bold">
            {selectedItem.char}
          </span>
        </div>

        {/* Tracing Canvas */}
        <canvas
          ref={canvasRef}
          width={600}
          height={340}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative z-10 w-full max-w-[600px] h-[260px] sm:h-[340px] bg-transparent rounded-2xl border-2 border-dashed border-amber-300 touch-none cursor-crosshair"
        />

        {/* Toolbar below canvas */}
        <div className="relative z-10 w-full max-w-[600px] mt-4 pt-3 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-amber-900 mr-1 hidden sm:inline">Warna:</span>
            {[
              { label: 'Batik', hex: '#78350f' },
              { label: 'Hitam', hex: '#1e293b' },
              { label: 'Biru', hex: '#2563eb' },
              { label: 'Ijo', hex: '#059669' },
              { label: 'Abang', hex: '#dc2626' }
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  playClickSound();
                  setColor(c.hex);
                  setIsEraser(false);
                }}
                title={c.label}
                aria-label={`Warna ${c.label}`}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c.hex && !isEraser ? 'scale-125 border-amber-600 ring-2 ring-amber-300' : 'border-white'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Stroke Width Slider */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900">Kandel:</span>
            <input
              type="range"
              min={4}
              max={18}
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-20 accent-amber-600"
            />
          </div>

          {/* Notebook line toggle, Eraser & Clear */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setShowLines(!showLines);
              }}
              title="Garis Buku Tulis Halus 3 Baris"
              aria-label="Alihkan Garis Buku Tulis"
              className={`p-2 rounded-xl border font-semibold transition-colors ${
                showLines
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Garis Buku
            </button>

            <button
              onClick={() => {
                playClickSound();
                setIsEraser(!isEraser);
              }}
              className={`p-2 rounded-xl border flex items-center gap-1 font-semibold transition-colors ${
                isEraser
                  ? 'bg-amber-600 text-white border-amber-700'
                  : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
              }`}
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Penghapus</span>
            </button>

            <button
              onClick={clearCanvas}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Busak</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
