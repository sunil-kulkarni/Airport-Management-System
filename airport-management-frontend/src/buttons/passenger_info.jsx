import React, { useState, useEffect } from 'react';
import "./buttons.css";

const PassengerInfo = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [flagReason, setFlagReason] = useState('');
  const [baggageWeight, setBaggageWeight] = useState('');

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/flights-list')
      .then(res => res.json())
      .then(data => {
        setFlights(data.flights || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching flights:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchPassengersByFlight = (flightNo) => {
    fetch(`http://localhost:8000/api/flight/${flightNo}/passengers`)
      .then(res => res.json())
      .then(data => {
        setPassengers(data.passengers || []);
        setSelectedFlight(flightNo);
      })
      .catch(error => {
        console.error('Error fetching passengers:', error);
        alert('Error fetching passengers: ' + error.message);
      });
  };

  const handleFlaggedPassengerClick = (passenger) => {
    setSelectedPassenger(passenger);
    setShowFlagModal(true);
    setFlagReason('');
    setBaggageWeight('');
  };

  const handleResolveFlag = () => {
    if (!flagReason) {
      alert('Please select a reason');
      return;
    }

    if (flagReason === 'baggage_overweight' && !baggageWeight) {
      alert('Please enter baggage weight');
      return;
    }

    let action = '';
    let newStatus = selectedPassenger.Passenger_status;

    if (flagReason === 'baggage_overweight') {
      const weight = parseFloat(baggageWeight);
      if (weight > 3) {
        action = 'remove';
        // Remove passenger from flight
        fetch(`http://localhost:8000/api/passengers/remove/${selectedPassenger.Passenger_ID}`, {
          method: 'PUT'
        })
          .then(res => res.json())
          .then(() => {
            alert('Passenger removed due to baggage overweight (>3kg)');
            setShowFlagModal(false);
            fetchPassengersByFlight(selectedFlight);
          })
          .catch(error => {
            alert('Error removing passenger: ' + error.message);
          });
        return;
      } else {
        action = 'normal';
        newStatus = 'Normal';
      }
    } else if (flagReason === 'illness' || flagReason === 'theft') {
      action = 'keep';
      newStatus = 'Flagged';
    }

    // Update passenger status
    fetch(`http://localhost:8000/api/passengers/update-status/${selectedPassenger.Passenger_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(() => {
        alert(`Passenger status updated to: ${newStatus}`);
        setShowFlagModal(false);
        fetchPassengersByFlight(selectedFlight);
      })
      .catch(error => {
        alert('Error updating passenger status: ' + error.message);
      });
  };

  const normalPassengers = passengers.filter(p => p.Passenger_status === 'Normal');
  const flaggedPassengers = passengers.filter(p => p.Passenger_status !== 'Normal');

  if (loading) return <div style={{ padding: 20 }}>Loading passenger information...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <>
      <div className="modern-bg" />
      <section className="glass-panel">
        <div style={{ maxWidth: 1400, margin: '20px auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 30, color: '#333' }}>
            ✈️ Passenger Information
          </h1>

          {!selectedFlight ? (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: 20, color: '#555' }}>Select a Flight</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {flights.map((flight) => (
                  <div
                    key={flight.Flight_no}
                    onClick={() => fetchPassengersByFlight(flight.Flight_no)}
                    style={{
                      backgroundColor: 'white',
                      border: '2px solid #007bff',
                      borderRadius: 12,
                      padding: 20,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: 10, color: '#007bff' }}>
                      {flight.Flight_no}
                    </h3>
                    <p style={{ fontSize: '16px', color: '#666', marginBottom: 5 }}>
                      <strong>Route:</strong> {flight.src_city} → {flight.des_city}
                    </p>
                    <p style={{ fontSize: '14px', color: '#999' }}>
                      {flight.departure_time} - {flight.arrival_time}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 30, display: 'flex', alignItems: 'center', gap: 20 }}>
                <button
                  onClick={() => {
                    setSelectedFlight(null);
                    setPassengers([]);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 16
                  }}
                >
                  ← Back to Flights
                </button>
                <h2 style={{ fontSize: '24px', color: '#333', margin: 0 }}>
                  Flight: {selectedFlight}
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                {/* Normal Passengers - Left Side */}
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: 15,
                    color: '#28a745',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    ✅ Normal Passengers ({normalPassengers.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {normalPassengers.length === 0 ? (
                      <div style={{ padding: 20, textAlign: 'center', color: '#999', backgroundColor: 'white', borderRadius: 8 }}>
                        No normal passengers
                      </div>
                    ) : (
                      normalPassengers.map((passenger) => (
                        <div
                          key={passenger.Passenger_ID}
                          style={{
                            backgroundColor: 'white',
                            border: '2px solid #28a745',
                            borderRadius: 8,
                            padding: 15,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h4 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#333' }}>
                                {passenger.Passenger_name}
                              </h4>
                              <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                                <strong>ID:</strong> {passenger.Passenger_ID}
                              </p>
                              <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                                <strong>DOB:</strong> {passenger.DOB}
                              </p>
                              <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                                <strong>Address:</strong> {passenger.Passenger_Address}
                              </p>
                            </div>
                            <div style={{
                              backgroundColor: '#d4edda',
                              color: '#155724',
                              padding: '6px 12px',
                              borderRadius: 20,
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              NORMAL
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Flagged Passengers - Right Side */}
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: 15,
                    color: '#dc3545',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    ⚠️ Flagged Passengers ({flaggedPassengers.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {flaggedPassengers.length === 0 ? (
                      <div style={{ padding: 20, textAlign: 'center', color: '#999', backgroundColor: 'white', borderRadius: 8 }}>
                        No flagged passengers
                      </div>
                    ) : (
                      flaggedPassengers.map((passenger) => (
                        <div
                          key={passenger.Passenger_ID}
                          onClick={() => handleFlaggedPassengerClick(passenger)}
                          style={{
                            backgroundColor: 'white',
                            border: '2px solid #dc3545',
                            borderRadius: 8,
                            padding: 15,
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,53,69,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h4 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#333' }}>
                                {passenger.Passenger_name}
                              </h4>
                              <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                                <strong>ID:</strong> {passenger.Passenger_ID}
                              </p>
                              <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                                <strong>DOB:</strong> {passenger.DOB}
                              </p>
                              <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                                <strong>Address:</strong> {passenger.Passenger_Address}
                              </p>
                              <p style={{ fontSize: '12px', color: '#999', marginTop: 8, fontStyle: 'italic' }}>
                                Click to resolve flag
                              </p>
                            </div>
                            <div style={{
                              backgroundColor: '#f8d7da',
                              color: '#721c24',
                              padding: '6px 12px',
                              borderRadius: 20,
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              FLAGGED
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Flag Resolution Modal */}
          {showFlagModal && selectedPassenger && (
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
                  maxWidth: 500,
                  width: '90%'
                }}
              >
                <h3 style={{ marginBottom: 20 }}>Resolve Flag for {selectedPassenger.Passenger_name}</h3>
                
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#333' }}>
                    Select Reason:
                  </label>
                  <select
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 10,
                      borderRadius: 5,
                      border: '1px solid #ccc',
                      fontSize: 16
                    }}
                  >
                    <option value="">-- Select Reason --</option>
                    <option value="baggage_overweight">Baggage Overweight</option>
                    <option value="illness">Illness</option>
                    <option value="theft">Theft</option>
                  </select>
                </div>

                {flagReason === 'baggage_overweight' && (
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#333' }}>
                      Baggage Weight (kg):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Enter weight in kg"
                      value={baggageWeight}
                      onChange={(e) => setBaggageWeight(e.target.value)}
                      style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 5,
                        border: '1px solid #ccc',
                        fontSize: 16
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#666', marginTop: 5 }}>
                      * If weight {'>'} 3kg, passenger will be removed
                    </p>
                  </div>
                )}

                {flagReason && (
                  <div style={{
                    backgroundColor: '#e7f3ff',
                    padding: 15,
                    borderRadius: 5,
                    marginBottom: 20,
                    border: '1px solid #b3d9ff'
                  }}>
                    <p style={{ fontSize: '14px', margin: 0, color: '#004085' }}>
                      <strong>Action:</strong>{' '}
                      {flagReason === 'baggage_overweight'
                        ? baggageWeight && parseFloat(baggageWeight) > 3
                          ? '❌ Remove passenger (overweight)'
                          : '✅ Assign as Normal'
                        : flagReason === 'illness'
                        ? '⚠️ Keep as Flagged (Illness)'
                        : '⚠️ Keep as Flagged (Theft)'}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setShowFlagModal(false);
                      setSelectedPassenger(null);
                      setFlagReason('');
                      setBaggageWeight('');
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: 5,
                      cursor: 'pointer',
                      fontSize: 16
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResolveFlag}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: 5,
                      cursor: 'pointer',
                      fontSize: 16
                    }}
                  >
                    Resolve
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

export default PassengerInfo;