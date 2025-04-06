
import { Candidate, EvaluationStatus } from '@/types/candidate';
import { toast } from 'sonner';

// Mock data for candidates
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'John Smith',
    summary: 'Experienced frontend developer with 5 years of React experience.',
    jobAppliedFor: 'Senior Frontend Developer',
    status: 'pending',
    phone: '+1-555-123-4567',
    email: 'john.smith@example.com'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    summary: 'Full-stack developer specializing in Node.js and React.',
    jobAppliedFor: 'Full Stack Engineer',
    status: 'pass',
    phone: '+1-555-987-6543',
    email: 'sarah.j@example.com'
  },
  {
    id: '3',
    name: 'Michael Brown',
    summary: 'Backend developer with expertise in Python and Django.',
    jobAppliedFor: 'Backend Developer',
    status: 'fail',
    phone: '+1-555-456-7890',
    email: 'michael.b@example.com'
  },
  {
    id: '4',
    name: 'Emily Davis',
    summary: 'UX/UI designer with a strong portfolio of mobile apps.',
    jobAppliedFor: 'Senior UX Designer',
    status: 'pending',
    phone: '+1-555-789-0123',
    email: 'emily.d@example.com'
  },
  {
    id: '5',
    name: 'Alex Wilson',
    summary: 'DevOps engineer with experience in AWS and Kubernetes.',
    jobAppliedFor: 'DevOps Engineer',
    status: 'pass',
    phone: '+1-555-234-5678',
    email: 'alex.w@example.com'
  },
  {
    id: '6',
    name: 'Jessica Taylor',
    summary: 'Product manager with background in agile methodologies.',
    jobAppliedFor: 'Product Manager',
    status: 'pending',
    phone: '+1-555-345-6789',
    email: 'jessica.t@example.com'
  }
];

export const getCandidates = async (): Promise<Candidate[]> => {
  // Simulate API call with a delay
  return new Promise(resolve => {
    setTimeout(() => resolve(mockCandidates), 500);
  });
};

export const updateCandidateStatus = async (
  candidateId: string, 
  newStatus: EvaluationStatus
): Promise<Candidate> => {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const candidate = mockCandidates.find(c => c.id === candidateId);
      if (candidate) {
        candidate.status = newStatus;
        toast.success(`${candidate.name}'s status updated to ${newStatus}`);
        resolve({ ...candidate });
      } else {
        toast.error("Candidate not found");
        throw new Error("Candidate not found");
      }
    }, 500);
  });
};

export const initiateCall = async (candidate: Candidate): Promise<void> => {
  // Simulate initiating a call
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success(`Initiating call to ${candidate.name} at ${candidate.phone}`);
      resolve();
    }, 500);
  });
};

export const scheduleInterview = async (candidate: Candidate): Promise<void> => {
  // Simulate scheduling an interview
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success(`Interview scheduling initiated for ${candidate.name}`);
      resolve();
    }, 500);
  });
};
