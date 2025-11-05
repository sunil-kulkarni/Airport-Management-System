import React, { useState, useEffect } from 'react';
import "./buttons.css";

const GroundOperations = () => {
  const [activeTab, setActiveTab] = useState('medical');
  const [medicalStaff, setMedicalStaff] = useState([]);
  const [groundEngineers, setGroundEngineers] = useState([]);
  const [illPassengers, setIllPassengers] = useState([]);
  const [arrivalFlights, setArrivalFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentType, setAssignmentType] = useState('medical');
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [assignedPassengers, setAssignedPassengers] = useState(new Set());
  const [assignedFlights, setAssignedFlights] = useState(new Set());

  const fetchData = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/ground_operations/data')
      .then(res => res.json())
      .then(data => {
        setMedicalStaff(data.medical_staff || []);
        setGroundEngineers(data.ground_engineers || []);
        setIllPassengers(data.ill_passengers || []);
        setArrivalFlights(data.arrival_flights || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignMedical = (passenger) => {
    setSelectedPassenger(passenger);
    setAssignmentType('medical');
    setShowAssignModal(true);
    setSelectedStaff(null);
  };

  const handleAssignEngineer = (flight) => {
    setSelectedFlight(flight);
    setAssignmentType('engineer');
    setShowAssignModal(true);
    setSelectedStaff(null);
  };

  const handleConfirmAssignment = () => {
    if (!selectedStaff) {
      alert('Please select staff member');
      return;
    }

    const endpoint = assignmentType === 'medical'
      ? 'http://localhost:8000/api/ground_operations/assign_medical'
      : 'http://localhost:8000/api/ground_operations/assign_engineer';

    const payload = assignmentType === 'medical'
      ? { Passenger_ID: selectedPassenger.Passenger_ID, Employee_ID: selectedStaff }
      : { Flight_no: selectedFlight.Flight_no, Employee_ID: selectedStaff };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        alert('✅ Assignment successful!');

        // Track assignment
        const newAssignment = {
          type: assignmentType,
          passenger: selectedPassenger,
          flight: selectedFlight,
          staff: selectedStaff,
          staffName: assignmentType === 'medical'
            ? medicalStaff.find(s => s.Employee_ID === selectedStaff)?.Employee_name
            : groundEngineers.find(s => s.Employee_ID === selectedStaff)?.Employee_name,
          timestamp: new Date().toLocaleTimeString()
        };
        setAssignments([...assignments, newAssignment]);

        // Mark as assigned
        if (assignmentType === 'medical') {
          setAssignedPassengers(new Set([...assignedPassengers, selectedPassenger.Passenger_ID]));
        } else {
          setAssignedFlights(new Set([...assignedFlights, selectedFlight.Flight_no]));
        }

        // Close modal and reset
        setShowAssignModal(false);
        setSelectedPassenger(null);
        setSelectedFlight(null);
        setSelectedStaff(null);
      })
      .catch(error => {
        alert('❌ Error: ' + error.message);
      });
  };

  // Get staff name by ID
  const getStaffName = (staffId, type) => {
    if (type === 'medical') {
      return medicalStaff.find(s => s.Employee_ID === staffId)?.Employee_name;
    } else {
      return groundEngineers.find(s => s.Employee_ID === staffId)?.Employee_name;
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading ground operations...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <>
      <div className="modern-bg" />
      <section className="glass-panel">
        <div style={{ maxWidth: 1400, margin: '20px auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 30, color: '#333' }}>
            🏗️ Ground Operations Management
          </h1>

          {/* Tab Buttons */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
            <button
              onClick={() => setActiveTab('medical')}
              style={{
                padding: '15px 30px',
                backgroundColor: activeTab === 'medical' ? '#e74c3c' : '#ecf0f1',
                color: activeTab === 'medical' ? 'white' : '#333',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: '600',
                transition: 'all 0.3s ease',
                transform: activeTab === 'medical' ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              🏥 Medical Staff
            </button>
            <button
              onClick={() => setActiveTab('engineers')}
              style={{
                padding: '15px 30px',
                backgroundColor: activeTab === 'engineers' ? '#3498db' : '#ecf0f1',
                color: activeTab === 'engineers' ? 'white' : '#333',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: '600',
                transition: 'all 0.3s ease',
                transform: activeTab === 'engineers' ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              🔧 Ground Engineers
            </button>
          </div>

          {/* Medical Staff Tab */}
          {activeTab === 'medical' && (
            <div>
              <h2 style={{ fontSize: '24px', marginBottom: 20, color: '#e74c3c' }}>
                🏥 Ill Passengers ({illPassengers.length})
              </h2>

              {illPassengers.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#999', backgroundColor: 'white', borderRadius: 8 }}>
                  No ill passengers found
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20, marginBottom: 30 }}>
                  {illPassengers.map((passenger) => {
                    const isAssigned = assignedPassengers.has(passenger.Passenger_ID);
                    const assignment = assignments.find(a => a.type === 'medical' && a.passenger?.Passenger_ID === passenger.Passenger_ID);

                    return (
                      <div
                        key={passenger.Passenger_ID}
                        style={{
                          backgroundColor: isAssigned ? '#f0f0f0' : 'white',
                          border: `2px solid ${isAssigned ? '#ccc' : '#e74c3c'}`,
                          borderRadius: 12,
                          padding: 20,
                          boxShadow: isAssigned ? '0 2px 4px rgba(0,0,0,0.05)' : '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          opacity: isAssigned ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isAssigned) {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(231,76,60,0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isAssigned) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          }
                        }}
                      >
                        <div style={{ marginBottom: 15 }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>
                            {passenger.Passenger_name}
                          </h3>
                          <p style={{ fontSize: '12px', color: '#e74c3c', marginTop: 5, fontWeight: '600' }}>
                            🚨 {passenger.Passenger_status}
                          </p>
                        </div>

                        <div style={{ fontSize: '14px', color: '#666', marginBottom: 15 }}>
                          <p style={{ margin: '4px 0' }}>
                            <strong>ID:</strong> {passenger.Passenger_ID}
                          </p>
                          <p style={{ margin: '4px 0' }}>
                            <strong>Flight:</strong> {passenger.Flight_no}
                          </p>
                          <p style={{ margin: '4px 0' }}>
                            <strong>Route:</strong> {passenger.src_city} → {passenger.des_city}
                          </p>
                        </div>

                        {isAssigned && assignment && (
                          <div style={{
                            backgroundColor: '#d4edda',
                            color: '#155724',
                            padding: 10,
                            borderRadius: 5,
                            marginBottom: 15,
                            fontSize: 12,
                            fontWeight: '600'
                          }}>
                            ✅ Assigned to: {assignment.staffName}
                          </div>
                        )}

                        <button
                          onClick={() => handleAssignMedical(passenger)}
                          disabled={isAssigned}
                          style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: isAssigned ? '#ccc' : '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: 5,
                            cursor: isAssigned ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            opacity: isAssigned ? 0.6 : 1
                          }}
                        >
                          {isAssigned ? '✓ Already Assigned' : 'Assign Medical Staff'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Ground Engineers Tab */}
          {activeTab === 'engineers' && (
            <div>
              <h2 style={{ fontSize: '24px', marginBottom: 20, color: '#3498db' }}>
                🔧 Arrival Flights ({arrivalFlights.length})
              </h2>

              {arrivalFlights.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#999', backgroundColor: 'white', borderRadius: 8 }}>
                  No arrival flights found
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20, marginBottom: 30 }}>
                  {arrivalFlights.map((flight) => {
                    const isAssigned = assignedFlights.has(flight.Flight_no);
                    const assignment = assignments.find(a => a.type === 'engineer' && a.flight?.Flight_no === flight.Flight_no);

                    return (
                      <div
                        key={flight.Flight_no}
                        style={{
                          backgroundColor: isAssigned ? '#f0f0f0' : 'white',
                          border: `2px solid ${isAssigned ? '#ccc' : '#3498db'}`,
                          borderRadius: 12,
                          padding: 20,
                          boxShadow: isAssigned ? '0 2px 4px rgba(0,0,0,0.05)' : '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          opacity: isAssigned ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isAssigned) {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(52,152,219,0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isAssigned) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          }
                        }}
                      >
                        <div style={{ marginBottom: 15 }}>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>
                            {flight.Flight_no}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#3498db', marginTop: 5, fontWeight: '600' }}>
                            {flight.Airline_name}
                          </p>
                        </div>

                        <div style={{ fontSize: '14px', color: '#666', marginBottom: 15 }}>
                          <p style={{ margin: '4px 0' }}>
                            <strong>Route:</strong> {flight.src_city} → {flight.des_city}
                          </p>
                          <p style={{ margin: '4px 0' }}>
                            <strong>Arrival Time:</strong> {flight.arrival_time || 'N/A'}
                          </p>
                        </div>

                        {isAssigned && assignment && (
                          <div style={{
                            backgroundColor: '#d4edda',
                            color: '#155724',
                            padding: 10,
                            borderRadius: 5,
                            marginBottom: 15,
                            fontSize: 12,
                            fontWeight: '600'
                          }}>
                            ✅ Assigned to: {assignment.staffName}
                          </div>
                        )}

                        <button
                          onClick={() => handleAssignEngineer(flight)}
                          disabled={isAssigned}
                          style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: isAssigned ? '#ccc' : '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: 5,
                            cursor: isAssigned ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            opacity: isAssigned ? 0.6 : 1
                          }}
                        >
                          {isAssigned ? '✓ Already Assigned' : 'Assign Ground Engineer'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Assignment History */}
          {assignments.length > 0 && (
            <div style={{ marginTop: 40, padding: 20, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: 15 }}>
                📋 Assignment History ({assignments.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {assignments.map((assignment, idx) => (
                  <div key={idx} style={{ padding: 12, backgroundColor: 'white', borderRadius: 5, borderLeft: `4px solid ${assignment.type === 'medical' ? '#e74c3c' : '#3498db'}` }}>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      <strong>
                        {assignment.type === 'medical'
                          ? `🏥 Medical: ${assignment.passenger.Passenger_name} → ${assignment.staffName}`
                          : `🔧 Engineer: ${assignment.flight.Flight_no} → ${assignment.staffName}`}
                      </strong>
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>
                      {assignment.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Assignment Modal */}
      {showAssignModal && (
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
            <h3 style={{ marginBottom: 20 }}>
              {assignmentType === 'medical'
                ? `Assign Medical Staff to ${selectedPassenger?.Passenger_name}`
                : `Assign Ground Engineer to ${selectedFlight?.Flight_no}`}
            </h3>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#333' }}>
                Select Staff Member:
              </label>
              <select
                value={selectedStaff || ''}
                onChange={(e) => setSelectedStaff(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 5,
                  border: '1px solid #ccc',
                  fontSize: 14
                }}
              >
                <option value="">-- Select Staff --</option>
                {(assignmentType === 'medical' ? medicalStaff : groundEngineers).map((staff) => (
                  <option key={staff.Employee_ID} value={staff.Employee_ID}>
                    {staff.Employee_name} ({staff.Job_title})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedPassenger(null);
                  setSelectedFlight(null);
                  setSelectedStaff(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                style={{
                  padding: '10px 20px',
                  backgroundColor: assignmentType === 'medical' ? '#e74c3c' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroundOperations;
