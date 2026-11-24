import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { productsApi } from '../services/api';
import { 
  X, 
  ChevronDown, 
  LayoutGrid, 
  Grid3X3, 
  SlidersHorizontal 
} from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const filterParam = searchParams.get('filter') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState(500);
  const [selectedColor, setSelectedColor] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Curator's Choice");
  const [gridCols, setGridCols] = useState(3);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [productList, setProductList] = useState(products);

  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const res = await productsApi.getProducts({ limit: 100 });
        if (res && res.products && res.products.length > 0) {
          const formatted = res.products.map(p => ({
            ...p,
            id: p.slug || p._id,
            coverImage: p.coverImage || (p.images && p.images[0])
          }));
          setProductList(formatted);
        }
      } catch (e) {
        // Fallback to local products
      }
    };
    fetchLiveProducts();
  }, []);

  // Sync state with URL params if category changes in URL
  React.useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleClearAll = () => {
    setSelectedCategory('all');
    setPriceRange(500);
    setSelectedColor(null);
    setInStockOnly(false);
    searchParams.delete('category');
    searchParams.delete('filter');
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let list = [...productList];

    // Filter by search
    if (searchParam) {
      const q = searchParam.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Filter by special query filter (new, bestseller, trending)
    if (filterParam === 'new') {
      list = list.filter(p => p.isNewArrival);
    } else if (filterParam === 'bestseller') {
      list = list.filter(p => p.isBestSeller);
    } else if (filterParam === 'trending') {
      list = list.filter(p => p.isTrending);
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Filter by Price
    list = list.filter(p => p.price <= priceRange);

    // Filter by In-Stock
    if (inStockOnly) {
      list = list.filter(p => p.inStock);
    }

    // Filter by Color
    if (selectedColor) {
      list = list.filter(p => 
        p.colors && p.colors.some(c => c.name.toLowerCase().includes(selectedColor.toLowerCase()))
      );
    }

    // Sort
    if (sortBy === 'Price: Low to High') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Customer Rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    } else if (sortBy === 'Newest Drops') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return list;
  }, [selectedCategory, priceRange, selectedColor, inStockOnly, sortBy, searchParam, filterParam]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Top Editorial Header & Breadcrumb Ribbon */}
      <section className="w-full px-4 lg:px-12 pt-8 pb-10 bg-surface-bright border-b border-surface-container-high/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant tracking-wider uppercase text-xs">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-outline-variant">/</span>
              <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-semibold">
                {activeCategoryObj ? activeCategoryObj.name : 'All Curations'}
              </span>
            </nav>

            <div className="flex items-baseline gap-4 flex-wrap">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                {searchParam 
                  ? `Search: "${searchParam}"`
                  : activeCategoryObj 
                    ? activeCategoryObj.name 
                    : 'The Atelier Collection'}
              </h1>
              <span className="font-label-lg text-label-lg text-primary bg-primary-fixed/40 px-3 py-0.5 rounded-full text-xs font-semibold">
                ({filteredProducts.length} Items)
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl text-sm leading-relaxed">
              Thoughtfully designed essentials for a refined life. Handcrafted silhouettes, raw tactile textures, and quiet luxury statement objects.
            </p>
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-label-md font-label-md whitespace-nowrap text-xs transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-on-surface text-surface shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              All Pieces
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-label-md font-label-md whitespace-nowrap text-xs transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-on-surface text-surface shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filter, Sort & Control Bar (Sticky Anchor) */}
      <section className="sticky top-[76px] lg:top-[116px] z-30 bg-surface/95 backdrop-blur-md shadow-sm border-b border-surface-container-high/60">
        <div className="max-w-7xl mx-auto px-4 lg:px-12 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Active Badges & Clear Trigger */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button 
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md font-semibold text-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider hidden sm:inline-block mr-1 text-xs font-semibold">
              Active:
            </span>

            <div className="flex items-center gap-2">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm text-xs">
                  {activeCategoryObj?.name || selectedCategory}
                  <button onClick={() => handleCategoryChange('all')} title="Remove filter">
                    <X className="w-3 h-3 hover:text-on-surface" />
                  </button>
                </span>
              )}

              {priceRange < 500 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm text-xs">
                  Under ${priceRange}
                  <button onClick={() => setPriceRange(500)} title="Remove filter">
                    <X className="w-3 h-3 hover:text-on-surface" />
                  </button>
                </span>
              )}

              {selectedColor && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm text-xs">
                  Color: {selectedColor}
                  <button onClick={() => setSelectedColor(null)} title="Remove filter">
                    <X className="w-3 h-3 hover:text-on-surface" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm text-xs">
                  In Stock
                  <button onClick={() => setInStockOnly(false)} title="Remove filter">
                    <X className="w-3 h-3 hover:text-on-surface" />
                  </button>
                </span>
              )}

              <button 
                onClick={handleClearAll}
                className="text-primary font-label-sm text-label-sm hover:underline ml-2 whitespace-nowrap text-xs font-semibold"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Controls: Sort & Grid Switches */}
          <div className="flex items-center justify-between md:justify-end gap-5">
            <div className="flex items-center gap-2">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase text-xs font-semibold" htmlFor="sort-dropdown">
                Sort By
              </label>
              <div className="relative">
                <select 
                  className="appearance-none bg-surface-container-lowest text-on-surface text-body-sm font-body-sm pl-4 pr-9 py-1.5 rounded-lg shadow-sm focus:outline-none cursor-pointer border border-surface-container-high text-xs" 
                  id="sort-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Curator's Choice</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Customer Rating</option>
                  <option>Newest Drops</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Grid Layout Switcher */}
            <div className="hidden lg:flex items-center bg-surface-container-low p-1 rounded-lg gap-1 border border-surface-container-high">
              <button 
                className={`p-1.5 rounded transition-all ${gridCols === 3 ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setGridCols(3)}
                title="3 Column View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                className={`p-1.5 rounded transition-all ${gridCols === 4 ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setGridCols(4)}
                title="4 Column Compact View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Listing (Sticky Sidebar + Product Grid) */}
      <section className="max-w-7xl mx-auto w-full px-4 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filter Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-[196px]">
            <Sidebar 
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              inStockOnly={inStockOnly}
              onToggleInStock={setInStockOnly}
            />
          </div>

          {/* Mobile Filter Sheet */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
              <div className="w-4/5 max-w-md h-full bg-surface-container-lowest p-6 overflow-y-auto animate-in slide-in-from-right">
                <div className="flex items-center justify-between pb-4 border-b border-surface-container-high mb-6">
                  <h3 className="font-headline-sm text-headline-sm font-semibold">Filter Curation</h3>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-on-surface" />
                  </button>
                </div>
                <Sidebar 
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    handleCategoryChange(cat);
                    setMobileFilterOpen(false);
                  }}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                  inStockOnly={inStockOnly}
                  onToggleInStock={setInStockOnly}
                />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest p-12 rounded-xl text-center shadow-sm border border-surface-container-high">
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-2">
                  No matching atelier pieces found
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-6 text-sm">
                  We couldn't find any creations matching your active filters. Try resetting the filters or searching with a different term.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-3 rounded-lg bg-on-surface text-surface font-label-md text-label-md uppercase tracking-wider font-semibold hover:bg-primary transition-colors text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
