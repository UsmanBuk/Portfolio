import { NAV_ITEMS } from '../constants'

export default function Navbar({ activePage, onNavigate }) {
  return (
    <nav className="navbar" aria-label="Primary">
      <ul className="navbar-list">
        {NAV_ITEMS.map((item) => (
          <li className="navbar-item" key={item.id}>
            <button
              className={`navbar-link${activePage === item.id ? ' active' : ''}`}
              data-nav-link
              type="button"
              aria-current={activePage === item.id ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
