import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';
import Header from '../components/Header.jsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [assetPerformance, setAssetPerformance] = useState([]);
  const [inventoryUsage, setInventoryUsage] = useState([]);
  const [maintenanceCosts, setMaintenanceCosts] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('charts'); // 'charts' or 'tables'
  const [inventoryFilter, setInventoryFilter] = useState('all'); // Filter: all, inStock, lowStock, outOfStock

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [perfRes, invRes, costRes, dashRes] = await Promise.all([
        api.get('/reports/asset-performance'),
        api.get('/reports/inventory-usage'),
        api.get('/reports/maintenance-costs'),
        api.get('/dashboard')
      ]);
      setAssetPerformance(perfRes.data);
      setInventoryUsage(invRes.data);
      setMaintenanceCosts(costRes.data);
      setDashboard(dashRes.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Activity Status Pie Chart
  const activityStatusData = {
    labels: ['Open', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Activities',
        data: [
          dashboard?.pendingMaintenance || 0,
          dashboard?.inProgressMaintenance || 0,
          dashboard?.completedMaintenance || 0
        ],
        backgroundColor: [
          '#3B82F6',
          '#A855F7',
          '#10B981'
        ],
        borderColor: ['#1E40AF', '#7C3AED', '#059669'],
        borderWidth: 2
      }
    ]
  };

  // Maintenance Cost Trend Line Chart
  const costTrendData = {
    labels: maintenanceCosts.map(cost => `${cost._id.month}/${cost._id.year}`),
    datasets: [
      {
        label: 'Monthly Maintenance Cost (₹)',
        data: maintenanceCosts.map(cost => cost.totalCost),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#10B981'
      }
    ]
  };

  // Equipment Condition Distribution
  const equipmentConditionData = {
    labels: ['Excellent', 'Good', 'Fair', 'Poor'],
    datasets: [
      {
        label: 'Equipment Count',
        data: [
          dashboard?.equipment?.filter(eq => eq.condition === 'Excellent')?.length || 0,
          dashboard?.equipment?.filter(eq => eq.condition === 'Good')?.length || 0,
          dashboard?.equipment?.filter(eq => eq.condition === 'Fair')?.length || 0,
          dashboard?.equipment?.filter(eq => eq.condition === 'Poor')?.length || 0
        ],
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
          '#EF4444'
        ],
        borderColor: ['#059669', '#1E40AF', '#D97706', '#DC2626'],
        borderWidth: 2
      }
    ]
  };

  // Inventory Status Distribution
  const inventoryStatusData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        label: 'Items',
        data: [
          inventoryUsage?.filter(item => item.status === 'In Stock')?.length || 0,
          inventoryUsage?.filter(item => item.status === 'Low Stock')?.length || 0,
          inventoryUsage?.filter(item => item.status === 'Out of Stock')?.length || 0
        ],
        backgroundColor: [
          '#10B981',
          '#F59E0B',
          '#EF4444'
        ],
        borderColor: ['#059669', '#D97706', '#DC2626'],
        borderWidth: 2
      }
    ]
  };

  // Asset Reliability Scores Bar Chart
  const reliabilityData = {
    labels: assetPerformance.slice(0, 6).map(asset => asset.assetName),
    datasets: [
      {
        label: 'Reliability Score (%)',
        data: assetPerformance.slice(0, 6).map(asset => asset.reliabilityScore),
        backgroundColor: '#8B5CF6',
        borderColor: '#6D28D9',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📊 Reports & Analytics</h1>
          <div className="flex gap-2 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('charts')}
              className={`px-4 py-2 rounded font-semibold transition ${
                viewMode === 'charts'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📊 Charts
            </button>
            <button
              onClick={() => setViewMode('tables')}
              className={`px-4 py-2 rounded font-semibold transition ${
                viewMode === 'tables'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📋 Tables
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-screen">Loading reports...</div>
        ) : (
          <>
            {/* KPI Cards - Always visible */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600">{dashboard?.pendingMaintenance || 0}</div>
                <p className="text-gray-600 text-sm mt-2">Open Activities</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-purple-600">{dashboard?.inProgressMaintenance || 0}</div>
                <p className="text-gray-600 text-sm mt-2">In Progress</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-600">{dashboard?.completedMaintenance || 0}</div>
                <p className="text-gray-600 text-sm mt-2">Completed</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-red-600">{dashboard?.overdueMaintenance || 0}</div>
                <p className="text-gray-600 text-sm mt-2">Overdue</p>
              </div>
            </div>

            {/* CHARTS VIEW */}
            {viewMode === 'charts' && (
              <>
                {/* Charts Row 1 */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Activity Status Pie Chart */}
                  <div className="card">
                    <h3 className="text-xl font-bold mb-4">📋 Activity Status Distribution</h3>
                    <div className="flex justify-center">
                      <div style={{ maxWidth: '300px', width: '100%' }}>
                        <Pie data={activityStatusData} options={chartOptions} />
                      </div>
                    </div>
                  </div>

                  {/* Equipment Condition Bar Chart */}
                  <div className="card">
                    <h3 className="text-xl font-bold mb-4">⚙️ Equipment Condition Status</h3>
                    <Bar data={equipmentConditionData} options={chartOptions} />
                  </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Maintenance Cost Trend */}
                  <div className="card">
                    <h3 className="text-xl font-bold mb-4">💰 Monthly Cost Trend</h3>
                    <Line data={costTrendData} options={chartOptions} />
                  </div>

                  {/* Inventory Status Doughnut */}
                  <div className="card">
                    <h3 className="text-xl font-bold mb-4">📦 Inventory Status</h3>
                    <div className="flex justify-center">
                      <div style={{ maxWidth: '300px', width: '100%' }}>
                        <Doughnut data={inventoryStatusData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asset Reliability Chart */}
                <div className="card mb-8">
                  <h3 className="text-xl font-bold mb-4">🎯 Asset Reliability Scores</h3>
                  <Bar data={reliabilityData} options={chartOptions} />
                </div>
              </>
            )}

            {/* TABLES VIEW */}
            {viewMode === 'tables' && (
              <>
                {/* Maintenance Costs Summary */}
                <div className="card mb-12">
                  <h2 className="text-2xl font-bold mb-4">💰 Maintenance Costs Summary</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {maintenanceCosts.map((cost) => (
                      <div key={`${cost._id.year}-${cost._id.month}`} className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600 font-semibold">{cost._id.month}/{cost._id.year}</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">₹{cost.totalCost.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500 mt-1">{cost.count} maintenance records</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inventory Stock Status Summary */}
                <div className="card mb-12">
                  <h2 className="text-2xl font-bold mb-4">📦 Stock Status Summary</h2>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
                      <p className="text-sm text-green-600 font-semibold mb-2">In Stock</p>
                      <p className="text-4xl font-bold text-green-600">✅ {inventoryUsage.filter(i => i.status === 'In Stock').length}</p>
                      <p className="text-xs text-gray-600 mt-2">Ready for use</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border-2 border-yellow-200">
                      <p className="text-sm text-yellow-600 font-semibold mb-2">Low Stock</p>
                      <p className="text-4xl font-bold text-yellow-600">🟡 {inventoryUsage.filter(i => i.status === 'Low Stock').length}</p>
                      <p className="text-xs text-gray-600 mt-2">Reorder soon</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border-2 border-red-200">
                      <p className="text-sm text-red-600 font-semibold mb-2">Out of Stock</p>
                      <p className="text-4xl font-bold text-red-600">🔴 {inventoryUsage.filter(i => i.status === 'Out of Stock').length}</p>
                      <p className="text-xs text-gray-600 mt-2">Urgent action needed</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Asset Performance Table */}
            {viewMode === 'tables' && (
              <div className="card mb-12">
                <h2 className="text-2xl font-bold mb-4">📊 Asset Performance Details</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-200">
                        <th className="border p-3 text-left">Asset Name</th>
                        <th className="border p-3 text-left">Condition</th>
                        <th className="border p-3 text-left">Total Maintenance</th>
                        <th className="border p-3 text-left">Preventive</th>
                        <th className="border p-3 text-left">Corrective</th>
                        <th className="border p-3 text-left">Reliability %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetPerformance.map((asset) => (
                        <tr key={asset._id} className="hover:bg-gray-50">
                          <td className="border p-3 font-medium">{asset.assetName}</td>
                          <td className="border p-3">
                            <span className={`px-2 py-1 rounded text-sm font-semibold ${
                              asset.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                              asset.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                              asset.condition === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {asset.condition}
                            </span>
                          </td>
                          <td className="border p-3 text-center font-bold">{asset.totalMaintenance}</td>
                          <td className="border p-3 text-center text-green-600">{asset.preventiveMaintenance}</td>
                          <td className="border p-3 text-center text-red-600">{asset.correctiveMaintenance}</td>
                          <td className="border p-3 text-center font-bold text-purple-600">{asset.reliabilityScore}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Inventory Usage Table */}
            {viewMode === 'tables' && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">📦 Inventory Usage Details</h2>
                
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
                    📦 All Items ({inventoryUsage.length})
                  </button>
                  <button
                    onClick={() => setInventoryFilter('inStock')}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      inventoryFilter === 'inStock'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    ✅ In Stock ({inventoryUsage.filter(i => i.status === 'In Stock').length})
                  </button>
                  <button
                    onClick={() => setInventoryFilter('lowStock')}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      inventoryFilter === 'lowStock'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    🟡 Low Stock ({inventoryUsage.filter(i => i.status === 'Low Stock').length})
                  </button>
                  <button
                    onClick={() => setInventoryFilter('outOfStock')}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      inventoryFilter === 'outOfStock'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    🔴 Out of Stock ({inventoryUsage.filter(i => i.status === 'Out of Stock').length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-green-200">
                        <th className="border p-3 text-left">Item Name</th>
                        <th className="border p-3 text-left">On Hand</th>
                        <th className="border p-3 text-left">Threshold</th>
                        <th className="border p-3 text-left">Status</th>
                        <th className="border p-3 text-left">Cost/Unit</th>
                        <th className="border p-3 text-left">Supplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryUsage
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
                              <td className="border p-3">{item.supplier || '-'}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Reports;
