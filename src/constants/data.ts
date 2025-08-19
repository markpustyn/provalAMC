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
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Vendors',
    url: '/admin/vendors',
    icon: 'user2',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Orders',
    url: '/admin/order',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Billing',
    url: '/admin/billing',
    icon: 'orderbilling',
    shortcut: ['z', 'z'],
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
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Create Order',
    url: '/admin/order/new',
    icon: 'kanban',
    shortcut: ['k', 'k'],
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
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Orders In Progress',
    url: '/broker/dashboard/order',
    icon: 'progress',
    isActive: false,
    shortcut: ['f', 'f'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Corrections',
    url: '/broker/dashboard/corrections',
    icon: 'correction',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Profile',
    url: '/broker/dashboard/profile',
    icon: 'user',
    isActive: false,
    shortcut: ['p', 'p'],

    items: [
      {
        title: 'Profile',
        url: '/broker/dashboard/profile',
        icon: 'user',
        shortcut: ['m', 'm']
      },
      {
        title: 'Service Area',
        url: '/broker/dashboard/profile/service-area',
        icon: 'user',
        shortcut: ['m', 'm']
      },
    ]
  },
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
