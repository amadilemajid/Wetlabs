import { useState } from 'react';
import { Users, Inbox, ScrollText, ShieldAlert, AlertTriangle, UserPlus, FileText, Download, Plus, UserCheck, UserX, Terminal, Edit2 } from 'lucide-react';
import { useUsers, useUpdateUser, useDlqDepth, useAuditLog, useRetryDlq, useDiscardDlq, exportAuditLogCsv } from '../hooks/useAdmin';
import { CreateUserDialog }  from './CreateUserDialog';
import { EditUserDialog }    from './EditUserDialog';
import { Button }    from '@components/ui/Button';
import { Spinner }   from '@components/ui/Spinner';
import { EmptyState }from '@components/ui/EmptyState';
import { fmtRelative } from '@utils/date';
import { cn }        from '@utils/cn';
import type { User } from '@wetlabs/shared-types';

type AdminTab = 'users' | 'dlq' | 'audit' | 'developer';

export function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('users');

  return (
    <div className="flex flex-col h-full">
      {/* Admin sub-tabs */}
      <div className="flex border-b border-teal-500/10 bg-slate-950/50">
        {([
          { id: 'users' as AdminTab, label: 'USERS',  icon: Users      },
          { id: 'dlq'   as AdminTab, label: 'DLQ',    icon: Inbox      },
          { id: 'audit' as AdminTab, label: 'AUDIT',  icon: ScrollText },
          { id: 'developer' as AdminTab, label: 'DEV', icon: Terminal },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-selected={tab === id}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-mono tracking-widest transition-colors',
              tab === id
                ? 'text-teal-400 border-b-2 border-teal-400 -mb-px'
                : 'text-slate-500 hover:text-slate-300',
            )}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'users' && <UsersTab />}
        {tab === 'dlq'   && <DlqTab />}
        {tab === 'audit' && <AuditTab />}
        {tab === 'developer' && <DevelopersTab />}
      </div>
    </div>
  );
}

