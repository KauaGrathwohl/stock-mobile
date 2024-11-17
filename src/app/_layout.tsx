import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthProvider } from '../providers/AuthProvider';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!isAuthenticated) {
        router.navigate('(public)' as any);
      }
    }, [isAuthenticated]);
  
    return <>{children}</>;
}

export default function RootLayout () {
    return (
      <AuthProvider>
        <ProtectedLayout>
          <Stack screenOptions={{ headerShown: false }} />
        </ProtectedLayout>
      </AuthProvider>
    )
}