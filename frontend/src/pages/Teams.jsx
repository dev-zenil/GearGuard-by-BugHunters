import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import Header from '../components/Header.jsx';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    teamName: '',
    company: '',
    teamMembers: []
  });

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/equipment'); // Fetch to get users/technicians
      // You might need a separate endpoint for users
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/teams/${editingId}`, formData);
      } else {
        await api.post('/teams', formData);
      }
      setFormData({ teamName: '', company: '', teamMembers: [] });
      setEditingId(null);
      setShowForm(false);
      fetchTeams();
    } catch (err) {
      alert('Error saving team: ' + err.message);
    }
  };

  const handleEdit = (team) => {
    setFormData(team);
    setEditingId(team._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await api.delete(`/teams/${id}`);
        fetchTeams();
      } catch (err) {
        alert('Error deleting team: ' + err.message);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ teamName: '', company: '', teamMembers: [] });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teams Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '✖️ Close' : '➕ Add Team'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Team' : 'Create New Team'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Team Name</label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  placeholder="e.g., Electrical Team"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., ABC Corporation"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Team Members (Coming Soon)</label>
                <p className="text-gray-500 text-sm">Multi-select will be available after user management setup</p>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-success">
                  {editingId ? 'Update Team' : 'Create Team'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Teams List */}
        <div className="grid gap-4">
          {teams.length > 0 ? (
            teams.map(team => (
              <div key={team._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-600">{team.teamName}</h3>
                    <p className="text-gray-600 mt-2">
                      <span className="font-semibold">Company:</span> {team.company}
                    </p>
                    <p className="text-gray-600 mt-1">
                      <span className="font-semibold">Members:</span> {team.teamMembers?.length || 0}
                    </p>
                    {team.teamMembers && team.teamMembers.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="font-semibold text-sm mb-2">Team Members:</p>
                        <div className="space-y-1">
                          {team.teamMembers.map(member => (
                            <p key={member._id} className="text-sm text-gray-700">
                              • {member.fullName} ({member.role})
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(team._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">No teams yet. Create your first team!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Teams;
