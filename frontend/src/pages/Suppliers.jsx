import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import Header from '../components/Header.jsx';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchSuppliers();
    fetchInventory();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
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
      if (formData._id) {
        await api.put(`/suppliers/${formData._id}`, formData);
      } else {
        await api.post('/suppliers', formData);
      }
      setFormData({});
      setShowForm(false);
      fetchSuppliers();
    } catch (err) {
      alert('Error saving supplier: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this supplier?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        fetchSuppliers();
      } catch (err) {
        alert('Error deleting supplier: ' + err.message);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            ➕ Add Supplier
          </button>
        </div>

        {showForm && (
          <div className="card mb-8">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Supplier Name"
                value={formData.supplierName || ''}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                className="w-full p-2 border rounded mb-4"
                required
              />
              <input
                type="text"
                placeholder="Contact Person"
                value={formData.contactPerson || ''}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded mb-4"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            {suppliers.map((supplier) => {
              const supplierInventory = inventory.filter(item => item.supplier === supplier._id);
              const inStock = supplierInventory.filter(i => i.status === 'In Stock').length;
              const lowStock = supplierInventory.filter(i => i.status === 'Low Stock').length;
              const outOfStock = supplierInventory.filter(i => i.status === 'Out of Stock').length;

              return (
                <div key={supplier._id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{supplier.supplierName}</h3>
                      {supplier.contactPerson && <p className="text-gray-600">Contact: {supplier.contactPerson}</p>}
                      {supplier.email && <p className="text-sm text-blue-600">{supplier.email}</p>}
                      {supplier.phone && <p className="text-sm text-gray-600">Tel: {supplier.phone}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setFormData(supplier); setShowForm(true); }}
                        className="btn btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(supplier._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Inventory Status by Supplier */}
                  {supplierInventory.length > 0 && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Items</p>
                        <p className="text-2xl font-bold">{supplierInventory.length}</p>
                      </div>
                      <div className="text-center bg-green-50 rounded p-2">
                        <p className="text-sm text-green-600 font-semibold">In Stock</p>
                        <p className="text-2xl font-bold text-green-600">✅ {inStock}</p>
                      </div>
                      <div className="text-center bg-yellow-50 rounded p-2">
                        <p className="text-sm text-yellow-600 font-semibold">Low Stock</p>
                        <p className="text-2xl font-bold text-yellow-600">🟡 {lowStock}</p>
                      </div>
                      <div className="text-center bg-red-50 rounded p-2">
                        <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
                        <p className="text-2xl font-bold text-red-600">🔴 {outOfStock}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Suppliers;
