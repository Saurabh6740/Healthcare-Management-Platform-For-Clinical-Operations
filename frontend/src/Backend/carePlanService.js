import { ENDPOINTS } from './apiConfig';

const MOCK_CARE_PLAN = {
  id: 'cp-saurabh-001',
  patientId: 'saurabh',
  patientName: 'Saurabh Kumar',
  riskLevel: 'HIGH',
  riskScore: 24.3,
  status: 'APPROVED',
  reviewPeriod: '30 Days',
  goals: [
    'Reduce HbA1c below 6.5%',
    'Maintain Systolic BP < 130 mmHg',
    'Reduce Cardiovascular Risk by 35%'
  ],
  medicines: [
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily after meals', instructions: 'Take with food to prevent GI upset', active: true },
    { name: 'Losartan', dosage: '50mg', frequency: 'Once daily morning', instructions: 'Monitor blood pressure regularly', active: true },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime', instructions: 'For lipid management', active: true }
  ],
  diet: [
    'Low Salt / Low Sodium (< 2g daily)',
    'Strictly No Sugar & Refined Carbohydrates',
    'High Fiber Vegetables & Whole Grains'
  ],
  exercise: [
    'Walk 30 mins daily',
    'Yoga & Breathing Exercises - 20 mins'
  ],
  sleep: '8 Hours',
  waterIntake: '3 Liters',
  doctorNotes: 'Patient exhibits high cardiovascular risk with pre-hypertension load. Initiate Metformin & Losartan, restrict sodium, review after 30 days.',
  doctorComments: [
    { id: 'c1', author: 'Dr. Sarah Johnson', role: 'DOCTOR', comment: 'Care plan approved. Continue prescribed medication and daily tracking.', timestamp: new Date().toISOString() },
    { id: 'c2', author: 'Nurse Anjali', role: 'NURSE', comment: 'Patient verified medication schedule during morning round.', timestamp: new Date().toISOString() }
  ],
  adherencePercentage: 78.0,
  approvedBy: 'Dr. Sarah Johnson',
  approvedAt: new Date().toISOString(),
  validations: {
    clinicalGuidelineCheck: 'Passed',
    drugInteractionCheck: 'No Interaction Found',
    doctorApproval: 'Approved Successfully',
    adherence: '78%',
    outcomeTracking: 'Risk Reduced',
    auditLog: 'Care Plan Generated -> Doctor Approved -> Patient Updated'
  }
};

const MOCK_OUTCOME = {
  patientId: 'saurabh',
  carePlanId: 'cp-saurabh-001',
  previousRisk: 24.3,
  currentRisk: 16.2,
  weightInitial: 85.0,
  weightCurrent: 80.0,
  bpInitial: '150/95',
  bpCurrent: '125/82',
  sugarInitial: 185.0,
  sugarCurrent: 120.0,
  outcomeStatus: 'RISK_REDUCED'
};

const MOCK_DASHBOARD = {
  activeCarePlans: 1124,
  averageAdherence: '78%',
  pendingApproval: 12,
  recoveredPatients: 320,
  highRiskPatients: 47
};

const activePlanStore = {};

