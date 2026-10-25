import React, { useState } from 'react';
import {
  Clock,
  Lock,
  Unlock,
  PlusCircle,
  CheckCircle2,
  BarChart3,
  Utensils,
  Users,
  Send,
  Trash2,
} from 'lucide-react';
import type {
  TblTimeWindow,
  TblMenuItem,
  TblRestaurant,
  TblCategory,
  TblOrder,
  TblOrderDetail,
  TblUser,
  DishArtworkType,
} from '../types/database.ts';
import {
  formatUsd,
  formatKhr,
  generateExpenseReport,
  type TimeWindowEvaluation,
} from '../utils/orderingLogic.ts';

interface AdminDashboardViewProps {
  windows: TblTimeWindow[];
  activeWindowId: number;
  onSelectWindowId: (id: number) => void;
  onUpdateWindow: (updated: TblTimeWindow) => void;
  windowEval: TimeWindowEvaluation;
  simulatedTimeStr: string;
  onChangeSimulatedTime: (timeStr: string) => void;
  onConsolidateAndLockWindow: () => void;
  menuItems: TblMenuItem[];
  restaurants: TblRestaurant[];
  categories: TblCategory[];
  onAddMenuItem: (item: Omit<TblMenuItem, 'item_id'>) => void;
  onToggleMenuItemAvailability: (itemId: number) => void;
  onDeleteMenuItem: (itemId: number) => void;
  orders: TblOrder[];
  orderDetails: TblOrderDetail[];
  users: TblUser[];
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  windows,
  activeWindowId,
  onSelectWindowId,
  onUpdateWindow,
  windowEval,
  simulatedTimeStr,
  onChangeSimulatedTime,
  onConsolidateAndLockWindow,
  menuItems,
  restaurants,
  categories,
  onAddMenuItem,
  onToggleMenuItemAvailability,
  onDeleteMenuItem,
  orders,
  orderDetails,
  users,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cutoff' | 'menu' | 'reports'>('cutoff');

  const activeWindow =
    windows.find((w) => w.window_id === activeWindowId) || windows[0];

  // Form state for adding a new dish
  const [newItemNameKh, setNewItemNameKh] = useState('');
  const [newItemNameEn, setNewItemNameEn] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('2.50');
  const [newItemCatId, setNewItemCatId] = useState<number>(categories[0]?.category_id || 1);
  const [newItemRestId, setNewItemRestId] = useState<number>(restaurants[0]?.restaurant_id || 1);
  const [newItemArtwork, setNewItemArtwork] = useState<DishArtworkType>('fish_amok');
  const [formFeedback, setFormFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const report = generateExpenseReport({ orders, orderDetails, users });

  const handleAddDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);
    const parsedPrice = parseFloat(newItemPrice);
    if (!newItemNameKh.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormFeedback({
        type: 'error',
        text: 'សូមបញ្ចូលឈ្មោះមុខម្ហូប និងតម្លៃឱ្យបានត្រឹមត្រូវ (តម្លៃត្រូវធំជាង $0.00)។',
      });
      return;
    }

    onAddMenuItem({
      item_name: newItemNameKh.trim(),
      item_name_en: newItemNameEn.trim() || newItemNameKh.trim(),
      description:
        newItemDesc.trim() ||
        'ម្ហូបចម្អិនថ្មីៗប្រចាំថ្ងៃសម្រាប់បុគ្គលិកស្ថាប័ន ដឹកជញ្ជូនទាន់ម៉ោងសម្រាក។',
      price: Number(parsedPrice.toFixed(2)),
      image: newItemArtwork,
      category_id: newItemCatId,
      restaurant_id: newItemRestId,
      calories: 480,
      is_available: true,
    });

