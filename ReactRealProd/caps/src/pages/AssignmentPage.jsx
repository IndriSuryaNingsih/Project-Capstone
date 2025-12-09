import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

const STATUS_OPTIONS = ['Selesai', 'Belum selesai', 'Proses'];

function formatDateForDisplay(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function AssignmentPage() {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [status, setStatus] = useState('Belum selesai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // LOAD dari backend
  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch('/assignments');
        setAssignments(data || []);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat assignment, tampilkan kosong dulu.');
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !due) return;
    setError('');

    try {
      const body = {
        title: title.trim(),
        dueDate: due,      // sesuaikan dengan backend: due / dueDate
        status,
      };
      const newAssignment = await apiFetch('/assignments', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      setAssignments((prev) => [...prev, newAssignment]);
      setTitle('');
      setDue('');
      setStatus('Belum selesai');
    } catch (err) {
      console.error(err);
      setError('Gagal menambah assignment');
    }
  };

  const handleChangeStatus = async (id, nextStatus) => {
    setError('');
    try {
      const updated = await apiFetch(`/assignments/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });

      setAssignments((prev) =>
        prev.map((a) => (a._id === id || a.id === id ? updated : a))
      );
    } catch (err) {
      console.error(err);
      setError('Gagal mengubah status');
    }
  };

  const getId = (a) => a._id || a.id;

  return (
    <div className="page">
      <h2>Assignment</h2>
      <p className="page-sub">
        Tugas-tugas utama kamu. Di sini kamu bisa menambah assignment baru dan
        mengganti status menjadi <em>Selesai</em>, <em>Belum selesai</em>, atau <em>Proses</em>.
      </p>

      <div className="card">
        <form className="assignment-form" onSubmit={handleAdd}>
          <div className="assignment-form-main">
            <input
              type="text"
              placeholder="Judul assignment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-small">
            Tambah assignment
          </button>
        </form>

        {error && (
          <p style={{ color: '#b23a48', fontSize: '0.8rem', marginBottom: 8 }}>
            {error}
          </p>
        )}

        {loading ? (
          <p>Memuat assignment...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tugas</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => {
                const id = getId(a);
                return (
                  <tr key={id}>
                    <td>{a.title}</td>
                    <td>{formatDateForDisplay(a.dueDate || a.due)}</td>
                    <td>
                      <select
                        value={a.status}
                        onChange={(e) => handleChangeStatus(id, e.target.value)}
                        className="status-select"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}

              {assignments.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '12px 0' }}>
                    Belum ada assignment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AssignmentPage;
