import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ categories = [], activeCategory = 'all', onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory && onSelectCategory('all')}
        className={`px-4 py-2 rounded-full text-label-md font-label-md whitespace-nowrap transition-colors ${
          activeCategory === 'all'
            ? 'bg-on-surface text-surface shadow-sm'
            : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
        }`}
      >
        All Pieces
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory && onSelectCategory(cat.id)}
          className={`px-4 py-2 rounded-full text-label-md font-label-md whitespace-nowrap transition-colors ${
            activeCategory === cat.id
              ? 'bg-on-surface text-surface shadow-sm'
              : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default Navbar;
