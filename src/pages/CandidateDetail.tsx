
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { getCandidateById, updateCandidate } from '@/services/candidateService';
import { Candidate, EvaluationStatus } from '@/types/candidate';
import { ArrowLeft } from 'lucide-react';

const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Candidate>>({});

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getCandidateById(id);
        setCandidate(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching candidate:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: EvaluationStatus) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !formData) return;
    
    try {
      await updateCandidate(id, formData as Candidate);
      navigate('/');
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-40 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10 text-gray-500">
              Candidate not found.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to candidates
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Candidate: {candidate.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                name="phone" 
                value={formData.phone || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobAppliedFor">Position</Label>
              <Input 
                id="jobAppliedFor"
                name="jobAppliedFor" 
                value={formData.jobAppliedFor || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea 
                id="summary"
                name="summary" 
                value={formData.summary || ''}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Evaluation Status</Label>
              <Select 
                value={formData.status || 'pending'} 
                onValueChange={(value) => handleStatusChange(value as EvaluationStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="pass">Pass</SelectItem>
                  <SelectItem value="fail">Fail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateDetail;
