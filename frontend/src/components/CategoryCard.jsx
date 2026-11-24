import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/shop?category=${category.id}`} 
      className="group relative rounded-xl overflow-hidden bg-surface-container-low shadow-sm flex flex-col aspect-[3/4] border border-surface-container-high/40"
    >
      <div className="w-full h-full overflow-hidden">
        <img 
          alt={category.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          src={category.image} 
          loading="lazy"
        />
      </div>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-on-surface/85 via-on-surface/25 to-transparent"></div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-on-primary flex flex-col">
        <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary-fixed mb-1 text-[11px]">
          {category.indexLabel || 'Curated Department'}
        </span>

        <h3 className="font-headline-md text-headline-md font-medium text-surface tracking-tight">
          {category.name}
        </h3>

        <p className="font-body-sm text-body-sm text-surface-variant line-clamp-1 mt-1 font-light text-xs">
          {category.subtitle}
        </p>

        {/* Hover Arrow Prompt */}
        <div className="mt-4 flex items-center gap-2 text-label-md font-label-md uppercase tracking-wider text-surface opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-xs font-semibold">
          <span>Explore Atelier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
