export interface ChartDataItem {
  rating: number;
  count: number;
  percentage: number;
  firstReview: string;
  lastReview: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  error?: string;
}

export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'STAFF';
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  date: Date;
  userId?: number;
}

export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  categories: Category[];
  menu: MenuItem[];
  tables: Table[];
}

export interface Category {
  id: number;
  name: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: number;
  available: boolean;
}

export interface Table {
  id: number;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
}