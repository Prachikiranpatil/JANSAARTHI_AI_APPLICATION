import { Scheme } from '../types';

export const NATIONAL_SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-Kisan Samman Nidhi',
    description: 'Direct income support of ₹6,000 per year to small and marginal farmer families.',
    department: 'Ministry of Agriculture',
    category: 'Agriculture',
    eligibilityDescription: 'Small and marginal farmers with land up to 2 hectares.',
    benefits: ['₹6,000 per year in three installments'],
    documentsRequired: ['Aadhaar Card', 'Land holding documents', 'Bank account details'],
    link: 'https://pmkisan.gov.in/'
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat (PM-JAY)',
    description: 'World\'s largest health insurance scheme providing ₹5 lakh cover per family per year.',
    department: 'National Health Authority',
    category: 'Health',
    eligibilityDescription: 'Low-income families listed in SECC 2011 data.',
    benefits: ['₹5 Lakh hospital cover', 'Cashless treatment'],
    documentsRequired: ['Ayushman Card / Ration Card', 'Aadhaar'],
    link: 'https://pmjay.gov.in/'
  },
  {
    id: 'mgnrega',
    name: 'MGNREGA',
    description: 'Guarantee of at least 100 days of wage employment in a financial year to every household.',
    department: 'Ministry of Rural Development',
    category: 'Employment',
    eligibilityDescription: 'Adult members of a rural household.',
    benefits: ['100 days guaranteed wage employment', 'Unemployment allowance if work not provided'],
    documentsRequired: ['Job Card', 'Aadhaar'],
    link: 'https://nrega.nic.in/'
  },
  {
    id: 'pm-mudra',
    name: 'Pradhan Mantri MUDRA Yojana',
    description: 'Providing loans up to 10 lakh to non-corporate, non-farm small/micro enterprises.',
    department: 'Department of Financial Services',
    category: 'Finance',
    eligibilityDescription: 'Small entrepreneurs, shopkeepers, service providers.',
    benefits: ['Loans up to ₹10 Lakh', 'No collateral for micro-business'],
    documentsRequired: ['Business Plan', 'Identity Proof', 'Bank statement'],
    link: 'https://www.mudra.org.in/'
  },
  {
    id: 'pm-awas',
    name: 'PM Awas Yojana (Gramin)',
    description: 'Providing financial assistance for construction of pucca houses to homeless and those living in dilapidated houses.',
    department: 'Ministry of Rural Development',
    category: 'Social Welfare',
    eligibilityDescription: 'Homeless households, households with 0, 1 or 2 rooms with kutcha walls and kutcha roof.',
    benefits: ['₹1.2 - ₹1.3 Lakh financial assistance for house construction'],
    documentsRequired: ['BPL Card', 'Aadhaar Card', 'Job card'],
    link: 'https://pmayg.nic.in/'
  }
];
