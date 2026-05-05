import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Waves } from 'lucide-react';
import { login } from '@api/auth.api';
import { useAuthStore } from '@stores/auth.store';
import { Button } from '@components/ui/Button';
import { cn } from '@utils/cn';

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate   = useNavigate();
  const setAuth    = useAuthStore((s) => s.setAuth);
  const [showPw,   setShowPw]  = useState(false);
  const [apiError, setApiError]= useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const result = await login(data.email, data.password);
      setAuth(result.access_token, result.role, data.email);
      
      // US-04: Enumerators go directly to field form
      if (result.role === 'FIELD_ENUMERATOR') {
        void navigate('/report');
      } else {
        void navigate('/dashboard');
      }
    } catch {
      setApiError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-canvas bg-grid flex items-center justify-center p-4">
      {/* Scan-line decorative overlay */}
      <div className="scan-container fixed inset-0 pointer-events-none opacity-30" />

      <div className="w-full max-w-sm space-y-8 animate-slide-in-up">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 mb-4">
            <svg viewBox="0 0 280 280" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="240" height="240" rx="30" fill="#05734e"/>
              <path d="M 100 180 Q 100 120 120 100 L 130 90 L 140 100 Q 160 120 160 180 L 160 200 L 100 200 Z" fill="#ffffff"/>
              <path d="M 140 180 Q 140 130 155 115 L 162 108 L 169 115 Q 184 130 184 180 L 184 200 L 140 200 Z" fill="#ffffff"/>
              <path d="M 70 180 Q 70 140 85 125 L 92 118 L 99 125 Q 114 140 114 180 L 114 200 L 70 200 Z" fill="#ffffff"/>
            </svg>
          </div>
          <h1 className="font-mono text-2xl font-medium text-teal-400 tracking-widest">WETLABS</h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider mt-1">WETLAND MONITORING SYSTEM</p>
        </div>

        {/* Form */}
        <div className="panel p-6 space-y-5">
          <h2 className="font-mono text-xs text-slate-400 tracking-widest border-b border-teal-500/10 pb-3">
            DASHBOARD LOGIN
          </h2>

          {apiError && (
            <div role="alert" className="text-xs text-crimson-400 bg-crimson-500/10 border border-crimson-500/20 rounded p-3 font-mono">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="data-label">EMAIL</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
                className={cn(
                  'w-full bg-slate-900 border rounded-md px-3 py-2.5 text-sm font-mono text-slate-200',
                  'placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors',
                  errors.email ? 'border-crimson-500/50' : 'border-teal-500/20',
                )}
                placeholder="officer@nema.go.ug"
              />
              {errors.email && (
                <p id="email-error" role="alert" className="text-xs text-crimson-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="data-label">PASSWORD</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-describedby={errors.password ? 'pw-error' : undefined}
                  {...register('password')}
                  className={cn(
                    'w-full bg-slate-900 border rounded-md px-3 py-2.5 pr-10 text-sm font-mono text-slate-200',
                    'placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors',
                    errors.password ? 'border-crimson-500/50' : 'border-teal-500/20',
                  )}
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="pw-error" role="alert" className="text-xs text-crimson-400">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full">
              Access Dashboard
            </Button>
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-600 font-mono tracking-widest">
          WETLABS v1.0 · MIIC GIP 2025
        </p>
      </div>
    </div>
  );
}
