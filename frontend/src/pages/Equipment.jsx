import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import Header from '../components/Header.jsx';

const Equipment = ({ tab }) => {
  const [equipment, setEquipment] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tab || 'equipment');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [inventoryFilter, setInventoryFilter] = useState('all'); // Filter: all, inStock, lowStock, outOfStock

  useEffect(() => {
    fetchEquipment();
    fetchInventory();
  }, []);

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  const fetchEquipment = async () => {
    try {
      const res = await api.get('/equipment');
      setEquipment(res.data);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = activeTab === 'equipment' ? '/equipment' : '/inventory';
      if (formData._id) {
        await api.put(`${endpoint}/${formData._id}`, formData);
      } else {
        await api.post(endpoint, formData);
      }
      setFormData({});
      setShowForm(false);
      if (activeTab === 'equipment') {
        fetchEquipment();
      } else {
        fetchInventory();
      }
    } catch (err) {
      alert(`Error saving ${activeTab}: ` + err.message);
    }
  };

  const handleDelete = async (id) => {
    const endpoint = activeTab === 'equipment' ? '/equipment' : '/inventory';
    if (window.confirm(`Delete this ${activeTab}?`)) {
      try {
        await api.delete(`${endpoint}/${id}`);
        if (activeTab === 'equipment') {
          fetchEquipment();
        } else {
          fetchInventory();
        }
      } catch (err) {
        alert(`Error deleting ${activeTab}: ` + err.message);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Equipment & Inventory</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => { setActiveTab('equipment'); setShowForm(false); setFormData({}); }}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'equipment'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            🔧 Equipment
          </button>
          <button
            onClick={() => { setActiveTab('inventory'); setShowForm(false); setFormData({}); }}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'inventory'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            📦 Inventory
          </button>
        </div>

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Equipment Management</h2>
              <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                ➕ Add Equipment
              </button>
            </div>

            {showForm && (
              <div className="card mb-8">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Asset Name"
                    value={formData.assetName || ''}
                    onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                    className="w-full p-2 border rounded mb-4"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded mb-4"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Manufacturer"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full p-2 border rounded mb-4"
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2 border rounded mb-4"
                  />
                  <input
                    type="text"
                    placeholder="Serial Number"
                    value={formData.serialNumber || ''}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full p-2 border rounded mb-4"
                  />
                  <div className="flex gap-4">
                    <button type="submit" className="btn btn-success">Save</button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setFormData({}); }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid gap-4">
                {equipment.map((eq) => (
                  <div key={eq._id} className="card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{eq.assetName}</h3>
                        <p className="text-gray-600">{eq.category}</p>
                        <p className="text-sm text-gray-500">Model: {eq.model} | Serial: {eq.serialNumber}</p>
                        <p className={`text-sm font-medium mt-2 ${eq.condition === 'Excellent' ? 'text-green-600' : eq.condition === 'Scrap' ? 'text-red-600' : 'text-yellow-600'}`}>
                          Condition: {eq.condition}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setFormData(eq); setShowForm(true); }}
                          className="btn btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(eq._id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                ➕ Add Item
              </button>
            </div>

            {showForm && (
              <div className="card mb-8">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={formData.itemName || ''}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    className="w-full p-2 border rounded mb-4"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity on Hand"
                    value={formData.quantityOnHand || ''}
                    onChange={(e) => setFormData({ ...formData, quantityOnHand: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded mb-4"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Minimum Threshold"
                    value={formData.minimumThreshold || ''}
                    onChange={(e) => setFormData({ ...formData, minimumThreshold: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded mb-4"
                  />
                  <input
                    type="number"
                    placeholder="Cost Per Unit"
                    value={formData.costPerUnit || ''}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded mb-4"
                  />
                  <select
                    value={formData.status || 'In Stock'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 border rounded mb-4"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                  <div className="flex gap-4">
                    <button type="submit" className="btn btn-success">Save</button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setFormData({}); }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {/* Stock Status Filter */}
                <div className="mb-6 flex gap-3 flex-wrap">
                  <button
                    onClick={() => setInventoryFilter('all')}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      inventoryFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📦 All Items ({inventory.length})
                  </button>
                  <button
                    onClick={() => setInventoryFilter('inStock')}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      inventoryFilter === 'inStock'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    ✅ In Stock ({inventory.filter(i => i.status === 'In Stock').length})
                  </button>
                  <button
                    onClick={() => setInventoryFilter('lowStock')}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      inventoryFilter === 'lowStock'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    🟡 Low Stock ({inventory.filter(i => i.status === 'Low Stock').length})
                  </button>
                  <button
                    onClick={() => setInventoryFilter('outOfStock')}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      inventoryFilter === 'outOfStock'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    🔴 Out of Stock ({inventory.filter(i => i.status === 'Out of Stock').length})
                  </button>
                </div>

                {/* Inventory Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-3 text-left">Item Name</th>
                        <th className="border p-3 text-left">Quantity</th>
                        <th className="border p-3 text-left">Threshold</th>
                        <th className="border p-3 text-left">Status</th>
                        <th className="border p-3 text-left">Cost/Unit</th>
                        <th className="border p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory
                        .filter((item) => {
                          if (inventoryFilter === 'all') return true;
                          if (inventoryFilter === 'inStock') return item.status === 'In Stock';
                          if (inventoryFilter === 'lowStock') return item.status === 'Low Stock';
                          if (inventoryFilter === 'outOfStock') return item.status === 'Out of Stock';
                          return true;
                        })
                        .map((item) => {
                          let statusColor = 'bg-green-50';
                          let statusIcon = '✅';
                          let statusText = 'In Stock';
                          let statusBadge = 'bg-green-100 text-green-800';

                          if (item.status === 'Out of Stock') {
                            statusColor = 'bg-red-50';
                            statusIcon = '🔴';
                            statusText = 'Out of Stock';
                            statusBadge = 'bg-red-100 text-red-800';
                          } else if (item.status === 'Low Stock') {
                            statusColor = 'bg-yellow-50';
                            statusIcon = '🟡';
                            statusText = 'Low Stock';
                            statusBadge = 'bg-yellow-100 text-yellow-800';
                          }

                          return (
                            <tr key={item._id} className={`${statusColor} hover:opacity-75`}>
                              <td className="border p-3 font-medium">{item.itemName}</td>
                              <td className="border p-3 text-center font-semibold">{item.quantityOnHand}</td>
                              <td className="border p-3 text-center text-gray-600">{item.minimumThreshold}</td>
                              <td className="border p-3">
                                <span className={`px-3 py-1 rounded font-semibold text-sm ${statusBadge}`}>
                                  {statusIcon} {statusText}
                                </span>
                              </td>
                              <td className="border p-3">₹{item.costPerUnit || 0}</td>
                              <td className="border p-3 flex gap-2">
                                <button
                                  onClick={() => { setFormData(item); setShowForm(true); }}
                                  className="btn btn-secondary text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="btn btn-danger text-sm"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Equipment;
