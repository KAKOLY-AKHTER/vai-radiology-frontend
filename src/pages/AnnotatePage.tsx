import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Point { x: number; y: number; }

interface Annotation {
  id: number;
  image: number;
  points: Point[];
}

interface ImageItem {
  id: number;
  name: string;
  file_url: string;
  annotations: Annotation[];
}

const AnnotatePage = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState<Point[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchImages = async () => {
    const res = await api.get('/images/');
    setImages(res.data);
  };

  useEffect(() => { fetchImages(); }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !images[currentIndex]) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = img.clientWidth / (img.naturalWidth || 1);
    const scaleY = img.clientHeight / (img.naturalHeight || 1);

    images[currentIndex].annotations.forEach((ann, idx) => {
      if (ann.points.length < 2) return;
      const hue = (idx * 60) % 360;
      ctx.beginPath();
      ctx.moveTo(ann.points[0].x * scaleX, ann.points[0].y * scaleY);
      ann.points.forEach((p) => ctx.lineTo(p.x * scaleX, p.y * scaleY));
      ctx.closePath();
      ctx.strokeStyle = `hsl(${hue}, 80%, 55%)`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = `hsla(${hue}, 80%, 55%, 0.12)`;
      ctx.fill();
    });

    if (currentPolygon.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentPolygon[0].x, currentPolygon[0].y);
      currentPolygon.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      currentPolygon.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#10b981' : '#6366f1';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  }, [images, currentIndex, currentPolygon]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const img = imgRef.current!;
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    setCurrentPolygon((prev) => [...prev, {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }]);
  };

  const handleSavePolygon = async () => {
    const img = images[currentIndex];
    if (currentPolygon.length < 3 || !img) return;
    await api.post('/annotations/', { image: img.id, points: currentPolygon });
    setCurrentPolygon([]);
    setDrawing(false);
    fetchImages();
  };

  const handleDeleteAnnotation = async (id: number) => {
    await api.delete(`/annotations/${id}/`);
    fetchImages();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    await api.post('/images/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    fetchImages();
  };

  const currentImage = images[currentIndex];

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoMark}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10C4 6.686 6.686 4 10 4C13.314 4 16 6.686 16 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 7v3l2 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="15" r="1.5" fill="white"/>
            </svg>
          </div>
          <div>
            <span style={styles.logoText}>VAI Radiology</span>
            <span style={styles.logoSep}>/</span>
            <span style={styles.pageTitle}>Image Annotation</span>
          </div>
        </div>
        <nav style={styles.nav}>
          <button style={styles.navLink} onClick={() => navigate('/tasks')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="2" rx="1" fill="rgba(255,255,255,0.7)"/>
              <rect x="2" y="7" width="8" height="2" rx="1" fill="rgba(255,255,255,0.7)"/>
              <rect x="2" y="11" width="10" height="2" rx="1" fill="rgba(255,255,255,0.7)"/>
            </svg>
            Tasks
          </button>
          <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </nav>
      </header>

      <div style={styles.body}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sideHeader}>
            <h3 style={styles.sideTitle}>Images</h3>
            <span style={styles.imgCount}>{images.length}</span>
          </div>

          <label style={styles.uploadBtn}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 11V3M5 6l3-3 3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 13h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Upload Image
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
          </label>

          <div style={styles.imageList}>
            {images.length === 0 && (
              <p style={styles.noImages}>No images yet. Upload one to start.</p>
            )}
            {images.map((img, idx) => (
              <div
                key={img.id}
                style={{
                  ...styles.imageItem,
                  background: idx === currentIndex ? '#ede9fe' : '#fff',
                  borderColor: idx === currentIndex ? '#7c3aed' : '#e2e8f0',
                }}
                onClick={() => { setCurrentIndex(idx); setCurrentPolygon([]); setDrawing(false); }}
              >
                <img src={img.file_url} alt={img.name} style={styles.thumb} />
                <div style={styles.imgMeta}>
                  <span style={styles.imgName}>{img.name.length > 18 ? img.name.slice(0, 18) + '…' : img.name}</span>
                  <span style={styles.annCount}>{img.annotations.length} annotations</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main style={styles.main}>
          {currentImage ? (
            <>
              <div style={styles.canvasWrap}>
                <img
                  ref={imgRef}
                  src={currentImage.file_url}
                  alt={currentImage.name}
                  style={styles.mainImg}
                  onLoad={drawCanvas}
                  draggable={false}
                />
                <canvas ref={canvasRef} style={{ ...styles.canvas, cursor: drawing ? 'crosshair' : 'default' }} onClick={handleCanvasClick} />
                {drawing && (
                  <div style={styles.drawHint}>
                    Click to add points · {currentPolygon.length} points added
                  </div>
                )}
              </div>

              <div style={styles.toolbar}>
                <div style={styles.toolbarLeft}>
                  {!drawing ? (
                    <button style={styles.drawBtn} onClick={() => setDrawing(true)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 14l4-1.5L13 5.5 10.5 3 3.5 10 2 14z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M10.5 3l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Draw Polygon
                    </button>
                  ) : (
                    <>
                      <button style={styles.cancelBtn} onClick={() => { setDrawing(false); setCurrentPolygon([]); }}>
                        Cancel
                      </button>
                      {currentPolygon.length >= 3 && (
                        <button style={styles.saveBtn} onClick={handleSavePolygon}>
                          Save Polygon ({currentPolygon.length} pts)
                        </button>
                      )}
                      {currentPolygon.length > 0 && (
                        <button style={styles.undoBtn} onClick={() => setCurrentPolygon(p => p.slice(0, -1))}>
                          Undo Last
                        </button>
                      )}
                    </>
                  )}
                </div>
                <span style={styles.imgLabel}>{currentImage.name}</span>
              </div>

              <div style={styles.annPanel}>
                <h4 style={styles.annTitle}>
                  Annotations
                  <span style={styles.annBadge}>{currentImage.annotations.length}</span>
                </h4>
                {currentImage.annotations.length === 0 ? (
                  <p style={styles.noAnn}>No annotations yet. Draw a polygon to start.</p>
                ) : (
                  <div style={styles.annList}>
                    {currentImage.annotations.map((ann, i) => {
                      const hue = (i * 60) % 360;
                      return (
                        <div key={ann.id} style={styles.annItem}>
                          <div style={styles.annItemLeft}>
                            <div style={{ ...styles.annColor, background: `hsl(${hue}, 80%, 55%)` }} />
                            <div>
                              <span style={styles.annName}>Polygon {i + 1}</span>
                              <span style={styles.annPts}>{ann.points.length} points</span>
                            </div>
                          </div>
                          <button style={styles.deleteBtn} onClick={() => handleDeleteAnnotation(ann.id)}>
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>🖼️</div>
              <h3 style={styles.emptyTitle}>No image selected</h3>
              <p style={styles.emptySub}>Upload an image from the sidebar to begin annotation</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' },
  header: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    padding: '0 32px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 12px rgba(79,70,229,0.3)',
    flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  logoMark: {
    width: 36, height: 36, background: 'rgba(255,255,255,0.2)',
    borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: 700, fontSize: 16 },
  logoSep: { color: 'rgba(255,255,255,0.4)', margin: '0 8px', fontSize: 16 },
  pageTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  nav: { display: 'flex', alignItems: 'center', gap: 8 },
  navLink: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 16px', background: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
  },
  logoutBtn: {
    padding: '7px 16px', background: 'transparent',
    color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8, cursor: 'pointer', fontSize: 13,
  },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: {
    width: 260, background: '#fff', borderRight: '1px solid #e2e8f0',
    display: 'flex', flexDirection: 'column', gap: 0, flexShrink: 0,
  },
  sideHeader: {
    padding: '20px 20px 12px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: '1px solid #f1f5f9',
  },
  sideTitle: { fontWeight: 700, fontSize: 14, color: '#1e293b' },
  imgCount: {
    background: '#ede9fe', color: '#7c3aed', fontSize: 12,
    fontWeight: 700, padding: '2px 8px', borderRadius: 20,
  },
  uploadBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    margin: '16px', padding: '11px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff', borderRadius: 10, cursor: 'pointer',
    fontWeight: 600, fontSize: 13,
    boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
  },
  imageList: { flex: 1, overflowY: 'auto', padding: '0 12px 12px' },
  noImages: { color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '24px 0' },
  imageItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
    border: '1.5px solid', marginBottom: 8, transition: 'all 0.15s',
  },
  thumb: { width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 },
  imgMeta: { display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' },
  imgName: { fontSize: 13, fontWeight: 600, color: '#1e293b' },
  annCount: { fontSize: 11, color: '#94a3b8', fontWeight: 500 },
  main: {
    flex: 1, padding: '24px', overflowY: 'auto',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  canvasWrap: { position: 'relative', display: 'inline-block', alignSelf: 'flex-start' },
  mainImg: {
    maxWidth: '100%', maxHeight: '55vh', display: 'block',
    borderRadius: 12, border: '1px solid #e2e8f0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  canvas: { position: 'absolute', top: 0, left: 0 },
  drawHint: {
    position: 'absolute', bottom: 12, left: 12,
    background: 'rgba(15,23,42,0.75)', color: '#fff',
    fontSize: 12, fontWeight: 600, padding: '6px 12px',
    borderRadius: 8, backdropFilter: 'blur(4px)',
  },
  toolbar: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
  },
  toolbarLeft: { display: 'flex', gap: 8 },
  drawBtn: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff', border: 'none', borderRadius: 10,
    cursor: 'pointer', fontWeight: 600, fontSize: 14,
    boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
  },
  cancelBtn: {
    padding: '10px 18px', background: '#f1f5f9', color: '#475569',
    border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13,
  },
  saveBtn: {
    padding: '10px 18px', background: '#10b981', color: '#fff',
    border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13,
    boxShadow: '0 4px 10px rgba(16,185,129,0.3)',
  },
  undoBtn: {
    padding: '10px 18px', background: '#fff7ed', color: '#d97706',
    border: '1px solid #fed7aa', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13,
  },
  imgLabel: { fontSize: 13, color: '#64748b', fontWeight: 500 },
  annPanel: {
    background: '#fff', borderRadius: 14, padding: '20px',
    border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  annTitle: {
    fontSize: 15, fontWeight: 700, color: '#1e293b',
    marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
  },
  annBadge: {
    background: '#ede9fe', color: '#7c3aed', fontSize: 12,
    fontWeight: 700, padding: '2px 8px', borderRadius: 20,
  },
  noAnn: { color: '#94a3b8', fontSize: 13 },
  annList: { display: 'flex', flexDirection: 'column', gap: 8 },
  annItem: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px', background: '#f8fafc',
    borderRadius: 10, border: '1px solid #f1f5f9',
  },
  annItemLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  annColor: { width: 12, height: 12, borderRadius: '50%', flexShrink: 0 },
  annName: { fontSize: 13, fontWeight: 600, color: '#1e293b', display: 'block' },
  annPts: { fontSize: 11, color: '#94a3b8', fontWeight: 500 },
  deleteBtn: {
    padding: '5px 12px', background: '#fff5f5',
    color: '#ef4444', border: '1px solid #fecaca',
    borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
  },
  empty: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 12, padding: 60,
  },
  emptyIcon: { fontSize: 56 },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: '#1e293b' },
  emptySub: { color: '#64748b', fontSize: 14, textAlign: 'center' },
};

export default AnnotatePage;
