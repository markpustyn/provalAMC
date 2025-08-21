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
export interface BrokerNavItem {
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
  [x: string]: any;
  orderId?: string;
  clientId?: string;
  orderNumber?: string;
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
  status?: string;
  sessionUserId?:string;  
}

export interface UpdateZip {
  userId?: string;
  zipCode?:string;
  county: string;
}


export interface AuthCredentials{
  id?:string,
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
  zip:string,
  role?:string,
  statued?: string,
	lastActivityDate?:string,
	// createdAt?:string,
}

export interface StatusOrder {
  // id?: string;
  propStatus: string;
  reason:string;
  propOrderId: string;
  vendorId: string;
  // status:string;
}

export type BillingStatus = {
  statusId?: string,
  vendorId: string,
  propOrderId: string,
  amount: string,
  vendorFee: string,
  billingStatus?: string,
  paymentDate?: Date,
  propertyAddress?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyZip?: string;
  propertyType?: string;
  orderType?: string;
};

export type InspectionForm = {
  date: string; // ISO date string, e.g., "2025-08-13"
  items: string[]; // array of selected features or attributes
  notes: string;
  stories: string;
  inspector: string;
  occupancy: "occupied" | "vacant" | string;
  viewFactors: string;
  neighborhood: string;
  propertyType: string;
  repairsNeeded: string;
  commonElements: string;
  subjectCondition: string;
  neighborhoodConformity: string;
};



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
