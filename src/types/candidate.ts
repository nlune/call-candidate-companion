
export type EvaluationStatus = 'pass' | 'fail' | 'pending';

export interface Candidate {
  id: string;
  name: string;
  summary: string;
  jobAppliedFor: string;
  status: EvaluationStatus;
  phone: string;
  email: string;
}
