import React from 'react';
import { 
  LayoutDashboard, 
  Heart, 
  Smartphone, 
  History, 
  Bell, 
  Pill, 
  User, 
  Settings, 
  LogOut,
  Activity, 
  AlertTriangle, 
  Users, 
  UserCheck, 
  FileText, 
  Sliders,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import MediSphereLogo from './MediSphereLogo';

export default function Sidebar({ currentRole, activeTab, setActiveTab, onLogout }) {
  // Navigation structure with professional clinical & administrative workflow order
  const menuConfig = {
    Patient: [
      { id: 'PatientDashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'MyVitals', label: 'My Vitals', icon: Heart },
      { id: 'PatientCarePlan', label: 'AI Care Plan', icon: FileText },
      { id: 'Medications', label: 'Medications', icon: Pill },
      { id: 'Devices', label: 'Connected Devices', icon: Smartphone },
      { id: 'History', label: 'Medical History', icon: History },
      { id: 'Alerts', label: 'Health Alerts', icon: Bell },
      { id: 'Profile', label: 'Profile', icon: User },
      { id: 'Settings', label: 'Settings', icon: Settings }
    ],
    Doctor: [
      { id: 'DoctorDashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'PatientMonitoring', label: 'Patients', icon: Users },
      { id: 'LiveMonitoring', label: 'Live Monitoring', icon: Activity },
      { id: 'CarePlanManagement', label: 'AI Care Plan', icon: FileText },
      { id: 'OutcomeTracking', label: 'Outcome Tracking', icon: TrendingUp },
      { id: 'AiAnomalyDetection', label: 'AI Anomaly', icon: Activity },
      { id: 'CarePlanDashboard', label: 'Care Plan Dashboard', icon: LayoutDashboard },
      { id: 'Alerts', label: 'Alerts', icon: Bell, alertBadge: 5 },
      { id: 'Analytics', label: 'Analytics', icon: Sliders },
      { id: 'Reports', label: 'Reports', icon: FileText },
      { id: 'DoctorNotifications', label: 'Messages', icon: MessageSquare },
      { id: 'Settings', label: 'Settings', icon: Settings }
    ],
    Admin: [
      { id: 'AdminDashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'ManageDoctors', label: 'Manage Doctors', icon: UserCheck },
      { id: 'ManagePatients', label: 'Manage Patients', icon: Users },
      { id: 'CarePlanDashboard', label: 'Care Plan Dashboard', icon: LayoutDashboard },
      { id: 'AdminAlertManagement', label: 'System Alert Control', icon: Sliders },
      { id: 'Reports', label: 'Analytics & Reports', icon: FileText }
    ]
  };

  const roleStyles = {
    Doctor: {
      badgeText: 'text-blue-400',
      activeButton: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-md shadow-blue-600/30 ring-1 ring-white/10'
    },
    Patient: {
      badgeText: 'text-emerald-400',
      activeButton: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-md shadow-emerald-600/30 ring-1 ring-white/10'
    },
    Admin: {
      badgeText: 'text-purple-400',
      activeButton: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-purple-600/30 ring-1 ring-white/10'
    }
  };

  const currentRoleStyle = roleStyles[currentRole] || roleStyles.Doctor;
  const currentMenu = menuConfig[currentRole] || [];

  return (
    <aside className="w-64 bg-[#0B132B] text-slate-200 flex flex-col justify-between min-h-[calc(100vh-61px)] shadow-xl z-20 select-none border-r border-slate-800/60">
      <div className="p-4 space-y-4">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2 py-1.5">
          <MediSphereLogo className="w-9 h-9" withGlow={true} />
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">MediSphere</h1>
            <p className="text-[10px] text-slate-400 font-medium">Clinical Operations AI</p>
          </div>
        </div>

        {/* Active Role Indicator */}
        <div className="px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-between">
          <span className={`text-[11px] uppercase tracking-wider font-semibold ${currentRoleStyle.badgeText}`}>
            {currentRole} Portal
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 font-medium relative group ${
                  isActive
                    ? `${currentRoleStyle.activeButton} font-semibold`
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
                {item.alertBadge && (
                  <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm shadow-rose-500/50">
                    {item.alertBadge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action at Sidebar Bottom */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

