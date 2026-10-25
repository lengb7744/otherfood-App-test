import React, { useState } from 'react';
import {
  Printer,
  Download,
  ChefHat,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
} from 'lucide-react';
import type {
  TblBatchOrder,
  TblRestaurant,
  TblTimeWindow,
  BatchOrderStatus,
} from '../types/database.ts';
import { formatUsd, formatKhr } from '../utils/orderingLogic.ts';

interface KdsBatchViewProps {
  batches: TblBatchOrder[];
  restaurants: TblRestaurant[];
  activeWindow: TblTimeWindow;
  onUpdateBatchStatus: (batchId: number, nextStatus: BatchOrderStatus) => void;
}

const STATUS_STEPS: Array<{
  status: BatchOrderStatus;
  labelKh: string;
  labelEn: string;
}> = [
  { status: 'Pending', labelKh: '១. រង់ចាំផ្ទះបាយទទួល', labelEn: 'Pending Kitchen' },
  { status: 'Preparing', labelKh: '២. កំពុងចម្អិនអាហារ', labelEn: 'Preparing in Kitchen' },
  { status: 'Delivering', labelKh: '៣. កំពុងដឹកជញ្ជូន', labelEn: 'Out for Delivery' },
  { status: 'Delivered', labelKh: '៤. ដឹកដល់ស្ថាប័នរួចរាល់', labelEn: 'Delivered to Campus' },
];

