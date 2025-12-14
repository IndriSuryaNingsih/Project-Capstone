import { useState } from 'react';
import { apiFetch } from '../api';

function FeedbackPage() {
  const [mood, setMood] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!mood) {
      setErrorMsg('Pilih dulu emoji yang menggambarkan mood kamu 😊');
      return;
    }
    if (!text.trim()) {
      setErrorMsg('Tulis sedikit pengalamanmu sebelum mengirim.');
      return;
    }

    try {
      setLoading(true);

      // Kirim ke backend: POST /api/feedback
      await apiFetch('/feedback', {
        method: 'POST',
        body: JSON.stringify({
          mood,          // "bad" | "okay" | "good"
          message: text, // sesuaikan dengan field di backend (message/notes/text)
        }),
      });

      setSuccessMsg('Terima kasih, feedback kamu sudah tersimpan 😊');
      setMood(null);
      setText('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal mengirim feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Feedback</h2>
      <p className="page-sub">
        Bagaimana pengalamanmu menggunakan mode fokus hari ini?
      </p>

      <div className="card feedback-card">
        <form onSubmit={handleSubmit}>
          <div className="feedback-mood-row">
            <button
              type="button"
              className={mood === 'bad' ? 'mood-btn active' : 'mood-btn'}
              onClick={() => setMood('bad')}
            >
              😞
            </button>
            <button
              type="button"
              className={mood === 'okay' ? 'mood-btn active' : 'mood-btn'}
              onClick={() => setMood('okay')}
            >
              😐
            </button>
            <button
              type="button"
              className={mood === 'good' ? 'mood-btn active' : 'mood-btn'}
              onClick={() => setMood('good')}
            >
              😊
            </button>
          </div>

          <label className="feedback-label">
            Ceritakan secara singkat pengalamanmu:
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Contoh: fokus 25 menit terasa cukup, tapi saya ingin notifikasi saat timer selesai."
            />
          </label>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim feedback'}
          </button>

          {successMsg && (
            <p
              style={{
                marginTop: 8,
                fontSize: '0.8rem',
                color: '#216e2a',
              }}
            >
              {successMsg}
            </p>
          )}

          {errorMsg && (
            <p
              style={{
                marginTop: 8,
                fontSize: '0.8rem',
                color: '#b23a48',
              }}
            >
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default FeedbackPage;
