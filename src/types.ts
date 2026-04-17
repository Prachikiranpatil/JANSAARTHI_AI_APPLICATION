export interface CitizenProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  state: string;
  district: string;
  occupation: string;
  annualIncome: number;
  casteCategory: 'General' | 'OBC' | 'SC' | 'ST';
  disabilityStatus: boolean;
  isFarmer: boolean;
  hasBPLCard: boolean;
  mobileNumber: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  department: string;
  category: 'Agriculture' | 'Education' | 'Health' | 'Finance' | 'Employment' | 'Social Welfare';
  eligibilityDescription: string;
  benefits: string[];
  documentsRequired: string[];
  link: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type AppView = 'citizen' | 'intelligence' | 'onboarding';
