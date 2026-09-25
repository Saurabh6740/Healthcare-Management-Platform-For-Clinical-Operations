import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CriticalAlertModal from './components/CriticalAlertModal';
import LoginPage from './components/LoginPage';
import AccessDenied from './components/AccessDenied';

// Services
import { fetchDoctors } from './Backend/doctorService';
import { fetchPatients } from './Backend/patientService';
import { fetchAlerts } from './Backend/alertService';
import { vitalsStream } from './Kafka/vitalsStream';
import { processVitalsForAnomalies } from './AI/anomalyDetector';
import { getCurrentSession, logoutUser, hasRolePermission } from './Backend/authService';

// Doctor Pages
import DoctorDashboard from './Doctor/Dashboard/DoctorDashboard';
import LiveMonitoring from './Doctor/LiveMonitoring/LiveMonitoring';
import AiAnomalyDetection from './Doctor/AIAnomaly/AiAnomalyDetection';
import AlertManagement from './Doctor/Alerts/AlertManagement';
import AlertHistory from './Doctor/AlertHistory/AlertHistory';
import DoctorNotifications from './Doctor/Notifications/DoctorNotifications';
import PatientMonitoring from './Doctor/PatientMonitoring/PatientMonitoring';
import DoctorAnalytics from './Doctor/Analytics/DoctorAnalytics';
import DoctorSettings from './Doctor/Settings/DoctorSettings';

// Patient Pages
import PatientDashboard from './Patient/Dashboard/PatientDashboard';
import MyVitals from './Patient/MyVitals/MyVitals';
import ConnectedDevices from './Patient/Devices/ConnectedDevices';
import MedicalHistory from './Patient/History/MedicalHistory';
import PatientAlerts from './Patient/Alerts/PatientAlerts';
import PatientMedications from './Patient/Medications/PatientMedications';
import PatientProfile from './Patient/Profile/PatientProfile';
import PatientSettings from './Patient/Settings/PatientSettings';

// Milestone 4 Care Plan Pages
import CarePlanManagement from './Doctor/CarePlan/CarePlanManagement';
import PatientCarePlanView from './Patient/CarePlan/PatientCarePlanView';
import OutcomeTracking from './Doctor/CarePlan/OutcomeTracking';
import CarePlanDashboard from './Doctor/CarePlan/CarePlanDashboard';

// Admin Pages
import AdminDashboard from './Admin/Dashboard/AdminDashboard';
import ManageDoctors from './Admin/ManageDoctors/ManageDoctors';
import ManagePatients from './Admin/ManagePatients/ManagePatients';
import AdminAlertManagement from './Admin/AlertManagement/AdminAlertManagement';
import Reports from './Admin/Reports/Reports';

