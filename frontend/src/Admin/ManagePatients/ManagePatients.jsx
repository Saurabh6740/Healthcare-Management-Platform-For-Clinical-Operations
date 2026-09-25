import React, { useState } from 'react';
import { Users, Plus, Search, User, Activity } from 'lucide-react';

export default function ManagePatients({ patients, onAddPatient }) {
  const [showForm, setShowForm] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: 25, gender: 'Male', contact: '', condition: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPatient.name) return;
    onAddPatient({
      id: `pat-${Date.now()}`,
      ...newPatient,
      assignedDoctor: 'Dr. Ramesh Gupta',
      specialtyRequired: 'Cardiology',
      riskScore: 25,
      riskLevel: 'Low',
      vitals: { heartRate: 72, bpSystolic: 120, bpDiastolic: 80, spo2: 98, temperature: 36.8 }
    });
    setNewPatient({ name: '', age: 25, gender: 'Male', contact: '', condition: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center">
            <Users className="w-6 h-6 text-cyan-400 mr-2.5" />
            Manage Patient Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">Onboard patients and assign monitoring sensors</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Patient</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-cyan-500/30 p-6 rounded-2xl space-y-4 shadow-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Patient Onboarding Form</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Patient Full Name"
              value={newPatient.name}
              onChange={e => setNewPatient({...newPatient, name: e.target.value})}
              className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={newPatient.age}
              onChange={e => setNewPatient({...newPatient, age: parseInt(e.target.value) || 0})}
              className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              placeholder="Contact Phone Number"
              value={newPatient.contact}
              onChange={e => setNewPatient({...newPatient, contact: e.target.value})}
              className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              placeholder="Medical Condition (e.g. Hypertension)"
              value={newPatient.condition}
              onChange={e => setNewPatient({...newPatient, condition: e.target.value})}
              className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl font-bold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-xl font-bold">Save Patient</button>
          </div>
        </form>
      )}

      {/* Patient Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
              <th className="p-4">Patient Name</th>
              <th className="p-4">Age / Gender</th>
              <th className="p-4">Condition</th>
              <th className="p-4">Assigned Care Team</th>
              <th className="p-4">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
            {patients.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-white">{p.name}</td>
                <td className="p-4">{p.age} yrs • {p.gender}</td>
                <td className="p-4 text-cyan-300 font-medium">{p.condition || 'General Care'}</td>
                <td className="p-4 text-slate-300">{p.assignedDoctor || 'Dr. Ramesh Gupta'} ({p.specialtyRequired || 'Cardiology'})</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                    (p.riskScore || 0) >= 75 ? 'bg-rose-600 text-white' :
                    (p.riskScore || 0) >= 50 ? 'bg-amber-600 text-white' :
                    'bg-emerald-600 text-white'
                  }`}>
                    {p.riskLevel || 'Normal'} ({p.riskScore || 45}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
