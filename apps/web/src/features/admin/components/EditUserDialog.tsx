import * as Dialog from '@radix-ui/react-dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver }  from '@hookform/resolvers/zod';
import { z }            from 'zod';
import { X, Edit2 }     from 'lucide-react';
import { useUpdateUser } from '../hooks/useAdmin';
import { Button }  from '@components/ui/Button';
import { cn }      from '@utils/cn';
import type { User, UserRole } from '@wetlabs/shared-types';
import { useEffect } from 'react';

const ROLES: UserRole[] = ['FIELD_ENUMERATOR','WETLAND_OFFICER','RESEARCHER','NGO_PARTNER','SYSTEM_ADMIN'];
const WETLANDS = ['KYO01','KYO02','VIC01','ALB01','KAT01'];

const schema = z.object({
  full_name:         z.string().min(2,  'Enter full name'),
  role:              z.enum(['FIELD_ENUMERATOR','WETLAND_OFFICER','RESEARCHER','NGO_PARTNER','SYSTEM_ADMIN']),
  assigned_wetlands: z.array(z.string()).min(1, 'Assign at least one wetland'),
});
type FormData = z.infer<typeof schema>;

interface Props { user: User | null; onClose: () => void; }

export function EditUserDialog({ user, onClose }: Props) {
  const { mutate: update, isPending } = useUpdateUser();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name:         user.full_name,
        role:              user.role,
        assigned_wetlands: user.assigned_wetlands,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: FormData) => {
    if (!user) return;
    update({ id: user.user_id, data }, { onSuccess: onClose });
  };

  return (
    <Dialog.Root open={!!user} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2001] w-full max-w-sm panel p-6 animate-slide-in-up">

          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="font-mono text-sm text-teal-400 tracking-widest flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> EDIT USER
            </Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close dialog" className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1">
              <label className="data-label">FULL NAME</label>
              <input
                {...register('full_name')}
                placeholder="Dr. Jane Akello"
                className="w-full bg-slate-900 border border-teal-500/15 rounded-md px-3 py-2 text-sm font-mono text-slate-300 focus:outline-none focus:border-teal-500"
              />
              {errors.full_name && <p role="alert" className="text-xs text-crimson-400">{errors.full_name.message}</p>}
            </div>

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
            </div>

            <div className="space-y-2">
              <label className="data-label">ASSIGNED WETLANDS</label>
              <Controller
                name="assigned_wetlands"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-1.5">
                    {WETLANDS.map((code) => {
                      const active = field.value?.includes(code);
                      return (
                        <button
                          key={code} type="button" aria-pressed={active}
                          onClick={() => field.onChange(
                            active ? field.value.filter((c) => c !== code) : [...(field.value || []), code],
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
                Save Changes
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
