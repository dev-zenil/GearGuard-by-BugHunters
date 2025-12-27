import React, { useEffect, useState, useLayoutEffect } from 'react';
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

  /* Hide scrollbars globally */
  useLayoutEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * { scrollbar-width: none; -ms-overflow-style: none; }
      *::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchActivities();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('maintenance-created', fetchDashboard);
    socket.on('maintenance-status-updated', fetchDashboard);
    socket.on('low-inventory-alert', fetchDashboard);

    return () => {
      socket.off('maintenance-created');
      socket.off('maintenance-status-updated');
      socket.off('low-inventory-alert');
    };
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const criticalEquipment =
    dashboard?.equipment?.filter(
      eq => eq.condition === 'Poor' || eq.condition === 'Fair'
    ).length || 0;

  const technicianLoadPercent = dashboard?.totalTeamMembers
    ? Math.min(
        100,
        Math.round(
          (dashboard.pendingMaintenance /
            Math.max(dashboard.totalTeamMembers, 1)) *
            100
        )
      )
    : 0;

  const openRequests =
    (dashboard?.pendingMaintenance || 0) +
    (dashboard?.overdueMaintenance || 0);

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 overflow-hidden">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg">
            <p className="text-sm font-semibold mb-2">CRITICAL EQUIPMENT</p>
            <div className="text-4xl font-bold">{criticalEquipment}</div>
            <p className="text-sm mt-1">Poor / Fair condition</p>
          </div>

          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <p className="text-sm font-semibold mb-2">TECHNICIAN LOAD</p>
            <div className="text-4xl font-bold">
              {technicianLoadPercent}%
            </div>
            <div className="mt-3 bg-blue-400 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${technicianLoadPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
            <p className="text-sm font-semibold mb-2">OPEN REQUESTS</p>
            <div className="text-4xl font-bold">{openRequests}</div>
            <p className="text-sm mt-1">
              {dashboard?.pendingMaintenance || 0} Pending •{' '}
              {dashboard?.overdueMaintenance || 0} Overdue
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-6 py-3 font-bold ${
              activeTab === 'equipment'
                ? 'text-blue-600 border-b-4 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            ⚙️ Equipment
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`px-6 py-3 font-bold ${
              activeTab === 'activities'
                ? 'text-blue-600 border-b-4 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            📋 Activities
          </button>
        </div>

        {/* EQUIPMENT TAB */}
        {activeTab === 'equipment' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="card p-4">
              <h3 className="font-bold mb-4">📅 Maintenance Calendar</h3>
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                tileClassName={({ date }) =>
                  dashboard?.upcomingMaintenance?.some(
                    m =>
                      new Date(m.scheduledDate).toDateString() ===
                      date.toDateString()
                  )
                    ? 'bg-yellow-200'
                    : ''
                }
              />
            </div>

            <div className="card p-4">
              <h3 className="font-bold mb-4">🚨 Inventory Status</h3>
              <p>
                Low / Out of Stock:{' '}
                <span className="font-bold text-red-600">
                  {
                    dashboard?.lowInventoryItems?.filter(
                      i =>
                        i.status === 'Low Stock' ||
                        i.status === 'Out of Stock'
                    ).length
                  }
                </span>
              </p>
            </div>
          </div>
        )}

        {/* ACTIVITIES TAB */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            {activities.length === 0 && (
              <div className="text-center text-gray-500">
                No activities yet
              </div>
            )}

            {activities.map(activity => (
              <div
                key={activity._id}
                className="card p-4 flex justify-between"
              >
                <div>
                  <h4 className="font-semibold">
                    {activity.equipment?.assetName ||
                      activity.workspace}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {activity.type} • {activity.priority}
                  </p>
                </div>
                <span className="font-bold">{activity.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