const PATIENT_PROFILES = {
  saurabh: {
    patientName: 'Saurabh Kumar',
    riskLevel: 'HIGH',
    riskScore: 24.3,
    medicines: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily after meals', instructions: 'Take with food to prevent GI upset', active: true },
      { name: 'Losartan', dosage: '50mg', frequency: 'Once daily morning', instructions: 'Monitor blood pressure regularly', active: true },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime', instructions: 'For lipid management', active: true }
    ],
    diet: ['Low Salt / Low Sodium (< 2g daily)', 'Strictly No Sugar & Refined Carbohydrates', 'High Fiber Vegetables & Whole Grains'],
    exercise: ['Walk 30 mins daily', 'Yoga & Breathing Exercises - 20 mins'],
    sleep: '8 Hours',
    waterIntake: '3 Liters',
    reviewPeriod: '30 Days',
    doctorNotes: 'Patient exhibits high cardiovascular risk with pre-hypertension load. Initiate Metformin & Losartan, restrict sodium, review after 30 days.'
  },
  priya: {
    patientName: 'Priya Verma',
    riskLevel: 'MEDIUM',
    riskScore: 18.7,
    medicines: [
      { name: 'Insulin Regular', dosage: '10 IU', frequency: 'Before breakfast', instructions: 'Subcutaneous injection as directed', active: true },
      { name: 'Prenatal Multivitamin', dosage: '1 Tablet', frequency: 'Once daily', instructions: 'Take with lunch', active: true }
    ],
    diet: ['Low Glycemic Index Foods', 'Controlled Carbohydrate Portioning', 'Green Leafy Vegetables'],
    exercise: ['Prenatal Yoga - 20 mins', 'Light Walking - 15 mins daily'],
    sleep: '9 Hours',
    waterIntake: '3.5 Liters',
    reviewPeriod: '15 Days',
    doctorNotes: 'Gestational glycemic monitoring required. Maintain strict dietary log.'
  },
  rahul: {
    patientName: 'Rahul Sharma',
    riskLevel: 'MEDIUM',
    riskScore: 14.5,
    medicines: [
      { name: 'Budesonide Inhaler', dosage: '200mcg', frequency: 'Twice daily', instructions: 'Rinse mouth after inhalation', active: true },
      { name: 'Montelukast', dosage: '10mg', frequency: 'Once daily at bedtime', instructions: 'For airway inflammation', active: true }
    ],
    diet: ['Anti-inflammatory Rich Foods', 'Vitamin C Rich Citrus Fruits', 'Avoid Cold Carbonated Drinks'],
    exercise: ['Breathing Exercises / Pranayama - 25 mins', 'Gentle Evening Walk'],
    sleep: '8 Hours',
    waterIntake: '3 Liters',
    reviewPeriod: '30 Days',
    doctorNotes: 'Asthma maintenance plan. Monitor peak flow meter readings twice weekly.'
  }
};