export const KdsBatchView: React.FC<KdsBatchViewProps> = ({
  batches,
  restaurants,
  activeWindow,
  onUpdateBatchStatus,
}) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | 'all'>('all');
  const [expandedBatchIds, setExpandedBatchIds] = useState<Record<number, boolean>>({
    501: true,
    502: true,
    503: true,
  });

  const restaurantMap = new Map<number, TblRestaurant>(
    restaurants.map((r) => [r.restaurant_id, r])
  );

  const filteredBatches =
    selectedRestaurantId === 'all'
      ? batches
      : batches.filter((b) => b.restaurant_id === selectedRestaurantId);

  const totalConsolidatedDishes = filteredBatches.reduce(
    (sum, b) => sum + b.total_items,
    0
  );
  const totalConsolidatedAmount = filteredBatches.reduce(
    (sum, b) => Number((sum + b.total_amount).toFixed(2)),
    0
  );

  const toggleExpand = (batchId: number) => {
    setExpandedBatchIds((prev) => ({
      ...prev,
      [batchId]: prev[batchId] === undefined ? false : !prev[batchId],
    }));
  };

  const handleDownloadCsv = () => {
    const rows: string[][] = [
      ['Batch ID', 'Restaurant', 'Dish Name', 'Unit Price (USD)', 'Total Quantity', 'Subtotal (USD)', 'Staff Recipients'],
    ];
    for (const batch of filteredBatches) {
      const restName = restaurantMap.get(batch.restaurant_id)?.name || `Restaurant #${batch.restaurant_id}`;
      for (const line of batch.lines) {
        const recipientsStr = line.recipients
          .map((r) => `${r.user_name} (${r.department}) x${r.quantity}${r.notes ? ` [${r.notes}]` : ''}`)
          .join('; ');
        rows.push([
          String(batch.batch_id),
          restName,
          line.item_name,
          line.unit_price.toFixed(2),
          String(line.total_quantity),
          line.subtotal.toFixed(2),
          recipientsStr,
        ]);
      }
    }
    const csvContent =
      '\uFEFF' +
      rows
        .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KDS_Batch_Order_Window_${activeWindow.window_id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-semibold text-amber-700">
            KITCHEN DISPLAY SYSTEM (KDS) · PROCESS 4.0 BATCH ORDER CONSOLIDATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            ប្រព័ន្ធបង្ហាញទិន្នន័យផ្ទះបាយ និងដឹកជញ្ជូនរួម (Batch Order View)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            បូកសរុបបញ្ជីមុខម្ហូបពីបុគ្គលិកទាំងអស់ក្នុងវេនតែមួយ ដើម្បីចុងភៅរៀបចំអាហារតាមបរិមាណសរុប និងដឹកជញ្ជូនដល់ស្ថាប័នទាន់ម៉ោង {activeWindow.delivery_time}។
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 no-print">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>ទាញយកបញ្ជីរួម (CSV)</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពបញ្ជីផ្ទះបាយ (Print / PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">វេនបញ្ជាទិញបច្ចុប្បន្ន</div>
          <div className="text-base font-bold text-slate-900 mt-1">
            {activeWindow.window_name}
          </div>
          <div className="text-xs text-slate-600 mt-1 font-mono-tabular">
            Cut-off: {activeWindow.end_time} · ដឹកដល់: {activeWindow.delivery_time}
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">ភោជនីយដ្ឋានដៃគូទទួលបញ្ជីរួម</div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
            {filteredBatches.length} ភោជនីយដ្ឋាន
          </div>
          <div className="text-xs text-slate-600 mt-1">
            តារាង tbl_batch_orders
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">បរិមាណអាហារសរុបត្រូវចម្អិន</div>
          <div className="text-2xl font-bold text-amber-700 font-mono-tabular mt-1">
            {totalConsolidatedDishes} ប្រអប់/កែវ
          </div>
          <div className="text-xs text-slate-600 mt-1">
            បូកសរុបស្វ័យប្រវត្តិ (Zero Manual Error)
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">ទឹកប្រាក់សរុបរួមក្នុងវេននេះ</div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1">
            {formatUsd(totalConsolidatedAmount)}
          </div>
          <div className="text-xs text-slate-600 font-mono-tabular mt-1">
            ស្មើនឹង {formatKhr(totalConsolidatedAmount)}
          </div>
        </div>
      </div>

      {/* Filter by Partner Restaurant */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedRestaurantId('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              selectedRestaurantId === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            គ្រប់ភោជនីយដ្ឋានដៃគូ ({batches.length})
          </button>
          {restaurants.map((r) => (
            <button
              key={r.restaurant_id}
              type="button"
              onClick={() => setSelectedRestaurantId(r.restaurant_id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedRestaurantId === r.restaurant_id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Consolidated Batch Cards per Restaurant */}
      {filteredBatches.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <ChefHat className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            មិនទាន់មានបញ្ជីបញ្ជាទិញរួមសម្រាប់ភោជនីយដ្ឋាននេះនៅឡើយទេ
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            នៅពេលបុគ្គលិកដាក់ការបញ្ជាទិញ ប្រព័ន្ធនឹងបូកសរុបបញ្ជីមុខម្ហូបចូលក្នុង KDS ដោយស្វ័យប្រវត្តិ។
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBatches.map((batch) => {
            const restaurant = restaurantMap.get(batch.restaurant_id);
            const isExpanded = expandedBatchIds[batch.batch_id] !== false;

            return (
              <div
                key={batch.batch_id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                {/* Batch Top Bar */}
                <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-tabular">
                      <span>BATCH #{batch.batch_id}</span>
                      <span>·</span>
                      <span>WINDOW #{batch.window_id}</span>
                      <span>·</span>
                      <span>រយៈពេលចម្អិន៖ ~{restaurant?.prep_lead_minutes || 20} នាទី</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      {restaurant?.name || `ភោជនីយដ្ឋាន #${batch.restaurant_id}`}
                    </h2>
                    {restaurant && (
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {restaurant.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {restaurant.address}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Interactive KDS Status Progression */}
                  <div className="flex flex-wrap items-center gap-2 no-print">
                    {STATUS_STEPS.map((step) => {
                      const active = batch.batch_status === step.status;
                      return (
                        <button
                          key={step.status}
                          type="button"
                          onClick={() => onUpdateBatchStatus(batch.batch_id, step.status)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? step.status === 'Delivered'
                                ? 'bg-emerald-700 text-white border-emerald-700'
                                : step.status === 'Delivering'
                                ? 'bg-sky-700 text-white border-sky-700'
                                : step.status === 'Preparing'
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {step.labelKh}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Consolidated Dish Production Table */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      បញ្ជីមុខម្ហូបបូកសរុបសម្រាប់ចុងភៅចម្អិន (Consolidated Kitchen Production List)
                    </h3>
                    <button
                      type="button"
                      onClick={() => toggleExpand(batch.batch_id)}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 no-print"
                    >
                      <span>{isExpanded ? 'លាក់ឈ្មោះបុគ្គលិក' : 'បង្ហាញឈ្មោះបុគ្គលិកទទួល'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                          <th className="py-3 px-4">កូដមុខម្ហូប</th>
                          <th className="py-3 px-4">ឈ្មោះមុខម្ហូបអាហារ</th>
                          <th className="py-3 px-4">បញ្ជីបុគ្គលិកកម្ម៉ង់ និងចំណាំផ្ទះបាយ (Packaging Labels)</th>
                          <th className="py-3 px-4 text-right">តម្លៃឯកតា</th>
                          <th className="py-3 px-4 text-right">ចំនួនសរុបរួម</th>
                          <th className="py-3 px-4 text-right">សរុបទឹកប្រាក់</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-sm">
                        {batch.lines.map((line) => (
                          <tr key={line.item_id} className="hover:bg-slate-50/80 align-top">
                            <td className="py-3.5 px-4 font-mono-tabular text-xs text-slate-500">
                              #{line.item_id}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{line.item_name}</div>
                              <div className="text-xs text-slate-500">{line.item_name_en}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              {isExpanded ? (
                                <div className="space-y-1.5">
                                  {line.recipients.map((rec, idx) => (
                                    <div
                                      key={`${rec.order_id}-${idx}`}
                                      className="text-xs text-slate-700 flex flex-wrap items-center gap-1.5"
                                    >
                                      <span className="font-semibold text-slate-900">
                                        {rec.user_name}
                                      </span>
                                      <span className="text-slate-400">·</span>
                                      <span className="text-slate-600">{rec.department}</span>
                                      <span className="text-slate-400">·</span>
                                      <span className="font-mono-tabular font-bold text-amber-700">
                                        ×{rec.quantity}
                                      </span>
                                      {rec.notes && (
                                        <span className="text-red-700 font-medium">
                                          ({rec.notes})
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-500">
                                  បុគ្គលិកចំនួន {line.recipients.length} នាក់
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono-tabular text-slate-700 whitespace-nowrap">
                              {formatUsd(line.unit_price)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono-tabular whitespace-nowrap">
                              <span className="text-base font-bold text-slate-900">
                                {line.total_quantity}
                              </span>{' '}
                              <span className="text-xs text-slate-500">ប្រអប់</span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono-tabular font-bold text-slate-900 whitespace-nowrap">
                              {formatUsd(line.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900 text-sm">
                          <td colSpan={4} className="py-3 px-4 text-right">
                            សរុបរួមសម្រាប់ {restaurant?.name}៖
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular text-amber-700">
                            {batch.total_items} ប្រអប់/កែវ
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular">
                            {formatUsd(batch.total_amount)} ({formatKhr(batch.total_amount)})
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
