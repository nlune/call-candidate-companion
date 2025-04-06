
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

export const getCandidateById = async (id: string): Promise<Candidate> => {
  // Simulate API call with a delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const candidate = mockCandidates.find(c => c.id === id);
      if (candidate) {
        resolve({ ...candidate });
      } else {
        toast.error("Candidate not found");
        reject(new Error("Candidate not found"));
      }
    }, 500);
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

export const updateCandidate = async (
  candidateId: string,
  updatedCandidate: Candidate
): Promise<Candidate> => {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockCandidates.findIndex(c => c.id === candidateId);
      if (index !== -1) {
        // Preserve the ID when updating
        updatedCandidate.id = candidateId;
        mockCandidates[index] = { ...updatedCandidate };
        toast.success(`${updatedCandidate.name}'s information updated`);
        resolve({ ...updatedCandidate });
      } else {
        toast.error("Candidate not found");
        throw new Error("Candidate not found");
      }
    }, 500);
  });
};

async function makeOutboundCall(
  candidateName: string,
  position: string,
  phoneNumber: string
): Promise<Response> {
  const apiUrl = "https://ae9c-2a02-2455-84a9-d100-acec-901-f1fa-ea8.ngrok-free.app/outbound-call";
  
  const requestBody = {
    prompt: `You are Stuart, an interviewer for the ${position} position. Conduct a professional interview by asking about the candidate.`,
    first_message: `Hello ${candidateName}, I'm Stuart from VoiceCo and I'm calling you regarding the ${position} role. Do you have a moment for a quick phone screening?`,
    number: phoneNumber
  };

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'no-cors', // Add no-cors mode to handle CORS issues
    body: JSON.stringify(requestBody)
  });
}

export const initiateCall = async (candidate: Candidate): Promise<void> => {
  try {
    toast.loading(`Calling ${candidate.name}...`);
    
    // Log the request for debugging
    console.log("Making call request for:", candidate.name, candidate.phone);
    
    try {
      const response = await makeOutboundCall(
        candidate.name,
        candidate.jobAppliedFor,
        candidate.phone
      );
      
      // With no-cors mode, we won't get a normal response status
      // The browser will just tell us if the request was sent
      toast.success(`Call request to ${candidate.name} sent successfully`);
      console.log("Call request sent:", response);
    } catch (error) {
      console.error('Error initiating call:', error);
      toast.error(`Failed to connect call: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Unexpected error in initiateCall:', error);
    toast.error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Dismiss any loading toasts
    toast.dismiss();
  }
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
