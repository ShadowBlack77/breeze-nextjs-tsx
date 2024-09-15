import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface AuthParams {
  setErrors: (errors: any[]) => void;
  setStatus?: (status: any) => void;
  email?: string | any;
  token?: string | any;
  [key: string]: any;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: { middleware?: string | any, redirectIfAuthenticated?: string | any } = {}) => {
  const router = useRouter();
  const params = useParams();

  const { data: user, error, mutate } = useSWR('/api/user', () => 
    axiosInstance
      .get('/api/user')
      .then(res => res.data)
      .catch((error) => {
        if (error.response.status !== 409) {
          throw error
        }

        router.push('/verify-email');
      }), 
  );

  const csrf = () => axiosInstance.get('/sanctum/csrf-cookie');
  
  const register = async ({ setErrors, ...props }: AuthParams) => {
    await csrf();

    setErrors([]);

    axiosInstance 
      .post('/register', props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) {
          throw error;
        }

        setErrors(error.response.data.errors);
      });
  }

  const login = async ({ setErrors, setStatus, ...props }: AuthParams) => {
    await csrf();

    setErrors([]);
    setStatus?.(null);

    axiosInstance
      .post('/login', props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) {
          throw error;
        }

        setStatus?.(error.response.data.errors);
      })
  }

  const forgotPassword = async ({ setErrors, setStatus, email }: AuthParams) => {
    await csrf();

    setErrors([]);
    setStatus?.(null);

    axiosInstance
      .post('/forgot-password', { email })
      .then(response => setStatus?.(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) {
          throw error;
        }

        setErrors(error.response.data.errors);
      })
  } 

  const resetPassword = async ({ setErrors, setStatus, ...props }: AuthParams) => {
    await csrf();

    setErrors([]);
    setStatus?.(null);

    axiosInstance
      .post('/reset-password', { token: params.token, ...props })
      .then(response => 
        router.push('/login?reset=' + btoa(response.data.status)),
      )
      .catch((error) => {
        if (error.response.status !== 422) {
          throw error;
        }

        setErrors(error.response.data.error);
      })
  }

  const resendEmailVerification = ({ setStatus }: AuthParams) => {
    axiosInstance
      .post('/email/verification-notification')
      .then(response => setStatus?.(response.data.status))
  }

  const logout = async () => {
    if (!error) {
      await axiosInstance.post('/logout')
        .then(() => mutate())
    }

    window.location.pathname = '/login';
  }

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }

    if (window.location.pathname === '/verify-email' && user?.email_verified_at) {
      router.push(redirectIfAuthenticated);
    }

    if (middleware === 'auth' && error) {
      logout();
    }
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  }
}