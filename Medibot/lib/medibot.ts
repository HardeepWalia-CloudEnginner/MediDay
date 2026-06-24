import { SourceCitation, UserRole, ChatMessage, User } from './types';

// Mock medical documents database - organized by collection type
const MEDICAL_DOCUMENTS: Record<string, Record<string, { content: string; role: UserRole[] }>> = {
  // GENERAL - All roles
  'Hospital HR Handbook': {
    'Staff Leave Policy': {
      content: 'Staff leave policies include annual leave (20 days), sick leave (10 days), maternal leave (90 days), and emergency leave as per hospital guidelines. All leave requests must be submitted through the HR portal.',
      role: ['doctor', 'nurse', 'billing_executive', 'technician', 'admin'],
    },
    'Code of Conduct': {
      content: 'All staff must maintain professional standards, dress code, punctuality, and ethical behavior. Violation of code of conduct may result in disciplinary action up to termination.',
      role: ['doctor', 'nurse', 'billing_executive', 'technician', 'admin'],
    },
  },
  'General FAQs': {
    'Hospital Information': {
      content: 'Our hospital operates 24/7 with emergency, outpatient, and inpatient services. Contact HR for any general inquiries. Employee benefits include health insurance, pension, and wellness programs.',
      role: ['doctor', 'nurse', 'billing_executive', 'technician', 'admin'],
    },
    'Facility Access': {
      content: 'All staff require valid ID badges for facility access. Visitor policies require sign-in at the main desk. Emergency exits are marked throughout the facility.',
      role: ['doctor', 'nurse', 'billing_executive', 'technician', 'admin'],
    },
  },

  // CLINICAL - Doctor, Admin
  'Clinical Treatment Protocols': {
    'Standard Treatment Guidelines': {
      content: 'Treatment protocols are evidence-based and reviewed quarterly. Physicians must follow established protocols for common conditions. Deviations require documentation and approval from Medical Director.',
      role: ['doctor', 'admin'],
    },
    'Hypertension Management': {
      content: 'First-line agents: ACE inhibitors or ARBs. Target BP <130/80. Monitor electrolytes and renal function. Follow-up in 2 weeks after initiation.',
      role: ['doctor', 'admin'],
    },
    'Diabetes Protocol': {
      content: 'HbA1c target <7% for most patients. Metformin is first-line agent. Monitor for complications: neuropathy, nephropathy, retinopathy. Annual screening recommended.',
      role: ['doctor', 'admin'],
    },
  },
  'Drug Formulary': {
    'Approved Medications': {
      content: 'Hospital maintains a standardized drug formulary. Only approved medications can be prescribed. Off-formulary drugs require prior authorization from pharmacy director.',
      role: ['doctor', 'admin'],
    },
    'Antibiotic Guidelines': {
      content: 'Empiric antibiotics: Cephalosporins for most infections, Fluoroquinolones for respiratory. Culture-directed therapy preferred. Review antibiogram before prescribing.',
      role: ['doctor', 'admin'],
    },
  },
  'Diagnostic Reference': {
    'Lab Values': {
      content: 'Normal ranges: Hemoglobin 12-16 g/dL, WBC 4.5-11K/μL, Platelets 150-400K/μL, Glucose 70-100 mg/dL (fasting), Creatinine 0.7-1.3 mg/dL.',
      role: ['doctor', 'admin'],
    },
    'Imaging Protocols': {
      content: 'Chest X-ray: routine imaging for respiratory complaints. CT chest: for PE/pneumonia complications. MRI: neurological cases. Always confirm patient ID and indication before ordering.',
      role: ['doctor', 'admin'],
    },
  },

  // NURSING - Nurse, Doctor, Admin
  'Nursing Procedures': {
    'ICU Procedures': {
      content: 'ICU admission requires physician order. Continuous monitoring of vitals. Central line care: sterile dressing changes every 48 hours. Document all interventions in real-time.',
      role: ['nurse', 'doctor', 'admin'],
    },
    'Medication Administration': {
      content: 'Follow 5 rights: right patient, drug, dose, time, route. IV medications require verification by second nurse. Chart all medications immediately after administration.',
      role: ['nurse', 'doctor', 'admin'],
    },
    'Patient Assessment': {
      content: 'Perform head-to-toe assessment on admission and q4h. Assess pain on 0-10 scale. Monitor vital signs q15min initially, then q1h for stable patients. Report changes to physician.',
      role: ['nurse', 'doctor', 'admin'],
    },
  },
  'Infection Control Guidelines': {
    'Standard Precautions': {
      content: 'Use hand hygiene before and after patient contact. Wear PPE based on exposure risk: gloves for blood/body fluids, masks for respiratory symptoms. Clean environment per protocol.',
      role: ['nurse', 'doctor', 'admin'],
    },
    'Isolation Procedures': {
      content: 'COVID-19: Droplet precautions, N95 masks, hand hygiene. TB: Airborne precautions, respiratory isolation. Measure: Private room, negative pressure preferred, restricted visitor access.',
      role: ['nurse', 'doctor', 'admin'],
    },
    'Bloodborne Pathogen Protocol': {
      content: 'All staff handling blood/body fluids must be vaccinated against Hepatitis B. Needlestick injuries: Wash immediately, report to occupational health. Follow post-exposure prophylaxis if needed.',
      role: ['nurse', 'doctor', 'admin'],
    },
  },

  // BILLING - Billing Executive, Admin
  'Insurance Billing Codes': {
    'ICD-10 Coding': {
      content: 'ICD-10 codes are required for all diagnoses. Primary code must reflect chief complaint. Secondary codes for comorbidities. Use 7th character where applicable for specificity.',
      role: ['billing_executive', 'admin'],
    },
    'CPT Codes': {
      content: 'CPT codes (Current Procedural Terminology) identify services and procedures. Modifier 25 needed when significant, separately identifiable E/M service performed. Bundle rules apply.',
      role: ['billing_executive', 'admin'],
    },
    'Common Code Examples': {
      content: 'Hypertension: I10. Type 2 Diabetes: E11.9. Office visit (new): 99203. Office visit (established): 99213. Emergency visit: 99281-99285 based on complexity.',
      role: ['billing_executive', 'admin'],
    },
  },
  'Claim Submission Guide': {
    'Insurance Authorization': {
      content: 'Obtain pre-authorization for elective procedures. Emergency cases: submit within 72 hours. Missing auth may result in claim denial. Always verify patient insurance before service.',
      role: ['billing_executive', 'admin'],
    },
    'Claim Filing Process': {
      content: 'Submit claims electronically within 14 days of service. Include: diagnosis codes, procedure codes, provider NPI, patient insurance details. Track claim status via payer portal.',
      role: ['billing_executive', 'admin'],
    },
    'Denial Management': {
      content: 'Common denials: invalid diagnosis code, non-covered service, eligibility issue. Appeal within 90 days with supporting documentation. Request medical records if peer-to-peer needed.',
      role: ['billing_executive', 'admin'],
    },
  },

  // EQUIPMENT - Technician, Admin
  'Equipment Operation Manual': {
    'ECG Machine': {
      content: 'ECG calibration: Run daily diagnostic check. Lead placement: RA-LL, LA-LL standard. Patient prep: skin prep with alcohol, wait 30 seconds. Maintenance: Replace electrodes monthly.',
      role: ['technician', 'admin'],
    },
    'Ventilator': {
      content: 'Pre-use: Check battery backup, oxygen source, connections. Settings: FiO2, respiratory rate, tidal volume per protocol. Alarms: Check CO2, pressure limits. Clean daily with hospital disinfectant.',
      role: ['technician', 'admin'],
    },
    'Infusion Pumps': {
      content: 'Daily: Test free-flow valve, alarm sounds. Weekly: Prime lines, check tubing compatibility. Monthly: Calibration verification. Report any errors immediately to biomedical team.',
      role: ['technician', 'admin'],
    },
  },
  'Maintenance Schedules': {
    'Preventive Maintenance': {
      content: 'All equipment requires preventive maintenance per manufacturer guidelines. Daily checks: function tests. Weekly: cleaning and inspection. Monthly: performance verification. Quarterly: calibration.',
      role: ['technician', 'admin'],
    },
    'Calibration Schedule': {
      content: 'Scales: monthly. Thermometers: quarterly. BP monitors: semi-annually. Defibrillators: annually. Lab analyzers: per manufacturer specs (usually daily). Document all calibrations.',
      role: ['technician', 'admin'],
    },
    'Maintenance Log': {
      content: 'Record all maintenance in facility management system. Include: date, equipment ID, work performed, technician name, time spent. Alert: Equipment out-of-service until clearance given.',
      role: ['technician', 'admin'],
    },
  },
};

