import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api.js';
import Header from '../components/Header.jsx';
import { AuthContext } from '../utils/AuthContext.jsx';

const Activity = () => {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    maintenanceCategory: 'Equipment',
    type: 'Preventive',
    priority: 'Moderate',
    status: 'New',
    equipment: '',
    workspace: {
      name: '',
      area: '',
      floor: '',
      location: '',
      description: ''
    },
    team: '',
    technician: '',
    company: '',
    requestDate: new Date().toISOString().split('T')[0],
    scheduledDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchActivities();
    fetchTeams();
    fetchEquipment();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/maintenance');
      setActivities(res.data);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        createdBy: user._id,
        workspace: formData.maintenanceCategory === 'Workspace' ? formData.workspace.name : null
      };

      if (editingId) {
        await api.put(`/maintenance/${editingId}`, submitData);
      } else {
        await api.post('/maintenance', submitData);
      }

      setFormData({
        maintenanceCategory: 'Equipment',
        type: 'Preventive',
        priority: 'Moderate',
        status: 'New',
        equipment: '',
        workspace: { name: '', area: '', floor: '', location: '', description: '' },
        team: '',
        technician: '',
        company: '',
        requestDate: new Date().toISOString().split('T')[0],
        scheduledDate: '',
        notes: ''
      });
      setEditingId(null);
      setShowForm(false);
      fetchActivities();
    } catch (err) {
      alert('Error saving activity: ' + err.message);
    }
  };

  const handleEdit = (activity) => {
    setFormData({
      maintenanceCategory: activity.maintenanceCategory || 'Equipment',
      type: activity.type,
      priority: activity.priority || 'Moderate',
      status: activity.status,
      equipment: activity.equipment?._id || '',
      workspace: {
        name: activity.workspace || '',
        area: '',
        floor: '',
        location: '',
        description: ''
      },
      team: activity.team?._id || '',
      technician: activity.technician?._id || '',
      company: activity.company || '',
      requestDate: activity.requestDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      scheduledDate: activity.scheduledDate?.split('T')[0] || '',
      notes: activity.notes || ''
    });
    setEditingId(activity._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await api.delete(`/maintenance/${id}`);
        fetchActivities();
      } catch (err) {
        alert('Error deleting activity: ' + err.message);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      maintenanceCategory: 'Equipment',
      type: 'Preventive',
      priority: 'Moderate',
      status: 'New',
      equipment: '',
      workspace: { name: '', area: '', floor: '', location: '', description: '' },
      team: '',
      technician: '',
      company: '',
      requestDate: new Date().toISOString().split('T')[0],
      scheduledDate: '',
      notes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Repaired':
        return 'bg-green-100 text-green-800';
      case 'Scrap':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Activities Management</h1>
          <button
            onClick={() => {
              handleCancel();
              setShowForm(!showForm);
            }}
            className="btn btn-primary"
          >
            {showForm ? '✖️ Close' : '➕ Create Activity'}
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Activity' : 'Create New Activity'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Created By, Maintenance Category, Type, Priority */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Created By</label>
                  <input
                    type="text"
                    value={user?.fullName || ''}
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Maintenance For *</label>
                  <select
                    value={formData.maintenanceCategory}
                    onChange={(e) => setFormData({ ...formData, maintenanceCategory: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Workspace">Workspace</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="Preventive">Preventive</option>
                    <option value="Corrective">Corrective</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Equipment/Workspace Selection */}
              {formData.maintenanceCategory === 'Equipment' ? (
                <div>
                  <label className="block text-sm font-bold mb-2">Equipment *</label>
                  <select
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Equipment</option>
                    {equipment.map(eq => (
                      <option key={eq._id} value={eq._id}>{eq.assetName}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="border rounded p-4 bg-blue-50">
                  <h3 className="font-bold mb-4 text-blue-900">Workspace Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Workspace Name *</label>
                      <input
                        type="text"
                        value={formData.workspace.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          workspace: { ...formData.workspace, name: e.target.value }
                        })}
                        placeholder="e.g., Assembly Area A"
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Area/Zone</label>
                      <input
                        type="text"
                        value={formData.workspace.area}
                        onChange={(e) => setFormData({
                          ...formData,
                          workspace: { ...formData.workspace, area: e.target.value }
                        })}
                        placeholder="e.g., Production Floor"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Floor</label>
                      <input
                        type="text"
                        value={formData.workspace.floor}
                        onChange={(e) => setFormData({
                          ...formData,
                          workspace: { ...formData.workspace, floor: e.target.value }
                        })}
                        placeholder="e.g., Floor 2"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.workspace.location}
                        onChange={(e) => setFormData({
                          ...formData,
                          workspace: { ...formData.workspace, location: e.target.value }
                        })}
                        placeholder="e.g., Building B, Wing 3"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold mb-2">Description</label>
                      <textarea
                        value={formData.workspace.description}
                        onChange={(e) => setFormData({
                          ...formData,
                          workspace: { ...formData.workspace, description: e.target.value }
                        })}
                        placeholder="Describe the workspace maintenance needed..."
                        className="w-full p-2 border rounded"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Row 3: Team, Technician, Company */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Team</label>
                  <select
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team._id} value={team._id}>{team.teamName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Technician</label>
                  <input
                    type="text"
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                    placeholder="Technician ID (Coming Soon)"
                    disabled
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Internal/External Vendor"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Row 4: Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Request Date</label>
                  <input
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Scheduled Date</label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold mb-2">Notes/Instructions</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add detailed instructions or notes for this activity..."
                  className="w-full p-2 border rounded"
                  rows="4"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button type="submit" className="btn btn-success flex-1">
                  {editingId ? '✏️ Update Activity' : '➕ Create Activity'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activities List Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="card text-center">
              <p className="text-sm text-gray-600">New</p>
              <p className="text-3xl font-bold text-blue-600">{activities.filter(a => a.status === 'New').length}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">{activities.filter(a => a.status === 'In Progress').length}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{activities.filter(a => a.status === 'Repaired').length}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-purple-600">{activities.length}</p>
            </div>
          </div>

          {activities.length > 0 ? (
            <div className="grid gap-4">
              {activities.map(activity => (
                <div key={activity._id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">
                          {activity.maintenanceCategory === 'Equipment' 
                            ? activity.equipment?.assetName 
                            : activity.workspace}
                        </h3>
                        <span className={`px-3 py-1 rounded text-xs font-bold ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        <span className={`px-3 py-1 rounded text-xs font-bold ${getPriorityColor(activity.priority)}`}>
                          {activity.priority} Priority
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                          <span className="font-semibold">Type:</span> {activity.type}
                        </div>
                        <div>
                          <span className="font-semibold">Category:</span> {activity.maintenanceCategory}
                        </div>
                        <div>
                          <span className="font-semibold">Team:</span> {activity.team?.teamName || 'Not Assigned'}
                        </div>
                        <div>
                          <span className="font-semibold">Company:</span> {activity.company || 'N/A'}
                        </div>
                        <div>
                          <span className="font-semibold">Request Date:</span> {new Date(activity.requestDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-semibold">Scheduled Date:</span> {activity.scheduledDate ? new Date(activity.scheduledDate).toLocaleDateString() : 'Not Scheduled'}
                        </div>
                      </div>
                      {activity.notes && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-700"><span className="font-semibold">Notes:</span> {activity.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(activity._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">No activities yet. Create your first activity!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Activity;
