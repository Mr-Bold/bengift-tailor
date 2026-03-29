import './SkeletonLoader.css'

function SkeletonLoader({ type = 'default' }) {
  if (type === 'dashboard') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-header">
          <div className="skeleton-title"></div>
          <div className="skeleton-subtitle"></div>
        </div>
        <div className="skeleton-stats">
          <div className="skeleton-stat-card"></div>
          <div className="skeleton-stat-card"></div>
          <div className="skeleton-stat-card"></div>
        </div>
        <div className="skeleton-table">
          <div className="skeleton-table-header"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
        </div>
      </div>
    )
  }

  if (type === 'form') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-header">
          <div className="skeleton-title"></div>
        </div>
        <div className="skeleton-form">
          <div className="skeleton-form-row">
            <div className="skeleton-input"></div>
            <div className="skeleton-input"></div>
          </div>
          <div className="skeleton-form-row">
            <div className="skeleton-input"></div>
            <div className="skeleton-input"></div>
          </div>
          <div className="skeleton-table">
            <div className="skeleton-table-header"></div>
            <div className="skeleton-table-row"></div>
            <div className="skeleton-table-row"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-header">
          <div className="skeleton-title"></div>
        </div>
        <div className="skeleton-filters">
          <div className="skeleton-filter"></div>
          <div className="skeleton-filter"></div>
          <div className="skeleton-filter"></div>
        </div>
        <div className="skeleton-table">
          <div className="skeleton-table-header"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
          <div className="skeleton-table-row"></div>
        </div>
      </div>
    )
  }

  // Default skeleton
  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-block"></div>
        <div className="skeleton-block"></div>
        <div className="skeleton-block"></div>
      </div>
    </div>
  )
}

export default SkeletonLoader
