import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components/ui/Loading';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Loading..." />;
  }

  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // Only admin users allowed
  if (user.role === 'admin') {
    return <Redirect href="/(admin)/dashboard" />;
  }

  // Fallback
  return <Redirect href="/(auth)/welcome" />;
}
