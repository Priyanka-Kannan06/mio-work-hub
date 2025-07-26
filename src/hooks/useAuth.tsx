
import { useState, useEffect } from 'react';
import { User } from '@/types/dashboard';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // This is a mock implementation - replace with Supabase auth
    if (email === 'mioshservices@gmail.com' && password === 'Miosh@2023') {
      const user: User = {
        id: '1',
        email: email,
        role: 'admin'
      };
      setUser(user);
      localStorage.setItem('adminUser', JSON.stringify(user));
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Invalid credentials'));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  return {
    user,
    loading,
    login,
    logout
  };
};
