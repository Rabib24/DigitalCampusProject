import { clearAuthData } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      // Call backend logout endpoint
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      await fetch(`${baseUrl}/api/v1/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear authentication data locally
      clearAuthData();

      // Redirect to login page
      router.push('/login');
    }
  };

  return { logout };
};