    setNewItemNameKh('');
    setNewItemNameEn('');
    setNewItemDesc('');
    setNewItemPrice('2.50');
    setFormFeedback({
      type: 'success',
      text: 'បានបន្ថែមមុខម្ហូបថ្មីចូលក្នុងតារាង tbl_menu_items ដោយជោគជ័យ!',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-semibold text-amber-700">
            ADMINISTRATION CONSOLE · PROCESS 2.0 & 5.0
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធមជ្ឈិម (Administrator Dashboard)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            គ្រប់គ្រងចន្លោះម៉ោងបញ្ជាទិញស្វ័យប្រវត្តិ (Cut-off Time Window), បូកសរុបបញ្ជីរួម (Batch Processing), ម៉ឺនុយអាហារ និងរបាយការណ៍ចំណាយ។
          </p>
        </div>

        {/* Sub-navigation Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start">
          <button
            type="button"
            onClick={() => setActiveSubTab('cutoff')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'cutoff'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>កំណត់ម៉ោង Cut-off & Batch</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('menu')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'menu'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>គ្រប់គ្រងមុខម្ហូប ({menuItems.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'reports'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>របាយការណ៍ចំណាយ (Reports)</span>
          </button>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">ស្ថានភាពប្រព័ន្ធទទួលការកម្ម៉ង់</div>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {windowEval.isOpen
              ? 'កំពុងបើកទទួលការកម្ម៉ង់ (OPEN)'
              : 'បានបិទការទទួល (CLOSED)'}
          </div>
          <div className="text-xs text-slate-600 font-mono-tabular mt-1">
            ម៉ោងសល់៖ {windowEval.formattedCountdown} (Cut-off {activeWindow.end_time})
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">ចំនួនវិក្កយបត្របញ្ជាទិញសរុប</div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
            {report.totalOrdersCount} វិក្កយបត្រ
          </div>
          <div className="text-xs text-slate-600 mt-1">
            សរុបចំនួន {report.totalPortionsCount} ប្រអប់/កែវ
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">ចំណាយអាហារសរុបប្រចាំថ្ងៃ (USD)</div>
          <div className="text-2xl font-bold text-amber-700 font-mono-tabular mt-1">
            {formatUsd(report.totalRevenueUsd)}
          </div>
          <div className="text-xs text-slate-600 font-mono-tabular mt-1">
            គិតជាប្រាក់រៀល៖ {formatKhr(report.totalRevenueUsd)}
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">គណនីបុគ្គលិក និងភោជនីយដ្ឋានដៃគូ</div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
            {users.length} គណនី · {restaurants.length} ហាង
          </div>
          <div className="text-xs text-slate-600 mt-1">
            តារាង tbl_users & tbl_restaurants
          </div>
        </div>
      </div>

      {/* SUBTAB 1: CUT-OFF TIME WINDOW & BATCH CONSOLIDATION */}
      {activeSubTab === 'cutoff' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 columns: Time Window Configuration */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  ការកំណត់ចន្លោះម៉ោងបញ្ជាទិញ (Time Window Management)
                </h2>
                <p className="text-xs text-slate-500">
                  តារាង tbl_time_windows · កំណត់ម៉ោងបើក និងបិទទទួលការកម្ម៉ង់ដោយស្វ័យប្រវត្តិ
                </p>
              </div>
              <select
                aria-label="ជ្រើសរើសវេនបញ្ជាទិញ"
                value={activeWindow.window_id}
                onChange={(e) => onSelectWindowId(Number(e.target.value))}
                className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-900"
              >
                {windows.map((w) => (
                  <option key={w.window_id} value={w.window_id}>
                    {w.window_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="window-start-time"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  ម៉ោងចាប់ផ្តើមបើក (start_time)
                </label>
                <input
                  id="window-start-time"
                  type="time"
                  value={activeWindow.start_time}
                  onChange={(e) =>
                    onUpdateWindow({ ...activeWindow, start_time: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-tabular"
                />
              </div>

              <div>
                <label
                  htmlFor="window-end-time"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  ម៉ោងបិទទទួល (end_time / Cut-off)
                </label>
                <input
                  id="window-end-time"
                  type="time"
                  value={activeWindow.end_time}
                  onChange={(e) =>
                    onUpdateWindow({ ...activeWindow, end_time: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-tabular"
                />
              </div>

              <div>
                <label
                  htmlFor="window-delivery-time"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  ម៉ោងដឹកដល់ស្ថាប័ន (delivery_time)
                </label>
                <input
                  id="window-delivery-time"
                  type="time"
                  value={activeWindow.delivery_time}
                  onChange={(e) =>
                    onUpdateWindow({ ...activeWindow, delivery_time: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono-tabular"
                />
              </div>
            </div>

            {/* Automated Cut-off Simulator & Manual Override */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    ការធ្វើតេស្តម៉ោងប្រព័ន្ធ និងបិទស្វ័យប្រវត្តិ (Automated Cut-off Test)
                  </div>
                  <p className="text-xs text-slate-600">
                    សាកល្បងផ្លាស់ប្តូរម៉ោងប្រព័ន្ធ ដើម្បីពិនិត្យមើលដំណើរការបិទការទទួល Order ស្វ័យប្រវត្តិនៅម៉ោង {activeWindow.end_time}៖
                  </p>
                </div>
                <span className="font-mono-tabular text-sm font-bold text-slate-900">
                  ម៉ោងប្រព័ន្ធ៖ {simulatedTimeStr}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onChangeSimulatedTime('09:45');
                    onUpdateWindow({ ...activeWindow, status: 'Open' });
                  }}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    simulatedTimeStr === '09:45' && activeWindow.status === 'Open'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  កំណត់ម៉ោង 09:45 AM (សល់ 45 នាទី - បើក)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeSimulatedTime('10:25');
                    onUpdateWindow({ ...activeWindow, status: 'Open' });
                  }}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    simulatedTimeStr === '10:25' && activeWindow.status === 'Open'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  កំណត់ម៉ោង 10:25 AM (ជិតដល់ម៉ោង Cut-off)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeSimulatedTime('10:35');
                  }}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    simulatedTimeStr === '10:35'
                      ? 'bg-red-700 text-white border-red-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  កំណត់ម៉ោង 10:35 AM (ផុតម៉ោង Cut-off ស្វ័យប្រវត្តិ)
                </button>
              </div>
            </div>

            {/* Direct Manual Open / Close Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onChangeSimulatedTime('09:45');
                    onUpdateWindow({ ...activeWindow, status: 'Open' });
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    activeWindow.status === 'Open' && windowEval.isOpen
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Unlock className="w-4 h-4" />
                  <span>បើកទទួលការកម្ម៉ង់ (Open Window)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateWindow({ ...activeWindow, status: 'Closed' })
                  }
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    !windowEval.isOpen
                      ? 'bg-red-700 text-white border-red-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>បិទការទទួល (Close Window)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 5 columns: One-Click Batch Order Consolidation Action */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-amber-700">
                PROCESS 4.0 · BATCH ORDER CONSOLIDATION
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                បូកសរុបបញ្ជីបញ្ជាទិញរួម និងបញ្ជូនទៅភោជនីយដ្ឋាន (KDS)
              </h3>
              <p className="text-sm text-slate-600">
                នៅពេលដល់ម៉ោងកំណត់ Cut-off ({activeWindow.end_time}) ប្រព័ន្ធនឹងបិទការទទួលការកម្ម៉ង់បន្ថែម ហើយប្រមូលបញ្ជីមុខម្ហូបពីបុគ្គលិកទាំងអស់មកបូកសរុបតាមភោជនីយដ្ឋានដៃគូក្នុងពេលតែមួយ។
              </p>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>ចំនួនការកម្ម៉ង់ក្នុងវេននេះ៖</span>
                  <span className="font-bold font-mono-tabular">
                    {orders.filter((o) => o.window_id === activeWindow.window_id).length} វិក្កយបត្រ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>បរិមាណអាហារសរុប៖</span>
                  <span className="font-bold font-mono-tabular text-amber-700">
                    {report.totalPortionsCount} ប្រអប់/កែវ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ភោជនីយដ្ឋានដៃគូពាក់ព័ន្ធ៖</span>
                  <span className="font-bold font-mono-tabular">
                    {restaurants.length} ភោជនីយដ្ឋាន
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onConsolidateAndLockWindow}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>បិទម៉ោង Cut-off & បញ្ជូនបញ្ជីរួមទៅផ្ទះបាយ (KDS)</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 2: MENU & RESTAURANT CRUD */}
      {activeSubTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add New Dish Form */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              បន្ថែមមុខម្ហូបថ្មី (Add to tbl_menu_items)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              បញ្ចូលព័ត៌មានមុខម្ហូប តម្លៃ និងភោជនីយដ្ឋានដៃគូសម្រាប់បង្ហាញលើទំព័រកម្ម៉ង់របស់បុគ្គលិក
            </p>

            {formFeedback && (
              <div
                className={`mb-4 rounded-lg border px-4 py-2.5 text-xs font-medium ${
                  formFeedback.type === 'error'
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                }`}
              >
                {formFeedback.text}
              </div>
            )}

            <form onSubmit={handleAddDishSubmit} className="space-y-3.5">
              <div>
                <label
                  htmlFor="dish-name-kh"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  ឈ្មោះមុខម្ហូប (ភាសាខ្មែរ) *
                </label>
                <input
                  id="dish-name-kh"
                  type="text"
                  value={newItemNameKh}
                  onChange={(e) => setNewItemNameKh(e.target.value)}
                  placeholder="ឧ. បាយឆាកាពិសាច់ជ្រូកបីជាន់"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="dish-name-en"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    ឈ្មោះភាសាអង់គ្លេស
                  </label>
                  <input
                    id="dish-name-en"
                    type="text"
                    value={newItemNameEn}
                    onChange={(e) => setNewItemNameEn(e.target.value)}
                    placeholder="Shrimp Paste Fried Rice"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dish-price"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    តម្លៃ (USD) *
                  </label>
                  <input
                    id="dish-price"
                    type="number"
                    step="0.25"
                    min="0.50"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono-tabular"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="dish-category"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    ប្រភេទម្ហូប (tbl_categories)
                  </label>
                  <select
                    id="dish-category"
                    value={newItemCatId}
                    onChange={(e) => setNewItemCatId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dish-restaurant"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    ភោជនីយដ្ឋាន (tbl_restaurants)
                  </label>
                  <select
                    id="dish-restaurant"
                    value={newItemRestId}
                    onChange={(e) => setNewItemRestId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    {restaurants.map((r) => (
                      <option key={r.restaurant_id} value={r.restaurant_id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="dish-artwork"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  រូបភាពតំណាងមុខម្ហូប (Dish Illustration)
                </label>
                <select
                  id="dish-artwork"
                  value={newItemArtwork}
                  onChange={(e) => setNewItemArtwork(e.target.value as DishArtworkType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="fish_amok">អាម៉ុកត្រីខ្មែរ (Fish Amok)</option>
                  <option value="beef_lok_lak">បាយឡុកឡាក់សាច់គោ (Beef Lok Lak)</option>
                  <option value="kuy_teav">គុយទាវភ្នំពេញ (Kuy Teav Soup)</option>
                  <option value="roast_duck">បាយទាខ្វៃទឹកឃ្មុំ (Roast Duck Rice)</option>
                  <option value="lemongrass_chicken">មាន់អាំងបុកល្ហុង (Grilled Chicken)</option>
                  <option value="pork_rice">បាយសាច់ជ្រូកអាំង (Grilled Pork Rice)</option>
                  <option value="iced_palm_coffee">កាហ្វេទឹកត្នោត (Iced Palm Coffee)</option>
                  <option value="passion_lime_soda">ទឹកផាសិនក្រូចឆ្មារ (Passionfruit Cooler)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dish-desc"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  ពិពណ៌នាគ្រឿងផ្សំ (Description)
                </label>
                <textarea
                  id="dish-desc"
                  rows={2}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="បញ្ជាក់ពីរសជាតិ និងគ្រឿងផ្សំ..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>រក្សាទុកមុខម្ហូបថ្មីចូលប្រព័ន្ធ</span>
              </button>
            </form>
          </div>

          {/* Menu Items Table */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              បញ្ជីមុខម្ហូបក្នុងប្រព័ន្ធបច្ចុប្បន្ន ({menuItems.length} មុខ)
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-3">ឈ្មោះមុខម្ហូប</th>
                    <th className="py-3 px-3 text-right">តម្លៃ</th>
                    <th className="py-3 px-3">ស្ថានភាព</th>
                    <th className="py-3 px-3 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {menuItems.map((item) => (
                    <tr key={item.item_id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono-tabular text-xs text-slate-500">
                        #{item.item_id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{item.item_name}</div>
                        <div className="text-xs text-slate-500">{item.item_name_en}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono-tabular font-semibold text-slate-900 whitespace-nowrap">
                        {formatUsd(item.price)}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => onToggleMenuItemAvailability(item.item_id)}
                          className={`text-xs font-semibold underline ${
                            item.is_available ? 'text-emerald-700' : 'text-slate-400'
                          }`}
                        >
                          {item.is_available ? 'មានលក់ (Available)' : 'អស់ស្តុក (Paused)'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteMenuItem(item.item_id)}
                          aria-label={`លុបមុខម្ហូប ${item.item_name}`}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: REPORTS & ANALYTICS */}
      {activeSubTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Spend by Department */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              របាយការណ៍ចំណាយតាមផ្នែក និងមហាវិទ្យាល័យ (Department Expense Report)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Process 5.0 Report Generation · សម្រាប់ផ្នែករដ្ឋបាល និងគណនេយ្យផ្ទៀងផ្ទាត់ចំណាយប្រចាំថ្ងៃ
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4">ផ្នែក / មហាវិទ្យាល័យ (Department)</th>
                    <th className="py-3 px-4 text-right">ចំនួនវិក្កយបត្រ</th>
                    <th className="py-3 px-4 text-right">ចំណាយសរុប (USD)</th>
                    <th className="py-3 px-4 text-right">ចំណាយសរុប (KHR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {report.byDepartment.map((d) => (
                    <tr key={d.department} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {d.department}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-tabular text-slate-700">
                        {d.orderCount}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-tabular font-bold text-slate-900">
                        {formatUsd(d.totalUsd)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-tabular text-slate-600">
                        {d.totalKhr.toLocaleString('en-US')} ៛
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Spend by Payment Method */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              ការទូទាត់តាមប្រព័ន្ធ (Payment Method Breakdown)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              បែងចែកតាម KHQR, កាត់ប្រាក់ខែបុគ្គលិក និងសាច់ប្រាក់ផ្ទាល់
            </p>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
              {report.byPaymentMethod.map((pm) => (
                <div
                  key={pm.method}
                  className="flex items-center justify-between px-4 py-3.5 text-sm"
                >
                  <div>
                    <div className="font-bold text-slate-900">{pm.method}</div>
                    <div className="text-xs text-slate-500">
                      ចំនួន {pm.orderCount} វិក្កយបត្រ
                    </div>
                  </div>
                  <div className="text-right font-mono-tabular">
                    <div className="font-bold text-slate-900">
                      {formatUsd(pm.totalUsd)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatKhr(pm.totalUsd)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
