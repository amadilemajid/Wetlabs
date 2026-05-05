import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Flag, X } from 'lucide-react';
import { Button }  from '@components/ui/Button';
import { useFlagReport } from '../hooks/useReports';

const schema = z.object({
  flag_reason: z.string().min(10, 'Please describe the issue (min 10 characters)').max(300),
});
type FormData = z.infer<typeof schema>;

interface Props { reportId: string; open: boolean; onClose: () => void; }

export function FlagReportDialog({ reportId, open, onClose }: Props) {
  const { mutate: flag, isPending } = useFlagReport();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    flag({ id: reportId, reason: data.flag_reason }, {
      onSuccess: () => { reset(); onClose(); },
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2001] w-full max-w-sm panel p-6 animate-slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="font-mono text-sm text-teal-400 tracking-widest flex items-center gap-2">
              <Flag className="w-4 h-4" />
              FLAG REPORT
            </Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close dialog" className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-xs text-slate-400 font-serif mb-4">
            Describe why this report is suspicious, erroneous, or a duplicate.
            It will be marked for officer review but not deleted.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <textarea
                {...register('flag_reason')}
                rows={4}
                placeholder="e.g. This location code does not match the reported area..."
                aria-label="Flag reason"
                aria-describedby="flag-error"
                className="w-full bg-slate-900 border border-teal-500/20 rounded-md p-3 text-sm text-slate-300 font-serif placeholder:text-slate-600 focus:outline-none focus:border-teal-500 resize-none"
              />
              {errors.flag_reason && (
                <p id="flag-error" role="alert" className="text-xs text-crimson-400 mt-1">
                  {errors.flag_reason.message}
                </p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Dialog.Close asChild>
                <Button variant="ghost" size="sm" type="button">Cancel</Button>
              </Dialog.Close>
              <Button variant="danger" size="sm" type="submit" loading={isPending}>
                Submit Flag
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
