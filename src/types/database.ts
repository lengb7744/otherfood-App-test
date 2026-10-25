/**
 * Database Schema Types matching Chapter 3 (Section 3.2.3 - 3.2.5)
 * of the Dewey International University Thesis:
 * "ប្រព័ន្ធគ្រប់គ្រងការបញ្ជាទិញ និងបញ្ជូនម្ហូបអាហារទំនើប"
 */

export type UserRole = 'Admin' | 'Staff' | 'Restaurant';

export interface TblUser {
  user_id: number;
  student_or_staff_code: string;
  full_name: string;
  full_name_en: string;
  email: string;
  password_hash: string;
  role: UserRole;
  department: string;
  phone: string;
  created_at: string;
}

export interface TblRestaurant {
  restaurant_id: number;
  name: string;
  name_en: string;
  phone: string;
  address: string;
  specialty: string;
  prep_lead_minutes: number;
}

export interface TblCategory {
  category_id: number;
  category_name: string;
  category_name_en: string;
}

export type DishArtworkType =
  | 'fish_amok'
  | 'beef_lok_lak'
  | 'kuy_teav'
  | 'roast_duck'
  | 'lemongrass_chicken'
  | 'pork_rice'
  | 'iced_palm_coffee'
  | 'passion_lime_soda';

export interface TblMenuItem {
  item_id: number;
  item_name: string;
  item_name_en: string;
  description: string;
  price: number; // USD (e.g. 2.50)
  image: string; // DishArtworkType key or custom image URL
  category_id: number;
  restaurant_id: number;
  calories: number;
  is_available: boolean;
}

export type TimeWindowStatus = 'Open' | 'Closed';

export interface TblTimeWindow {
  window_id: number;
  window_name: string;
  window_name_en: string;
  start_time: string; // "HH:MM" 24h format e.g. "08:00"
  end_time: string;   // "HH:MM" 24h format e.g. "10:30"
  delivery_time: string; // "HH:MM" e.g. "11:45"
  status: TimeWindowStatus;
  auto_cutoff_enabled: boolean;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Cancelled';
export type PaymentMethod = 'KHQR' | 'Payroll' | 'Cash';

export interface TblOrder {
  order_id: number;
  user_id: number;
  window_id: number;
  total_amount: number;
  payment_method: PaymentMethod;
  order_status: OrderStatus;
  notes: string;
  delivery_drop_point: string;
  created_at: string;
}

export interface TblOrderDetail {
  detail_id: number;
  order_id: number;
  item_id: number;
  quantity: number;
  subtotal: number;
  special_request?: string;
}

export type BatchOrderStatus = 'Pending' | 'Preparing' | 'Delivering' | 'Delivered';

export interface ConsolidatedDishLine {
  item_id: number;
  item_name: string;
  item_name_en: string;
  unit_price: number;
  total_quantity: number;
  subtotal: number;
  recipients: Array<{
    order_id: number;
    user_name: string;
    department: string;
    quantity: number;
    notes?: string;
  }>;
}

export interface TblBatchOrder {
  batch_id: number;
  window_id: number;
  restaurant_id: number;
  total_items: number;
  total_amount: number;
  batch_status: BatchOrderStatus;
  consolidated_at: string;
  lines: ConsolidatedDishLine[];
}

export interface CartItem {
  item: TblMenuItem;
  quantity: number;
  special_request: string;
}
