export interface Product {
  id: string;
  name: string;
  category: string;
  sellPrice: number;
  lastUpdated: string;
  image?: string; // Base64 string for the image
}

export interface AIPriceSuggestion {
  suggestedSellPrice: number;
  suggestedCategory: string;
  marketPriceRange: string;
  reasoning: string;
}

export type SortOption = 'name' | 'priceHigh' | 'priceLow' | 'newest';