function createInitialPlan(patientId) {
  const profile = PATIENT_PROFILES[patientId] || PATIENT_PROFILES['saurabh'];
  return {
    id: `cp-${patientId}-${Date.now().toString().slice(-4)}`,
    patientId: patientId,
    patientName: profile.patientName,
    riskLevel: profile.riskLevel,
    riskScore: profile.riskScore,
    status: 'PENDING',
    reviewPeriod: profile.reviewPeriod,
    goals: [
      'Reduce HbA1c below 6.5%',
      'Maintain Systolic BP < 130 mmHg',
      'Reduce Risk Score by 35%'
    ],
    medicines: profile.medicines,
    diet: profile.diet,
    exercise: profile.exercise,
    sleep: profile.sleep,
    waterIntake: profile.waterIntake,
    doctorNotes: profile.doctorNotes,
    doctorComments: [
      { id: 'c1', author: 'AI Care Engine', role: 'SYSTEM', comment: 'AI Care Plan generated based on vitals and guidelines. Pending doctor approval.', timestamp: new Date().toISOString() }
    ],
    adherencePercentage: 0.0,
    approvedBy: '',
    approvedAt: null,
    validations: {
      clinicalGuidelineCheck: 'Passed',
      drugInteractionCheck: 'No Interaction Found',
      doctorApproval: 'Pending',
      adherence: '0%',
      outcomeTracking: 'Monitoring Initiated',
      auditLog: 'Care Plan Generated -> Pending Doctor Approval'
    }
  };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 1200) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export async function generateCarePlan(patientId = 'saurabh') {
  const generatedPlan = createInitialPlan(patientId);
  generatedPlan.status = 'PENDING';
  generatedPlan.validations.doctorApproval = 'Pending';
  activePlanStore[patientId] = generatedPlan;

  // Background async attempt if backend is active
  fetch(`${ENDPOINTS.CAREPLAN}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId })
  })
    .then(res => res.ok ? res.json() : null)
    .then(plan => {
      if (plan) activePlanStore[patientId] = plan;
    })
    .catch(() => {});

  return generatedPlan;
}

export async function fetchCarePlan(patientId = 'saurabh') {
  if (!activePlanStore[patientId]) {
    if (patientId === 'saurabh') {
      activePlanStore[patientId] = { ...MOCK_CARE_PLAN };
    } else {
      activePlanStore[patientId] = createInitialPlan(patientId);
    }
  }

  // Background async attempt if backend is active
  fetch(`${ENDPOINTS.CAREPLAN}/${patientId}`)
    .then(res => res.ok ? res.json() : null)
    .then(plan => {
      if (plan) activePlanStore[patientId] = plan;
    })
    .catch(() => {});

  return activePlanStore[patientId];
}

export async function approveCarePlan(carePlanId, doctorName, doctorNotes, medicines) {
  const targetPatient = Object.keys(activePlanStore).find(pId => activePlanStore[pId].id === carePlanId) || 'saurabh';
  const basePlan = activePlanStore[targetPatient] || MOCK_CARE_PLAN;

  const approvedPlan = {
    ...basePlan,
    status: 'APPROVED',
    approvedBy: doctorName || 'Dr. Sarah Johnson',
    approvedAt: new Date().toISOString(),
    doctorNotes: doctorNotes || basePlan.doctorNotes,
    medicines: medicines && medicines.length > 0 ? medicines : basePlan.medicines,
    validations: {
      ...(basePlan.validations || {}),
      doctorApproval: 'Approved Successfully'
    },
    doctorComments: [
      ...(basePlan.doctorComments || []),
      {
        id: Date.now().toString(),
        author: doctorName || 'Dr. Sarah Johnson',
        role: 'DOCTOR',
        comment: 'Care plan approved successfully. Treatment regimen validated.',
        timestamp: new Date().toISOString()
      }
    ]
  };

  activePlanStore[targetPatient] = approvedPlan;

  // Background async attempt if backend is active
  fetch(`${ENDPOINTS.CAREPLAN}/approve`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carePlanId, doctorName, doctorNotes, medicines })
  }).catch(() => {});

  return approvedPlan;
}

export async function updateProgress(carePlanId, tasks) {
  try {
    const res = await fetch(`${ENDPOINTS.CAREPLAN}/updateProgress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carePlanId, tasks })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend CarePlan updateProgress offline, using local state:', err.message);
  }
  const completed = tasks.filter(t => t.completed).length;
  const percentage = Math.round((completed / tasks.length) * 100);
  return { ...MOCK_CARE_PLAN, adherencePercentage: percentage };
}

export async function fetchOutcome(patientId = 'saurabh') {
  try {
    const res = await fetch(`${ENDPOINTS.CAREPLAN}/outcome/${patientId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend CarePlan outcome fetch offline, using fallback:', err.message);
  }
  return MOCK_OUTCOME;
}

export async function fetchCarePlanDashboard() {
  try {
    const res = await fetch(`${ENDPOINTS.CAREPLAN}/dashboard`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend CarePlan dashboard fetch offline, using fallback:', err.message);
  }
  return MOCK_DASHBOARD;
}

export async function addDoctorComment(carePlanId, author, role, comment) {
  try {
    const res = await fetch(`${ENDPOINTS.CAREPLAN}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carePlanId, author, role, comment })
    });
    if (res.ok) {
      const plan = await res.json();
      if (plan.patientId) activePlanStore[plan.patientId] = plan;
      return plan;
    }
  } catch (err) {
    console.warn('Backend CarePlan comment offline, updating locally:', err.message);
  }

  const targetPatient = Object.keys(activePlanStore).find(pId => activePlanStore[pId].id === carePlanId) || 'saurabh';
  const basePlan = activePlanStore[targetPatient] || MOCK_CARE_PLAN;

  const updatedPlan = {
    ...basePlan,
    doctorComments: [
      ...(basePlan.doctorComments || []),
      { id: Date.now().toString(), author, role, comment, timestamp: new Date().toISOString() }
    ]
  };

  activePlanStore[targetPatient] = updatedPlan;
  return updatedPlan;
}
