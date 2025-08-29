import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/config/supabase';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback page loaded');
        
        // First, try to handle the OAuth callback URL
        const { data, error } = await supabase.auth.getSession();
        console.log('Session data:', data, 'Error:', error);
        
        if (error) {
          console.error('OAuth callback error:', error);
          navigate('/login?error=oauth_failed');
          return;
        }

        if (data.session?.user) {
          console.log('Session found, user:', data.session.user);
          // Wait a moment for the AuthContext to process the session
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          // Try to get session from URL hash (for implicit flow)
          console.log('No session found, checking URL hash...');
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken) {
            console.log('Found access token in URL hash');
            // Set the session manually
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (sessionError) {
              console.error('Error setting session:', sessionError);
              navigate('/login?error=oauth_failed');
            } else {
              console.log('Session set successfully:', sessionData);
              setTimeout(() => {
                navigate('/');
              }, 1000);
            }
          } else {
            // Check for error in URL params as fallback
            const urlError = searchParams.get('error');
            if (urlError) {
              console.error('OAuth error from URL:', urlError);
              navigate('/login?error=oauth_failed');
            } else {
              console.log('No session or tokens found, redirecting to login');
              navigate('/login');
            }
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login?error=oauth_failed');
      }
    };

    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(handleCallback, 100);
    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