// Mock retrieval data
export interface RetrievalResult {
  query: string;
  retrievalType: 'Hybrid RAG' | 'SQL RAG';
  citations: SourceCitation[];
  response: string;
}

export function retrieveDocuments(query: string, userRole: UserRole): RetrievalResult {
  const keywords = query.toLowerCase().split(' ');
  const results: SourceCitation[] = [];
  let retrievalType: 'Hybrid RAG' | 'SQL RAG' = Math.random() > 0.5 ? 'Hybrid RAG' : 'SQL RAG';

  // Search through documents
  for (const [docName, sections] of Object.entries(MEDICAL_DOCUMENTS)) {
    for (const [sectionTitle, { content, role }] of Object.entries(sections)) {
      // Check if user has access to this section
      if (!role.includes(userRole)) continue;

      // Check if any keyword matches
      const contentLower = content.toLowerCase();
      if (keywords.some(kw => contentLower.includes(kw) && kw.length > 2)) {
        results.push({
          documentName: docName,
          sectionTitle: sectionTitle,
          content: content,
        });
      }
    }
  }

  // If no results found, provide general information
  if (results.length === 0) {
    results.push({
      documentName: 'System Documentation',
      sectionTitle: 'General Information',
      content: `I found information related to "${query}" in the system. Based on your ${userRole} role, you have access to relevant medical and operational guidelines.`,
    });
  }

  return {
    query,
    retrievalType,
    citations: results,
    response: generateResponse(query, results, userRole),
  };
}

