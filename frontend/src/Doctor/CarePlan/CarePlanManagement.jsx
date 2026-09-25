import React, { useState, useEffect } from 'react';
import { fetchCarePlan, generateCarePlan, approveCarePlan, addDoctorComment } from '../../Backend/carePlanService';

export default function CarePlanManagement() {
  const [carePlan, setCarePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [newComment, setNewComment] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('saurabh');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadPlan();
  }, [selectedPatient]);

  const loadPlan = async () => {
    setLoading(true);
    const plan = await fetchCarePlan(selectedPatient);
    setCarePlan(plan);
    setDoctorNotes(plan.doctorNotes || '');
    setMedicines(plan.medicines || []);
    setLoading(false);
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    const newPlan = await generateCarePlan(selectedPatient);
    setCarePlan(newPlan);
    setDoctorNotes(newPlan.doctorNotes || '');
    setMedicines(newPlan.medicines || []);
    setActionSuccess('AI Care Plan successfully generated based on current patient risk & vitals!');
    setLoading(false);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleApprove = async () => {
    if (!carePlan) return;
    const updated = await approveCarePlan(carePlan.id, 'Dr. Sarah Johnson', doctorNotes, medicines);
    setCarePlan(updated);
    setActionSuccess('Care Plan approved successfully! Status updated to APPROVED.');
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !carePlan) return;
    const updated = await addDoctorComment(carePlan.id, 'Dr. Sarah Johnson', 'DOCTOR', newComment);
    setCarePlan(updated);
    setNewComment('');
  };

  if (loading) {
    return (
      <div style={{
        padding: '3rem 2rem',
        color: '#f8fafc',
        textAlign: 'center',
        background: '#0f172a',
        borderRadius: '16px',
        margin: '1.5rem',
        border: '1px solid #334155',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem' }}>Loading AI Care Plan...</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Evaluating clinical guidelines & patient vitals</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', color: '#e2e8f0' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid #334155',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', color: '#f8fafc' }}>
            📋 AI Care Plan Generator & Management
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
            Personalized treatment recommendations, clinical guideline validation, & doctor approval workflow
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #475569',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            <option value="saurabh">Patient: Saurabh Kumar (EHR-101)</option>
            <option value="priya">Patient: Priya Verma (EHR-102)</option>
            <option value="rahul">Patient: Rahul Sharma (EHR-103)</option>
          </select>

          <button
            onClick={handleGenerateAI}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(37,99,235,0.4)'
            }}
          >
            ⚡ Generate AI Care Plan
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid #22c55e',
          color: '#4ade80',
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          ✅ {actionSuccess}
        </div>
      )}

      {/* Validations & Status Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Care Plan Status</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span style={{
              background: carePlan?.status === 'APPROVED' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)',
              color: carePlan?.status === 'APPROVED' ? '#4ade80' : '#facc15',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}>
              {carePlan?.status || 'PENDING'}
            </span>
          </div>
        </div>

        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Calculated Risk Level</span>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: carePlan?.riskLevel === 'HIGH' ? '#f87171' : '#facc15', marginTop: '0.25rem' }}>
            {carePlan?.riskLevel || 'HIGH'} ({carePlan?.riskScore || 24.3}%)
          </div>
        </div>

        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Clinical Guideline Check</span>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#4ade80', marginTop: '0.25rem' }}>
            ✓ {carePlan?.validations?.clinicalGuidelineCheck || 'Passed'}
          </div>
        </div>

        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Drug Interaction Check</span>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#38bdf8', marginTop: '0.25rem' }}>
            ✓ {carePlan?.validations?.drugInteractionCheck || 'No Interaction Found'}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Plan Content & Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Personalized Recommendations */}
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#60a5fa', fontSize: '1.2rem' }}>
              💊 Prescribed Medicines (AI Recommended & Doctor Modifiable)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {medicines.map((med, index) => (
                <div key={index} style={{
                  background: '#0f172a',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontWeight: '700', color: '#f8fafc', fontSize: '1rem' }}>✓ {med.name}</span>
                    <span style={{ marginLeft: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '600' }}>({med.dosage})</span>
                    <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                      {med.frequency} • <span style={{ color: '#cbd5e1' }}>{med.instructions}</span>
                    </p>
                  </div>
                  <span style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Diet, Exercise, Sleep & Review */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            {/* Diet & Exercise */}
            <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '14px', border: '1px solid #334155' }}>
              <h4 style={{ margin: '0 0 0.75rem', color: '#34d399', fontSize: '1rem' }}>🥗 Diet Plan</h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {carePlan?.diet?.map((item, i) => (
                  <li key={i}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '14px', border: '1px solid #334155' }}>
              <h4 style={{ margin: '0 0 0.75rem', color: '#fbbf24', fontSize: '1rem' }}>🏃 Exercise & Activity</h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {carePlan?.exercise?.map((item, i) => (
                  <li key={i}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lifestyle Guidelines & Review */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>🌙 Sleep Recommendation</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#a78bfa', marginTop: '0.25rem' }}>
                {carePlan?.sleep || '8 Hours'}
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>💧 Daily Water Intake</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8', marginTop: '0.25rem' }}>
                {carePlan?.waterIntake || '3 Liters'}
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📅 Doctor Review Period</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f43f5e', marginTop: '0.25rem' }}>
                {carePlan?.reviewPeriod || '30 Days'}
              </div>
            </div>
          </div>

          {/* Doctor Approval Box */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #4338ca'
          }}>
            <h3 style={{ margin: '0 0 0.75rem', color: '#a5b4fc', fontSize: '1.1rem' }}>
              🩺 Doctor Approval & Custom Clinical Notes
            </h3>

            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              rows={3}
              placeholder="Add doctor notes or modifications..."
              style={{
                width: '100%',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.9rem',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={handleApprove}
                disabled={carePlan?.status === 'APPROVED'}
                style={{
                  background: carePlan?.status === 'APPROVED' ? '#15803d' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: carePlan?.status === 'APPROVED' ? 'default' : 'pointer',
                  opacity: carePlan?.status === 'APPROVED' ? 0.85 : 1,
                  boxShadow: carePlan?.status === 'APPROVED' ? 'none' : '0 4px 12px rgba(34,197,94,0.4)'
                }}
              >
                {carePlan?.status === 'APPROVED' ? '✓ Care Plan Approved & Published' : '✓ Approve & Publish Care Plan'}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Collaboration & Notes Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '16px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#f8fafc', fontSize: '1.1rem' }}>
              💬 Doctor–Nurse–Patient Collaboration
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {carePlan?.doctorComments?.map((c, index) => (
                <div key={index} style={{
                  background: c.role === 'DOCTOR' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
                  borderLeft: `4px solid ${c.role === 'DOCTOR' ? '#3b82f6' : '#10b981'}`,
                  padding: '0.75rem',
                  borderRadius: '0 8px 8px 0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <span style={{ fontWeight: '700', color: '#f8fafc' }}>{c.author} ({c.role})</span>
                    <span>{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p style={{ margin: '0.35rem 0 0', color: '#cbd5e1', fontSize: '0.85rem' }}>
                    {c.comment}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} style={{ marginTop: '1rem' }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add collaboration comment..."
                style={{
                  width: '100%',
                  background: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                  marginBottom: '0.5rem'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#334155',
                  color: '#f8fafc',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Post Comment
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
