
import { User } from '@/hooks/user/schema';
import useGetAllUser from '@/hooks/user/useGetUser';
import React, { createContext, useContext, ReactNode } from 'react';



interface UserContextType {
  users: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  users: null,
  loading: true
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { users, loading } = useGetAllUser();
  return (
    <UserContext.Provider value={{ users, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a UserProvider');
  }  
  return context;
};

export default UserContext;