function generateResponse(query: string, citations: SourceCitation[], userRole: UserRole): string {
  const responses: Record<string, string> = {
    doctor:
      `Based on clinical protocols and treatment guidelines, I've found ${citations.length} relevant source(s). This information covers diagnosis, treatment protocols, nursing procedures, and clinical guidelines relevant to your query.`,
    nurse:
      `Based on nursing procedures and infection control guidelines, I've found ${citations.length} relevant source(s). This covers ICU procedures, patient assessment, medication administration, and infection prevention.`,
    billing_executive:
      `Based on billing and insurance documentation, I've found ${citations.length} relevant source(s). This includes coding references, claim submission procedures, and reimbursement guidelines.`,
    technician:
      `Based on equipment manuals and maintenance schedules, I've found ${citations.length} relevant source(s). This covers equipment operation, calibration, preventive maintenance, and safety procedures.`,
    admin:
      `As an administrator with full access, I've retrieved ${citations.length} relevant source(s) from all hospital departments and systems relevant to your query.`,
  };

  return responses[userRole] || 'I have retrieved information relevant to your query. Please review the source citations below.';
}

export function generateBotMessage(query: string, userRole: UserRole): ChatMessage {
  const retrieval = retrieveDocuments(query, userRole);

  return {
    id: `msg-${Date.now()}`,
    sender: 'bot',
    content: retrieval.response,
    timestamp: new Date(),
    retrievalType: retrieval.retrievalType,
    citations: retrieval.citations,
  };
}

// Call external FastAPI endpoint to generate bot message
export async function generateBotMessageFromApi(query: string, user: User): Promise<ChatMessage> {
  const url = 'http://127.0.0.1:8000/api/v1/ingestrequest/query';
  const body = {
    query,
    user,
    history: [],
    max_citations: 5,
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`API error ${res.status}: ${text}`);
    }
    const data = await res.json();

    // Expecting { answer, retrieval_type, citations: [{document_name, section_title, content, source_url}], confidence?, follow_up? }
    const citations: SourceCitation[] = (data.citations || []).map((c: any) => ({
      documentName: c.document_name || c.documentName || 'Unknown',
      sectionTitle: c.section_title || c.sectionTitle || 'Unknown',
      content: c.content || '',
      sourceUrl: c.source_url || c.sourceUrl,
    }));

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      content: data.answer || data.response || 'No response from server',
      timestamp: new Date(),
      retrievalType: data.retrieval_type || data.retrievalType || 'Hybrid RAG',
      citations,
    };

    return message;
  } catch (err: any) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      content: `Error contacting backend: ${err?.message || String(err)}`,
      timestamp: new Date(),
      retrievalType: 'Hybrid RAG',
      citations: [],
    };
  }
}
