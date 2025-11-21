import { Product } from '../types';
import { supabase } from '../lib/supabaseClient';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('last_updated', { ascending: false });

    if (error) {
      throw error;
    }

    // Map DB snake_case to camelCase
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      sellPrice: item.sell_price, // Map here
      image: item.image,
      lastUpdated: item.last_updated
    }));
  } catch (error) {
    console.error('Error reading from supabase', error);
    return [];
  }
};

export const addProduct = async (product: Product): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .insert([{
        id: product.id,
        name: product.name,
        category: product.category,
        sell_price: product.sellPrice, // Map here
        image: product.image,
        last_updated: product.lastUpdated
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error adding to supabase', error);
    throw error;
  }
};

export const updateProduct = async (product: Product): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        category: product.category,
        sell_price: product.sellPrice, // Map here
        image: product.image,
        last_updated: product.lastUpdated
      })
      .eq('id', product.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating supabase', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting from supabase', error);
    throw error;
  }
};

// We don't need saveProducts anymore as we do atomic updates
// But to keep compatibility for a moment while refactoring App.tsx, we can keep a dummy or remove it.
// I will remove saveProducts and replace usages in App.tsx

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
