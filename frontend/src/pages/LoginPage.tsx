import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = (data: LoginForm) => {
    dispatch(login(data));
  };

  return (
    <div className="max-w-md mx-auto mt-16 glass-panel p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400">Sign in to manage your tasks</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className={`w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
              errors.email ? 'border-red-500' : 'border-border'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register('password')}
            className={`w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
              errors.password ? 'border-red-500' : 'border-border'
            }`}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
