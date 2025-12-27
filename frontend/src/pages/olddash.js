import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import Header from '../components/Header.jsx';
import useSocket from '../hooks/useSocket.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('equipment');
  const socket = useSocket();

  useEffect(() => {
    fetchDashboard();
    fetchActivities();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('maintenance-created', fetchDashboard);
      socket.on('maintenance-status-updated', fetchDashboard);
      socket.on('low-inventory-alert', fetchDashboard);
      return () => {
        socket.off('maintenance-created');
        socket.off('maintenance-status-updated');
        socket.off('low-inventory-alert');
      };
    }
  }, [socket]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setDashboard(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await api.get('/maintenance');
      setActivities(res.data);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // Calculate critical equipment (Poor or Fair condition)
  const criticalEquipment = dashboard?.equipment?.filter(eq => 
    eq.condition === 'Poor' || eq.condition === 'Fair'
  )?.length || 0;

  // Calculate technician load % (pending maintenance / total team members * 100)
  const technicianLoadPercent = dashboard?.totalTeamMembers 
    ? Math.min(100, Math.round((dashboard.pendingMaintenance / Math.max(dashboard.totalTeamMembers, 1)) * 100))
    : 0;

  // Calculate open requests (pending + overdue)
  const openRequests = (dashboard?.pendingMaintenance || 0) + (dashboard?.overdueMaintenance || 0);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'equipment'
                ? 'text-blue-600 border-b-4 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            ⚙️ Equipment Overview
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'activities'
                ? 'text-blue-600 border-b-4 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            📋 Activities Overview
          </button>
        </div>

        {/* EQUIPMENT TAB */}
        {activeTab === 'equipment' && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Critical Equipment Card - Red */}
          <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-100 text-sm font-semibold mb-2">CRITICAL EQUIPMENT</p>
                <div className="text-4xl font-bold mb-2">{criticalEquipment}</div>
                <p className="text-red-100 text-sm">Units in Poor/Fair condition</p>
              </div>
              <span className="text-4xl">⚠️</span>
            </div>
          </div>

          {/* Technician Load Card - Blue */}
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-2">TECHNICIAN LOAD</p>
                <div className="text-4xl font-bold mb-2">{technicianLoadPercent}%</div>
                <p className="text-blue-100 text-sm">Utilization</p>
                <div className="mt-3 bg-blue-400 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${technicianLoadPercent}%` }}
                  />
                </div>
              </div>
              <span className="text-4xl">👨‍🔧</span>
            </div>
          </div>

          {/* Open Requests Card - Green */}
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm font-semibold mb-2">OPEN REQUESTS</p>
                <div className="text-4xl font-bold mb-2">{openRequests}</div>
                <p className="text-green-100 text-sm">
                  {dashboard?.pendingMaintenance || 0} Pending • {dashboard?.overdueMaintenance || 0} Overdue
                </p>
              </div>
              <span className="text-4xl">�</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600">{dashboard?.totalEquipment || 0}</div>
            <p className="text-gray-600">Total Equipment</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">{dashboard?.activeEquipment || 0}</div>
            <p className="text-gray-600">Active Equipment</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600">{dashboard?.equipmentInMaintenance || 0}</div>
            <p className="text-gray-600">Under Maintenance</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600">{dashboard?.scrapppedEquipmentCount || 0}</div>
            <p className="text-gray-600">Scrapped</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card">
            <h3 className="font-bold mb-4">⚠️ Alerts</h3>
            <p className="text-lg mb-2">Pending Maintenance: <span className="font-bold text-red-600">{dashboard?.pendingMaintenance || 0}</span></p>
            <p className="text-lg mb-2">Overdue Tasks: <span className="font-bold text-orange-600">{dashboard?.overdueMaintenance || 0}</span></p>
            <p className="text-lg">Inventory Alerts: <span className="font-bold text-purple-600">{dashboard?.lowInventoryItems?.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock')?.length || 0}</span></p>
          </div>
          <div className="card">
            <h3 className="font-bold mb-4">💰 Costs (Last 30 Days)</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Maintenance Cost:</p>
                <p className="text-4xl font-bold text-green-600">₹{(dashboard?.totalMaintenanceCost || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Completed Activities: <span className="font-bold text-blue-600">{dashboard?.completedMaintenance || 0}</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Cost/Activity: <span className="font-bold text-purple-600">₹{(dashboard?.totalMaintenanceCost && dashboard?.completedMaintenance) ? Math.round(dashboard.totalMaintenanceCost / dashboard.completedMaintenance).toLocaleString('en-IN') : '0'}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-bold mb-4">📅 Maintenance Calendar</h3>
            <style>{`
              .react-calendar {
                width: 100%;
                border: none;
                background: transparent;
                font-family: inherit;
              }
              .react-calendar__tile {
                padding: 0.75rem;
                border-radius: 0.375rem;
              }
              .react-calendar__tile--active {
                background-color: #3b82f6;
                color: white;
              }
              .react-calendar__tile:hover {
                background-color: #e5e7eb;
              }
              .react-calendar__tile--hasActive {
                background-color: #fbbf24;
              }
              .react-calendar__tile--now {
                background-color: #10b981;
                color: white;
              }
              .react-calendar__navigation button {
                min-width: 44px;
                background: none;
                border: none;
                cursor: pointer;
                font-weight: bold;
                color: #3b82f6;
              }
              .react-calendar__navigation button:hover {
                background-color: #f3f4f6;
              }
              .react-calendar__month-view__weekdays {
                font-weight: bold;
                color: #6b7280;
                text-transform: uppercase;
                font-size: 0.75rem;
              }
            `}</style>
            <Calendar 
              value={selectedDate}
              onChange={setSelectedDate}
              tileClassName={({ date }) => {
                const hasEvent = dashboard?.upcomingMaintenance?.some(m => 
                  new Date(m.scheduledDate).toDateString() === date.toDateString()
                );
                return hasEvent ? 'react-calendar__tile--hasActive' : '';
              }}
            />
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold text-sm mb-2">📍 Selected Date: {selectedDate.toLocaleDateString()}</h4>
              {dashboard?.upcomingMaintenance?.filter(m => 
                new Date(m.scheduledDate).toDateString() === selectedDate.toDateString()
              ).length > 0 ? (
                <ul className="space-y-2">
                  {dashboard.upcomingMaintenance.filter(m => 
                    new Date(m.scheduledDate).toDateString() === selectedDate.toDateString()
                  ).map(m => (
                    <li key={m._id} className="p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                      <p className="font-semibold text-sm text-blue-900">{m.equipment?.assetName}</p>
                      <p className="text-xs text-blue-700">{m.description || 'No description'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No maintenance scheduled</p>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4">🚨 Inventory Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="font-semibold">✅ In Stock</span>
                <span className="text-lg font-bold text-green-600">{dashboard?.lowInventoryItems?.filter(i => i.status === 'In Stock')?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="font-semibold">🟡 Low Stock</span>
                <span className="text-lg font-bold text-yellow-600">{dashboard?.lowInventoryItems?.filter(i => i.status === 'Low Stock')?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="font-semibold">🔴 Out of Stock</span>
                <span className="text-lg font-bold text-red-600">{dashboard?.lowInventoryItems?.filter(i => i.status === 'Out of Stock')?.length || 0}</span>
              </div>
            </div>
            {dashboard?.lowInventoryItems?.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock')?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs font-semibold text-red-600 mb-2">⚠️ Items Needing Attention:</p>
                <ul className="space-y-1">
                  {dashboard?.lowInventoryItems?.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock')?.slice(0, 3).map(item => (
                    <li key={item.id} className="text-sm">
                      <span className={item.status === 'Out of Stock' ? 'text-red-600' : 'text-yellow-600'}>
                        {item.itemName}: {item.quantity}/{item.threshold}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ACTIVITIES TAB */}
        {activeTab === 'activities' && (
          <div className="space-y-8">
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">📋 Activities Overview</h2>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="card text-center">
                  <p className="text-sm text-gray-600">New</p>
                  <p className="text-3xl font-bold text-blue-600">{activities?.filter(a => a.status === 'New')?.length || 0}</p>
                </div>
                <div className="card text-center">
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-600">{activities?.filter(a => a.status === 'In Progress')?.length || 0}</p>
                </div>
                <div className="card text-center">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{activities?.filter(a => a.status === 'Repaired')?.length || 0}</p>
                </div>
                <div className="card text-center">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-purple-600">{activities?.length || 0}</p>
                </div>
              </div>

              {/* Recent Activities List */}
              {activities && activities.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-semibold mb-3">All Activities:</p>
                  {activities?.map(activity => {
                    const getStatusColor = (status) => {
                      switch (status) {
                        case 'New': return 'bg-blue-100 text-blue-800';
                        case 'In Progress': return 'bg-yellow-100 text-yellow-800';
                        case 'Repaired': return 'bg-green-100 text-green-800';
                        case 'Scrap': return 'bg-red-100 text-red-800';
                        default: return 'bg-gray-100 text-gray-800';
                      }
                    };

                    const getPriorityColor = (priority) => {
                      switch (priority) {
                        case 'High': return 'text-red-600';
                        case 'Moderate': return 'text-yellow-600';
                        case 'Low': return 'text-green-600';
                        default: return 'text-gray-600';
                      }
                    };

                    return (
                      <div key={activity._id} className="card p-4 flex justify-between items-start hover:shadow-md transition">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">
                              {activity.maintenanceCategory === 'Equipment' 
                                ? activity.equipment?.assetName 
                                : activity.workspace}
                            </h4>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-semibold">Type:</span> {activity.type} • <span className={`font-bold ${getPriorityColor(activity.priority)}`}>{activity.priority} Priority</span></p>
                            <p><span className="font-semibold">Team:</span> {activity.team?.teamName || 'Not Assigned'} • <span className="font-semibold">Category:</span> {activity.maintenanceCategory}</p>
                            {activity.scheduledDate && <p><span className="font-semibold">Scheduled:</span> {new Date(activity.scheduledDate).toLocaleDateString()}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="card text-center py-8">
                  <p className="text-gray-500">No activities yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
