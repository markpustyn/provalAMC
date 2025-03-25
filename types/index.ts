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
  id?: string;
  loanNumber?: string;
  loanOfficer?: string;
  loanOfficerEmail?: string;
  lender?: string;
  lenderAddress?: string;
  lenderCity?: string;
  lenderZip?: string;
  borrowerName?: string;
  borrowerEmail?: string;
  borrowerPhoneType?: string;
  borrowerPhoneNumber?: string;
  propertyAddress?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyZip?: string;
  propertyType?: string;
  orderType?: string;
  presentOccupancy?: string;
  loanPurpose?: string;
  loanType?: string;
  mainProduct?: string;
  requestedDueDate?: string;
  description?: string;


  services?: string;
  dbaName?: string;
  accContact?: string;
  accMobile?: string;
  accHome?: string;
  accWork?: string;
  accEmail?: string;
  callbackReference?: string;
  notes?: string;
  reportHtml?: string;
  status?: string;
  isDone?: boolean;
}


export interface AuthCredentials{
  // id:string,
	fname:string,
	lname:string,
	email:string,
	phone:string,
	password:string,
	companyName:string,
	licenseNum:string,
	street:string,
	city:string,
	state:string,
  // role:string,
	zip:string,
  // statued: string,
	// lastActivityDate:string,
	// createdAt:string,
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
