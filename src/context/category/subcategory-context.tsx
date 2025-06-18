import React, { createContext, useContext, ReactNode } from 'react';
import { SubCategory } from '@/features/subcategories/data/schema';
import useGetAllSubCategories from '@/hooks/categories/useGetAllSubCategories';

interface SubCategoryContextType {
  subCategories: SubCategory[];
  loading: boolean;
}

const SubCategoryContext = createContext<SubCategoryContextType>({
  subCategories: [],
  loading: true
});

export const SubCategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { subCategories, loading } = useGetAllSubCategories();

  return (
    <SubCategoryContext.Provider value={{ subCategories, loading }}>
      {children}
    </SubCategoryContext.Provider>
  );
};

export const useSubCategories = (): SubCategoryContextType => {
  const context = useContext(SubCategoryContext);
  
  if (context === undefined) {
    throw new Error('useSubCategories must be used within a SubCategoryProvider');
  }
  
  return context;
};


export default SubCategoryContext;