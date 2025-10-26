import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = (type) => {
    setLoading(true);
    setError(null);
    setReportType(type);

    let endpoint = '';
    if (type === 'flight-traffic') endpoint = 'http://localhost:8000/api/reports/flight-traffic';
    if (type === 'employee') endpoint = 'http://localhost:8000/api/reports/employee-stats';
    if (type === 'passenger') endpoint = 'http://localhost:8000/api/reports/passenger-traffic';

    fetch(endpoint)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching report:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const downloadPDF = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    const reportContent = document.getElementById('report-content').innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportType.toUpperCase()} Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #007bff; color: white; }
            .stat-box { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
            .stat-label { font-weight: bold; color: #555; }
            .stat-value { font-size: 24px; color: #007bff; }
          </style>
        </head>
        <body>
          ${reportContent}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderFlightTrafficReport = () => (
    <div id="report-content">
      <h1>✈️ Flight Traffic Report</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>Generated on {new Date().toLocaleString()}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 30 }}>
        <div style={{ background: '#E3F2FD', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#666' }}>Total Flights</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1976D2' }}>{reportData.total_flights}</div>
        </div>
        <div style={{ background: '#E8F5E9', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#666' }}>Arrivals</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#388E3C' }}>{reportData.arrivals}</div>
        </div>
        <div style={{ background: '#FFF3E0', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#666' }}>Departures</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#F57C00' }}>{reportData.departures}</div>
        </div>
      </div>

      <h2>Airline Breakdown</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
            <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Airline</th>
            <th style={{ padding: 12, textAlign: 'right', border: '1px solid #ddd' }}>Number of Flights</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(reportData.airline_breakdown).map(([airline, count], idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
              <td style={{ padding: 12, border: '1px solid #ddd' }}>{airline}</td>
              <td style={{ padding: 12, textAlign: 'right', border: '1px solid #ddd' }}>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Top Routes</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
            <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Route</th>
            <th style={{ padding: 12, textAlign: 'right', border: '1px solid #ddd' }}>Number of Flights</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(reportData.top_routes).map(([route, count], idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
              <td style={{ padding: 12, border: '1px solid #ddd' }}>{route}</td>
              <td style={{ padding: 12, textAlign: 'right', border: '1px solid #ddd' }}>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEmployeeReport = () => (
    <div id="report-content">
      <h1>👥 Employee Statistics Report</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>Generated on {new Date().toLocaleString()}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 30 }}>
        <div style={{ background: '#E3F2FD', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#666' }}>Total Employees</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1976D2' }}>{reportData.total_employees}</div>
        </div>
        <div style={{ background: '#E8F5E9', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#666' }}>Total Salary Expense</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: '#388E3C' }}>₹{reportData.total_salary_expense.toLocaleString()}</div>
        </div>
        <div style={{ background: '#FFF3E0', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#666' }}>Average Salary</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: '#F57C00' }}>₹{reportData.average_salary.toLocaleString()}</div>
        </div>
      </div>

      <h2>Job Title Breakdown</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
            <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Job Title</th>
            <th style={{ padding: 12, textAlign: 'right', border: '1px solid #ddd' }}>Count</th>
            <th style={{ padding: 12, textAlign: 'right', border: '1px solid #ddd' }}>Total Salary</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(reportData.job_breakdown).map(([job, stats], idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
              <td style={{ padding: 12, border: '1px solid #ddd' }}>{job}</td>
              <td style={{ padding: 12, textAlign: 'right', border: '1px solid #ddd' }}>{stats.count}</td>
              <td style={{ padding: 12, textAlign: 'right', border: '1px solid #ddd' }}>₹{stats.total_salary.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPassengerReport = () => (
    <div id="report-content">
      <h1>🧳 Passenger Traffic Report</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>Generated on {new Date().toLocaleString()}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 30 }}>
        <div style={{ background: '#E3F2FD', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#666' }}>Total Passengers</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1976D2' }}>{reportData.total_passengers}</div>
        </div>
        <div style={{ background: '#E8F5E9', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#666' }}>Total Tickets</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#388E3C' }}>{reportData.total_tickets}</div>
        </div>
        <div style={{ background: '#FFF3E0', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#666' }}>Total Baggage</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#F57C00' }}>{reportData.total_baggage}</div>
        </div>
      </div>

      <h2>Ticket Class Distribution</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
            <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Class</th>
            <th style={{ padding: 12, textAlign: 'right', border: '1px solid #ddd' }}>Number of Tickets</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(reportData.ticket_class_breakdown).map(([className, count], idx) => (
            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
              <td style={{ padding: 12, border: '1px solid #ddd' }}>{className}</td>
              <td style={{ padding: 12, textAlign: 'right', border: '1px solid #ddd' }}>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Baggage Statistics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
          <div style={{ fontSize: 14, color: '#666' }}>Total Baggage Weight</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#007bff' }}>{reportData.baggage_stats.total_weight} kg</div>
        </div>
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
          <div style={{ fontSize: 14, color: '#666' }}>Average Baggage Weight</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#007bff' }}>{reportData.baggage_stats.average_weight} kg</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '20px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 30, color: '#333' }}>
        📊 Reports & Analytics
      </h1>

      {/* Report Type Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
        <button
          onClick={() => generateReport('flight-traffic')}
          style={{
            padding: '40px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ✈️ Flight Traffic Report
        </button>
        <button
          onClick={() => generateReport('employee')}
          style={{
            padding: '40px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          👥 Employee Statistics
        </button>
        <button
          onClick={() => generateReport('passenger')}
          style={{
            padding: '40px 20px',
            backgroundColor: '#ffc107',
            color: '#333',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          🧳 Passenger Traffic
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '48px', marginBottom: 10 }}>⏳</div>
          <div style={{ fontSize: '18px' }}>Generating report...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ padding: 20, backgroundColor: '#ffebee', color: '#c62828', borderRadius: 8 }}>
          Error: {error}
        </div>
      )}

      {/* Report Display */}
      {reportData && !loading && (
        <div style={{ backgroundColor: 'white', padding: 30, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {reportType === 'flight-traffic' && renderFlightTrafficReport()}
          {reportType === 'employee' && renderEmployeeReport()}
          {reportType === 'passenger' && renderPassengerReport()}

          {/* Download PDF Button */}
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <button
              onClick={downloadPDF}
              style={{
                padding: '15px 40px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              📥 Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