// ── Users tab (US-13) ─────────────────────────────────────────────────────────
function UsersTab() {
  const { data, isLoading }    = useUsers();
  const { mutate: updateUser } = useUpdateUser();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  return (
    <div className="p-4 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="data-label">USER ACCOUNTS</p>
          <p className="font-mono text-lg text-slate-200">{data?.meta.total ?? '—'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> NEW USER
        </Button>
      </div>

      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}

      {data?.data.map((user: User) => (
        <div
          key={user.user_id}
          className={cn(
            'panel p-3 space-y-2 animate-slide-in-up',
            !user.is_active && 'opacity-50',
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-xs text-slate-200 truncate">{user.full_name}</p>
              <p className="font-mono text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-teal-500/20 text-teal-400 flex-shrink-0">
              {user.role.replace('_',' ')}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-teal-500/5">
            <p className="font-mono text-[10px] text-slate-500 flex-1">
              {user.assigned_wetlands.length > 0
                ? user.assigned_wetlands.join(' · ')
                : 'No wetlands assigned'}
            </p>

            {/* US-13 AC3: deactivate → session invalidation happens server-side */}
            <button
              onClick={() => setEditingUser(user)}
              aria-label="Edit user"
              className="p-1 text-slate-500 hover:text-teal-400 border border-slate-700 hover:border-teal-500/50 rounded transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => updateUser({ id: user.user_id, data: { is_active: !user.is_active } })}
              aria-label={user.is_active ? 'Deactivate user' : 'Activate user'}
              className={cn(
                'flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded border transition-colors',
                user.is_active
                  ? 'border-crimson-500/30 text-crimson-400 hover:bg-crimson-500/10'
                  : 'border-signal-500/30 text-signal-400 hover:bg-signal-500/10',
              )}
            >
              {user.is_active
                ? <><UserX className="w-3 h-3" /> DEACTIVATE</>
                : <><UserCheck className="w-3 h-3" /> ACTIVATE</>}
            </button>
          </div>
        </div>
      ))}

      <CreateUserDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditUserDialog user={editingUser} onClose={() => setEditingUser(null)} />
    </div>
  );
}

// ── DLQ tab (US-14) ───────────────────────────────────────────────────────────
function DlqTab() {
  const { data, isLoading, refetch } = useDlqDepth();
  const retryDlq = useRetryDlq();
  const discardDlq = useDiscardDlq();

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="data-label">DEAD LETTER QUEUE</p>
        <p className="font-mono text-[10px] text-slate-500 mt-0.5">wetlabs.reports.inbound.dlq</p>
      </div>

      {isLoading ? <Spinner /> : (
        <div className={cn(
          'panel p-4 flex items-center gap-4',
          (data?.dlq_depth ?? 0) > 0 ? 'border-amber-500/30' : 'border-teal-500/20',
        )}>
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            (data?.dlq_depth ?? 0) > 0 ? 'bg-amber-500/10' : 'bg-signal-500/10',
          )}>
            {(data?.dlq_depth ?? 0) > 0
              ? <AlertTriangle className="w-6 h-6 text-amber-400" />
              : <Inbox className="w-6 h-6 text-signal-400" />}
          </div>
          <div>
            <p className="font-mono text-2xl text-slate-200">{data?.dlq_depth ?? 0}</p>
            <p className="data-label">
              {(data?.dlq_depth ?? 0) === 0 ? 'QUEUE CLEAR' : 'FAILED MESSAGES'}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          Refresh
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open('http://localhost:15672', '_blank')}
        >
          Open RabbitMQ UI ↗
        </Button>
      </div>

      {data?.messages && data.messages.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="data-label text-amber-500">MESSAGES ({data.messages.length})</p>
          {data.messages.map((msg, i) => (
            <div key={i} className="panel p-3 border-amber-500/20 bg-amber-500/5">
               <pre className="text-[10px] text-slate-300 font-mono whitespace-pre-wrap mb-3 overflow-x-auto">
                 {JSON.stringify(msg, null, 2)}
               </pre>
               {msg.messageId && (
                 <div className="flex gap-2">
                   <Button size="sm" variant="outline" loading={retryDlq.isPending}
                     onClick={() => retryDlq.mutate(msg.messageId)}>Retry</Button>
                   <Button size="sm" variant="ghost" loading={discardDlq.isPending}
                     onClick={() => discardDlq.mutate(msg.messageId)} className="text-red-400 hover:text-red-300">Discard</Button>
                 </div>
               )}
            </div>
          ))}
        </div>
      )}

      <div className="panel p-3 bg-amber-500/5 border-amber-500/15">
        <p className="font-mono text-[10px] text-amber-400 mb-1">HOW TO RETRY</p>
        <p className="text-xs text-slate-400 font-serif leading-relaxed">
          To retry failed messages, use the RabbitMQ Management UI to move messages
          from the DLQ back to <code className="font-mono text-teal-400">wetlabs.reports.inbound</code>.
          Full retry UI is planned for Sprint 5 (US-14).
        </p>
      </div>
    </div>
  );
}

