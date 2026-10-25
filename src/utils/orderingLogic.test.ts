import test from 'node:test';
import assert from 'node:assert/strict';
import {
  encryptPassword,
  verifyUserCredentials,
  evaluateTimeWindow,
  calculateCartSummary,
  consolidateBatchOrders,
  generateExpenseReport,
  convertUsdToKhr,
} from './orderingLogic.ts';
import type {
  TblUser,
  TblTimeWindow,
  TblMenuItem,
  TblRestaurant,
  TblOrder,
  TblOrderDetail,
} from '../types/database.ts';

const mockUsers: TblUser[] = [
  {
    user_id: 1,
    student_or_staff_code: '02712',
    full_name: 'វ៉ាន់ថា សុភ័ក្ត្រនេត្រា',
    full_name_en: 'Vantha Sopheaknetra',
    email: 'sopheaknetra@diu.edu.kh',
    password_hash: encryptPassword('diu2026'),
    role: 'Admin',
    department: 'ព័ត៌មានវិទ្យា (IT)',
    phone: '012 345 678',
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    user_id: 2,
    student_or_staff_code: '02699',
    full_name: 'ហឿត សុវណ្ណារ៉ា',
    full_name_en: 'Hoeut Sovannara',
    email: 'sovannara@diu.edu.kh',
    password_hash: encryptPassword('diu2026'),
    role: 'Staff',
    department: 'គណិតសាស្ត្រ និងវិទ្យាសាស្ត្រ',
    phone: '096 888 999',
    created_at: '2026-03-01T08:00:00Z',
  },
];

test('Unit Test 1: Password encryption and user credential verification', () => {
  const hash1 = encryptPassword('diu2026');
  const hash2 = encryptPassword('diu2026');
  assert.equal(hash1, hash2);
  assert.ok(hash1.startsWith('bcrypt$2b$10$'));

  const validByCode = verifyUserCredentials(mockUsers, '02712', 'diu2026');
  assert.ok(validByCode);
  assert.equal(validByCode?.full_name_en, 'Vantha Sopheaknetra');

  const invalidPass = verifyUserCredentials(mockUsers, '02712', 'wrongpass');
  assert.equal(invalidPass, null);
});

test('Unit Test 2: Cut-off Time Window evaluation and countdown timer', () => {
  const lunchWindow: TblTimeWindow = {
    window_id: 1,
    window_name: 'វេនអាហារថ្ងៃត្រង់',
    window_name_en: 'Lunch Batch Window',
    start_time: '08:00',
    end_time: '10:30',
    delivery_time: '11:45',
    status: 'Open',
    auto_cutoff_enabled: true,
  };

  // At 10:00:00 AM (36000 seconds), 30 minutes remain until 10:30:00 AM (37800 seconds)
  const evalAt10Am = evaluateTimeWindow(lunchWindow, 10 * 3600);
  assert.equal(evalAt10Am.isOpen, true);
  assert.equal(evalAt10Am.remainingSeconds, 1800);
  assert.equal(evalAt10Am.formattedCountdown, '00:30:00');
  assert.equal(evalAt10Am.reason, 'OPEN');

  // At 10:35:00 AM (past 10:30 cut-off), window automatically closes
  const evalAt1035Am = evaluateTimeWindow(lunchWindow, 10 * 3600 + 35 * 60);
  assert.equal(evalAt1035Am.isOpen, false);
  assert.equal(evalAt1035Am.remainingSeconds, 0);
  assert.equal(evalAt1035Am.reason, 'PAST_CUTOFF');

  // When Admin manually sets status to Closed
  const closedWindow: TblTimeWindow = { ...lunchWindow, status: 'Closed' };
  const evalManualClose = evaluateTimeWindow(closedWindow, 9 * 3600);
  assert.equal(evalManualClose.isOpen, false);
  assert.equal(evalManualClose.reason, 'MANUAL_CLOSED');
});

