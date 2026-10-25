import React from 'react';
import { X, CheckCircle2, QrCode, Building2, Wallet, Tag } from 'lucide-react';
import type { CartItem, PaymentMethod, TblTimeWindow, TblUser } from '../types/database.ts';
import { formatUsd, formatKhr, calculateCartSummary } from '../utils/orderingLogic.ts';

interface KhqrModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  promoCode: string;
  currentUser: TblUser;
  activeWindow: TblTimeWindow;
  selectedPayment: PaymentMethod;
  onSelectPayment: (method: PaymentMethod) => void;
  deliveryDropPoint: string;
  onChangeDropPoint: (val: string) => void;
  orderNotes: string;
  onChangeOrderNotes: (val: string) => void;
  onConfirmOrder: () => void;
}

export const KhqrModal: React.FC<KhqrModalProps> = ({
  isOpen,
  onClose,
  cart,
  promoCode,
  currentUser,
  activeWindow,
  selectedPayment,
  onSelectPayment,
  deliveryDropPoint,
  onChangeDropPoint,
  orderNotes,
  onChangeOrderNotes,
  onConfirmOrder,
}) => {
  if (!isOpen) return null;

  const summary = calculateCartSummary(cart, promoCode);

  // Deterministic 11x11 QR matrix pattern for KHQR visual display
  const qrPattern = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
    [0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-[#FDF2F7]">
          <div>
            <h2 id="checkout-modal-title" className="text-lg font-bold text-slate-900">
              ផ្ទៀងផ្ទាត់ការកម្ម៉ង់ និងទូទាត់ប្រាក់ (Checkout & KHQR)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {activeWindow.window_name} · ម៉ោងបិទទទួល {activeWindow.end_time} · ដឹកដល់ម៉ោង {activeWindow.delivery_time}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="បិទផ្ទាំងទូទាត់ប្រាក់"
            className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Staff & Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5 border-b border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                អ្នកបញ្ជាទិញ (Staff / User)
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900">
                <div className="font-semibold">{currentUser.full_name}</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  អត្តលេខ៖ {currentUser.student_or_staff_code} · {currentUser.department}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="delivery-drop-input"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                ទីតាំងទទួលអាហារក្នុងស្ថាប័ន (Drop-off Point)
              </label>
              <input
                id="delivery-drop-input"
                type="text"
                value={deliveryDropPoint}
                onChange={(e) => onChangeDropPoint(e.target.value)}
                placeholder="ឧ. អគារ A - បន្ទប់ IT Lab"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#D70F64] focus:outline-hidden"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="order-notes-input"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                កំណត់ចំណាំពិសេសទៅកាន់អ្នកដឹកជញ្ជូន និងផ្ទះបាយ (Rider & Kitchen Notes)
              </label>
              <input
                id="order-notes-input"
                type="text"
                value={orderNotes}
                onChange={(e) => onChangeOrderNotes(e.target.value)}
                placeholder="ឧ. អត់ហឹរ, សូមដាក់ម្ទេសដាច់, ទុកនៅតុទទួលភ្ញៀវអគារ A..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-[#D70F64] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Itemized Summary + Payment Selector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left 7 cols: Order items */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                បញ្ជីមុខម្ហូបបានជ្រើសរើស ({summary.totalItems} ប្រអប់/កែវ)
              </h3>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-slate-50/50">
                {cart.map((entry) => (
                  <div
                    key={entry.item.item_id}
                    className="flex items-center justify-between px-3.5 py-2.5 text-sm"
                  >
                    <div className="pr-2">
                      <div className="font-medium text-slate-900">
                        {entry.item.item_name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono-tabular">
                        {formatUsd(entry.item.price)} × {entry.quantity}
                        {entry.special_request ? ` · ${entry.special_request}` : ''}
                      </div>
                    </div>
                    <div className="font-semibold text-slate-900 font-mono-tabular whitespace-nowrap">
                      {formatUsd(entry.item.price * entry.quantity)}
                    </div>
                  </div>
                ))}
                {summary.discountUsd > 0 && (
                  <div className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-[#D70F64] bg-[#FDF2F7]">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>បញ្ចុះតម្លៃកូដ {promoCode.toUpperCase()} (15%)</span>
                    </span>
                    <span className="font-mono-tabular">
                      -{formatUsd(summary.discountUsd)}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Method Tabs */}
              <div className="pt-2">
                <span className="block text-xs font-semibold text-slate-700 mb-2">
                  ជ្រើសរើសវិធីសាស្ត្រទូទាត់ប្រាក់ (Payment Method)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectPayment('KHQR')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                      selectedPayment === 'KHQR'
                        ? 'border-[#D70F64] bg-[#FDF2F7] text-[#D70F64]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mb-1 text-[#D70F64]" />
                    <span>KHQR (បាគង)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPayment('Payroll')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                      selectedPayment === 'Payroll'
                        ? 'border-[#D70F64] bg-[#FDF2F7] text-[#D70F64]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mb-1 text-slate-700" />
                    <span>កាត់ប្រាក់ខែ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPayment('Cash')}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                      selectedPayment === 'Cash'
                        ? 'border-[#D70F64] bg-[#FDF2F7] text-[#D70F64]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="w-4 h-4 mb-1 text-emerald-600" />
                    <span>សាច់ប្រាក់ផ្ទាល់</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Cambodia National QR Code Standard (KHQR) Card */}
            <div className="md:col-span-5">
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="bg-[#E11D48] px-4 py-2.5 text-center text-white">
                  <div className="text-sm font-bold tracking-wider font-mono-tabular">
                    KHQR · BAKONG
                  </div>
                  <div className="text-[11px] opacity-90">
                    Cambodia National QR Code Standard
                  </div>
                </div>
                <div className="p-4 text-center space-y-3">
                  <div>
                    <div className="text-xs text-slate-500">គណនីទទួលប្រាក់ស្ថាប័ន</div>
                    <div className="text-sm font-bold text-slate-900">
                      PANDABATCH DIU SYSTEM
                    </div>
                    <div className="text-lg font-bold text-[#D70F64] font-mono-tabular mt-1">
                      {formatUsd(summary.totalUsd)} / {formatKhr(summary.totalUsd)}
                    </div>
                  </div>

                  {/* Deterministic SVG QR Code */}
                  <div className="mx-auto w-36 h-36 p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 11 11" className="w-full h-full">
                      {qrPattern.map((row, rIdx) =>
                        row.map((cell, cIdx) =>
                          cell === 1 ? (
                            <rect
                              key={`${rIdx}-${cIdx}`}
                              x={cIdx}
                              y={rIdx}
                              width={0.92}
                              height={0.92}
                              fill="#0F172A"
                            />
                          ) : null
                        )
                      )}
                    </svg>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    {selectedPayment === 'KHQR'
                      ? 'ស្កេនតាម ABA, ACLEDA, Wing ឬ Bakong រួចចុចបញ្ជាក់ការកម្ម៉ង់'
                      : selectedPayment === 'Payroll'
                      ? 'កត់ត្រាចូលបញ្ជីចំណាយបុគ្គលិកប្រចាំខែដោយស្វ័យប្រវត្តិ'
                      : 'ទូទាត់សាច់ប្រាក់ពេលអាហារដឹកដល់ទីតាំងស្ថាប័ន'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <div className="text-xs text-slate-500">
              ទឹកប្រាក់សរុបត្រូវទូទាត់ · ដឹកជញ្ជូនឥតគិតថ្លៃ ($0.00)
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono-tabular">
              {formatUsd(summary.totalUsd)}{' '}
              <span className="text-sm font-normal text-slate-600">
                ({formatKhr(summary.totalUsd)})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors whitespace-nowrap shrink-0"
            >
              បោះបង់ (Cancel)
            </button>
            <button
              type="button"
              onClick={onConfirmOrder}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#D70F64] hover:bg-[#B80C55] rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>បញ្ជាក់ការបញ្ជាទិញឥឡូវនេះ (Confirm Order)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
