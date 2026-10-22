import React from 'react';
import { CuisineCategory } from '../types';
import { useApp } from '../context/AppContext';
import { categoryLabels } from '../utils/translations';
import {
  Utensils,
  Flame,
  Soup,
  Pizza,
  Sandwich,
  Drumstick,
  CookingPot,
  Sparkles,
  Coffee,
  Tag,
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: CuisineCategory;
  onSelectCategory: (cat: CuisineCategory) => void;
}

const CATEGORY_ITEMS: { key: CuisineCategory; icon: React.FC<{ className?: string }> }[] = [
  { key: 'all', icon: Utensils },
  { key: 'deals', icon: Tag },
  { key: 'pizza', icon: Pizza },
  { key: 'karahi', icon: Soup },
  { key: 'bbq', icon: Flame },
  { key: 'biryani', icon: CookingPot },
  { key: 'sohan_halwa', icon: Sparkles },
  { key: 'burgers', icon: Sandwich },
  { key: 'fast_food', icon: Drumstick },
  { key: 'desi', icon: CookingPot },
  { key: 'beverages', icon: Coffee },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { language } = useApp();

  return (
    <div className="py-4 border-b-[1.5px] border-[#1A1A1A] bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          <span className="font-label mr-2 hidden md:inline-block shrink-0">
            [ Categories ]
          </span>
          {CATEGORY_ITEMS.map(({ key, icon: Icon }) => {
            const isSelected = selectedCategory === key;
            const label = categoryLabels[language][key];
            return (
              <button
                key={key}
                onClick={() => onSelectCategory(key)}
                className={`pill-editorial flex items-center gap-1.5 shrink-0 ${
                  isSelected ? 'active' : ''
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#B38B3F]' : 'text-[#1A1A1A]/60'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
