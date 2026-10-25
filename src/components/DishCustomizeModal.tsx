import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import type { TblMenuItem, TblRestaurant } from '../types/database.ts';
import { formatUsd, formatKhr } from '../utils/orderingLogic.ts';
import { DishIllustration } from './DishIllustration.tsx';

interface DishCustomizeModalProps {
  dish: TblMenuItem | null;
  restaurant?: TblRestaurant;
  onClose: () => void;
  onAddCustomizedToCart: (
    dish: TblMenuItem,
    quantity: number,
    customNotes: string,
    extraPriceUsd: number
  ) => void;
}

const SPICE_OPTIONS = [
  { id: 'standard', labelKh: 'រសជាតិដើម (Standard)', labelEn: 'Normal' },
  { id: 'mild', labelKh: 'អត់ហឹរ / ផ្អែមតិច (Mild / Less Sweet)', labelEn: 'Mild' },
  { id: 'spicy', labelKh: 'ហឹរខ្លាំង / ដាក់ម្ទេសថែម (Extra Spicy)', labelEn: 'Spicy' },
];

const ADDON_OPTIONS = [
  { id: 'sauce_separate', labelKh: 'ដាក់ទឹកជ្រលក់ និងម្ទេសដាច់ដោយឡែក', priceUsd: 0 },
  { id: 'extra_egg', labelKh: 'ថែមពងទាចៀន / ពងទាខ ១ គ្រាប់', priceUsd: 0.5 },
  { id: 'extra_rice', labelKh: 'ថែមបាយសក្តៅៗ ១ ប្រអប់តូច', priceUsd: 0.5 },
  { id: 'extra_veggies', labelKh: 'ថែមបន្លែស្រស់ និងជ្រក់', priceUsd: 0.25 },
];

export const DishCustomizeModal: React.FC<DishCustomizeModalProps> = ({
  dish,
  restaurant,
  onClose,
  onAddCustomizedToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSpice, setSelectedSpice] = useState<string>('standard');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['sauce_separate']);
  const [customNote, setCustomNote] = useState<string>('');

  if (!dish) return null;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const extraUnitUsd = ADDON_OPTIONS.filter((a) =>
    selectedAddons.includes(a.id)
  ).reduce((sum, a) => sum + a.priceUsd, 0);

  const unitPriceWithExtras = Number((dish.price + extraUnitUsd).toFixed(2));
  const totalLineUsd = Number((unitPriceWithExtras * quantity).toFixed(2));

  const handleConfirm = () => {
    const spiceLabel =
      SPICE_OPTIONS.find((s) => s.id === selectedSpice)?.labelKh || '';
    const addonLabels = ADDON_OPTIONS.filter((a) =>
      selectedAddons.includes(a.id)
    ).map((a) => a.labelKh);

    const parts = [spiceLabel, ...addonLabels, customNote.trim()].filter(Boolean);
    onAddCustomizedToCart(dish, quantity, parts.join(' · '), extraUnitUsd);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Hero Image */}
        <div className="relative h-52 w-full bg-slate-900 shrink-0">
          <DishIllustration
            imageKey={dish.image}
            alt={dish.item_name}
            className="w-full h-full"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="បិទផ្ទាំងជ្រើសរើសមុខម្ហូប"
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Options Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs text-slate-500">
              {restaurant?.name || 'ភោជនីយដ្ឋានដៃគូ'} · {dish.calories} kcal
            </div>
            <div className="flex items-start justify-between gap-3 mt-1">
              <div>
                <h2 id="dish-modal-title" className="text-xl font-bold text-slate-900">
                  {dish.item_name}
                </h2>
                <div className="text-xs text-slate-500">{dish.item_name_en}</div>
              </div>
              <div className="text-right font-mono-tabular shrink-0">
                <div className="text-lg font-bold text-[#D70F64]">
                  {formatUsd(dish.price)}
                </div>
                <div className="text-xs text-slate-500">{formatKhr(dish.price)}</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">{dish.description}</p>
          </div>

          {/* Spice / Sweetness Required Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                ១. ជ្រើសរើសកម្រិតរសជាតិ (Taste Preference)
              </h3>
              <span className="text-xs font-semibold text-[#D70F64]">តម្រូវឱ្យជ្រើសរើស ១</span>
            </div>
            <div className="space-y-2">
              {SPICE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedSpice === opt.id
                      ? 'border-[#D70F64] bg-[#FDF2F7]'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="spice-level"
                      checked={selectedSpice === opt.id}
                      onChange={() => setSelectedSpice(opt.id)}
                      className="accent-[#D70F64] w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-900">
                      {opt.labelKh}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono-tabular">ឥតគិតថ្លៃ</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Add-ons */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                ២. បន្ថែមពិសេស (Optional Add-ons)
              </h3>
              <span className="text-xs text-slate-500">ជ្រើសរើសតាមចំណូលចិត្ត</span>
            </div>
            <div className="space-y-2">
              {ADDON_OPTIONS.map((addon) => {
                const checked = selectedAddons.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      checked
                        ? 'border-[#D70F64] bg-[#FDF2F7]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                        className="accent-[#D70F64] w-4 h-4 rounded"
                      />
                      <span className="text-xs sm:text-sm font-medium text-slate-900">
                        {addon.labelKh}
                      </span>
                    </div>
                    <span className="text-xs font-mono-tabular font-semibold text-slate-700">
                      {addon.priceUsd > 0 ? `+${formatUsd(addon.priceUsd)}` : '+$0.00'}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Special Kitchen Note */}
          <div>
            <label
              htmlFor="dish-custom-note"
              className="block text-sm font-bold text-slate-900 mb-1.5"
            >
              ៣. កំណត់ចំណាំទៅចុងភៅ (Special Instructions)
            </label>
            <input
              id="dish-custom-note"
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="ឧ. អត់ដាក់ស្លឹកខ្ទឹម, សូមបាយតិច..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#D70F64] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Bottom Quantity Stepper & Add to Cart Bar */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-4">
          <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-2 py-1.5">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="បន្ថយចំនួន"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center font-mono-tabular font-bold text-sm">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="បន្ថែមចំនួន"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-between px-5 py-3 rounded-xl bg-[#D70F64] hover:bg-[#B80C55] text-white font-semibold text-sm shadow-sm transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>ដាក់ចូលកន្ត្រក</span>
            </span>
            <span className="font-mono-tabular font-bold">
              {formatUsd(totalLineUsd)} ({formatKhr(totalLineUsd)})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
