import React, { useState, useEffect } from 'react';
import "./buttons.css";


const CrewInfo = () => {
  const [crewMembers, setCrewMembers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCrewId, setDeleteCrewId] = useState('');


  const fetchCrewMembers = () => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:8000/api/crew').then(res => res.json()),
      fetch('http://localhost:8000/api/flights-list').then(res => res.json())
    ])
      .then(([crewData, flightsData]) => {
        setCrewMembers(crewData.crew || []);
        setFlights(flightsData.flights || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };


  useEffect(() => {
    fetchCrewMembers();
  }, []);


  // Filter crew based on search and flight
  const filteredCrew = crewMembers.filter(crew => {
    const matchesSearch =
      searchQuery === '' ||
      crew.Crew_ID.toString().includes(searchQuery) ||
      crew.Employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (crew.Flight_no ? crew.Flight_no.toLowerCase().includes(searchQuery.toLowerCase()) : false);


    const matchesFlight = selectedFlight === 'All' || crew.Flight_no === selectedFlight;


    return matchesSearch && matchesFlight;
  });


  // Helper function to check if flight number is unassigned
  const isFlightUnassigned = (flightNo) => {
    return flightNo === null || flightNo === undefined || flightNo === '' || flightNo === 'NULL';
  };


  const handleDeleteCrew = () => {
    if (!deleteCrewId) {
      alert('Please enter a crew ID');
      return;
    }


    fetch(`http://localhost:8000/api/crew/delete/${deleteCrewId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Crew member not found or failed to delete');
        return res.json();
      })
      .then(() => {
        alert('Crew member deleted successfully!');
        setShowDeleteModal(false);
        setDeleteCrewId('');
        fetchCrewMembers();
      })
      .catch(error => {
        alert('Error deleting crew member: ' + error.message);
      });
  };


  if (loading) return <div style={{ padding: 20 }}>Loading crew information...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;


  return (
    <>
      <div className="modern-bg" />
      <section className="glass-panel">
        <div style={{ maxWidth: 1200, margin: '20px auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 30, color: '#333' }}>✈️ Crew Information</h1>


          <div style={{
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: '#f5f5f5',
            padding: '15px 20px',
            borderRadius: 8,
            border: '1px solid #ddd'
          }}>
            <span style={{ fontSize: '20px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by Crew ID, Employee Name, or Flight Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '16px'
              }}
            />
          </div>


          <div style={{ marginBottom: 30 }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: 8, display: 'block' }}>Filter by Flight:</label>
            <select
              value={selectedFlight}
              onChange={(e) => setSelectedFlight(e.target.value)}
              style={{
                width: '100%',
                maxWidth: 400,
                padding: '12px',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <option value="All">All Flights</option>
              {flights.map(flight => (
                <option key={flight.Flight_no} value={flight.Flight_no}>
                  {flight.Flight_no} - {flight.src_city} → {flight.des_city}
                </option>
              ))}
            </select>
          </div>


          {filteredCrew.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: 10 }}>👨‍✈️</div>
              <div style={{ fontSize: '18px' }}>No crew members found</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
              {filteredCrew.map((crew, idx) => {
                const roleColors = {
                  'Pilot': { bg: '#E3F2FD', border: '#1976D2', text: '#0D47A1', icon: '👨‍✈️' },
                  'Flight Attendant': { bg: '#F3E5F5', border: '#7B1FA2', text: '#4A148C', icon: '👩‍✈️' }
                };


                const colors = roleColors[crew.Crew_role] || { bg: '#F5F5F5', border: '#9E9E9E', text: '#424242', icon: '👤' };


                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'white',
                      border: `2px solid ${colors.border}`,
                      borderRadius: 12,
                      padding: 20,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}>
                    <div
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        padding: '8px 14px',
                        borderRadius: 20,
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: 15,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      <span>{colors.icon}</span>
                      <span>{crew.Crew_role}</span>
                    </div>


                    <h3 style={{ margin: '10px 0', fontSize: '20px', color: '#333' }}>{crew.Employee_name}</h3>


                    <div style={{ marginTop: 15, fontSize: '14px', color: '#666' }}>
                      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: '600', minWidth: 100 }}>Crew ID:</span>
                        <span>{crew.Crew_ID}</span>
                      </div>
                      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: '600', minWidth: 100 }}>Employee ID:</span>
                        <span>{crew.Employee_ID}</span>
                      </div>
                      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: '600', minWidth: 100 }}>Flight:</span>
                        <span style={{ color: '#007bff', fontWeight: '600' }}>
                          {isFlightUnassigned(crew.Flight_no) ? 'Unassigned' : crew.Flight_no}
                        </span>
                      </div>
                      {!isFlightUnassigned(crew.Flight_no) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: '600', minWidth: 100 }}>Route:</span>
                          <span style={{ fontSize: '12px' }}>{crew.src_city} → {crew.des_city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}


          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: 40, marginBottom: 30 }}>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                padding: '15px 30px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: '600'
              }}
            >
              🗑️ Delete Crew Member
            </button>
          </div>


          {/* Delete Crew Modal */}
          {showDeleteModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  padding: 30,
                  borderRadius: 10,
                  maxWidth: 400,
                  width: '90%'
                }}
              >
                <h3>Delete Crew Member</h3>
                <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
                  Enter the crew ID to delete
                </p>


                <input
                  type="number"
                  placeholder="Crew ID"
                  value={deleteCrewId}
                  onChange={(e) => setDeleteCrewId(e.target.value)}
                  style={{ width: '100%', padding: 10, marginBottom: 20, borderRadius: 5, border: '1px solid #ccc' }}
                />


                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteCrewId('');
                    }}
                    style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCrew}
                    style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};


export default CrewInfo;
