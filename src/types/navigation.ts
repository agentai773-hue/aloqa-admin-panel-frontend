import React from 'react';

export interface NavChild {
  name: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export interface NavSection {
  id: string;
  name: string;
  icon: React.ReactNode;
  isExpandable: boolean;
  children?: NavChild[];
  href?: string;
  isActive?: boolean;
  isExpanded?: boolean;
}