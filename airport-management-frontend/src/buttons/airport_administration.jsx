import React, { useState, useEffect } from 'react';
import "./buttons.css";

const AirportAdministration = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState('');

  const jobTypes = [
    'All',
    'Check-in Handler',
    'Ground Engineer',
    'Immigration Handler',
    'Security Handler',
    'Retail Staff'
  ];

  const [newEmployee, setNewEmployee] = useState({
    Employee_ID: '',
    F_Name: '',
    M_Initial: '',
    L_Name: '',
    Employee_name: '',
    Hire_date: '',
    Employee_Salary: '',
    Job_title: '',
    Airport_ID: 'BLR',
    pwd: null
  });

  const fetchEmployees = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/employees')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setEmployees(data.employees || []);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    if (
      emp.Job_title === 'Airport Head of Staff' ||
      emp.Job_title === 'Pilot' ||
      emp.Job_title === 'Security' ||
      emp.Job_title === 'Flight Attendant'
    ) {
      return false;
    }

    const matchesSearch =
      searchQuery === '' ||
      emp.Employee_ID.toString().includes(searchQuery) ||
      emp.Employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.Job_title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJobType = selectedJobType === 'All' || emp.Job_title === selectedJobType;

    return matchesSearch && matchesJobType;
  });

  const handleAddEmployee = () => {
    const fullName = `${newEmployee.F_Name} ${newEmployee.M_Initial} ${newEmployee.L_Name}`.trim();
    const employeeData = {
      ...newEmployee,
      Employee_name: fullName
    };

    fetch('http://localhost:8000/api/employees/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add employee');
        return res.json();
      })
      .then(() => {
        alert('Employee added successfully!');
        setShowAddModal(false);
        setNewEmployee({
          Employee_ID: '',
          F_Name: '',
          M_Initial: '',
          L_Name: '',
          Employee_name: '',
          Hire_date: '',
          Employee_Salary: '',
          Job_title: '',
          Airport_ID: 'BLR',
          pwd: null
        });
        fetchEmployees();
      })
      .catch(error => {
        alert('Error adding employee: ' + error.message);
      });
  };

  const handleDeleteEmployee = () => {
    if (!deleteEmployeeId) {
      alert('Please enter an employee ID');
      return;
    }

    fetch(`http://localhost:8000/api/employees/delete/${deleteEmployeeId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Employee not found or failed to delete');
        return res.json();
      })
      .then(() => {
        alert('Employee deleted successfully!');
        setShowDeleteModal(false);
        setDeleteEmployeeId('');
        fetchEmployees();
      })
      .catch(error => {
        alert('Error deleting employee: ' + error.message);
      });
  };

  if (loading) return <div style={{ padding: 20 }}>Loading employees...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <>
      {/* Background Image Overlay */}
      <div className="modern-bg" />
      {/* Glass Panel Wrapper */}
      <section className="glass-panel">
        <div style={{ maxWidth: 1200, margin: '20px auto', padding: '0 20px' }}>
          <h1 className="glass-header" style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 30, color: '#333' }}>
            👥 Airport Administration
          </h1>
          {/* Search Bar */}
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
              placeholder="Search by Employee ID, Name, or Job Title"
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
          {/* Job Type Filter Dropdown */}
          <div style={{ marginBottom: 30 }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: 8, display: 'block' }}>
              Filter by Job Type:
            </label>
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
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
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {/* Employee Cards */}
          {filteredEmployees.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: 10 }}>👤</div>
              <div style={{ fontSize: '18px' }}>No employees found</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
              {filteredEmployees.map((employee, idx) => {
                const jobColors = {
                  'Check-in Handler': { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
                  'Ground Engineer': { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
                  'Immigration Handler': { bg: '#F3E5F5', border: '#9C27B0', text: '#6A1B9A' },
                  'Security Handler': { bg: '#FFEBEE', border: '#F44336', text: '#C62828' },
                  'Retail Staff': { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' }
                };

                const colors = jobColors[employee.Job_title] || { bg: '#F5F5F5', border: '#9E9E9E', text: '#424242' };

                return (
                  <div key={idx} style={{
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
                    {/* Job Title Badge */}
                    <div style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: 15,
                      display: 'inline-block',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {employee.Job_title}
                    </div>
                    {/* Employee Name */}
                    <h3 style={{ margin: '10px 0', fontSize: '20px', color: '#333' }}>
                      {employee.Employee_name}
                    </h3>
                    {/* Employee Details */}
                    <div style={{ marginTop: 15, fontSize: '14px', color: '#666' }}>
                      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: '600', minWidth: 80 }}>ID:</span>
                        <span>{employee.Employee_ID}</span>
                      </div>
                      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: '600', minWidth: 80 }}>Hired:</span>
                        <span>{new Date(employee.Hire_date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}</span>
                      </div>
                      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: '600', minWidth: 80 }}>Salary:</span>
                        <span style={{ color: '#28a745', fontWeight: '600' }}>₹{employee.Employee_Salary.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: '600', minWidth: 80 }}>Airport:</span>
                        <span>{employee.Airport_ID}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Footer Buttons */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: 40, marginBottom: 30 }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '15px 30px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              ➕ Add Employee
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
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              🗑️ Delete Employee
            </button>
          </div>
          {/* Add Employee Modal */}
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
                <h3>Add New Employee</h3>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: 20 }}>
                  Fill in all employee details below
                </p>
                <input
                  type="number"
                  placeholder="Employee ID"
                  value={newEmployee.Employee_ID}
                  onChange={(e) => setNewEmployee({ ...newEmployee, Employee_ID: e.target.value })}
                  style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  placeholder="First Name"
                  value={newEmployee.F_Name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, F_Name: e.target.value })}
                  style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  placeholder="Middle Initial (Optional)"
                  maxLength="1"
                  value={newEmployee.M_Initial}
                  onChange={(e) => setNewEmployee({ ...newEmployee, M_Initial: e.target.value })}
                  style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={newEmployee.L_Name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, L_Name: e.target.value })}
                  style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
                />
                <input
                  type="date"
                  placeholder="Hire Date"
                  value={newEmployee.Hire_date}
                  onChange={(e) => setNewEmployee({ ...newEmployee, Hire_date: e.target.value })}
                  style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
                />
                <input
                  type="number"
                  placeholder="Salary"
                  value={newEmployee.Employee_Salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, Employee_Salary: e.target.value })}
                  style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
                />
                <select
                  value={newEmployee.Job_title}
                  onChange={(e) => setNewEmployee({ ...newEmployee, Job_title: e.target.value })}
                  style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
                >
                  <option value="">Select Job Title</option>
                  <option value="Check-in Handler">Check-in Handler</option>
                  <option value="Ground Engineer">Ground Engineer</option>
                  <option value="Immigration Handler">Immigration Handler</option>
                  <option value="Security Handler">Security Handler</option>
                  <option value="Retail Staff">Retail Staff</option>
                </select>
                <input
                  type="text"
                  placeholder="Airport ID (Default: BLR)"
                  value={newEmployee.Airport_ID}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: 20,
                    borderRadius: 5,
                    border: '1px solid #ccc',
                    backgroundColor: '#f0f0f0',
                    cursor: 'not-allowed'
                  }}
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowAddModal(false)}
                    style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEmployee}
                    style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                  >
                    Add Employee
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Delete Employee Modal */}
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
                <h3>Delete Employee</h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: 20 }}>
                  Enter the employee ID to delete
                </p>
                <input
                  type="number"
                  placeholder="Employee ID"
                  value={deleteEmployeeId}
                  onChange={(e) => setDeleteEmployeeId(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: 20, borderRadius: 5, border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteEmployeeId('');
                    }}
                    style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteEmployee}
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

export default AirportAdministration;
