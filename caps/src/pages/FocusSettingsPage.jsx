import { useEffect, useState } from 'react'

const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 10,
  enableLongBreak: false,
}

function FocusSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  // LOAD SETTINGS
  useEffect(() => {
    const saved = localStorage.getItem('focus_settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  // SAVE SETTINGS
  const handleSave = () => {
    localStorage.setItem('focus_settings', JSON.stringify(settings))
    alert('Pengaturan fokus & istirahat berhasil disimpan ✅')
  }

  return (
    <div className="page">
      <h2>Pengaturan waktu fokus</h2>
      <p className="page-sub">
        Atur durasi fokus dan waktu istirahat (break).
      </p>

      <div
        style={{
          background: '#f8f5f0',
          padding: 24,
          borderRadius: 20,
          maxWidth: 420,
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        }}
      >
        {/* FOCUS */}
        <label>
          Durasi fokus (menit)
          <input
            type="number"
            value={settings.focusDuration}
            onChange={e =>
              setSettings({ ...settings, focusDuration: +e.target.value })
            }
            style={inputStyle}
          />
        </label>

        {/* SHORT BREAK */}
        <label>
          Short break (menit)
          <input
            type="number"
            value={settings.shortBreak}
            onChange={e =>
              setSettings({ ...settings, shortBreak: +e.target.value })
            }
            style={inputStyle}
          />
        </label>

        {/* LONG BREAK */}
        <label>
          Long break (menit)
          <input
            type="number"
            value={settings.longBreak}
            disabled={!settings.enableLongBreak}
            onChange={e =>
              setSettings({ ...settings, longBreak: +e.target.value })
            }
            style={{
              ...inputStyle,
              opacity: settings.enableLongBreak ? 1 : 0.5,
            }}
          />
        </label>

        {/* ENABLE LONG BREAK */}
        <label style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            type="checkbox"
            checked={settings.enableLongBreak}
            onChange={e =>
              setSettings({
                ...settings,
                enableLongBreak: e.target.checked,
              })
            }
          />
          Aktifkan long break
        </label>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button onClick={handleSave} style={saveBtn}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  marginTop: 4,
  marginBottom: 12,
}

const saveBtn = {
  padding: '8px 20px',
  borderRadius: 999,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
}

export default FocusSettingsPage
