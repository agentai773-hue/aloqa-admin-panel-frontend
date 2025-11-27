import React from 'react';
import {
  Home,
  Users,
  UserPlus,
  Bot,
  PlusCircle,
  Phone,
  PhoneOutgoing,
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
    name: 'Create User',
    href: '/user/create',
    icon: <UserPlus className="h-5 w-5" />
  },
  {
    name: 'User List',
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
    name: 'Buy Phone Number',
    href: '/phone-numbers',
    icon: <Phone className="h-5 w-5" />
  },
  {
    name: 'Assign Number',
    href: '/phone-numbers-assign',
    icon: <PhoneOutgoing className="h-5 w-5" />
  },
];
