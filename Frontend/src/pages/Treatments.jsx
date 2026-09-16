import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  ShieldCheck, 
  PlusCircle, 
  Calendar, 
  Crosshair, 
  AlertCircle,
  Leaf
} from 'lucide-react';

const Treatments = () => {
  const { sidebarOpen } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [treatments, setTreatments] = useState([
    {
      id: 'TRT-101',
      crop: 'Paddy',
      field: 'Field-A (Lowland)',
      productName: 'Tricyclazole 75% WP',
      treatmentType: 'Fungicide',
      target: 'Paddy Blast (Magnaporthe oryzae)',
      method: 'Targeted Spot Spray',
      dosage: '0.6 g/L',
      areaTreated: '0.8 Acres',
      date: '2026-09-02',
      phiDays: 14,
      status: 'In Safety Window (7 days remaining)'
    },
    {
      id: 'TRT-102',
      crop: 'Cotton',
      field: 'Field-B (Upland)',
      productName: 'Neem Oil (10,000 ppm) + Sticky Traps',
      treatmentType: 'Biocontrol',
      target: 'Whiteflies & Early Aphids',
      method: 'Targeted Spot Spray',
      dosage: '2 mL/L',
      areaTreated: '1.2 Acres',
      date: '2026-08-25',
      phiDays: 3,
      status: 'Harvest Safe'
    }
  ]);

  const [formData, setFormData] = useState({
    crop: 'Paddy',
    field: 'Field-A (Lowland)',
    productName: '',
    treatmentType: 'Fungicide',
    target: '',
    method: 'Targeted Spot Spray',
    dosage: '2 g/L',
    areaTreated: '1.0',
    phiDays: 14
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTreatment = (e) => {
    e.preventDefault();
    if (!formData.productName) return;

    const newRecord = {
      id: `TRT-${Math.floor(100 + Math.random() * 900)}`,
      crop: formData.crop,
      field: formData.field,
      productName: formData.productName,
      treatmentType: formData.treatmentType,
      target: formData.target || 'General Foliar Protection',
      method: formData.method,
      dosage: formData.dosage,
      areaTreated: `${formData.areaTreated} Acres`,
      date: new Date().toISOString().split('T')[0],
      phiDays: Number(formData.phiDays),
      status: 'In Safety Window'
    };

    setTreatments(prev => [newRecord, ...prev]);
    setShowModal(false);
    setFormData({
      crop: 'Paddy',
      field: 'Field-A (Lowland)',
      productName: '',
      treatmentType: 'Fungicide',
      target: '',
      method: 'Targeted Spot Spray',
      dosage: '2 g/L',
      areaTreated: '1.0',
      phiDays: 14
    });
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${sidebarOpen ? 'md:pl-64' : 'pl-0'} transition-all duration-300`}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-7 w-7 text-emerald-600" />
              Targeted Treatments & Traceability Log
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Maintain immutable chemical & bio-input records, Pre-Harvest Intervals (PHI), and targeted spot-spray history for supply-chain traceability.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Log Application</span>
          </button>
        </div>

        {/* Traceability Summary Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Chemical Input Reduction</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600">28.5%</span>
              <span className="text-xs text-slate-500">vs Blanket Spraying</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Achieved via localized patch application only on affected canopies.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active PHI Quarantine</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">1 Field</span>
              <span className="text-xs text-slate-500">Under Observation</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Zero residue guarantee for certified grain procurement.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Biocontrol Integration</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">42%</span>
              <span className="text-xs text-slate-500">Organic / Pheromone Ratio</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Encouraging predator insect conservation in farm ecosystem.</p>
          </div>
        </div>

        {/* Treatment History Table */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Application Records & Traceability Ledger</h2>
            <span className="text-xs text-slate-500">{treatments.length} Total Logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Field & Crop</th>
                  <th className="py-3 px-4">Product & Type</th>
                  <th className="py-3 px-4">Target Pest/Disease</th>
                  <th className="py-3 px-4">Method & Dosage</th>
                  <th className="py-3 px-4">Area</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Safety Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {treatments.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">{t.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{t.field}</span>
                      <span className="text-slate-500 text-[11px]">{t.crop}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{t.productName}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{t.treatmentType}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{t.target}</td>
                    <td className="py-3.5 px-4">
                      <span className="block font-medium text-slate-800">{t.method}</span>
                      <span className="text-slate-500 text-[11px]">{t.dosage}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{t.areaTreated}</td>
                    <td className="py-3.5 px-4 text-slate-500">{t.date}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        t.status.includes('Safe') 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Treatment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-1">Log Targeted Application</h3>
              <p className="text-xs text-slate-500 mb-4">Record chemical or biocontrol treatment for harvest safety and audit compliance.</p>

              <form onSubmit={handleAddTreatment} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="e.g. Copper Oxychloride 50% WP"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Treatment Type</label>
                    <select
                      name="treatmentType"
                      value={formData.treatmentType}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    >
                      <option value="Fungicide">Fungicide</option>
                      <option value="Pesticide">Pesticide</option>
                      <option value="Herbicide">Herbicide</option>
                      <option value="Biocontrol">Biocontrol / Organic</option>
                      <option value="Fertilizer">Foliar Nutrient</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Application Method</label>
                    <select
                      name="method"
                      value={formData.method}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    >
                      <option value="Targeted Spot Spray">Targeted Spot Spray</option>
                      <option value="Knapsack Foliar">Knapsack Foliar</option>
                      <option value="Drip Fertigation">Drip Fertigation</option>
                      <option value="Drone Spray">Drone Ultra-Low Volume</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Pest / Disease</label>
                  <input
                    type="text"
                    name="target"
                    value={formData.target}
                    onChange={handleInputChange}
                    placeholder="e.g. Leaf Rust, Sucking Pests"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Treated Area (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="areaTreated"
                      value={formData.areaTreated}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Pre-Harvest Interval (Days)</label>
                    <input
                      type="number"
                      name="phiDays"
                      value={formData.phiDays}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                  >
                    Save Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Treatments;
