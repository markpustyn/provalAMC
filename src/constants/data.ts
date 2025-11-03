import { NavItem, BrokerNavItem } from 'types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: string;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'My Orders',
    url: '/admin/overview',
    icon: 'dashboard',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
    {
    title: 'Clients',
    url: '/admin/clients',
    icon: 'employee',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Vendors',
    url: '/admin/vendors',
    icon: 'user2',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Quality Control',
    url: '/admin/order',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Billing',
    url: '/admin/billing',
    icon: 'orderbilling',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/admin/profile',
        icon: 'userPen',
      },
      {
        title: 'Login',
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Create Order',
    url: '/admin/order/new',
    icon: 'kanban',
    isActive: false,
    items: []
  }
];
export const brokerNav: BrokerNavItem[] = [
  {
    title: 'Avalible Orders',
    url: '/broker/dashboard',
    icon: 'avaliable',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Orders In Progress',
    url: '/broker/dashboard/order',
    icon: 'progress',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Order Corrections',
    url: '/broker/dashboard/corrections',
    icon: 'correction',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Profile',
    url: '/broker/dashboard/profile',
    icon: 'user',
    isActive: false,
    items: [
      {
        title: 'Profile',
        url: '/broker/dashboard/profile',
        icon: 'user',
      },
      {
        title: 'Service Area',
        url: '/broker/dashboard/profile/service-area',
        icon: 'user',
      },
    ]
  },
];
export const clientNav: BrokerNavItem[] = [
  {
    title: 'New Order',
    url: '/client',
    icon: 'HousePlus',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
    {
    title: 'Completed Orders',
    url: '/client/complete',
    icon: 'check',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Orders In Progress',
    url: '/client/order',
    icon: 'progress',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Profile',
    url: '/client/profile',
    icon: 'user',
    isActive: false,
    items: []
  },
];
