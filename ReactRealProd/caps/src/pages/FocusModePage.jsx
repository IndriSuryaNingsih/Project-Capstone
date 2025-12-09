import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api';

const DURATIONS = [15, 25, 45, 60];

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function FocusModePage() {
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS[0] * 60);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState('');
  const [studyUrl, setStudyUrl] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);

  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const intervalRef = useRef(null);

  // ===== LOAD HISTORY (CORRECT ENDPOINT) =====
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await apiFetch('/focus'); // <--- FIXED
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    loadHistory();
  }, []);

  // ===== TIMER =====
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setRunning(false);

          saveSession('Sesi fokus selesai! 🎉');

          document.exitFullscreen?.();
          setFocusMode(false);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  // ===== FULLSCREEN UTILITY =====
  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  // ===== SAVE SESSION (CORRECT ENDPOINT) =====
  const saveSession = async (message = '') => {
    try {
      const body = {
        durationMinutes: duration,
        note: note.trim() || undefined,
        studyUrl: studyUrl.trim() || undefined,
        startedAt: sessionStartedAt,
        finishedAt: new Date().toISOString(),
      };

      await apiFetch('/focus', {   // <--- FIXED
        method: 'POST',
        body: JSON.stringify(body),
      });

      setInfo(message || 'Sesi fokus disimpan.');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan sesi fokus.');
    }
  };

  // ===== START SESSION =====
  const handleStart = () => {
    setError('');
    setInfo('');

    if (!studyUrl.trim()) {
      setError('Masukkan link belajar terlebih dahulu.');
      return;
    }

    try {
      new URL(studyUrl);
    } catch {
      setError('URL tidak valid.');
      return;
    }

    setFocusMode(true);
    setRunning(true);
    setSessionStartedAt(new Date().toISOString());

    if (secondsLeft <= 0) setSecondsLeft(duration * 60);

    enterFullscreen();
  };

  // ===== EXIT SESSION =====
  const handleExitFocusAndReset = () => {
    if (sessionStartedAt) {
      saveSession('Sesi fokus disimpan (keluar manual).');
    }

    setRunning(false);
    clearInterval(intervalRef.current);
    document.exitFullscreen?.();

    setFocusMode(false);
    setSecondsLeft(duration * 60);
    setSessionStartedAt(null);
    setNote('');
  };

  return (
    <div className="page focus-page">
      <h2>Focus Mode</h2>
      <p className="page-sub">Mode fokus fullscreen dengan timer & halaman belajar.</p>

      <div className="card focus-card-main">

        {/* LINK BELAJAR */}
        <div style={{ marginBottom: 10, textAlign: 'left' }}>
          <label style={{ fontSize: '0.84rem' }}>
            Link belajar:
            <input
              type="text"
              placeholder="https://contoh.com/artikel"
              value={studyUrl}
              onChange={e => setStudyUrl(e.target.value)}
              style={{
                width: '100%',
                marginTop: 4,
                padding: '6px 8px',
                borderRadius: 8,
                border: '1px solid #cbd2d9',
              }}
            />
          </label>
        </div>

        {/* TIMER BESAR */}
        <div className="hourglass">⏳</div>
        <div className="focus-time-big">{formatTime(secondsLeft)}</div>

        {/* DURASI */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ marginRight: 8 }}>Durasi sesi</span>
          <select
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            disabled={running}
          >
            {DURATIONS.map(d => (
              <option key={d} value={d}>{d} menit</option>
            ))}
          </select>
        </div>

        {/* TOMBOL */}
        <div className="focus-buttons-row">
          <button
            className="btn-primary"
            onClick={handleStart}
            disabled={running}
          >
            Mulai
          </button>

          <button
            className="btn-secondary"
            onClick={handleExitFocusAndReset}
          >
            Reset
          </button>
        </div>

        {/* CATATAN */}
        <div style={{ marginTop: 8, textAlign: 'left' }}>
          <label style={{ fontSize: '0.84rem' }}>
            Catatan (opsional)
            <textarea
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{
                width: '100%',
                marginTop: 4,
                borderRadius: 10,
                padding: '6px 8px',
                border: '1px solid #cbd2d9',
              }}
            />
          </label>
        </div>

        {info && <p style={{ color: '#216e2a' }}>{info}</p>}
        {error && <p style={{ color: '#b23a48' }}>{error}</p>}
      </div>

      {/* ===== FULLSCREEN FOCUS MODE ===== */}
      {focusMode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* TIMER BAR ATAS */}
          <div
            style={{
              width: '100%',
              padding: '10px 20px',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              fontSize: '1.4rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span>{formatTime(secondsLeft)}</span>

            <button
              className="btn-secondary"
              onClick={handleExitFocusAndReset}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                fontSize: '1rem',
              }}
            >
              Keluar Fokus
            </button>
          </div>

          {/* HALAMAN BELAJAR (IFRAME) */}
          <iframe
            src={studyUrl}
            title="study-page"
            style={{
              flexGrow: 1,
              width: '100%',
              border: 'none',
              background: '#fff',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default FocusModePage;
