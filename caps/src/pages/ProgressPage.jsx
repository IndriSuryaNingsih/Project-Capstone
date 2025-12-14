import { useEffect, useState } from 'react'

function ProgressPage() {
  const [monthlyProgress, setMonthlyProgress] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulasi fetch histori (nanti bisa ganti ke API backend)
    async function fetchProgress() {
      setLoading(true)

      // simulasi data histori
      const data = [
        { month: "Januari", value: 80 },
        { month: "Februari", value: 55 },
        { month: "Maret", value: 30 },
        { month: "April", value: 70 }
      ]

      setMonthlyProgress(data)
      setLastUpdate(new Date())
      setLoading(false)
    }

    fetchProgress()
  }, [])

  const formatDate = (date) => {
    if (!date) return ''
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="page">
      <h2>Progress</h2>
      <p className="page-sub">Lihat progress setiap bulanmu</p>

      <div className="card">

        {/* Header progress */}
        <div className="progress-header">
          <div className="progress-title-big">Your Progress</div>
          <div className="progress-update">
            {loading
              ? 'Loading...'
              : `Last update: ${formatDate(lastUpdate)}`}
          </div>
        </div>

        <div className="progress-divider"></div>

        {/* List progress bulanan */}
        <div className="progress-month-list">
          {monthlyProgress.map((item, idx) => (
            <div key={item.month} className="progress-month-block">
              <div className="progress-month-label">{item.month}</div>

              {/* Bar hijau */}
              <div className="bar-track">
                <div
                  className="bar-fill green"
                  style={{ width: `${item.value}%` }}
                />
              </div>

              {idx < monthlyProgress.length - 1 && (
                <div className="month-divider"></div>
              )}
            </div>
          ))}

          {!loading && monthlyProgress.length === 0 && (
            <div className="empty-state">
              Belum ada progress yang tercatat.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProgressPage
