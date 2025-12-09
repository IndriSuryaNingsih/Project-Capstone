import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from "react";

function DashboardLayout({ user, onLogout }) {
  const navigate = useNavigate();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="shell">
      
      {/* SIDEBAR */}
<aside className="sidebar">

  {/* HEADER */}
  <div className="sidebar-header">
    <div className="logo-badge">Z</div>
    <div>
      <div className="logo-title">ZenFocus</div>
      <div className="logo-sub">Capstone 2025</div>
    </div>
  </div>

  {/* MENU UTAMA */}
  <nav className="sidebar-nav">
    <NavLink to="home" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Dashboard</NavLink>
    <NavLink to="progress" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Progress</NavLink>
    <NavLink to="assignments" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Assignment</NavLink>
    <NavLink to="focus" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Focus Mode</NavLink>
    <NavLink to="focus-settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Focus Settings</NavLink>
  </nav>

</aside>

      
      {/* CONTENT */}
      <main className="content">

        <header className="topbar">
          <div>
            <div className="topbar-title">Welcome back, {user?.name || 'Student'} 👋</div>
            <div className="topbar-sub">Kelola capstone dan fokus belajar dari satu tempat.</div>
          </div>

          {/* DROPDOWN USER */}
          <div 
            className="topbar-user" 
            ref={menuRef}
            onClick={() => setOpenProfileMenu(prev => !prev)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <div className="avatar-circle">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>

            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>

            {openProfileMenu && (
              <div className="profile-menu">
                <button onClick={() => navigate('/app/account')}>Account</button>
                <button onClick={() => navigate('/app/display')}>Display</button>
                <button onClick={onLogout}>Log out</button>
              </div>
            )}
          </div>
        </header>

        <div className="content-inner">
          <Outlet />
        </div>

        
        
      </main>
    </div>
  )
}

export default DashboardLayout
