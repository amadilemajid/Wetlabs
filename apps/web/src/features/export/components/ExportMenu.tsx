import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Download, FileText, Globe } from 'lucide-react';
import { useState } from 'react';
import { exportCsv, exportGeoJson } from '@api/export.api';
import { useFilterStore } from '@stores/filter.store';
import { useAuthStore }   from '@stores/auth.store';
import { Button }         from '@components/ui/Button';
import { useToast }       from '@hooks/useToast';

export function ExportMenu() {
  const { role }   = useAuthStore();
  const getActiveFilters = useFilterStore((s) => s.getActiveFilters);
  const toast      = useToast();
  const [busy, setBusy] = useState(false);

  // US-10 AC4: only RESEARCHER and SYSTEM_ADMIN see export
  if (!role || !['RESEARCHER','SYSTEM_ADMIN'].includes(role)) return null;

  const handleExport = async (type: 'csv' | 'geojson') => {
    setBusy(true);
    try {
      const filters = getActiveFilters();
      if (type === 'csv')     await exportCsv(filters);
      if (type === 'geojson') await exportGeoJson(filters);
      toast.success(`Export downloaded successfully`);
    } catch {
      toast.error('Export failed. Try narrowing your filters.');
    } finally { setBusy(false); }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="sm" loading={busy} aria-label="Export data">
          <Download className="w-3.5 h-3.5" />
          EXPORT
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom" align="start" sideOffset={6}
          className="panel min-w-[160px] p-1 z-[1500] animate-slide-in-up"
        >
          {[
            { label: 'Download CSV',     icon: FileText, type: 'csv'     as const },
            { label: 'Download GeoJSON', icon: Globe,    type: 'geojson' as const },
          ].map(({ label, icon: Icon, type }) => (
            <DropdownMenu.Item
              key={type}
              onSelect={() => void handleExport(type)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-mono text-slate-300 hover:bg-teal-500/10 hover:text-teal-300 rounded cursor-pointer outline-none transition-colors"
            >
              <Icon className="w-3.5 h-3.5 text-teal-500" />
              {label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
