import { useState } from 'react'
import './Sidebar.css'
import logo from '../assets/logo.png'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'newjob', label: 'New Job Card', icon: '➕' },
  { id: 'jobs', label: 'JOB Register', icon: '📋' },
  { id: 'reports', label: 'Reports', icon: '📈' },
  { id: 'masters', label: 'Masters', icon: '⚙️' },
  { id: 'shopinfo', label: 'Shop Info', icon: '🏪' },
  { id: 'settings', label: 'Settings', icon: '🔧' },
]

function Sidebar({ currentPage, setCurrentPage, shopInfo }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleMenuClick = (pageId) => {
    setCurrentPage(pageId)
    setIsOpen(false) // Close menu on mobile after selection
  }

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button 
        className="hamburger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
      </button>

      {/* Overlay - Only visible on mobile when menu is open */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logo} alt="BenGift Clothing Logo" className="logo-image" />
          </div>
          <p className="sidebar-slogan">Inspiring Confidence</p>
          <div className="sidebar-company">BenGift Clothing</div>
          <div className="sidebar-date">
            Current Date: <span>{currentDate}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="help-line">
            <div className="help-title">HELP LINE</div>
            <div className="help-phone">{shopInfo.phone || '+233209609002'}</div>
          </div>
          <div className="sidebar-brand">
            <div className="brand-logo">BG</div>
            <div className="brand-text">
              <div>BenGift Clothing</div>
              <div className="brand-tagline">Quality Tailoring Solutions</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
