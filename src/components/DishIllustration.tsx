import React, { useState } from 'react';

interface DishIllustrationProps {
  imageKey: string;
  alt: string;
  className?: string;
}

/**
 * Renders bespoke, high-detail overhead culinary SVG artwork for each Cambodian dish,
 * or a custom URL with automatic resilient fallback so zero broken images ever occur.
 */
export const DishIllustration: React.FC<DishIllustrationProps> = ({
  imageKey,
  alt,
  className = 'w-full h-full',
}) => {
  const [imgError, setImgError] = useState(false);
  const isExternalUrl =
    imageKey.startsWith('http://') ||
    imageKey.startsWith('https://') ||
    imageKey.startsWith('/') ||
    imageKey.startsWith('data:');

  if (isExternalUrl && !imgError) {
    return (
      <img
        src={imageKey}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${className} object-cover`}
      />
    );
  }

  switch (imageKey) {
    case 'fish_amok':
      return (
        <svg
          viewBox="0 0 400 300"
          className={className}
          role="img"
          aria-label={alt}
        >
          <defs>
            <linearGradient id="bg-amok" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <radialGradient id="curry-amok" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="url(#bg-amok)" />
          {/* Woven bamboo mat texture */}
          <g stroke="#334155" strokeWidth="1" opacity="0.4">
            <line x1="0" y1="40" x2="400" y2="40" />
            <line x1="0" y1="80" x2="400" y2="80" />
            <line x1="0" y1="120" x2="400" y2="120" />
            <line x1="0" y1="160" x2="400" y2="160" />
            <line x1="0" y1="200" x2="400" y2="200" />
            <line x1="0" y1="240" x2="400" y2="240" />
          </g>
          {/* Steamed Jasmine Rice Bowl on top right */}
          <circle cx="305" cy="95" r="56" fill="#334155" />
          <circle cx="305" cy="95" r="48" fill="#F8FAFC" />
          <circle cx="300" cy="90" r="38" fill="#F1F5F9" />
          <circle cx="305" cy="92" r="4" fill="#15803D" />
          <circle cx="314" cy="98" r="3" fill="#15803D" />
          {/* Banana Leaf Cup (Kanthong) */}
          <polygon points="85,155 150,70 245,95 265,195 180,255 95,225" fill="#14532D" />
          <polygon points="95,160 155,82 238,105 252,190 178,242 105,215" fill="#166534" />
          <circle cx="176" cy="162" r="68" fill="#15803D" />
          {/* Golden Fish Amok Curry */}
          <circle cx="176" cy="162" r="58" fill="url(#curry-amok)" />
          {/* Fish fillets texture */}
          <ellipse cx="160" cy="150" rx="22" ry="14" fill="#FBBF24" opacity="0.7" transform="rotate(-15 160 150)" />
          <ellipse cx="195" cy="172" rx="24" ry="15" fill="#FBBF24" opacity="0.7" transform="rotate(20 195 172)" />
          <ellipse cx="165" cy="182" rx="18" ry="12" fill="#FDE68A" opacity="0.55" />
          {/* Coconut cream swirl */}
          <path
            d="M 145 155 Q 175 130 205 158 Q 185 185 155 172 Q 170 155 190 162"
            fill="none"
            stroke="#FFFBEB"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Red chili & kaffir lime julienne */}
          <path d="M 162 145 Q 178 160 194 148" fill="none" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 155 168 Q 176 156 188 178" fill="none" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
          <line x1="168" y1="142" x2="185" y2="176" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="186" y1="145" x2="164" y2="174" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'beef_lok_lak':
      return (
        <svg viewBox="0 0 400 300" className={className} role="img" aria-label={alt}>
          <rect width="400" height="300" fill="#1C1917" />
          {/* Ceramic Plate */}
          <circle cx="190" cy="152" r="118" fill="#E7E5E4" />
          <circle cx="190" cy="152" r="104" fill="#FAFAF9" />
          {/* Fresh Lettuce & Tomato ring */}
          <circle cx="150" cy="120" r="36" fill="#22C55E" opacity="0.85" />
          <circle cx="135" cy="160" r="34" fill="#16A34A" opacity="0.85" />
          <circle cx="122" cy="140" r="16" fill="#EF4444" />
          <circle cx="160" cy="202" r="16" fill="#EF4444" />
          {/* Seared Kampot Pepper Beef Cubes */}
          <g fill="#451A03" stroke="#78350F" strokeWidth="1.5">
            <rect x="120" y="118" width="26" height="22" rx="6" transform="rotate(-12 133 129)" />
            <rect x="148" y="112" width="28" height="24" rx="6" transform="rotate(8 162 124)" />
            <rect x="132" y="144" width="28" height="22" rx="6" transform="rotate(5 146 155)" />
            <rect x="162" y="138" width="26" height="24" rx="6" transform="rotate(-18 175 150)" />
            <rect x="142" y="168" width="28" height="22" rx="6" transform="rotate(14 156 179)" />
            <rect x="172" y="164" width="25" height="22" rx="6" transform="rotate(-6 184 175)" />
          </g>
          {/* Sunny-side up Fried Egg */}
          <path
            d="M 205 98 Q 255 88 268 135 Q 275 182 228 195 Q 188 192 195 145 Z"
            fill="#FFFFFF"
            stroke="#F59E0B"
            strokeWidth="2"
          />
          <circle cx="232" cy="144" r="21" fill="#F59E0B" />
          <circle cx="226" cy="138" r="6" fill="#FEF3C7" opacity="0.8" />
          {/* Kampot Pepper & Lime Dipping Bowl */}
          <circle cx="338" cy="225" r="38" fill="#292524" stroke="#57534E" strokeWidth="3" />
          <circle cx="338" cy="225" r="28" fill="#D97706" opacity="0.9" />
          <circle cx="332" cy="220" r="2.5" fill="#1C1917" />
          <circle cx="344" cy="226" r="2.5" fill="#1C1917" />
          <circle cx="336" cy="233" r="2.5" fill="#1C1917" />
          <path d="M 335 205 A 16 16 0 0 1 356 222 Z" fill="#84CC16" />
        </svg>
      );

    case 'kuy_teav':
      return (
        <svg viewBox="0 0 400 300" className={className} role="img" aria-label={alt}>
          <rect width="400" height="300" fill="#0F172A" />
          {/* Soup Bowl Outer */}
          <circle cx="200" cy="152" r="116" fill="#1E293B" stroke="#475569" strokeWidth="4" />
          <circle cx="200" cy="152" r="104" fill="#FEF3C7" />
          {/* Golden Aromatic Broth */}
          <circle cx="200" cy="152" r="96" fill="#FDE68A" />
          <circle cx="200" cy="152" r="88" fill="#F59E0B" opacity="0.28" />
          {/* Rice Noodles strands */}
          <g fill="none" stroke="#FFFBEB" strokeWidth="4.5" strokeLinecap="round">
            <path d="M 135 140 Q 180 110 235 142" />
            <path d="M 130 156 Q 190 128 245 158" />
            <path d="M 140 172 Q 195 148 240 176" />
            <path d="M 150 188 Q 200 165 232 190" />
          </g>
          {/* Beef slices & Meatballs */}
          <ellipse cx="165" cy="122" rx="22" ry="13" fill="#78350F" />
          <ellipse cx="202" cy="116" rx="20" ry="12" fill="#92400E" />
          <circle cx="238" cy="138" r="14" fill="#B45309" />
          <circle cx="246" cy="168" r="13" fill="#B45309" />
          {/* Shrimp */}
          <path
            d="M 152 178 Q 135 198 162 212 Q 182 212 178 195"
            fill="none"
            stroke="#FB7185"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Scallions, Cilantro & Fried Garlic */}
          <circle cx="188" cy="152" r="5" fill="#16A34A" />
          <circle cx="205" cy="160" r="5" fill="#16A34A" />
          <circle cx="176" cy="166" r="4.5" fill="#22C55E" />
          <circle cx="215" cy="146" r="4" fill="#D97706" />
          <circle cx="195" cy="138" r="3.5" fill="#B45309" />
        </svg>
      );

    case 'roast_duck':
      return (
        <svg viewBox="0 0 400 300" className={className} role="img" aria-label={alt}>
          <rect width="400" height="300" fill="#18181B" />
          <rect x="45" y="38" width="310" height="224" rx="28" fill="#F4F4F5" />
          <rect x="57" y="50" width="286" height="200" rx="20" fill="#FAFAFA" />
          {/* Steamed Rice Mound */}
          <circle cx="145" cy="148" r="58" fill="#F1F5F9" />
          <circle cx="145" cy="148" r="46" fill="#FFFFFF" />
          {/* Honey Glazed Roast Duck Slices */}
          <g transform="translate(185, 82)">
            <rect x="0" y="0" width="95" height="24" rx="8" fill="#9A3412" stroke="#7C2D12" strokeWidth="2" />
            <rect x="6" y="28" width="98" height="24" rx="8" fill="#B45309" stroke="#7C2D12" strokeWidth="2" />
            <rect x="10" y="56" width="95" height="24" rx="8" fill="#9A3412" stroke="#7C2D12" strokeWidth="2" />
            <rect x="4" y="84" width="90" height="24" rx="8" fill="#B45309" stroke="#7C2D12" strokeWidth="2" />
            <rect x="0" y="112" width="82" height="22" rx="8" fill="#9A3412" stroke="#7C2D12" strokeWidth="2" />
          </g>
          {/* Pickled greens & cucumber */}
          <circle cx="115" cy="212" r="16" fill="#4ADE80" />
          <circle cx="138" cy="218" r="16" fill="#22C55E" />
          <circle cx="95" cy="90" r="22" fill="#451A03" />
          <circle cx="95" cy="90" r="16" fill="#78350F" />
        </svg>
      );

    case 'lemongrass_chicken':
      return (
        <svg viewBox="0 0 400 300" className={className} role="img" aria-label={alt}>
          <rect width="400" height="300" fill="#14532D" />
          <circle cx="200" cy="150" r="118" fill="#FEFCE8" />
          <circle cx="200" cy="150" r="105" fill="#FFFBEB" />
          {/* Grilled Chicken Golden Quarter */}
          <ellipse cx="152" cy="155" rx="52" ry="68" fill="#D97706" transform="rotate(-15 152 155)" />
          <ellipse cx="152" cy="155" rx="42" ry="56" fill="#B45309" transform="rotate(-15 152 155)" />
          {/* Grill char marks */}
          <line x1="122" y1="125" x2="175" y2="115" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
          <line x1="120" y1="148" x2="182" y2="136" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
          <line x1="125" y1="172" x2="180" y2="160" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
          {/* Green Papaya Salad */}
          <circle cx="248" cy="145" r="46" fill="#ECFCCB" />
          <g stroke="#65A30D" strokeWidth="3" strokeLinecap="round">
            <line x1="220" y1="125" x2="270" y2="145" />
            <line x1="225" y1="155" x2="275" y2="130" />
            <line x1="218" y1="142" x2="268" y2="168" />
          </g>
          <circle cx="235" cy="132" r="8" fill="#EF4444" />
          <circle cx="262" cy="158" r="8" fill="#EF4444" />
          <circle cx="248" cy="148" r="4" fill="#92400E" />
          <circle cx="256" cy="136" r="4" fill="#92400E" />
        </svg>
      );

    case 'pork_rice':
      return (
        <svg viewBox="0 0 400 300" className={className} role="img" aria-label={alt}>
          <rect width="400" height="300" fill="#1E293B" />
          <circle cx="195" cy="152" r="114" fill="#F8FAFC" />
          <circle cx="195" cy="152" r="100" fill="#F1F5F9" />
          {/* Broken Rice */}
          <circle cx="165" cy="155" r="64" fill="#FFFFFF" />
          {/* Caramelized Grilled Pork */}
          <rect x="135" y="105" width="88" height="58" rx="14" fill="#B45309" transform="rotate(-8 179 134)" />
          <line x1="145" y1="122" x2="212" y2="114" stroke="#451A03" strokeWidth="3.5" />
          <line x1="145" y1="140" x2="215" y2="132" stroke="#451A03" strokeWidth="3.5" />
          {/* Braised Egg */}
          <circle cx="238" cy="175" r="24" fill="#92400E" />
          <circle cx="238" cy="175" r="18" fill="#FEF3C7" />
          <circle cx="238" cy="175" r="10" fill="#F59E0B" />
          {/* Cucumber slices */}
          <circle cx="145" cy="202" r="15" fill="#22C55E" />
          <circle cx="170" cy="210" r="15" fill="#4ADE80" />
        </svg>
      );

    case 'iced_palm_coffee':
      return (
        <svg viewBox="0 0 400 300" className={className} role="img" aria-label={alt}>
          <rect width="400" height="300" fill="#27272A" />
          <circle cx="200" cy="150" r="110" fill="#3F3F46" opacity="0.5" />
          {/* Tall Iced Latte Glass */}
          <polygon points="145,55 255,55 240,255 160,255" fill="#FDE68A" opacity="0.9" />
          {/* Bottom Palm Sugar Syrup layer */}
          <polygon points="157,210 243,210 240,255 160,255" fill="#78350F" />
          {/* Middle Creamy Milk layer */}
          <polygon points="150,125 250,125 243,210 157,210" fill="#FFFBEB" />
          {/* Top Espresso layer */}
          <polygon points="146,68 254,68 250,125 150,125" fill="#92400E" />
          {/* Ice Cubes */}
          <rect x="162" y="82" width="28" height="24" rx="5" fill="#FFFFFF" opacity="0.65" />
          <rect x="202" y="88" width="28" height="24" rx="5" fill="#FFFFFF" opacity="0.65" />
          <rect x="180" y="135" width="30" height="25" rx="5" fill="#FFFFFF" opacity="0.55" />
          {/* Straw */}
          <line x1="215" y1="28" x2="185" y2="235" stroke="#15803D" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 400 300" className={className} role="img" aria-label={alt}>
          <rect width="400" height="300" fill="#064E3B" />
          <circle cx="200" cy="150" r="108" fill="#047857" opacity="0.5" />
          {/* Tall Refreshing Glass */}
          <polygon points="148,58 252,58 238,252 162,252" fill="#FDE047" opacity="0.88" />
          <polygon points="156,175 244,175 238,252 162,252" fill="#F59E0B" />
          {/* Lime wheel & passionfruit seeds */}
          <circle cx="185" cy="125" r="22" fill="#84CC16" stroke="#ECFCCB" strokeWidth="3" />
          <circle cx="215" cy="195" r="3" fill="#451A03" />
          <circle cx="195" cy="212" r="3" fill="#451A03" />
          <circle cx="178" cy="198" r="3" fill="#451A03" />
          <circle cx="208" cy="225" r="3" fill="#451A03" />
          <line x1="220" y1="30" x2="190" y2="235" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
        </svg>
      );
  }
};
