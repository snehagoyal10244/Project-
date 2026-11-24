import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { products } from '../data/products';

const SearchBar = ({ onSearchSubmit }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredSuggestions = query.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      if (onSearchSubmit) {
        onSearchSubmit(query.trim());
      } else {
        navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSelectProduct = (product) => {
    setShowDropdown(false);
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative w-full">
        <input 
          className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm pl-9 pr-8 py-2 rounded-full focus:outline-none focus:bg-surface-container-lowest transition-all shadow-inner" 
          placeholder="Search curation, apparel, living..." 
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        
        {query && (
          <button 
            type="button"
            onClick={() => {
              setQuery('');
              setShowDropdown(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Live Auto-suggestion dropdown */}
      {showDropdown && filteredSuggestions.length > 0 && (
        <div 
          className="absolute left-0 top-full mt-2 w-full bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high py-2 z-50 animate-in fade-in slide-in-from-top-1"
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="px-3 py-1 text-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
            Suggested Curations
          </div>
          {filteredSuggestions.map((prod) => (
            <button
              key={prod.id}
              onClick={() => handleSelectProduct(prod)}
              className="w-full px-3 py-2 flex items-center gap-3 hover:bg-surface-container text-left transition-colors"
            >
              <img 
                src={prod.coverImage || (prod.images && prod.images[0])} 
                alt={prod.name}
                className="w-10 h-10 rounded-md object-cover flex-shrink-0 bg-surface-container"
              />
              <div className="flex-1 min-w-0">
                <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">{prod.shortName || prod.name}</p>
                <p className="font-label-sm text-[11px] text-on-surface-variant">{prod.subtitle}</p>
              </div>
              <span className="font-body-sm text-body-sm font-semibold text-primary">${prod.price}</span>
            </button>
          ))}
          <button
            onClick={handleSearch}
            className="w-full mt-1 pt-2 border-t border-surface-container-high px-3 py-1.5 text-center text-label-sm text-primary hover:text-on-surface font-semibold uppercase tracking-wider text-[11px]"
          >
            See all matches for "{query}"
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
