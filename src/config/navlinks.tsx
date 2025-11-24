import React from 'react';
import {
  Home,
  Users,
  Bot,
  PlusCircle,
  PhoneCall,
  List,
  Mic,
  Hash,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: <Home className="h-5 w-5" />
  },
  {
    name: 'Users',
    href: '/users',
    icon: <Users className="h-5 w-5" />
  },
  {
    name: 'Assistants',
    href: '/assistant',
    icon: <Bot className="h-5 w-5" />
  },
  {
    name: 'Create Assistant',
    href: '/assistants/create',
    icon: <PlusCircle className="h-5 w-5" />
  },
  {
    name: 'Assign Number',
    href: '/assign/number',
    icon: <PhoneCall className="h-5 w-5" />
  },
  {
    name: 'Number Lists',
    href: '/number/lists',
    icon: <List className="h-5 w-5" />
  },
  {
    name: 'Assign Voice',
    href: '/assign/voice',
    icon: <Mic className="h-5 w-5" />
  },
  {
    name: 'Voice Lists',
    href: '/voice/lists',
    icon: <Hash className="h-5 w-5" />
  },
];
