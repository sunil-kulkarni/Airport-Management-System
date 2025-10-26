import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import AirportAdministration from './buttons/airport_administration';
import CrewInfo from './buttons/crew_info';
import EmergencyGround from './buttons/emergency_ground';
import FlightSchedule from './buttons/flight_schedule';
import Reports from './buttons/reports';
import PassengerInfo from './buttons/passenger_info';
import kialLogo from './images/kial.png';

// SignIn component with lighter gradient and emoji icons
function SignIn({ onLogin }) {
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, password })
      });
      if (!response.ok) throw new Error('Invalid credentials');
      const data = await response.json();
      onLogin(data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ef 0%, #b6e3fa 60%, #fbc2eb 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter',sans-serif",
      flexDirection: 'column',
    }}>
      <SignInHeader />
      <form onSubmit={handleSubmit}
        style={{
          background: 'rgba(255,255,255,0.70)',
          boxShadow: '0 8px 40px 0 rgba(59,130,246,0.12), 0 4px 32px #fbc2eb70',
          borderRadius: 28,
          padding: '40px 34px 36px 34px',
          minWidth: 330,
          width: '100%',
          maxWidth: 395,
          margin: 'auto',
          backdropFilter: 'blur(13px)'
        }}
      >
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg,#29b6f6 0%,#a7bfe8 100%)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 16px auto', boxShadow: '0 2px 9px #b6e3fa66'
        }}>
          👤
        </div>
        <div style={{
          background: 'linear-gradient(90deg,#b6e3fa66 0%,#fbc2eb44 100%)',
          height: '5px', width: '100%', borderRadius: 3, marginBottom: 36
        }}/>
        <h2 style={{
          textAlign: 'center', marginBottom: 17, color: '#184463', fontWeight: 800, fontSize: 26,
          letterSpacing: '-0.02em'
        }}>
          Sign-in
        </h2>
        <div style={{ marginBottom: 24, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: '#29b6f6', fontSize: 19, pointerEvents: 'none'
          }}>👤</span>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            style={{
              width: '100%', padding: '15px 12px 15px 44px', fontSize: 16,
              borderRadius: 16, border: '1.5px solid #aedff7',
              outline: 'none', background: 'rgba(255,255,255,0.5)', color: '#184463',
              transition: 'border 0.2s', fontWeight: 500
            }}
          />
        </div>
        <div style={{ marginBottom: 18, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: '#f172b6', fontSize: 19, pointerEvents: 'none'
          }}>🔒</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%', padding: '15px 12px 15px 44px', fontSize: 16,
              borderRadius: 16, border: '1.5px solid #aedff7',
              outline: 'none', background: 'rgba(255,255,255,0.5)', color: '#184463',
              fontWeight: 500
            }}
          />
        </div>
        {error && <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: 18, fontWeight: 600 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '13px 0', border: 'none',
            borderRadius: 13, background: 'linear-gradient(90deg,#29b6f6,#fbc2eb)',
            color: '#1e293b', fontWeight: 700, fontSize: 17, marginTop: 8, letterSpacing: '0.01em',
            transition: 'background 0.2s', boxShadow: '0 2px 10px #b6e3fa80',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      {/* Footer for sign-in page */}
      <footer style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: '#183153d6',
        color: '#ffffffb0',
        padding: '16px 0',
        fontSize: 14,
        textAlign: 'center',
        borderTop: '1px solid #b6e3fa',
        letterSpacing: '0.01em',
        fontFamily: "'Inter', sans-serif"
      }}>
        &copy; Kempegowda International Airport
      </footer>
    </div>
  );
}
function SignInHeader() {
  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, height: 70,
      background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)',
      display: 'flex', alignItems: 'center',
      color: 'white', fontSize: 22, fontWeight: '700', zIndex: 1000, letterSpacing: '0.01em',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <img
        src={kialLogo}
        alt="KIAL Logo"
        style={{
          marginLeft: 28, height: 46, width: 'auto', borderRadius: 10, background: '#fff',
          padding: '5px 8px', objectFit: 'contain', boxShadow: '0 2px 10px #192a5614'
        }}
      />
      <div style={{
        flex: 1,
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: '0.01em',
        marginLeft: '-46px'
      }}>
        Airport Management System
      </div>
    </header>
  );
}


