import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface OpenOrder {
  id: number;
  PropAddress: string;
  PropCity:string;
  PropOwner: string;
  PropState: string;
  PropZip: string;
  Services: string;
  UserID: number;
  PONumber: string;
  dbaName: string;
  PropDesc: string;
  AccContact: string;
  AccMobile: string;
  AccHome: string;
  AccWork: string;
  AccEmail: string;
  CallbackReference:string;
  Notes: string;
  ReportHTML:string;
  Status: string
}





export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
