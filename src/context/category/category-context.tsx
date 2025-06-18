import useGetAllCategories from '@/hooks/categories/useGetAllCategories';
import React, { createContext, useContext, ReactNode } from 'react';

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  categoryId?: string;
  subCategories?: Category[];
}

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
}

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  loading: true
});

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { categories, loading } = useGetAllCategories();
  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }  
  return context;
};

export default CategoryContext;