// ── Audit tab (US-15) ─────────────────────────────────────────────────────────
function AuditTab() {
  const [page,       setPage]       = useState(1);
  const [actionFilt, setActionFilt] = useState('');
  const [emailFilt,  setEmailFilt]  = useState('');
  const [exporting,  setExporting]  = useState(false);

  const { data, isLoading } = useAuditLog({
    page,
    action:      actionFilt || undefined,
    actor_email: emailFilt  || undefined,
  });

  const handleExport = async () => {
    setExporting(true);
    try {
       await exportAuditLogCsv({ action: actionFilt || undefined, actor_email: emailFilt || undefined });
    } finally {
       setExporting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Filters row */}
      <div className="grid grid-cols-2 gap-2 relative">
        <div className="absolute -top-1 right-0 z-10">
           <Button size="sm" variant="outline" loading={exporting} onClick={() => void handleExport()}>
              <Download className="w-3.5 h-3.5 mr-1" /> EXPORT CSV
           </Button>
        </div>
        {[
          { label: 'ACTION',       value: actionFilt, set: setActionFilt, placeholder: 'e.g. REPORT_CREATED' },
          { label: 'ACTOR EMAIL',  value: emailFilt,  set: setEmailFilt,  placeholder: 'officer@...'         },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label} className="space-y-1">
            <label className="data-label">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => { set(e.target.value); setPage(1); }}
              placeholder={placeholder}
              className="w-full bg-slate-900 border border-teal-500/15 rounded px-2 py-1.5 text-xs font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>
        ))}
      </div>

      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}

      {!isLoading && !data?.data.length && (
        <EmptyState icon={ScrollText} title="No audit events" message="Try adjusting the filters." />
      )}

      {/* Event list */}
      <div className="space-y-1.5">
        {data?.data.map((entry) => (
          <details
            key={entry.log_id}
            className="panel group cursor-pointer"
          >
            <summary className="flex items-center gap-3 p-3 list-none">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                    {entry.action}
                  </span>
                  {entry.target_type && (
                    <span className="font-mono text-[10px] text-slate-500">{entry.target_type}</span>
                  )}
                </div>
                <p className="font-mono text-[10px] text-slate-500 mt-0.5 truncate">
                  {entry.actor_email ?? 'system'} · {fmtRelative(entry.created_at)}
                </p>
                {entry.ip_address && (
                  <p className="font-mono text-[9px] text-slate-600 mt-0.5">
                    IP: {entry.ip_address}
                  </p>
                )}
              </div>
            </summary>

            {/* Expanded: meta JSONB payload (US-15 AC3) */}
            {entry.meta && (
              <div className="px-3 pb-3 border-t border-teal-500/10 mt-0">
                <pre className="text-[10px] font-mono text-slate-400 bg-slate-950 rounded p-2 overflow-x-auto mt-2">
                  {JSON.stringify(entry.meta, null, 2)}
                </pre>
              </div>
            )}
          </details>
        ))}
      </div>

      {/* Pagination */}
      {data && data.meta.total > 50 && (
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </Button>
          <span className="font-mono text-[10px] text-slate-500">
            {page} / {Math.ceil((data?.meta.total || 0) / 50)}
          </span>
          <Button variant="ghost" size="sm"
            disabled={page >= Math.ceil((data?.meta.total || 0) / 50)}
            onClick={() => setPage((p) => p + 1)}>
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Developer tab (US-12) ─────────────────────────────────────────────────────
function DevelopersTab() {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div>
        <p className="data-label">PUBLIC API ACCESS</p>
        <p className="text-xs text-slate-400 font-serif leading-relaxed mt-2">
          Wetlabs provides a machine-readable API for researchers and NGO partners
           to integrate data into external modeling tools.
        </p>
      </div>

      <div className="panel p-4 space-y-4">
        <div>
          <label className="data-label block mb-1">API BASE URL</label>
          <code className="block p-2 bg-slate-900 rounded border border-teal-500/10 text-[10px] font-mono text-teal-300">
            https://api.wetlabs.app/api/v1
          </code>
        </div>

        <div>
          <label className="data-label block mb-1">YOUR ACCESS KEY</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 bg-slate-900 rounded border border-teal-500/10 text-[10px] font-mono text-slate-400">
              ••••••••••••••••••••••••••••••••
            </code>
            <Button variant="ghost" size="sm" className="text-[10px] px-2 h-7">Copy</Button>
          </div>
        </div>
      </div>

      <div>
        <p className="data-label mb-2">DOCUMENTATION</p>
        <div className="space-y-2">
          {[
            { label: 'REST API Reference', url: 'https://docs.wetlabs.app/api' },
            { label: 'Webhooks Guide',     url: 'https://docs.wetlabs.app/webhooks' },
            { label: 'Data Dictionary',    url: 'https://docs.wetlabs.app/dictionary' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 panel hover:bg-teal-500/5 group"
            >
              <span className="font-mono text-[10px] text-slate-300 group-hover:text-teal-400 underline underline-offset-4">
                {item.label}
              </span>
              <Terminal className="w-3 h-3 text-slate-600 group-hover:text-teal-500" />
            </a>
          ))}
        </div>
      </div>

      <div className="p-3 bg-teal-500/5 border border-teal-500/10 rounded">
        <p className="text-[10px] font-mono text-teal-400 leading-relaxed uppercase tracking-widest mb-1">
          Quota Notice
        </p>
        <p className="text-[10px] text-slate-500 font-mono">
          Public keys are rate-limited to 1,000 requests/hour. Contact NEMA IT
          for high-throughput research keys.
        </p>
      </div>
    </div>
  );
}