test('Unit Test 3: Cart subtotal, USD total, and KHR conversion math', () => {
  const itemA: TblMenuItem = {
    item_id: 101,
    item_name: 'អាម៉ុកត្រីខ្មែរ',
    item_name_en: 'Cambodian Fish Amok',
    description: 'Steamed fish curry',
    price: 2.5,
    image: 'fish_amok',
    category_id: 1,
    restaurant_id: 1,
    calories: 480,
    is_available: true,
  };
  const itemB: TblMenuItem = {
    item_id: 102,
    item_name: 'កាហ្វេទឹកដោះគោទឹកត្នោត',
    item_name_en: 'Iced Palm Sugar Latte',
    description: 'Iced coffee',
    price: 1.5,
    image: 'iced_palm_coffee',
    category_id: 4,
    restaurant_id: 2,
    calories: 190,
    is_available: true,
  };

  const summary = calculateCartSummary([
    { item: itemA, quantity: 2, special_request: 'Less spicy' },
    { item: itemB, quantity: 1, special_request: 'Less sweet' },
  ]);

  assert.equal(summary.totalItems, 3);
  assert.equal(summary.subtotalUsd, 6.5);
  assert.equal(summary.discountUsd, 0);
  assert.equal(summary.totalUsd, 6.5);
  assert.equal(summary.totalKhr, convertUsdToKhr(6.5));
  assert.equal(summary.itemSubtotals[0].subtotal, 5.0);
  assert.equal(summary.itemSubtotals[1].subtotal, 1.5);

  const discountedSummary = calculateCartSummary(
    [
      { item: itemA, quantity: 2, special_request: 'Less spicy' },
      { item: itemB, quantity: 1, special_request: 'Less sweet' },
    ],
    'DIU2026'
  );
  assert.equal(discountedSummary.discountUsd, 0.98);
  assert.equal(discountedSummary.totalUsd, 5.52);
});

test('Unit Test 4: Batch Order Consolidation (Process 4.0) & Expense Report (Process 5.0)', () => {
  const restaurants: TblRestaurant[] = [
    {
      restaurant_id: 1,
      name: 'ភោជនីយដ្ឋាន សង្កែរសជាតិខ្មែរ',
      name_en: 'Sangkae Khmer Kitchen',
      phone: '053 952 111',
      address: 'Battambang',
      specialty: 'Khmer Lunch',
      prep_lead_minutes: 25,
    },
  ];
  const menuItems: TblMenuItem[] = [
    {
      item_id: 101,
      item_name: 'អាម៉ុកត្រីខ្មែរ',
      item_name_en: 'Cambodian Fish Amok',
      description: 'Steamed fish curry',
      price: 2.5,
      image: 'fish_amok',
      category_id: 1,
      restaurant_id: 1,
      calories: 480,
      is_available: true,
    },
  ];
  const orders: TblOrder[] = [
    {
      order_id: 1001,
      user_id: 1,
      window_id: 1,
      total_amount: 5.0,
      payment_method: 'KHQR',
      order_status: 'Confirmed',
      notes: '',
      delivery_drop_point: 'Building A - IT Lab',
      created_at: '2026-03-15T09:15:00Z',
    },
    {
      order_id: 1002,
      user_id: 2,
      window_id: 1,
      total_amount: 2.5,
      payment_method: 'Payroll',
      order_status: 'Confirmed',
      notes: 'No chili',
      delivery_drop_point: 'Building B - Science Room',
      created_at: '2026-03-15T09:20:00Z',
    },
  ];
  const orderDetails: TblOrderDetail[] = [
    { detail_id: 1, order_id: 1001, item_id: 101, quantity: 2, subtotal: 5.0 },
    { detail_id: 2, order_id: 1002, item_id: 101, quantity: 1, subtotal: 2.5, special_request: 'No chili' },
  ];

  const batches = consolidateBatchOrders({
    windowId: 1,
    orders,
    orderDetails,
    menuItems,
    restaurants,
    users: mockUsers,
  });

  assert.equal(batches.length, 1);
  assert.equal(batches[0].restaurant_id, 1);
  assert.equal(batches[0].total_items, 3);
  assert.equal(batches[0].total_amount, 7.5);
  assert.equal(batches[0].lines[0].total_quantity, 3);
  assert.equal(batches[0].lines[0].recipients.length, 2);

  const report = generateExpenseReport({ orders, orderDetails, users: mockUsers });
  assert.equal(report.totalOrdersCount, 2);
  assert.equal(report.totalPortionsCount, 3);
  assert.equal(report.totalRevenueUsd, 7.5);
  assert.equal(report.byDepartment.length, 2);
});
