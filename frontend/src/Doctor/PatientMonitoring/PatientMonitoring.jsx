import React from 'react';
import { Users, Heart, Activity, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function PatientMonitoring({ patients, onSelectPatient }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center">
            <Users className="w-6 h-6 text-cyan-400 mr-2.5" />
            Patient Monitoring Roster
          </h2>
          <p className="text-xs text-slate-400 mt-1">Live AI risk scores and telemetry for assigned patients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-cyan-400 font-bold uppercase">{patient.specialtyRequired}</span>
                <h3 className="text-xl font-extrabold text-white">{patient.name}</h3>
                <p className="text-xs text-slate-400">{patient.age} yrs • {patient.gender} • {patient.contact}</p>
              </div>
              <span className={`px-3 py-1 rounded-xl text-xs font-extrabold ${patient.riskScore >= 75 ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400' :
                  patient.riskScore >= 50 ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400' :
                    'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                }`}>
                Risk: {patient.riskScore}% ({patient.riskLevel})
              </span>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Heart Rate:</span>
                <strong className="text-rose-400">{patient.vitals.heartRate} BPM</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Blood Pressure:</span>
                <strong className="text-blue-400">{patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic} mmHg</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>SpO2 Level:</span>
                <strong className="text-cyan-400">{patient.vitals.spo2}%</strong>
              </div>
            </div>

            <button
              onClick={() => onSelectPatient(patient.id)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs border border-slate-700 flex items-center justify-center transition-all"
            >
              <span>View Full Clinical Profile</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
