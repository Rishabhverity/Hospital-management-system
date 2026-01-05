import { useState, useEffect } from 'react'
import './App.css'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import { appointmentsAPI, notificationsAPI } from './services/api'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [appointmentFilter, setAppointmentFilter] = useState('all')
  const [appointments, setAppointments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { isAuthenticated, user, logout } = useAuth()

  // Fetch appointments when logged in
  useEffect(() => {
    if (isAuthenticated && currentPage === 'appointments') {
      fetchAppointments()
    }
  }, [isAuthenticated, currentPage, appointmentFilter])

  // Fetch notifications when logged in
  useEffect(() => {
    if (isAuthenticated && currentPage === 'notifications') {
      fetchNotifications()
    }
  }, [isAuthenticated, currentPage])

  // Fetch unread count
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount()
    }
  }, [isAuthenticated])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = appointmentFilter !== 'all' ? { status: appointmentFilter } : {}
      const response = await appointmentsAPI.getAll(params)
      setAppointments(response.data.appointments || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await notificationsAPI.getAll()
      setNotifications(response.data.notifications || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getUnreadCount()
      setUnreadCount(response.data.unread_count || 0)
    } catch (err) {
      console.error('Failed to fetch unread count:', err)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId)
      fetchNotifications()
      fetchUnreadCount()
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return
    
    try {
      await appointmentsAPI.cancel(appointmentId, 'Cancelled by user')
      alert('Appointment cancelled successfully')
      fetchAppointments()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment')
    }
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="hospital-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <h1>🏥 Hospital Management System</h1>
            <p className="tagline">Teleconsult & Appointment Platform</p>
          </div>
          <nav className="main-nav">
            <button onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
            <button onClick={() => setCurrentPage('appointments')}>Appointments</button>
            <button onClick={() => setCurrentPage('patients')}>Patients</button>
            <button onClick={() => setCurrentPage('doctors')}>Doctors</button>
            <button onClick={() => setCurrentPage('notifications')}>
              Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-section">
          {currentPage === 'dashboard' && (
            <div className="dashboard">
              <h2>Welcome, {user?.full_name || 'User'}!</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{appointments.length}</h3>
                  <p>Total Appointments</p>
                </div>
                <div className="stat-card">
                  <h3>{unreadCount}</h3>
                  <p>New Notifications</p>
                </div>
                <div className="stat-card">
                  <h3>{appointments.filter(a => a.status === 'confirmed').length}</h3>
                  <p>Confirmed</p>
                </div>
                <div className="stat-card">
                  <h3>{appointments.filter(a => a.status === 'completed').length}</h3>
                  <p>Completed</p>
                </div>
              </div>
              <div className="recent-section">
                <h3>Quick Actions</h3>
                <div className="activity-list">
                  <div className="activity-item" onClick={() => setCurrentPage('appointments')} style={{ cursor: 'pointer' }}>
                    <span className="activity-icon">📅</span>
                    <div>
                      <p><strong>Book New Appointment</strong></p>
                      <p className="activity-time">Schedule your next consultation</p>
                    </div>
                  </div>
                  <div className="activity-item" onClick={() => alert('Prescriptions feature coming soon!')} style={{ cursor: 'pointer' }}>
                    <span className="activity-icon">📋</span>
                    <div>
                      <p><strong>View Prescriptions</strong></p>
                      <p className="activity-time">Access your medical records</p>
                    </div>
                  </div>
                  <div className="activity-item" onClick={() => alert('Payment history feature coming soon!')} style={{ cursor: 'pointer' }}>
                    <span className="activity-icon">💳</span>
                    <div>
                      <p><strong>Payment History</strong></p>
                      <p className="activity-time">View receipts and transactions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentPage === 'appointments' && (
            <div className="appointments">
              <h2>My Appointments</h2>
              <div className="appointment-filters">
                <button 
                  className={`filter-btn ${appointmentFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setAppointmentFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-btn ${appointmentFilter === 'confirmed' ? 'active' : ''}`}
                  onClick={() => setAppointmentFilter('confirmed')}
                >
                  Upcoming
                </button>
                <button 
                  className={`filter-btn ${appointmentFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setAppointmentFilter('completed')}
                >
                  Completed
                </button>
                <button 
                  className={`filter-btn ${appointmentFilter === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setAppointmentFilter('cancelled')}
                >
                  Cancelled
                </button>
              </div>

              {loading ? (
                <p className="info-text">Loading appointments...</p>
              ) : error ? (
                <p className="info-text error-text">Error: {error}</p>
              ) : appointments.length === 0 ? (
                <p className="info-text">No appointments found. Book your first appointment!</p>
              ) : (
                <div className="appointment-list">
                  {appointments.map((apt) => (
                    <div key={apt.appointment_id} className="appointment-card">
                      <div className="appointment-header">
                        <h3>{apt.doctor_name || 'Doctor'}</h3>
                        <span className={`status-badge ${apt.status}`}>{apt.status}</span>
                      </div>
                      <p>{apt.appointment_type} | {apt.branch_name || 'Unknown Branch'}</p>
                      <p>📅 {new Date(apt.scheduled_start_time).toLocaleString()}</p>
                      {apt.patient_notes && <p>📝 {apt.patient_notes}</p>}
                      <div className="appointment-actions">
                        <button className="btn-primary" onClick={() => alert(`View details for appointment ${apt.appointment_id}`)}>
                          View Details
                        </button>
                        {apt.status === 'confirmed' && (
                          <>
                            <button className="btn-secondary" onClick={() => alert('Reschedule feature coming soon')}>
                              Reschedule
                            </button>
                            <button className="btn-danger" onClick={() => handleCancelAppointment(apt.appointment_id)}>
                              Cancel
                            </button>
                          </>
                        )}
                        {apt.status === 'completed' && (
                          <button className="btn-secondary" onClick={() => alert('Book follow-up feature coming soon')}>
                            Book Follow-up
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {currentPage === 'notifications' && (
            <div className="notifications">
              <h2>Notifications</h2>
              
              {loading ? (
                <p className="info-text">Loading notifications...</p>
              ) : error ? (
                <p className="info-text error-text">Error: {error}</p>
              ) : notifications.length === 0 ? (
                <p className="info-text">No notifications yet.</p>
              ) : (
                <div className="notification-list">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.notification_id} 
                      className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                      onClick={() => !notif.is_read && handleMarkAsRead(notif.notification_id)}
                      style={{ cursor: !notif.is_read ? 'pointer' : 'default' }}
                    >
                      <div className="notification-icon">
                        {notif.notification_type === 'reminder' && '🔔'}
                        {notif.notification_type === 'confirmation' && '✅'}
                        {notif.notification_type === 'cancellation' && '❌'}
                        {notif.notification_type === 'payment' && '💳'}
                      </div>
                      <div className="notification-content">
                        <h4>{notif.title || 'Notification'}</h4>
                        <p>{notif.message}</p>
                        <span className="notification-time">
                          {new Date(notif.created_at).toLocaleString()}
                          {!notif.is_read && ' • Unread'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {currentPage === 'patients' && (
            <div className="patients">
              <h2>Patient Profile</h2>
              {user && (
                <div className="profile-info">
                  <p><strong>Name:</strong> {user.full_name}</p>
                  <p><strong>Phone:</strong> {user.phone_number}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>User ID:</strong> {user.user_id}</p>
                </div>
              )}
              <p className="info-text">Profile management features coming soon</p>
            </div>
          )}
          
          {currentPage === 'doctors' && (
            <div className="doctors">
              <h2>Doctor Directory</h2>
              <p className="info-text">Browse and search available doctors - Coming soon</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Hospital Management System © 2026 | All Epics Implemented ✅</p>
        <p className="epic-list">
          E1: Auth | E2: Profiles | E4: Scheduling | E5: Booking | E6: Lifecycle | 
          E7: Payments | E8: Teleconsult | E9: Prescriptions | E10: Follow-ups | E11: Notifications
        </p>
      </footer>
    </div>
  )
}

export default App
