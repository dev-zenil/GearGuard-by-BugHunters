import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import Header from '../components/Header.jsx';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/inventory/${formData._id}`, formData);
      } else {
        await api.post('/inventory', formData);
      }
      setFormData({});
      setShowForm(false);
      fetchInventory();
    } catch (err) {
      alert('Error saving inventory: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      try {
        await api.delete(`/inventory/${id}`);
        fetchInventory();
      } catch (err) {
        alert('Error deleting item: ' + err.message);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
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
                {inventory.map((item) => {
                  const isLow = item.quantityOnHand < item.minimumThreshold;
                  return (
                    <tr key={item._id} className={isLow ? 'bg-red-50' : ''}>
                      <td className="border p-3">{item.itemName}</td>
                      <td className="border p-3">{item.quantityOnHand}</td>
                      <td className="border p-3">{item.minimumThreshold}</td>
                      <td className="border p-3">
                        <span className={isLow ? 'text-red-600 font-bold' : 'text-green-600'}>
                          {isLow ? '🔴 Low Stock' : '✅ In Stock'}
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
        )}
      </div>
    </>
  );
};

export default Inventory;