function Header({ user, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    setShowProfile(false);
    onLogout();
    navigate("/");
  };
  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, height: 70,
      background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)',
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      fontSize: 22,
      fontWeight: '700',
      zIndex: 1000,
      letterSpacing: '0.01em',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <img
        src={kialLogo}
        alt="KIAL Logo"
        style={{
          marginLeft: 28,
          height: 46,
          width: 'auto',
          borderRadius: 10,
          boxShadow: '0 2px 10px #192a5614',
          background: '#fff',
          padding: '5px 8px',
          objectFit: 'contain'
        }}
      />
      <div style={{
        flex: 1,
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: '0.01em',
        marginLeft: '-46px' // negative margin to roughly center title with logo present
      }}>
        Airport Management System
      </div>
      {user && (
        <div style={{ position: 'absolute', right: 30, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            onClick={() => setShowProfile(!showProfile)}
            style={{
              width: 48, height: 48, borderRadius: '50%', background: '#e0e7ef',
              border: '3px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#2563eb', fontWeight: 700, fontSize: 26, cursor: 'pointer', boxShadow: '0 2px 8px #2563eb30'
            }}
            title="Profile"
          >
            <span role="img" aria-label="profile">👤</span>
          </div>
          {showProfile && (
            <div style={{
              position: 'absolute', right: 0, top: 58, background: '#fff', color: '#101828',
              padding: 24, borderRadius: 16, minWidth: 270, minHeight: 200,
              boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.25)', fontFamily: "'Inter',sans-serif",
              zIndex: 1100
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 54, height: 54, borderRadius: '50%', background: '#2563eb',
                  marginRight: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 30, fontWeight: 800
                }}>
                  <span role="img" aria-label="profile">👤</span>
                </div>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 19 }}>{user.Employee_name}</span>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{user.Job_title}</div>
                </div>
              </div>
              <div style={{ fontSize: 15, marginBottom: 10 }}><b>Employee ID:</b> {user.Employee_ID}</div>
              <div style={{ fontSize: 15, marginBottom: 10 }}><b>Airport ID:</b> {user.Airport_ID}</div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '13px 0', border: 'none',
                  borderRadius: 10, background: 'linear-gradient(90deg,#ef4444,#ef883d)',
                  color: '#fff', fontWeight: 700, fontSize: 16, marginTop: 16, letterSpacing: '0.01em',
                  transition: 'background 0.2s', cursor: 'pointer', boxShadow: '0 2px 8px #ef444460'
                }}
              >
                <span role="img" aria-label="logout" style={{ marginRight: 8 }}>🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}


function Navigation() {
  return (
    <div className="container">
      <Link to="/airport_administration"><button>Airport Administration</button></Link>
      <Link to="/crew-info"><button>Crew Info</button></Link>
      <Link to="/emergency-ground"><button>Emergency Ground</button></Link>
      <Link to="/flight-schedule"><button>Flight Schedule</button></Link>
      <Link to="/reports"><button>Reports</button></Link>
      <Link to="/passenger-info"><button>Passenger Info</button></Link>
    </div>
  );
}

function Home() {
  return (
    <div className="background-root">
    <div className="dashboard-wrapper">
      {/* Left: Button grid */}
      <div className="dashboard-buttons">
        <Link to="/crew-info"><button className="dashboard-btn">Crew Info</button></Link>
        <Link to="/passenger-info"><button className="dashboard-btn">Passenger Info</button></Link>
        <Link to="/reports"><button className="dashboard-btn">Reports</button></Link>
        <Link to="/emergency-ground"><button className="dashboard-btn">Emergency Ground</button></Link>
        <Link to="/airport_administration"><button className="dashboard-btn">Airport Admin</button></Link>
        <Link to="/flight-schedule"><button className="dashboard-btn">Flight Schedule</button></Link>
      </div>
      {/* Right: Map Box */}
      <div className="dashboard-map">
        <iframe
  title="Kempegowda International Airport"
  width="440"
  height="350"
  style={{ border: 0, borderRadius: 12 }}
  src="https://www.google.com/maps?q=Kempegowda+International+Airport&output=embed"
  allowFullScreen=""
  loading="lazy"
/>

      </div>
    </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <Router>
      {user && <Header user={user} onLogout={handleLogout} />}
      <main style={{ paddingTop: user ? 80 : 0, minHeight: '80vh' }}>
        <Routes>
          {!user ? (
            <Route path="*" element={<SignIn onLogin={handleLogin} />} />
          ) : (
            <>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/airport_administration" element={<AirportAdministration />} />
              <Route path="/crew-info" element={<CrewInfo />} />
              <Route path="/emergency-ground" element={<EmergencyGround />} />
              <Route path="/flight-schedule" element={<FlightSchedule />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/passenger-info" element={<PassengerInfo />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          )}
        </Routes>
      </main>
      {/* Footer for all pages except the sign-in page */}
      <footer>
        &copy; Kempegowda International Airport
      </footer>
    </Router>
    
  );
}

export default App;
