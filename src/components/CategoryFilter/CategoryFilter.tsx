import React from 'react';
import { SlidersHorizontal, Search, RotateCcw, CheckSquare } from 'lucide-react';
import type { Category, SortOption } from '../../types/product';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryToggle: (categoryName: string) => void;
  onClearCategories: () => void;
  onSelectAllCategories: () => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onClearCategories,
  onSelectAllCategories,
  sortOption,
  onSortChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <aside className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-3">
        <label htmlFor="search" className="block text-sm font-bold text-gray-950 dark:text-white">
          Search Products
        </label>
        <div className="relative">
          <input
            id="search"
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 dark:text-white transition-all"
          />
          <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-950 dark:text-white">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Sort By</span>
        </div>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 dark:text-white transition-all"
        >
          <option value="default">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Alphabetical: A-Z</option>
          <option value="title-desc">Alphabetical: Z-A</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-gray-950 dark:text-white">Filter by Categories</h3>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs">
          <button
            onClick={onSelectAllCategories}
            className="flex items-center gap-1 text-brand-600 hover:text-brand-700 dark:text-brand-300 font-semibold transition-colors focus:outline-none"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Select All</span>
          </button>
          {selectedCategories.length > 0 && (
            <button
              onClick={onClearCategories}
              className="flex items-center gap-1 text-rose-500 hover:text-rose-600 font-semibold transition-colors focus:outline-none"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.name.toLowerCase());
            return (
              <button
                key={category.id}
                onClick={() => onCategoryToggle(category.name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-900/30 dark:border-brand-500/30 dark:text-brand-300'
                    : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100 dark:bg-slate-950 dark:border-slate-800 dark:text-gray-300 dark:hover:bg-slate-800/40'
                }`}
              >
                <span>{category.name}</span>
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-transform ${
                    isSelected ? 'bg-brand-500 scale-110' : 'bg-transparent border border-gray-300 dark:border-slate-700'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
