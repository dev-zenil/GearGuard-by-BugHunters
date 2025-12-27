import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import Header from '../components/Header.jsx';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [maintenance, setMaintenance] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchMaintenance();
    fetchEquipment();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const res = await api.get('/maintenance');
      setMaintenance(res.data);
    } catch (err) {
      console.error('Failed to fetch maintenance:', err);
    }
  };

  const fetchEquipment = async () => {
    try {
      const res = await api.get('/equipment');
      setEquipment(res.data);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    }
  };

  const getMaintenanceForDate = (selectedDate) => {
    return maintenance.filter(m => {
      const mDate = new Date(m.scheduledDate || m.date);
      return mDate.toDateString() === selectedDate.toDateString();
    });
  };

  const handleScheduleMaintenance = async (e) => {
    e.preventDefault();
    try {
      const data = {
        equipment: formData.equipment,
        scheduledDate: selectedDate,
        type: 'Preventive',
        status: 'New',
        description: formData.description
      };
      await api.post('/maintenance', data);
      setFormData({});
      setShowForm(false);
      fetchMaintenance();
    } catch (err) {
      alert('Error scheduling maintenance: ' + err.message);
    }
  };

  const selectedDateMaintenance = selectedDate ? getMaintenanceForDate(selectedDate) : [];

  // Simple calendar generation
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  
  const calendarDays = [];
  const firstDay = getFirstDay(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Maintenance Calendar</h1>

        <div className="grid grid-cols-2 gap-8">
          <div className="card">
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevMonth}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ← Prev
              </button>
              <h2 className="text-2xl font-bold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={nextMonth}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next →
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => {
                const hasEvent = day && maintenance.some(m => {
                  const mDate = new Date(m.scheduledDate || m.date);
                  return mDate.toDateString() === day.toDateString();
                });
                
                const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
                const isToday = day && day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={idx}
                    onClick={() => day && setSelectedDate(day)}
                    className={`
                      p-3 rounded text-center cursor-pointer transition
                      ${!day ? 'bg-gray-50' : ''}
                      ${isToday ? 'bg-green-200 font-bold' : ''}
                      ${isSelected ? 'bg-blue-500 text-white font-bold' : ''}
                      ${hasEvent && !isSelected && !isToday ? 'bg-yellow-200 font-bold' : ''}
                      ${!day || isToday || isSelected || hasEvent ? '' : 'hover:bg-gray-100'}
                    `}
                  >
                    {day ? (
                      <>
                        <div>{day.getDate()}</div>
                        {hasEvent && <div className="text-xs mt-1">●</div>}
                      </>
                    ) : ''}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            {selectedDate && (
              <>
                <h2 className="font-bold text-xl mb-4">{selectedDate.toDateString()}</h2>
                
                {selectedDateMaintenance.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {selectedDateMaintenance.map(m => (
                      <div key={m._id} className="card">
                        <p className="font-semibold">{m.equipment?.assetName}</p>
                        <p className="text-sm text-gray-600">{m.type} • {m.status}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mb-6">No maintenance scheduled</p>
                )}

                <button
                  onClick={() => setShowForm(!showForm)}
                  className="btn btn-primary w-full mb-4"
                >
                  📅 Schedule Maintenance
                </button>

                {showForm && (
                  <form onSubmit={handleScheduleMaintenance} className="card">
                    <select
                      value={formData.equipment || ''}
                      onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                      className="w-full p-2 border rounded mb-4"
                      required
                    >
                      <option value="">Select Equipment</option>
                      {equipment.map(eq => (
                        <option key={eq._id} value={eq._id}>{eq.assetName}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2 border rounded mb-4"
                      required
                    />
                    <div className="flex gap-4">
                      <button type="submit" className="btn btn-success">Schedule</button>
                      <button
                        type="button"
                        onClick={() => { setShowForm(false); setFormData({}); }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
