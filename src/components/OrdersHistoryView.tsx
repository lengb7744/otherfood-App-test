import React, { useState } from 'react';
import {
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  FileCheck2,
  ChefHat,
  Bike,
  MapPin,
} from 'lucide-react';
import type {
  TblOrder,
  TblOrderDetail,
  TblMenuItem,
  TblUser,
  TblTimeWindow,
} from '../types/database.ts';
import { formatUsd, formatKhr } from '../utils/orderingLogic.ts';

interface OrdersHistoryViewProps {
  orders: TblOrder[];
  orderDetails: TblOrderDetail[];
  menuItems: TblMenuItem[];
  users: TblUser[];
  windows: TblTimeWindow[];
  currentUser: TblUser;
  onCancelOrder: (orderId: number) => void;
  isWindowOpen: boolean;
}

export const OrdersHistoryView: React.FC<OrdersHistoryViewProps> = ({
  orders,
  orderDetails,
  menuItems,
  users,
  windows,
  currentUser,
  onCancelOrder,
  isWindowOpen,
}) => {
  const [filterScope, setFilterScope] = useState<'all' | 'mine'>('all');

  const userMap = new Map<number, TblUser>(users.map((u) => [u.user_id, u]));
  const itemMap = new Map<number, TblMenuItem>(menuItems.map((m) => [m.item_id, m]));
  const windowMap = new Map<number, TblTimeWindow>(windows.map((w) => [w.window_id, w]));

  const displayedOrders =
    filterScope === 'mine'
      ? orders.filter((o) => o.user_id === currentUser.user_id)
      : orders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-[#D70F64]">
            LIVE ORDER TRACKER & RECEIPTS · TBL_ORDERS & TBL_ORDER_DETAILS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            តាមដានការកម្ម៉ង់ និងវិក្កយបត្រអាហារ ({displayedOrders.length})
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            តាមដានដំណើរការចម្អិនក្នុងផ្ទះបាយ KDS ការដឹកជញ្ជូនមកកាន់ស្ថាប័ន និងវិក្កយបត្រទូទាត់ប្រាក់។
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setFilterScope('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterScope === 'all'
                  ? 'bg-[#D70F64] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ការកម្ម៉ង់ទាំងអស់ ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterScope('mine')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterScope === 'mine'
                  ? 'bg-[#D70F64] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              តែគណនីរបស់ខ្ញុំ ({orders.filter((o) => o.user_id === currentUser.user_id).length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ព</span>
          </button>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <FileCheck2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            មិនទាន់មានវិក្កយបត្របញ្ជាទិញក្នុងបញ្ជីនេះទេ
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            សូមចូលទៅកាន់ទំព័រ «ហាង និងម៉ឺនុយ» ដើម្បីជ្រើសរើសមុខម្ហូបក្នុងចន្លោះម៉ោងកំណត់។
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const staff = userMap.get(order.user_id);
            const win = windowMap.get(order.window_id);
            const details = orderDetails.filter((d) => d.order_id === order.order_id);

            return (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono-tabular">
                      <span className="font-bold text-[#D70F64]">
                        ORDER #{order.order_id}
                      </span>
                      <span>·</span>
                      <span>{win?.window_name || `Window #${order.window_id}`}</span>
                      <span>·</span>
                      <span>ការទូទាត់៖ {order.payment_method}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      {staff?.full_name || `បុគ្គលិក #${order.user_id}`}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        ({staff?.department})
                      </span>
                    </h2>
                    <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D70F64] shrink-0" />
                      <span>
                        ទីតាំងដឹកជញ្ជូន៖ {order.delivery_drop_point}
                        {order.notes ? ` · ចំណាំ៖ ${order.notes}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 justify-end">
                        {order.order_status === 'Confirmed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : order.order_status === 'Cancelled' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-600" />
                        )}
                        <span>
                          {order.order_status === 'Confirmed'
                            ? 'បានបញ្ជាក់ (Confirmed)'
                            : order.order_status === 'Cancelled'
                            ? 'បានបោះបង់ (Cancelled)'
                            : 'រង់ចាំ (Pending)'}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-slate-900 font-mono-tabular">
                        {formatUsd(order.total_amount)}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          ({formatKhr(order.total_amount)})
                        </span>
                      </div>
                    </div>

                    {order.order_status !== 'Cancelled' && isWindowOpen && (
                      <button
                        type="button"
                        onClick={() => onCancelOrder(order.order_id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-xl transition-colors no-print whitespace-nowrap"
                      >
                        បោះបង់មុន Cut-off
                      </button>
                    )}
                  </div>
                </div>

                {/* foodpanda-style 4-Step Live Delivery Tracker */}
                {order.order_status !== 'Cancelled' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 pb-2 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>១. បានទទួលការកម្ម៉ង់</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#D70F64] font-semibold">
                      <ChefHat className="w-4 h-4 shrink-0" />
                      <span>២. បូកសរុបចូលផ្ទះបាយ KDS</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Bike className="w-4 h-4 shrink-0" />
                      <span>៣. ដឹកជញ្ជូនម៉ោង {win?.delivery_time || '11:45'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">៤. ប្រគល់ដល់អគារស្ថាប័ន</span>
                    </div>
                  </div>
                )}

                {/* Order Items List */}
                <div className="divide-y divide-slate-100 text-sm">
                  {details.map((det) => {
                    const dish = itemMap.get(det.item_id);
                    return (
                      <div
                        key={det.detail_id}
                        className="py-2 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold text-slate-900">
                            {dish?.item_name || `មុខម្ហូប #${det.item_id}`}
                          </span>
                          <span className="text-xs text-slate-500 font-mono-tabular ml-2">
                            × {det.quantity}
                          </span>
                          {det.special_request && (
                            <span className="text-xs text-[#D70F64] ml-2">
                              ({det.special_request})
                            </span>
                          )}
                        </div>
                        <div className="font-mono-tabular font-semibold text-slate-800">
                          {formatUsd(det.subtotal)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
