
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCandidates } from '@/services/candidateService';
import CandidateTable from './CandidateTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EvaluationStatus, Candidate } from '@/types/candidate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CandidateDashboard: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<EvaluationStatus | 'all'>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  
  const { data: candidates, isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: getCandidates,
  });

  // Get unique job positions for the filter
  const uniqueJobs = React.useMemo(() => {
    if (!candidates) return [];
    const jobs = new Set(candidates.map(c => c.jobAppliedFor));
    return ['all', ...Array.from(jobs)];
  }, [candidates]);

  // Apply filters
  useEffect(() => {
    if (!candidates) {
      setFilteredCandidates([]);
      return;
    }

    let result = [...candidates];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    
    // Apply job filter
    if (jobFilter !== 'all') {
      result = result.filter(c => c.jobAppliedFor === jobFilter);
    }
    
    setFilteredCandidates(result);
  }, [candidates, statusFilter, jobFilter]);

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!candidates) return { total: 0, pending: 0, passed: 0, failed: 0 };
    
    return {
      total: candidates.length,
      pending: candidates.filter(c => c.status === 'pending').length,
      passed: candidates.filter(c => c.status === 'pass').length,
      failed: candidates.filter(c => c.status === 'fail').length
    };
  }, [candidates]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
        <p className="text-muted-foreground">
          Manage candidate screening calls and schedule interviews.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Evaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setStatusFilter(value as EvaluationStatus | 'all')}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Candidates</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="pass">Passed</TabsTrigger>
            <TabsTrigger value="fail">Failed</TabsTrigger>
          </TabsList>
          
          <div className="w-60">
            <Select
              value={jobFilter}
              onValueChange={setJobFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                {uniqueJobs.map(job => (
                  <SelectItem key={job} value={job}>
                    {job === 'all' ? 'All Positions' : job}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all">
          <CandidateTable candidates={filteredCandidates} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="pending">
          <CandidateTable candidates={filteredCandidates} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="pass">
          <CandidateTable candidates={filteredCandidates} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="fail">
          <CandidateTable candidates={filteredCandidates} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateDashboard;
