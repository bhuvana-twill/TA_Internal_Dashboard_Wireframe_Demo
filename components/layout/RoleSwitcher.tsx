'use client';

import { useCurrentUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';

export function RoleSwitcher() {
  const { userRole, switchRole } = useCurrentUser();

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background p-1">
      <Button
        variant={userRole === 'ta' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchRole('ta')}
        className="gap-2"
      >
        <User className="h-4 w-4" />
        TA View
      </Button>
      <Button
        variant={userRole === 'admin' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchRole('admin')}
        className="gap-2"
      >
        <Shield className="h-4 w-4" />
        Admin View
      </Button>
    </div>
  );
}
