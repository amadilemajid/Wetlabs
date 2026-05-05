import * as Dialog from '@radix-ui/react-dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver }  from '@hookform/resolvers/zod';
import { z }            from 'zod';
import { X, UserPlus }  from 'lucide-react';
import { useCreateUser } from '../hooks/useAdmin';
import { Button }  from '@components/ui/Button';
import { cn }      from '@utils/cn';
import type { UserRole } from '@wetlabs/shared-types';

const ROLES: UserRole[] = ['FIELD_ENUMERATOR','WETLAND_OFFICER','RESEARCHER','NGO_PARTNER','SYSTEM_ADMIN'];

const WETLANDS = ['KYO01','KYO02','VIC01','ALB01','KAT01'];

const schema = z.object({
  email:             z.string().email('Invalid email'),
  password:          z.string().min(10, 'Minimum 10 characters'),
  full_name:         z.string().min(2,  'Enter full name'),
  role:              z.enum(['FIELD_ENUMERATOR','WETLAND_OFFICER','RESEARCHER','NGO_PARTNER','SYSTEM_ADMIN']),
  assigned_wetlands: z.array(z.string()).min(1, 'Assign at least one wetland'),
});
type FormData = z.infer<typeof schema>;

interface Props { open: boolean; onClose: () => void; }

export function CreateUserDialog({ open, onClose }: Props) {
  const { mutate: create, isPending } = useCreateUser();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver:      zodResolver(schema),
    defaultValues: { assigned_wetlands: [] },
  });

  const onSubmit = (data: FormData) => {
    create(data, { onSuccess: () => { reset(); onClose(); } });
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2001] w-full max-w-md panel p-6 animate-slide-in-up max-h-[90vh] overflow-y-auto">

          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="font-mono text-sm text-teal-400 tracking-widest flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> CREATE USER
            </Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close dialog" className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

            {/* Email + Full name */}
            {([
              { id: 'email',     label: 'EMAIL',     type: 'email', ph: 'officer@nema.go.ug' },
              { id: 'full_name', label: 'FULL NAME',  type: 'text',  ph: 'Dr. Jane Akello'    },
              { id: 'password',  label: 'TEMP PASSWORD', type: 'password', ph: '••••••••••' },
            ] as const).map(({ id, label, type, ph }) => (
              <div key={id} className="space-y-1">
                <label htmlFor={`cu-${id}`} className="data-label">{label}</label>
                <input
                  id={`cu-${id}`}
                  type={type}
                  placeholder={ph}
                  {...register(id)}
                  className="w-full bg-slate-900 border border-teal-500/15 rounded-md px-3 py-2 text-sm font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
                {errors[id] && <p role="alert" className="text-xs text-crimson-400">{errors[id]?.message}</p>}
              </div>
            ))}

            {/* Role */}
            <div className="space-y-2">
              <label className="data-label">ROLE</label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-1.5">
                    {ROLES.map((r) => (
                      <button
                        key={r} type="button" aria-pressed={field.value === r}
                        onClick={() => field.onChange(r)}
                        className={cn(
                          'px-2 py-1.5 rounded text-[10px] font-mono border text-left transition-all',
                          field.value === r
                            ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                            : 'border-slate-700 text-slate-500 hover:border-slate-500',
                        )}
                      >
                        {r.replace(/_/g,' ')}
                      </button>
                    ))}
                  </div>
                )}
              />
              {errors.role && <p role="alert" className="text-xs text-crimson-400">{errors.role.message}</p>}
            </div>

            {/* Assigned wetlands */}
            <div className="space-y-2">
              <label className="data-label">ASSIGNED WETLANDS</label>
              <Controller
                name="assigned_wetlands"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-1.5">
                    {WETLANDS.map((code) => {
                      const active = field.value.includes(code);
                      return (
                        <button
                          key={code} type="button" aria-pressed={active}
                          onClick={() => field.onChange(
                            active ? field.value.filter((c) => c !== code) : [...field.value, code],
                          )}
                          className={cn(
                            'px-2.5 py-1 rounded text-[10px] font-mono border transition-all',
                            active
                              ? 'border-teal-500/50 bg-teal-500/15 text-teal-300'
                              : 'border-slate-700 text-slate-500 hover:border-slate-500',
                          )}
                        >
                          {code}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.assigned_wetlands && (
                <p role="alert" className="text-xs text-crimson-400">{errors.assigned_wetlands.message}</p>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Dialog.Close asChild>
                <Button variant="ghost" size="sm" type="button">Cancel</Button>
              </Dialog.Close>
              <Button variant="primary" size="sm" type="submit" loading={isPending}>
                Create User
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
