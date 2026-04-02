import { useAuth } from '@/context/AuthContext';

export const useAuthHook = () => {
  const auth = useAuth();
  return auth;
};