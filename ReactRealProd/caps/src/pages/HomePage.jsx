import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";

const defaultHistory = [];

// Nama bulan & hari
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function formatKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildCalendar(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const firstDay = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const prevMonthDays = new Date(year, monthIndex, 0).getDate();

  const cells = [];
  for (let i = 0; i < 42; i++) {
    let day, monthOffset;

    if (i < firstDay) {
      day = prevMonthDays - (firstDay - 1 - i);
      monthOffset = -1;
    } else if (i >= firstDay + daysInMonth) {
      day = i - (firstDay + daysInMonth) + 1;
      monthOffset = 1;
    } else {
      day = i - firstDay + 1;
      monthOffset = 0;
    }

    const date = new Date(year, monthIndex + monthOffset, day);
    cells.push({
      key: formatKey(date),
      day: date.getDate(),
      inCurrentMonth: monthOffset === 0,
    });
  }
  return cells;
}

function HomePage({ user }) {
  const [history, setHistory] = useState(defaultHistory);
  const [search, setSearch] = useState("");

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate] = useState(today);

  const [taskDate, setTaskDate] = useState("");
  const [taskName, setTaskName] = useState("");

  // ====== LOAD DARI BACKEND + LOCAL STORAGE ======
  useEffect(() => {
    const loadFocusHistory = async () => {
      try {
        // Ambil data fokus dari backend
        const data = await apiFetch("/focus");

        const focusItems = data.map((item) => {
          const dateObj = item.finishedAt
            ? new Date(item.finishedAt)
            : new Date(item.createdAt);

          const formattedDate = dateObj.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          const formattedTime = dateObj.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return {
            id: item._id, // dari database
            label: `Fokus ${item.durationMinutes} menit${
              item.note ? " – " + item.note : ""
            }`,
            time: formattedTime,
            date: formattedDate,
          };
        });

        // Ambil history manual (tugas) dari localStorage
        const stored = window.localStorage.getItem("asah_history");
        let localHistory = [];
        if (stored) {
          try {
            localHistory = JSON.parse(stored);
          } catch {
            localHistory = [];
          }
        }

        // Gabungkan: history dari backend + history manual
        setHistory([...focusItems, ...localHistory]);
      } catch (err) {
        console.error("Gagal load riwayat fokus:", err);

        // Kalau backend error, minimal tetap load dari localStorage
        const stored = window.localStorage.getItem("asah_history");
        if (stored) {
          try {
            setHistory(JSON.parse(stored));
          } catch {
            setHistory(defaultHistory);
          }
        }
      }
    };

    loadFocusHistory();
  }, []);

  // Simpan ulang ke localStorage HANYA untuk history manual (id number)
  useEffect(() => {
    const manualOnly = history.filter((h) => typeof h.id === "number");
    window.localStorage.setItem("asah_history", JSON.stringify(manualOnly));
  }, [history]);

  // ====== FILTER SEARCH ======
  const filteredHistory = useMemo(() => {
    if (!search.trim()) return history;
    return history.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [history, search]);

  // ====== KALENDAR ======
  const calendarCells = useMemo(
    () => buildCalendar(year, month),
    [year, month]
  );

  const handleChangeMonth = (direction) => {
    setMonth((prev) => {
      let nextMonth = prev + direction;
      let nextYear = year;

      if (nextMonth < 0) {
        nextMonth = 11;
        nextYear = year - 1;
      } else if (nextMonth > 11) {
        nextMonth = 0;
        nextYear = year + 1;
      }

      setYear(nextYear);
      return nextMonth;
    });
  };

  // ====== TAMBAH TUGAS MANUAL ======
  const handleAddTask = () => {
    if (!taskDate || !taskName.trim()) return;

    const dateObj = new Date(taskDate);
    const formattedDate = dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newTask = {
      id: Date.now(), // number -> manual
      label: taskName,
      time: "-",
      date: formattedDate,
    };

    setHistory((prev) => [newTask, ...prev]);
    setTaskDate("");
    setTaskName("");
  };

  return (
    <div className="page">
      <div className="page-grid">
        {/* KIRI: Dashboard + History aktivitas (kalender) ditumpuk */}
        <div className="dashboard-left">
          {/* DASHBOARD */}
          <section className="card main-card">
            <h2>Dashboard</h2>

            <div
              style={{
                background: "var(--bg-card)",
                padding: "14px 18px",
                borderRadius: "var(--radius-lg)",
                marginBottom: "16px",
                boxShadow: "var(--shadow-card)",
                fontSize: "0.92rem",
                lineHeight: "1.45",
              }}
            >
              <strong>Halo {user?.name || "Student"}!</strong>
              <br />
              Semangat terus ya! Hari ini kamu masih punya kesempatan buat
              maju 1 langkah lagi ke capstone selesai. Kamu pasti bisa!
            </div>
          </section>

          {/* HISTORY AKTIVITAS (KALENDER) */}
          <section className="card history-card">
            <h2>History aktivitas</h2>

            <div className="calendar-header" style={{ marginBottom: "10px" }}>
              <button
                className="calendar-nav-btn"
                onClick={() => handleChangeMonth(-1)}
              >
                ‹
              </button>
              <strong style={{ margin: "0 8px" }}>
                {MONTH_NAMES[month]}, {year}
              </strong>
              <button
                className="calendar-nav-btn"
                onClick={() => handleChangeMonth(1)}
              >
                ›
              </button>
            </div>

            <div className="calendar-grid-header">
              {DAY_LABELS.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarCells.map((cell) => (
                <button
                  key={cell.key}
                  className={[
                    "calendar-cell",
                    cell.inCurrentMonth ? "" : "muted",
                  ].join(" ")}
                >
                  {cell.day}
                </button>
              ))}
            </div>

            {/* ADD TUGAS */}
            <div
              style={{
                marginTop: "20px",
                background: "var(--bg-card)",
                padding: "18px",
                borderRadius: "14px",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>Tambah Tugas</h3>

              <label>Tanggal tugas</label>
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                style={{
                  width: "100%",
                  marginBottom: "12px",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />

              <label>Nama tugas</label>
              <input
                type="text"
                placeholder="Contoh: Revisi Bab 2"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                style={{
                  width: "100%",
                  marginBottom: "12px",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />

              <button className="btn-small" onClick={handleAddTask}>
                Tambah
              </button>
            </div>
          </section>
        </div>

        {/* KANAN: History list (search + list, tinggi fix & scroll) */}
        <section className="card history-panel">
          <input
            type="text"
            placeholder="Cari history aktivitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 15px",
              borderRadius: "12px",
              border: "1px solid #ccc",
              marginBottom: "8px",
            }}
          />

          <ul className="history-list-right">
            {filteredHistory.map((item) => (
              <li
                key={item.id}
                className="history-item"
                style={{
                  background: "var(--bg-card)",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  marginBottom: "12px",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <strong>{item.label}</strong>
                <div style={{ fontSize: "0.85rem" }}>
                  {item.time} • {item.date}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
