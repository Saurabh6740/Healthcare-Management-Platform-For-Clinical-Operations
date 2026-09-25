import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function AccessDenied({ currentRole, attemptedTab, onReturn }) {
  const defaultDashboard = 
    currentRole === 'Admin' ? 'Admin Overview' :
    currentRole === 'Doctor' ? 'Doctor Clinical Overview' :
    'Patient Health Dashboard';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-rose-200 shadow-xl p-8 space-y-5">
        {/* Security Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div>
          <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-black rounded-full uppercase tracking-wider">
            HTTP 403 • Forbidden
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Access Restricted
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Role-Based Access Control (RBAC) Security Violation
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 text-slate-700">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="font-semibold text-slate-500">Authenticated Role:</span>
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {currentRole}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="font-semibold text-slate-500">Requested Resource:</span>
            <span className="font-mono text-rose-600 font-semibold">{attemptedTab}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-500">Access Policy:</span>
            <span className="text-slate-600 font-medium">Strict Portal Isolation Active</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Each clinical portal (Admin, Doctor, Patient) is strictly sandboxed to prevent HIPAA/GDPR data leakage. You can only view modules authorized for your profile.
        </p>

        <button
          onClick={onReturn}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to {defaultDashboard}</span>
        </button>
      </div>
    </div>
  );
}
