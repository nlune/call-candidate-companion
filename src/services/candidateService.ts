
import { Candidate, EvaluationStatus } from '@/types/candidate';
import { toast } from 'sonner';


export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await fetch("http://localhost:8008/candidates/");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // Map backend fields to frontend candidate type
    const candidates: Candidate[] = data.map((candidate: any) => ({
      id: candidate.id.toString(), // Convert id to string if required by your type
      name: candidate.name,
      summary: candidate.summary,
      jobAppliedFor: candidate.position, // Map 'position' from the database to 'jobAppliedFor'
      status: candidate.status,
      phone: candidate.phone_number, // Map 'phone_number' to 'phone'
      transcript: candidate.call_transcript, // Email is not provided by the backend so we default to an empty string
    }));
    return candidates;
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch candidates.");
    return [];
  }
};

export const getCandidateById = async (id: string): Promise<Candidate> => {
  try {
    const response = await fetch(`http://localhost:8008/candidates/${id}`);
    if (!response.ok) {
      toast.error("Candidate not found");
      throw new Error("Candidate not found");
    }
    const candidateData = await response.json();
    // Map backend fields to frontend candidate type
    const candidate: Candidate = {
      id: candidateData.id.toString(), // Convert number to string if needed
      name: candidateData.name,
      summary: candidateData.summary,
      jobAppliedFor: candidateData.position, // Map 'position' from backend to 'jobAppliedFor'
      status: candidateData.status,
      phone: candidateData.phone_number, // Map 'phone_number' to 'phone'
      transcript: "", // The backend does not provide an email, so default to an empty string
    };
    return candidate;
  } catch (error) {
    toast.error("Candidate not found");
    throw error;
  }
};

export const updateCandidateStatus = async (
  candidateId: string, 
  newStatus: EvaluationStatus
): Promise<Candidate> => {
  try {
    const response = await fetch(`http://localhost:8008/candidates/${candidateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // Only sending the status update in the payload
      body: JSON.stringify({ status: newStatus })
    });
    
    if (!response.ok) {
      toast.error("Candidate not found");
      throw new Error("Candidate not found");
    }
    
    const candidateData = await response.json();
    // Map the backend fields to your frontend Candidate type
    const candidate: Candidate = {
      id: candidateData.id.toString(),
      name: candidateData.name,
      summary: candidateData.summary,
      jobAppliedFor: candidateData.position,
      status: candidateData.status,
      phone: candidateData.phone_number,
      transcript: "", // Backend does not provide an email field
    };
    
    toast.success(`${candidate.name}'s status updated to ${newStatus}`);
    return candidate;
  } catch (error) {
    toast.error("Candidate not found");
    throw error;
  }
};

export const updateCandidate = async (
  candidateId: string,
  updatedCandidate: Candidate
): Promise<Candidate> => {
  try {
    // Create a payload that matches the backend's expected field names
    const payload = {
      name: updatedCandidate.name,
      summary: updatedCandidate.summary,
      position: updatedCandidate.jobAppliedFor, // Mapping frontend field to backend
      phone_number: updatedCandidate.phone,
      status: updatedCandidate.status,
      // Optionally include call_transcript if needed, e.g.:
      // call_transcript: updatedCandidate.callTranscript || ""
    };
    
    const response = await fetch(`http://localhost:8008/candidates/${candidateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      toast.error("Candidate not found");
      throw new Error("Candidate not found");
    }
    
    const candidateData = await response.json();
    // Map the updated candidate data to your frontend Candidate type
    const candidate: Candidate = {
      id: candidateData.id.toString(),
      name: candidateData.name,
      summary: candidateData.summary,
      jobAppliedFor: candidateData.position,
      status: candidateData.status,
      phone: candidateData.phone_number,
      transcript: "", // Email is not provided by the backend
    };
    
    toast.success(`${candidate.name}'s information updated`);
    return candidate;
  } catch (error) {
    toast.error("Candidate not found");
    throw error;
  }
};

async function makeOutboundCall(
  candidateName: string,
  position: string,
  phoneNumber: string,
  candidateID: string
): Promise<Response> {
  const apiUrl = "https://ae9c-2a02-2455-84a9-d100-acec-901-f1fa-ea8.ngrok-free.app/outbound-call";
  
  // Ensure the phone number is in E.164 format (remove any non-numeric characters except +)
  const formattedPhone = phoneNumber.replace(/[^\d+]/g, '');
  
  const requestBody = {
    prompt: `You are Stuart, an interviewer for the ${position} position. Conduct a professional interview with no more than 3 questions, for a maximum of 10 minutes. Try to keep all responses short and concise, and sound as much like a human as possible.`,
    first_message: `Hello ${candidateName.split(" ")[0]}, I'm Stuart from VoiceCo and I'm calling you regarding the ${position} role. Do you have a moment for a quick phone screening?`,
    number: formattedPhone,
    candidate_id: candidateID
  };

  console.log("Outbound call request payload:", JSON.stringify(requestBody, null, 2));

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // mode: 'no-cors', // Add no-cors mode to handle CORS issues
    // credentials: 'include',
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
        candidate.phone,
        candidate.id
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
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
