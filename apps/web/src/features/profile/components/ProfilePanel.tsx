import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@api/client';
import { Button } from '@components/ui/Button';
import { useToast } from '@hooks/useToast';
import { Key, Trash2, Shield, Copy } from 'lucide-react';
import { EmptyState } from '@components/ui/EmptyState';
import { Spinner } from '@components/ui/Spinner';
import { useAuthStore } from '@stores/auth.store';

interface ApiKey {
  key_id: string;
  description: string | null;
  prefix: string;
  created_at: string;
  last_used_at: string | null;
}

export function ProfilePanel() {
  const qc = useQueryClient();
  const toast = useToast();
  const { role } = useAuthStore();
  const [desc, setDesc] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);

  const { data: keys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: ApiKey[] }>('/profile/api-keys');
      return res.data.data;
    },
    enabled: role === 'RESEARCHER' || role === 'SYSTEM_ADMIN',
  });

  const createKey = useMutation({
    mutationFn: (description: string) => apiClient.post<{ data: ApiKey & { key: string } }>('/profile/api-keys', { description }),
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: ['api-keys'] });
      setNewKey(res.data.data.key);
      setDesc('');
      toast.success('API key generated');
    },
    onError: () => toast.error('Failed to generate API key'),
  });

  const deleteKey = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/profile/api-keys/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key revoked');
    },
  });

  const copyKey = () => {
    if (newKey) {
       void navigator.clipboard.writeText(newKey);
       toast.success('Copied to clipboard');
    }
  };

  if (role !== 'RESEARCHER' && role !== 'SYSTEM_ADMIN') {
     return <div className="p-4 text-xs font-mono text-crimson-400">Access denied</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="data-label text-teal-400 mb-2 flex items-center gap-2"><Key className="w-4 h-4"/> API SETTINGS</h2>
        <p className="text-xs text-slate-400 mb-4">Manage your personal API keys for programmatic access to Wetlabs.</p>
        
        {newKey && (
          <div className="panel p-4 mb-4 border-teal-500/40 bg-teal-500/10">
             <p className="text-xs font-mono text-teal-300 mb-2">New API Key generated!</p>
             <p className="text-[10px] text-slate-400 mb-3">Copy this key now. You won't be able to see it again.</p>
             <div className="flex gap-2 items-center">
                <code className="text-[10px] font-mono text-teal-300 bg-slate-900 border border-teal-500/20 px-2 py-1.5 flex-1 break-all select-all rounded">{newKey}</code>
                <Button size="sm" variant="outline" onClick={copyKey}><Copy className="w-3.5 h-3.5"/></Button>
             </div>
             <Button size="sm" variant="ghost" className="mt-3 w-full" onClick={() => setNewKey(null)}>Dismiss</Button>
          </div>
        )}

        <div className="panel p-4 space-y-3">
          <p className="data-label text-slate-300">GENERATE NEW KEY</p>
          <input 
            type="text" 
            placeholder="Key Description (optional)" 
            value={desc} 
            onChange={(e) => setDesc(e.target.value)}
            className="w-full bg-slate-900 border border-teal-500/15 rounded px-2 py-1.5 text-xs font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
          />
          <Button size="sm" className="w-full" loading={createKey.isPending} onClick={() => createKey.mutate(desc)}>
             <Shield className="w-3.5 h-3.5 mr-2" /> GENERATE KEY
          </Button>
        </div>
      </div>

      <div>
        <p className="data-label mb-3">YOUR ACTIVE KEYS</p>
        {isLoading ? <div className="py-4 flex justify-center"><Spinner /></div> : 
          (!keys || keys.length === 0) ? <EmptyState icon={Key} title="No API keys" message="Generate a key to access the API." /> : 
          <div className="space-y-2">
            {keys.map(k => (
              <div key={k.key_id} className="panel p-3 flex justify-between items-center group">
                 <div>
                    <p className="text-xs font-mono text-slate-300">{k.description || 'Untitled Key'}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">{k.prefix}••••••••</p>
                 </div>
                 <Button size="sm" variant="ghost" className="text-slate-500 hover:text-crimson-400 hover:bg-crimson-400/10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteKey.mutate(k.key_id)} loading={deleteKey.isPending}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
