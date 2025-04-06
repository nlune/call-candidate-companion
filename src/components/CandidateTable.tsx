
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Candidate } from '@/types/candidate';
import StatusBadge from './StatusBadge';
import { Phone, Calendar } from 'lucide-react';
import { initiateCall, scheduleInterview } from '@/services/candidateService';
import { Link } from 'react-router-dom';

interface CandidateTableProps {
  candidates: Candidate[];
  isLoading: boolean;
}

const CandidateTable: React.FC<CandidateTableProps> = ({ 
  candidates,
  isLoading
}) => {
  const handleCall = async (candidate: Candidate) => {
    await initiateCall(candidate);
  };

  const handleSchedule = async (candidate: Candidate) => {
    await scheduleInterview(candidate);
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center my-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No candidates found matching the current filters.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">
                <Link to={`/candidate/${candidate.id}`} className="hover:underline text-blue-600">
                  {candidate.name}
                </Link>
              </TableCell>
              <TableCell className="max-w-xs truncate">{candidate.summary}</TableCell>
              <TableCell>{candidate.jobAppliedFor}</TableCell>
              <TableCell>
                <StatusBadge status={candidate.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {candidate.status === 'pending' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleCall(candidate)}
                      className="flex items-center gap-1"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">Call</span>
                    </Button>
                  )}
                  
                  {candidate.status === 'pass' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleSchedule(candidate)}
                      className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Schedule</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidateTable;
