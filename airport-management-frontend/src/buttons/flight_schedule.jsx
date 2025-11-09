import React, { useState, useEffect } from 'react';

const FlightSchedule = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Departure');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeError, setTimeError] = useState('');
  

  const cities = ['Bengaluru', 'Hyderabad', 'Delhi', 'Mumbai', 'Chennai', 'Kolkata'];
  
 
  const [newFlight, setNewFlight] = useState({
    Flight_no: '',
    Airline_name: '',
    Flight_status: '',
    arrival_time: '',
    Airport_ID: 'BLR',
    Airline_ID: '',
    Gate_no: '',
    Terminal: '',
    src_city: '',
    des_city: ''
  });

  // State for deleting flight
  const [deleteFlightNo, setDeleteFlightNo] = useState('');

  const fetchFlights = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/flight-schedule')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Received data:', data);
        setFlights(data.flights || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching flights:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  // Filter flights based on tab and search
  const filteredFlights = flights.filter(flight => {
    const matchesTab = flight.Flight_status === activeTab;
    const matchesSearch = searchQuery === '' || 
      flight.Flight_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.Airline_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Check if gate is available at the selected time
  const checkGateAvailability = (gateNo, time) => {
    if (!gateNo || !time) return true;

    const newTime = new Date(`2000-01-01T${time}`);
    
    // Find all flights using the same gate
    const gateFlights = flights.filter(f => f.Gate_no === gateNo);
    
    for (let flight of gateFlights) {
      const flightTime = new Date(`2000-01-01T${flight.arrival_time}`);
      const timeDiff = Math.abs(newTime - flightTime) / 60000; // difference in minutes
      
      if (timeDiff < 30) {
        return false;
      }
    }
    
    return true;
  };

  const handleAddFlight = () => {
    // Validate gate availability
    if (!checkGateAvailability(newFlight.Gate_no, newFlight.arrival_time)) {
      setTimeError(`Gate ${newFlight.Gate_no} is not available at ${newFlight.arrival_time}. Please select another time or gate (minimum 30 minutes gap required).`);
      return;
    }

    setTimeError('');
    
    fetch('http://localhost:8000/api/flight-schedule/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFlight)
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to add flight');
      return res.json();
    })
    .then(() => {
      alert('Flight added successfully!');
      setShowAddModal(false);
      setTimeError('');
      setNewFlight({
        Flight_no: '',
        Airline_name: '',
        Flight_status: '',
        arrival_time: '',
        Airport_ID: 'BLR',
        Airline_ID: '',
        Gate_no: '',
        Terminal: '',
        src_city: '',
        des_city: ''
      });
      fetchFlights();
    })
    .catch(error => {
      alert('Error adding flight: ' + error.message);
    });
  };

  const handleDeleteFlight = () => {
    if (!deleteFlightNo) {
      alert('Please enter a flight number');
      return;
    }

    fetch(`http://localhost:8000/api/flight-schedule/delete/${deleteFlightNo}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error('Flight not found or failed to delete');
      return res.json();
    })
    .then(() => {
      alert('Flight deleted successfully!');
      setShowDeleteModal(false);
      setDeleteFlightNo('');
      fetchFlights();
    })
    .catch(error => {
      alert('Error deleting flight: ' + error.message);
    });
  };

  if (loading) return <div style={{ padding: 20 }}>Loading flights...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', padding: '0 20px' }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Departure/Arrival Tabs */}
      <div style={{ display: 'flex', gap: 20, borderBottom: '2px solid #ddd', marginBottom: 20 }}>
        <button 
          onClick={() => setActiveTab('Departure')}
          style={{
            padding: '15px 30px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'Departure' ? '3px solid #FFC107' : 'none',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: activeTab === 'Departure' ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          ✈️ Departure
        </button>
        <button 
          onClick={() => setActiveTab('Arrival')}
          style={{
            padding: '15px 30px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'Arrival' ? '3px solid #FFC107' : 'none',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: activeTab === 'Arrival' ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          🛬 Arrival
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ 
        marginBottom: 30,
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
          placeholder="Enter flight number or airline name"
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

      {/* Flight List - MODERN CARDS */}
      {filteredFlights.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '48px', marginBottom: 10 }}>✈️</div>
          <div style={{ fontSize: '18px' }}>No {activeTab.toLowerCase()} flights found</div>
        </div>
      ) : (
        

filteredFlights.map((flight, idx) => {
  // Determine airline color
  const airlineColors = {
    'IndiGo': { bg: '#003366', text: '#FFFFFF' },
    'Air India': { bg: '#DC143C', text: '#FFFFFF' },
    'Star Air': { bg: '#FF6B35', text: '#FFFFFF' },
    'SpiceJet': { bg: '#FFD700', text: '#000000' },
    'Akasa Air': { bg: '#FF4500', text: '#FFFFFF' }
  };
  
  const colors = airlineColors[flight.Airline_name] || { bg: '#6c757d', text: '#FFFFFF' };
  
  return (
    <div key={idx} style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid #e0e0e0',
      borderRadius: 12,
      marginBottom: 15,  
      padding: 0,
      boxShadow: '0 3px 8px rgba(0,0,0,0.07)',  
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      maxWidth: 750  
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.07)';
    }}>
      {/* Header Section with Airline Brand */}
      <div style={{
        background: colors.bg,
        color: colors.text,
        padding: '12px 16px',  
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            ✈️
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{flight.Flight_no}</h2>
            <p style={{ margin: '2px 0 0 0', opacity: 0.9, fontSize: '13px' }}>{flight.Airline_name}</p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.25)',
          padding: '6px 12px',
          borderRadius: 20,
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {flight.Flight_status}
        </div>
      </div>

      {/* Main Content Section */}
      <div style={{ padding: 16 }}> {/* smaller padding */}
        {/* Route Visualization */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          padding: '16px 0'
        }}>
          {/* Source City */}
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: 4 }}>FROM</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{flight.src_city}</div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
              {flight.Flight_status === 'Departure' ? 'Terminal ' + flight.Terminal : ''}
            </div>
          </div>

          {/* Flight Path Animation */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '26px',
              marginBottom: 6,
              animation: 'float 3s ease-in-out infinite'
            }}>
              {flight.Flight_status === 'Departure' ? '🛫' : '🛬'}
            </div>
            <div style={{
              width: '100%',
              height: 2,
              background: 'repeating-linear-gradient(to right, #007bff 0, #007bff 8px, transparent 8px, transparent 16px)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: -6,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#007bff',
                color: 'white',
                padding: '3px 10px',
                borderRadius: 10,
                fontSize: '11px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}>
                {flight.arrival_time}
              </div>
            </div>
          </div>

          {/* Destination City */}
          <div style={{ textAlign: 'right', flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: 4 }}>TO</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{flight.des_city}</div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
              {flight.Flight_status === 'Arrival' ? 'Terminal ' + flight.Terminal : ''}
            </div>
          </div>
        </div>

        {/* Gate and Terminal Info */}
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '12px 0',
          borderTop: '1px solid #e0e0e0'
        }}>
          <div style={{
            flex: 1,
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: 8,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: 4 }}>GATE</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{flight.Gate_no}</div>
          </div>
          
          <div style={{
            flex: 1,
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: 8,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: 4 }}>TERMINAL</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>T{flight.Terminal}</div>
          </div>
        </div>
      </div>

      {/* Status Bar at Bottom */}
      <div style={{
        backgroundColor: flight.Flight_status === 'Arrival' ? '#e8f5e9' : '#fff3e0',
        padding: '8px 16px',
        fontSize: '12px',
        color: flight.Flight_status === 'Arrival' ? '#2e7d32' : '#e65100',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        {flight.Flight_status === 'Arrival' 
          ? `✓ Arriving from ${flight.src_city}` 
          : `→ Departing to ${flight.des_city}`}
      </div>
    </div>
  );
})

      )}

      {/* Footer Buttons */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: 30, marginBottom: 30 }}>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '15px 30px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ➕ Add Flight
        </button>
        <button 
          onClick={() => setShowDeleteModal(true)}
          style={{
            padding: '15px 30px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🗑️ Delete Flight
        </button>
      </div>

      {/* Add Flight Modal */}
      {showAddModal && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 30,
            borderRadius: 10,
            maxWidth: 500,
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>Add New Flight</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: 20 }}>
              Fill in all flight details below
            </p>

            {/* Time Error Message */}
            {timeError && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '10px',
                borderRadius: 5,
                marginBottom: 15,
                fontSize: '14px',
                border: '1px solid #ef5350'
              }}>
                ⚠️ {timeError}
              </div>
            )}

            <input
              type="text"
              placeholder="Flight Number (e.g., 6E1234)"
              value={newFlight.Flight_no}
              onChange={(e) => setNewFlight({...newFlight, Flight_no: e.target.value})}
              style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
            />
            
            <select
              value={newFlight.Airline_ID}
              onChange={(e) => {
                const airlines = {
                  '1': 'IndiGo',
                  '2': 'Air India',
                  '3': 'Star Air',
                  '4': 'SpiceJet',
                  '5': 'Akasa Air'
                };
                setNewFlight({...newFlight, Airline_ID: e.target.value, Airline_name: airlines[e.target.value] || ''});
              }}
              style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
            >
              <option value="">Select Airline</option>
              <option value="1">IndiGo</option>
              <option value="2">Air India</option>
              <option value="3">Star Air</option>
              <option value="4">SpiceJet</option>
              <option value="5">Akasa Air</option>
            </select>

            <select
              value={newFlight.Flight_status}
              onChange={(e) => {
                const status = e.target.value;
                if (status === 'Arrival') {
                  setNewFlight({
                    ...newFlight, 
                    Flight_status: status,
                    des_city: 'Bengaluru',
                    Airport_ID: 'BLR'
                  });
                } else if (status === 'Departure') {
                  setNewFlight({
                    ...newFlight, 
                    Flight_status: status,
                    src_city: 'Bengaluru',
                    Airport_ID: 'BLR'
                  });
                } else {
                  setNewFlight({...newFlight, Flight_status: status});
                }
              }}
              style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
            >
              <option value="">Select Flight Status</option>
              <option value="Arrival">Arrival</option>
              <option value="Departure">Departure</option>
            </select>

            <input
              type="time"
              placeholder="Time"
              value={newFlight.arrival_time}
              onChange={(e) => {
                setNewFlight({...newFlight, arrival_time: e.target.value});
                setTimeError('');
              }}
              style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
            />

            <select
              value={newFlight.Gate_no}
              onChange={(e) => {
                setNewFlight({...newFlight, Gate_no: e.target.value});
                setTimeError('');
              }}
              style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
            >
              <option value="">Select Gate</option>
              <option value="G01">G01</option>
              <option value="G02">G02</option>
              <option value="G03">G03</option>
              <option value="G04">G04</option>
              <option value="G05">G05</option>
              <option value="G06">G06</option>
            </select>

            <select
              value={newFlight.Terminal}
              onChange={(e) => setNewFlight({...newFlight, Terminal: e.target.value})}
              style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
            >
              <option value="">Select Terminal</option>
              <option value="1">Terminal 1</option>
              <option value="2">Terminal 2</option>
            </select>

            {/* Source City Dropdown - Disabled if Departure */}
            <select
              value={newFlight.Flight_status === 'Departure' ? 'Bengaluru' : newFlight.src_city}
              onChange={(e) => {
                if (newFlight.Flight_status !== 'Departure') {
                  setNewFlight({...newFlight, src_city: e.target.value});
                }
              }}
              disabled={newFlight.Flight_status === 'Departure'}
              style={{ 
                width: '100%', 
                padding: '10px', 
                marginBottom: 10, 
                borderRadius: 5, 
                border: '1px solid #ccc',
                backgroundColor: newFlight.Flight_status === 'Departure' ? '#f0f0f0' : 'white',
                cursor: newFlight.Flight_status === 'Departure' ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="">Select Source City</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Destination City Dropdown - Disabled if Arrival */}
            <select
              value={newFlight.Flight_status === 'Arrival' ? 'Bengaluru' : newFlight.des_city}
              onChange={(e) => {
                if (newFlight.Flight_status !== 'Arrival') {
                  setNewFlight({...newFlight, des_city: e.target.value});
                }
              }}
              disabled={newFlight.Flight_status === 'Arrival'}
              style={{ 
                width: '100%', 
                padding: '10px', 
                marginBottom: 20, 
                borderRadius: 5, 
                border: '1px solid #ccc',
                backgroundColor: newFlight.Flight_status === 'Arrival' ? '#f0f0f0' : 'white',
                cursor: newFlight.Flight_status === 'Arrival' ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="">Select Destination City</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setTimeError('');
                }}
                style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddFlight}
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
              >
                Add Flight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Flight Modal */}
      {showDeleteModal && (
        <div style={{
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
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 30,
            borderRadius: 10,
            maxWidth: 400,
            width: '90%'
          }}>
            <h3>Delete Flight</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: 20 }}>
              Enter the flight number to delete
            </p>

            <input
              type="text"
              placeholder="Flight Number (e.g., 6E1234)"
              value={deleteFlightNo}
              onChange={(e) => setDeleteFlightNo(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: 20, borderRadius: 5, border: '1px solid #ccc' }}
            />

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteFlightNo('');
                }}
                style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteFlight}
                style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSchedule;
