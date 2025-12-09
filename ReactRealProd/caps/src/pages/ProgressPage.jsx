function ProgressPage() {
  const monthlyProgress = [
    { month: "Januari", value: 80 },
    { month: "Februari", value: 55 },
    { month: "Maret", value: 30 },
    { month: "April", value: 70 }
  ];

  return (
    <div className="page">
      <h2>Progress</h2>
      <p className="page-sub">Lihat progress setiap bulanmu</p>

      <div className="card">

        {/* Header progress */}
        <div className="progress-header">
          <div className="progress-title-big">Your Progress</div>
          <div className="progress-update">Last update: 21 November 2025</div>
        </div>

        <div className="progress-divider"></div>

        {/* List progress bulanan */}
        <div className="progress-month-list">
          {monthlyProgress.map((item, idx) => (
            <div key={idx} className="progress-month-block">
              <div className="progress-month-label">{item.month}</div>

              {/* Bar hijau */}
              <div className="bar-track">
                <div
                  className="bar-fill green"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>

              {idx < monthlyProgress.length - 1 && (
                <div className="month-divider"></div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ProgressPage;
