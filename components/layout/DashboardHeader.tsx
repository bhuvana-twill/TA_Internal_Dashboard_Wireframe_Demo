'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/contexts/UserContext';
import { RoleSwitcher } from './RoleSwitcher';
import { LayoutDashboard, Kanban } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Kanban View', href: '/dashboard/kanban', icon: Kanban },
];

export function DashboardHeader() {
  const { currentUser } = useCurrentUser();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Twill</h1>
          </div>

          {/* Navigation moved to header */}
          <nav className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-1.5">
            <span className="text-xs text-yellow-800 font-medium">
              DEMO ONLY: TAs/Admin see their assigned view automatically based on email. View switcher shown for demonstration purposes only.
            </span>
          </div>
          <RoleSwitcher />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-semibold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-sm">
              <div className="font-medium">{currentUser.name}</div>
              <div className="text-xs text-muted-foreground">{currentUser.name.toLowerCase().replace(/\s+/g, '.')}@withtwill.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
