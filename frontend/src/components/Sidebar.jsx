import React from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';
import { categories } from '../data/categories';

const Sidebar = ({ 
  selectedCategory, 
  onSelectCategory, 
  priceRange, 
  onPriceChange,
  selectedColor,
  onSelectColor,
  inStockOnly,
  onToggleInStock
}) => {
  const shades = [
    { name: 'Champagne', hex: '#f4ebe1' },
    { name: 'Oatmeal', hex: '#d5c4b0' },
    { name: 'Obsidian', hex: '#1e1b17' },
    { name: 'Terracotta', hex: '#b87352' },
    { name: 'Olive', hex: '#536256' },
    { name: 'Raw Ivory', hex: '#faf7f2' }
  ];

  return (
    <aside className="bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-7 border border-surface-container-high/60">
      {/* Category Navigation */}
      <div>
        <h3 className="font-label-lg text-label-lg font-semibold tracking-wider text-on-surface uppercase mb-3 flex items-center justify-between text-xs">
          <span>Categories</span>
          <SlidersHorizontal className="w-4 h-4 text-on-surface-variant" />
        </h3>

        <ul className="space-y-1.5 font-body-sm text-body-sm">
          <li>
            <button
              onClick={() => onSelectCategory('all')}
              className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors text-left ${
                selectedCategory === 'all'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                  : 'text-on-surface hover:text-primary hover:bg-surface-container-low'
              }`}
            >
              <span>All Collections</span>
              <span className="text-on-surface-variant text-label-sm font-label-sm text-xs">48</span>
            </button>
          </li>

          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors text-left ${
                  selectedCategory === cat.id
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span className="flex items-center gap-2">
                  {selectedCategory === cat.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  )}
                  {cat.name}
                </span>
                <span className="text-on-surface-variant text-label-sm font-label-sm text-xs">
                  {cat.itemCount || 12}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px bg-surface-container-high w-full"></div>

      {/* Price Range Slider */}
      <div>
        <h3 className="font-label-lg text-label-lg font-semibold tracking-wider text-on-surface uppercase mb-3 text-xs">
          Price Spectrum
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface">
            <span>$40</span>
            <span className="font-semibold text-primary">${priceRange}</span>
            <span>$500</span>
          </div>

          <input 
            className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary" 
            max="500" 
            min="40" 
            step="10"
            type="range" 
            value={priceRange}
            onChange={(e) => onPriceChange(Number(e.target.value))}
          />

          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 bg-surface-container-low px-3 py-1.5 rounded-lg text-body-sm font-body-sm text-on-surface flex items-center gap-1">
              <span className="text-on-surface-variant text-label-sm">$</span>
              <span className="w-full bg-transparent text-sm">40</span>
            </div>
            <span className="text-on-surface-variant font-label-sm">—</span>
            <div className="flex-1 bg-surface-container-low px-3 py-1.5 rounded-lg text-body-sm font-body-sm text-on-surface flex items-center gap-1">
              <span className="text-on-surface-variant text-label-sm">$</span>
              <span className="w-full bg-transparent text-sm">{priceRange}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-surface-container-high w-full"></div>

      {/* Material Shade Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-label-lg text-label-lg font-semibold tracking-wider text-on-surface uppercase text-xs">
            Material Shade
          </h3>
          {selectedColor && (
            <button 
              onClick={() => onSelectColor(null)}
              className="text-label-sm text-[11px] text-primary hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {shades.map((shade) => {
            const isSelected = selectedColor === shade.name;
            return (
              <button
                key={shade.name}
                type="button"
                onClick={() => onSelectColor(isSelected ? null : shade.name)}
                className={`group flex items-center gap-1.5 p-1 pr-2.5 rounded-full transition-all text-xs ${
                  isSelected 
                    ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                <span 
                  className="w-4 h-4 rounded-full shadow-inner border border-outline-variant/30 flex items-center justify-center"
                  style={{ backgroundColor: shade.hex }}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-on-surface" />}
                </span>
                <span>{shade.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-surface-container-high w-full"></div>

      {/* Stock Status Filter */}
      <div>
        <h3 className="font-label-lg text-label-lg font-semibold tracking-wider text-on-surface uppercase mb-3 text-xs">
          Availability
        </h3>
        <label className="flex items-center gap-2.5 cursor-pointer text-body-sm text-on-surface">
          <input 
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
          />
          <span>In Stock Atelier Pieces Only</span>
        </label>
      </div>
    </aside>
  );
};

export default Sidebar;
