import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import Header from '../components/Header.jsx';
import useSocket from '../hooks/useSocket.js';

const KanbanBoard = () => {
  const [board, setBoard] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    fetchBoard();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('maintenance-status-updated', fetchBoard);
      socket.on('maintenance-created', fetchBoard);
      return () => {
        socket.off('maintenance-status-updated');
        socket.off('maintenance-created');
      };
    }
  }, [socket]);

  const fetchBoard = async () => {
    try {
      const res = await api.get('/maintenance/kanban/board');
      setBoard(res.data);
    } catch (err) {
      console.error('Failed to fetch Kanban board:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (maintenanceId, newStatus) => {
    try {
      await api.put(`/maintenance/${maintenanceId}`, { status: newStatus });
      socket?.emit('update-maintenance-status', { maintenanceId, newStatus });
      fetchBoard();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const statuses = ['New', 'In Progress', 'Repaired', 'Scrap'];

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Status Board</h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {statuses.map((status) => (
              <div key={status} className="bg-gray-100 p-4 rounded min-h-screen">
                <h2 className="font-bold text-lg mb-4 p-2 bg-gray-300 rounded">{status}</h2>
                <div className="space-y-3">
                  {board[status]?.map((maintenance) => (
                    <div
                      key={maintenance._id}
                      className="bg-white p-3 rounded shadow cursor-pointer hover:shadow-lg transition"
                      onClick={() => setSelectedMaintenance(maintenance)}
                    >
                      <p className="font-semibold text-sm">{maintenance.equipment?.assetName}</p>
                      <p className="text-xs text-gray-600 mb-2">
                        {maintenance.type} • {new Date(maintenance.date).toLocaleDateString()}
                      </p>
                      {maintenance.technician && (
                        <p className="text-xs text-gray-500">👨‍🔧 {maintenance.technician?.fullName}</p>
                      )}
                      {maintenance.cost && (
                        <p className="text-xs text-green-600 mt-2">💰 ₹{maintenance.cost}</p>
                      )}
                      
                      {status !== 'Repaired' && status !== 'Scrap' && (
                        <div className="mt-3 flex gap-2">
                          {status === 'New' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(maintenance._id, 'In Progress');
                              }}
                              className="text-xs btn btn-primary py-1 px-2"
                            >
                              Start
                            </button>
                          )}
                          {status === 'In Progress' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(maintenance._id, 'Repaired');
                                }}
                                className="text-xs btn btn-success py-1 px-2"
                              >
                                Complete
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(maintenance._id, 'Scrap');
                                }}
                                className="text-xs btn btn-danger py-1 px-2"
                              >
                                Scrap
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMaintenance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={() => setSelectedMaintenance(null)}>
            <div className="card w-96" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-bold text-lg mb-4">{selectedMaintenance.equipment?.assetName}</h2>
              <p><strong>Type:</strong> {selectedMaintenance.type}</p>
              <p><strong>Status:</strong> {selectedMaintenance.status}</p>
              <p><strong>Description:</strong> {selectedMaintenance.description}</p>
              {selectedMaintenance.cost && <p><strong>Cost:</strong> ₹{selectedMaintenance.cost}</p>}
              <button onClick={() => setSelectedMaintenance(null)} className="mt-4 btn btn-secondary w-full">Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default KanbanBoard;
