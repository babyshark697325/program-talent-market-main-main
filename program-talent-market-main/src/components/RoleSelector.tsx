
import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleSelector: React.FC = () => {
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 bg-secondary/50 backdrop-blur-sm rounded-2xl p-1 shadow-md border border-primary/10">
      <Button
        variant={role === 'student' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => { setRole('student'); navigate('/student-dashboard'); }}
        className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${
          role === 'student' 
            ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25' 
            : 'hover:bg-primary/5'
        }`}
      >
        <Users size={16} />
        Student
      </Button>
      <Button
        variant={role === 'client' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => { setRole('client'); navigate('/'); }}
        className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${
          role === 'client' 
            ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-primary/25' 
            : 'hover:bg-primary/5'
        }`}
      >
        <Briefcase size={16} />
        Client
      </Button>
      <Button
        variant={role === 'admin' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => { setRole('admin'); navigate('/admin-dashboard'); }}
        className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${
          role === 'admin' 
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/25' 
            : 'hover:bg-red-50'
        }`}
      >
        <Shield size={16} />
        Admin
      </Button>
    </div>
  );
};

export default RoleSelector;
