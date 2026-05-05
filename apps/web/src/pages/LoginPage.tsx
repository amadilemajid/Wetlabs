import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Waves, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';
import type { UserRole } from '@wetlabs/shared-types';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

interface LoginResponse {
  data: { access_token: string; expires_in: number; role: UserRole };
}

export default function LoginPage() {
  const navigate   = useNavigate();
  const { login }  = useAuthStore();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.post<LoginResponse>('/auth/login', data).then((r) => r.data),
    onSuccess: (res) => {
      const { access_token, role } = res.data;
      // Decode sub + email from the JWT payload (base64 middle segment)
      const [, payload] = access_token.split('.');
      const decoded = JSON.parse(atob(payload + '=='.slice((payload.length % 4) || 4)));
      login(access_token, { user_id: decoded.sub, email: decoded.email, role });
      navigate('/dashboard');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas-950 px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center shadow-teal-glow mb-4">
            <svg viewBox="0 0 280 280" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="240" height="240" rx="30" fill="#05734e"/>
              <path d="M 100 180 Q 100 120 120 100 L 130 90 L 140 100 Q 160 120 160 180 L 160 200 L 100 200 Z" fill="#ffffff"/>
              <path d="M 140 180 Q 140 130 155 115 L 162 108 L 169 115 Q 184 130 184 180 L 184 200 L 140 200 Z" fill="#ffffff"/>
              <path d="M 70 180 Q 70 140 85 125 L 92 118 L 99 125 Q 114 140 114 180 L 114 200 L 70 200 Z" fill="#ffffff"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to WETLABS Dashboard</p>
        </div>

        {/* Card */}
        <div className="card shadow-glass">
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="officer@wetlabs.app"
                className={cn('input-base w-full', errors.email && 'border-red-500/60 focus:ring-red-500/30')}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  className={cn('input-base w-full pr-10', errors.password && 'border-red-500/60')}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* API error */}
            {mutation.isError && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Invalid email or password
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          WETLABS v2.0 · Wetland Monitoring & Reporting Platform
        </p>
      </div>
    </div>
  );
}
