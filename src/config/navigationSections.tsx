import {
  Home,
  Users,
  UserPlus,
  Bot,
  PlusCircle,
  Phone,
  PhoneOutgoing,
  PhoneCall,
  Mic,
  UserCheck,
  List,
  Archive,
} from 'lucide-react';
import type { NavSection } from '../types/navigation';

export const navigationSections: NavSection[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    isExpandable: false,
    href: '/',
    isActive: false,
  },
  {
    id: 'users',
    name: 'Users',
    icon: <Users className="h-5 w-5" />,
    isExpandable: true,
    isExpanded: false,
    children: [
      {
        name: 'Create User',
        href: '/user/create',
        icon: <UserPlus className="h-4 w-4" />,
      },
      {
        name: 'User List',
        href: '/users',
        icon: <List className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'assistants',
    name: 'Assistants',
    icon: <Bot className="h-5 w-5" />,
    isExpandable: true,
    isExpanded: false,
    children: [
      {
        name: 'Assistant List',
        href: '/assistant',
        icon: <Archive className="h-4 w-4" />,
      },
      {
        name: 'Create Assistant',
        href: '/assistants/create',
        icon: <PlusCircle className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'phone-numbers',
    name: 'Phone Numbers',
    icon: <Phone className="h-5 w-5" />,
    isExpandable: true,
    isExpanded: false,
    children: [
      {
        name: 'Buy Phone Number',
        href: '/phone-numbers',
        icon: <Phone className="h-4 w-4" />,
      },
      {
        name: 'Assign Number',
        href: '/phone-numbers-assign',
        icon: <PhoneOutgoing className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'voice',
    name: 'Voice',
    icon: <Mic className="h-5 w-5" />,
    isExpandable: true,
    isExpanded: false,
    children: [
      {
        name: 'Voice Library',
        href: '/voices',
        icon: <Archive className="h-4 w-4" />,
      },
      {
        name: 'Voice Assignments',
        href: '/voice-assignments',
        icon: <UserCheck className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'calls',
    name: 'Make Sample Call',
    icon: <PhoneCall className="h-5 w-5" />,
    isExpandable: false,
    href: '/sample-call',
    isActive: false,
  },
];