export default function App() {
  // Authentication & Session State with Persistent Restore
  const [currentUser, setCurrentUser] = useState(() => getCurrentSession());
  const [currentRole, setCurrentRole] = useState(() => {
    const session = getCurrentSession();
    return session?.role || 'Doctor';
  });
  const [activeTab, setActiveTab] = useState(() => {
    const session = getCurrentSession();
    if (session?.role === 'Admin') return 'AdminDashboard';
    if (session?.role === 'Patient') return 'PatientDashboard';
    return 'DoctorDashboard';
  });

  // Application State
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'CRITICAL', title: 'Critical SpO2 & AFib Alert', message: 'Saurabh Kumar: SpO2 dropped to 89%, HR 145 BPM.', time: 'Just now' },
    { id: 2, type: 'ALERT', title: 'Hypertension Spike', message: 'Priya Verma: BP reached 148/94 mmHg.', time: '15 mins ago' }
  ]);

  // Telemetry Stream State
  const [currentVitals, setCurrentVitals] = useState({
    heartRate: 72,
    bpSystolic: 124,
    bpDiastolic: 82,
    spo2: 98,
    temperature: 36.8,
    timestamp: new Date().toLocaleTimeString()
  });

  const [vitalsHistory, setVitalsHistory] = useState([
    { timestamp: '10:00 AM', heartRate: 72, bpSystolic: 120 },
    { timestamp: '10:15 AM', heartRate: 75, bpSystolic: 122 },
    { timestamp: '10:30 AM', heartRate: 78, bpSystolic: 125 }
  ]);

  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [riskScore, setRiskScore] = useState(25);
  const [riskLevel, setRiskLevel] = useState('Low');
  const [activeCriticalModalAlert, setActiveCriticalModalAlert] = useState(null);
  const [selectedPatientForAnomaly, setSelectedPatientForAnomaly] = useState(null);

  // Initial Data Fetch & URL Check
  useEffect(() => {
    if (window.location.search.includes('logout=true')) {
      logoutUser();
      setCurrentUser(null);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    fetchDoctors().then(setDoctors);
    fetchPatients().then(setPatients);
    fetchAlerts().then(setAlerts);
  }, []);

  // Handle Login and Direct Portal Routing
  const handleLogin = (userCredentials) => {
    setCurrentUser(userCredentials);
    setCurrentRole(userCredentials.role);

    // Direct user strictly to their authorized portal
    if (userCredentials.role === 'Admin') {
      setActiveTab('AdminDashboard');
    } else if (userCredentials.role === 'Patient') {
      setActiveTab('PatientDashboard');
    } else {
      setActiveTab('DoctorDashboard');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Kafka Vitals Subscriber
  useEffect(() => {
    if (!isLiveStreaming || !currentUser) return;
    vitalsStream.startSimulation();

    const unsubscribe = vitalsStream.subscribe(async (payload) => {
      setCurrentVitals(payload);

      setVitalsHistory(prev => {
        const next = [...prev, { timestamp: payload.timestamp, heartRate: payload.heartRate, bpSystolic: payload.bpSystolic }];
        return next.slice(-12);
      });

      // AI Anomaly Processing
      const result = await processVitalsForAnomalies(payload);
      setRiskScore(result.riskScore);
      setRiskLevel(result.riskLevel);

      if (result.isAnomalyDetected && result.alerts.length > 0) {
        const newAlert = result.alerts[0];
        setAlerts(prev => [newAlert, ...prev.filter(a => a.id !== newAlert.id)]);

        if (newAlert.severity === 'Critical') {
          setActiveCriticalModalAlert(newAlert);
        }
      }
    });

    return () => {
      unsubscribe();
      vitalsStream.stopSimulation();
    };
  }, [isLiveStreaming, currentUser]);

  // Alert Actions
  const handleAcknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: 'Dr. Ramesh Gupta', acknowledgedAt: new Date().toLocaleTimeString() } : a));
    if (activeCriticalModalAlert && activeCriticalModalAlert.id === alertId) {
      setActiveCriticalModalAlert(null);
    }
  };

  const handleCloseAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'CLOSED' } : a));
  };

  const triggerSimulatedSpike = () => {
    const spikePayload = {
      topic: 'vitals-stream',
      patientId: 'saurabh',
      patientName: 'Saurabh Kumar',
      heartRate: 148,
      bpSystolic: 165,
      bpDiastolic: 102,
      spo2: 88,
      temperature: 38.6,
      timestamp: new Date().toLocaleTimeString()
    };
    setCurrentVitals(spikePayload);
    
    const criticalAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      patientId: 'saurabh',
      patientName: 'Saurabh Kumar',
      type: 'AFib Spike & Oxygen Drop (SpO2 88%)',
      severity: 'Critical',
      vitalsTrigger: spikePayload,
      detectedAt: new Date().toLocaleString(),
      assignedSpecialty: 'Cardiology',
      assignedDoctor: 'Dr. Ramesh Gupta',
      routedTo: ['Dr. Ramesh Gupta (Cardiologist)', 'ICU Staff Nurse Duty', 'Patient Emergency Contact'],
      status: 'ACTIVE'
    };

    setAlerts(prev => [criticalAlert, ...prev]);
    setActiveCriticalModalAlert(criticalAlert);
  };

  // Render Login Page if user is not authenticated
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} doctors={doctors} patients={patients} />;
  }

  // Authorization Check
  const isAuthorized = hasRolePermission(currentRole, activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        activeAlertsCount={alerts.filter(a => a.status === 'ACTIVE').length}
        isLiveStreaming={isLiveStreaming}
        toggleLiveStream={() => setIsLiveStreaming(!isLiveStreaming)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Menu */}
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-100 min-h-[calc(100vh-61px)] max-w-7xl mx-auto w-full">
          {/* RBAC Authorization Guard: Prevent Cross-Portal Access */}
          {!isAuthorized ? (
            <AccessDenied
              currentRole={currentRole}
              attemptedTab={activeTab}
              onReturn={() => {
                if (currentRole === 'Admin') setActiveTab('AdminDashboard');
                else if (currentRole === 'Patient') setActiveTab('PatientDashboard');
                else setActiveTab('DoctorDashboard');
              }}
            />
          ) : (
            <>
              {/* Doctor Portal */}
              {currentRole === 'Doctor' && (
                <>
                  {activeTab === 'CarePlanManagement' && (
                    <CarePlanManagement />
                  )}

                  {activeTab === 'OutcomeTracking' && (
                    <OutcomeTracking />
                  )}

                  {activeTab === 'CarePlanDashboard' && (
                    <CarePlanDashboard />
                  )}

                  {activeTab === 'DoctorDashboard' && (
                    <DoctorDashboard
                      patients={patients}
                      alerts={alerts}
                      notifications={notifications}
                      onSelectTab={setActiveTab}
                      onSelectPatient={(pat) => {
                        setSelectedPatientForAnomaly(pat);
                        setActiveTab('AiAnomalyDetection');
                      }}
                    />
                  )}

                  {activeTab === 'AiAnomalyDetection' && (
                    <AiAnomalyDetection
                      patient={selectedPatientForAnomaly}
                      onBack={() => setActiveTab('DoctorDashboard')}
                    />
                  )}

                  {activeTab === 'LiveMonitoring' && (
                    <LiveMonitoring
                      currentVitals={currentVitals}
                      vitalsHistory={vitalsHistory}
                      isAutoRefresh={isLiveStreaming}
                      toggleAutoRefresh={() => setIsLiveStreaming(!isLiveStreaming)}
                      triggerSimulatedSpike={triggerSimulatedSpike}
                    />
                  )}

                  {activeTab === 'Alerts' && (
                    <AlertManagement
                      alerts={alerts}
                      onAcknowledgeAlert={handleAcknowledgeAlert}
                      onCloseAlert={handleCloseAlert}
                    />
                  )}

                  {activeTab === 'AlertHistory' && (
                    <AlertHistory alerts={alerts} />
                  )}

                  {activeTab === 'DoctorNotifications' && (
                    <DoctorNotifications notifications={notifications} />
                  )}

                  {activeTab === 'PatientMonitoring' && (
                    <PatientMonitoring
                      patients={patients}
                      onSelectPatient={() => setActiveTab('LiveMonitoring')}
                    />
                  )}

                  {activeTab === 'Reports' && (
                    <Reports />
                  )}

                  {activeTab === 'Analytics' && (
                    <DoctorAnalytics patients={patients} alerts={alerts} />
                  )}

                  {activeTab === 'Settings' && (
                    <DoctorSettings />
                  )}
                </>
              )}

              {/* Patient Portal */}
              {currentRole === 'Patient' && (
                <>
                  {activeTab === 'PatientDashboard' && (
                    <PatientDashboard
                      vitals={currentVitals}
                      riskScore={riskScore}
                      riskLevel={riskLevel}
                      vitalsHistory={vitalsHistory}
                      onEmergencyTrigger={triggerSimulatedSpike}
                      patientName={currentUser?.name || "Patient"}
                      currentUser={currentUser}
                    />
                  )}

                  {activeTab === 'PatientCarePlan' && (
                    <PatientCarePlanView />
                  )}

                  {activeTab === 'MyVitals' && (
                    <MyVitals vitals={currentVitals} currentUser={currentUser} />
                  )}

                  {activeTab === 'Devices' && (
                    <ConnectedDevices patientName={currentUser?.name || "Patient"} currentUser={currentUser} />
                  )}

                  {activeTab === 'History' && (
                    <MedicalHistory currentUser={currentUser} />
                  )}

                  {activeTab === 'Alerts' && (
                    <PatientAlerts alerts={alerts} currentUser={currentUser} />
                  )}

                  {activeTab === 'Medications' && (
                    <PatientMedications currentUser={currentUser} />
                  )}

                  {activeTab === 'Profile' && (
                    <PatientProfile patientName={currentUser?.name || "Patient"} currentUser={currentUser} />
                  )}

                  {activeTab === 'Settings' && (
                    <PatientSettings currentUser={currentUser} />
                  )}
                </>
              )}

              {/* Admin Portal */}
              {currentRole === 'Admin' && (
                <>
                  {activeTab === 'AdminDashboard' && (
                    <AdminDashboard
                      doctors={doctors}
                      patients={patients}
                      alerts={alerts}
                      onSelectTab={setActiveTab}
                    />
                  )}

                  {activeTab === 'CarePlanDashboard' && (
                    <CarePlanDashboard />
                  )}

                  {activeTab === 'ManageDoctors' && (
                    <ManageDoctors
                      doctors={doctors}
                      onAddDoctor={doc => setDoctors(prev => [...prev, doc])}
                    />
                  )}

                  {activeTab === 'ManagePatients' && (
                    <ManagePatients
                      patients={patients}
                      onAddPatient={pat => setPatients(prev => [...prev, pat])}
                    />
                  )}

                  {activeTab === 'AdminAlertManagement' && (
                    <AdminAlertManagement />
                  )}

                  {activeTab === 'Reports' && (
                    <Reports />
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Critical Alert Modal Popup */}
      <CriticalAlertModal
        alert={activeCriticalModalAlert}
        onClose={() => setActiveCriticalModalAlert(null)}
        onAcknowledge={handleAcknowledgeAlert}
      />
    </div>
  );
}
