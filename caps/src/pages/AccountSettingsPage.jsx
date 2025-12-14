function AccountSettingsPage({ user }) {
  return (
    <div className="page">
      <h2>Account</h2>
      <p className="page-sub">
        Informasi singkat tentang akun kamu. Layout dibuat mirip kartu About
        di desain Figma.
      </p>

      <div className="card">
        <div className="account-row">
          <span>Nama</span>
          <span>{user?.name}</span>
        </div>
        <div className="account-row">
          <span>Email</span>
          <span>{user?.email}</span>
        </div>
        <div className="account-row">
          <span>Role</span>
          <span>Student</span>
        </div>
        <div className="account-row">
          <span>Capstone</span>
          <span>Project Asah 2025</span>
        </div>
      </div>
    </div>
  )
}

export default AccountSettingsPage
