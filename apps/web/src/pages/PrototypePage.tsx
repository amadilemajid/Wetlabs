import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map, BarChart2, ChevronLeft, Phone, Delete, X } from 'lucide-react';
import { apiClient } from '@api/client';
import type { WetlandReport } from '@wetlabs/shared-types';

type Step = 'locked'|'dialer'|'calling'|'main_menu'|'wetland'|'issue'|'severity'|'confirm'|'submitting'|'sms'|'my_reports'|'help';

const WETLAND_MAP: Record<string,'string'> = { '1':'KYO01','2':'VIC01','3':'ALB01','4':'KAT01' };
const WETLAND_NAMES = ['Kyoga Basin','Victoria Basin','Albert Basin','Katonga Valley'];
const ISSUE_MAP: Record<string,string> = { '1':'FLOOD','2':'DROUGHT','3':'ENCROACHMENT','4':'VEGETATION_CHANGE','5':'POLLUTION' };
const ISSUE_NAMES = ['Flood','Drought','Encroachment','Vegetation Change','Pollution'];
const SEV_MAP: Record<string,string> = { '1':'LOW','2':'MEDIUM','3':'HIGH' };
const SEV_NAMES = ['Low','Medium','High'];
const USSD = '*384#';
const SESSION_ID = `proto_${Math.random().toString(36).slice(2,9)}`;

function UssdHeader({ sub, onBack }:{ sub:string; onBack?:()=>void }) {
  return (
    <div className="bg-emerald-600 px-4 py-3 flex items-center gap-2 flex-shrink-0">
      {onBack && <button onClick={onBack} className="text-white/70 hover:text-white"><ChevronLeft className="w-4 h-4"/></button>}
      <div>
        <p className="text-white text-[11px] font-bold font-mono">WETLABS Â· {USSD}</p>
        <p className="text-white/70 text-[10px] font-mono">{sub}</p>
      </div>
    </div>
  );
}

function Menu({ items, onSelect }:{ items:[string,string][]; onSelect:(k:string)=>void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {items.map(([k,v]) => (
        <button key={k} onClick={()=>onSelect(k)}
          className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-emerald-50 active:bg-emerald-100 transition-colors">
          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">{k}</span>
          <span className="font-mono text-[11px] text-gray-700 text-left">{v}</span>
        </button>
      ))}
    </div>
  );
}

export function PrototypePage() {
  const navigate = useNavigate();
  const [step, setStep]     = useState<Step>('locked');
  const [dial, setDial]     = useState('');
  const [dialErr, setErr]   = useState(false);
  const [wKey, setWKey]     = useState('');
  const [iKey, setIKey]     = useState('');
  const [sKey, setSKey]     = useState('');
  const [reportId, setRid]  = useState('');
  const [apiErr, setApiErr] = useState('');
  const [myReports, setMyReports] = useState<WetlandReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const now = new Date();
  const timeStr = now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  const dateStr = now.toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'});

  const go = (s:Step) => {
    setStep(s);
    if (s === 'my_reports') loadMyReports();
  };
  const reset = () => { setWKey(''); setIKey(''); setSKey(''); setDial(''); setRid(''); setApiErr(''); go('locked'); };

  const loadMyReports = async () => {
    setReportsLoading(true);
    try {
      const res = await apiClient.get<{ data: WetlandReport[] }>('/reports', {
        params: { per_page: 5, page: 1 },
      });
      setMyReports(res.data.data || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
      // Show demo data if API fails (not authenticated or server down)
      setMyReports([
        {
          report_id: 'demo-001',
          wetland_code: 'KYO01',
          observation_type: 'FLOOD',
          severity: 'HIGH',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        } as WetlandReport,
        {
          report_id: 'demo-002',
          wetland_code: 'VIC01',
          observation_type: 'ENCROACHMENT',
          severity: 'MEDIUM',
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        } as WetlandReport,
        {
          report_id: 'demo-003',
          wetland_code: 'ALB01',
          observation_type: 'POLLUTION',
          severity: 'LOW',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        } as WetlandReport,
      ]);
    } finally {
      setReportsLoading(false);
    }
  };

  const handleCall = () => {
    if (dial === USSD) { setDial(''); setErr(false); go('calling'); setTimeout(()=>go('main_menu'),1500); }
    else { setErr(true); setTimeout(()=>{ setErr(false); setDial(''); },1800); }
  };

  const handleSubmit = async () => {
    go('submitting');
    setApiErr('');
    try {
      // Build USSD text path: 1 (Report) * wetland * issue * severity
      const text = `1*${wKey}*${iKey}*${sKey}`;
      const res = await apiClient.post<string>('/ussd/callback',
        { sessionId: SESSION_ID, phoneNumber: '+256700000000', text },
        { headers: { 'x-ussd-simulator-key': 'dev-sim-key' } }
      );
      const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      const match = body.match(/WL-[\d-]+/);
      setRid(match ? match[0] : `WL-${Date.now()}`);
      navigate('/confirmation');
    } catch {
      // Fallback: generate local ID so prototype still works offline
      setRid(`WL-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*9000)+1000)}`);
      setApiErr('Submitted locally (API offline)');
      navigate('/confirmation');
    }
  };

  const screens: Record<Step, React.ReactNode> = {

    locked: (
      <div className="bg-gradient-to-b from-emerald-900 to-black" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <p className="text-white text-5xl font-thin">{timeStr}</p>
          <p className="text-white/50 text-xs">{dateStr}</p>
          <div className="mt-8 flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-2xl">ðŸ’§</div>
            <p className="text-emerald-400 text-[10px] font-mono tracking-widest mt-1">WETLABS REPORTER</p>
          </div>
        </div>
        <div className="pb-10 flex flex-col items-center gap-3">
          <p className="text-white/30 text-[10px] font-mono">Dial {USSD} to report</p>
          <button onClick={()=>go('dialer')} className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-lg">
            <Phone className="w-6 h-6"/>
          </button>
          <p className="text-white/20 text-[9px] font-mono">TAP TO OPEN DIALER</p>
        </div>
      </div>
    ),

    dialer: (
      <div className="bg-[#0f0f0f]" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div className="flex justify-between px-4 pt-3 pb-1">
          <span className="text-white/40 text-[9px] font-mono">{timeStr}</span>
          <span className="text-white/40 text-[9px]">ðŸ“¶ ðŸ”‹</span>
        </div>
        <div className="px-6 py-5 text-center">
          <p className={`font-mono text-3xl tracking-widest min-h-[2.5rem] ${dialErr?'text-red-400':'text-white'}`}>
            {dialErr ? 'Invalid code' : dial}
          </p>
          <p className="text-white/25 text-[10px] font-mono mt-1">Enter {USSD} then press call</p>
        </div>
        <div className="flex-1 px-5">
          <div className="grid grid-cols-3 gap-3">
            {['1','2','3','4','5','6','7','8','9','*','0','#'].map(k=>(
              <button key={k} onClick={()=>setDial(p=>p.length<15?p+k:p)}
                className="h-14 rounded-full bg-white/8 text-white font-mono text-xl hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center border border-white/5">{k}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 py-5">
          <button onClick={()=>setDial(p=>p.slice(0,-1))} className="w-12 h-12 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"><Delete className="w-5 h-5"/></button>
          <button onClick={handleCall} className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-lg"><Phone className="w-7 h-7"/></button>
          <button onClick={()=>{setDial('');go('locked');}} className="w-12 h-12 rounded-full flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-white/10 transition-all"><X className="w-5 h-5"/></button>
        </div>
      </div>
    ),

    calling: (
      <div className="flex items-center justify-center bg-[#0f0f0f] gap-4" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div className="w-16 h-16 rounded-full bg-emerald-600/20 border-2 border-emerald-500/40 flex items-center justify-center animate-pulse text-3xl">ðŸ’§</div>
        <p className="text-white font-mono text-sm">WETLABS</p>
        <p className="text-white/50 font-mono text-xs">{USSD}</p>
        <div className="flex gap-1 mt-2">
          {[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
        </div>
        <p className="text-white/30 text-[10px] font-mono">Connecting to WETLABS...</p>
      </div>
    ),

    main_menu: (
      <div className="bg-[#f5f5f0]" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <UssdHeader sub="Welcome to WETLABS"/>
        <div className="flex-1 p-4 overflow-y-auto">
          <Menu items={[['1','Report a wetland issue'],['2','My Reports'],['3','Help'],['0','Exit']]}
            onSelect={k=>{ if(k==='1')go('wetland'); if(k==='2')go('my_reports'); if(k==='3')go('help'); if(k==='0')reset(); }}/>
        </div>
        <p className="p-3 text-gray-400 text-[9px] font-mono text-center bg-white border-t border-gray-100">Tap a number to select</p>
      </div>
    ),

    wetland: (
      <div className="bg-[#f5f5f0]" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <UssdHeader sub="Select Wetland Area" onBack={()=>go('main_menu')}/>
        <div className="flex-1 p-4 overflow-y-auto">
          <Menu items={[...WETLAND_NAMES.map((w,i)=>[`${i+1}`,w] as [string,string]),['0','Back']]}
            onSelect={k=>{ if(k==='0')go('main_menu'); else{setWKey(k);go('issue');} }}/>
        </div>
      </div>
    ),

    issue: (
      <div className="bg-[#f5f5f0]" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <UssdHeader sub="Select Issue Type" onBack={()=>go('wetland')}/>
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100">
          <p className="font-mono text-[10px] text-emerald-700">ðŸ“ {WETLAND_NAMES[parseInt(wKey)-1]}</p>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <Menu items={[...ISSUE_NAMES.map((iss,i)=>[`${i+1}`,iss] as [string,string]),['0','Back']]}
            onSelect={k=>{ if(k==='0')go('wetland'); else{setIKey(k);go('severity');} }}/>
        </div>
      </div>
    ),

    severity: (
      <div className="bg-[#f5f5f0]" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <UssdHeader sub="Select Severity" onBack={()=>go('issue')}/>
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 space-y-0.5">
          <p className="font-mono text-[10px] text-emerald-700">ðŸ“ {WETLAND_NAMES[parseInt(wKey)-1]}</p>
          <p className="font-mono text-[10px] text-emerald-700">âš ï¸ {ISSUE_NAMES[parseInt(iKey)-1]}</p>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <Menu items={[['1','Low â€” minor concern'],['2','Medium â€” needs attention'],['3','High â€” urgent response'],['0','Back']]}
            onSelect={k=>{ if(k==='0')go('issue'); else{setSKey(k);go('confirm');} }}/>
        </div>
      </div>
    ),

    confirm: (
      <div className="bg-[#f5f5f0]" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <UssdHeader sub="Confirm & Submit" onBack={()=>go('severity')}/>
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 space-y-1.5">
            <p className="font-mono text-[9px] text-gray-400 uppercase border-b border-gray-50 pb-1.5">Report Summary</p>
            {[['Wetland', WETLAND_NAMES[parseInt(wKey)-1]??''],['Issue', ISSUE_NAMES[parseInt(iKey)-1]??''],['Severity', SEV_NAMES[parseInt(sKey)-1]??''],['GPS','Auto-detected'],['Reporter','Anonymised'],['Time',timeStr]].map(([k,v])=>(
              <div key={k} className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-gray-400">{k}</span>
                <span className="font-mono text-[9px] text-gray-800 font-semibold truncate ml-2 max-w-[55%] text-right">{v}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-2">
            <p className="text-blue-600 text-[9px] font-mono leading-relaxed">â„¹ï¸ Submitting via {USSD} sends this to the WETLABS server. No internet needed on a real GSM phone.</p>
          </div>
        </div>
        <div className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
          <button onClick={()=>go('severity')} className="flex-1 py-2 border border-gray-300 rounded-xl text-gray-600 text-xs font-mono">Back</button>
          <button onClick={()=>void handleSubmit()} className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-emerald-500 active:scale-95 transition-all">Submit Report</button>
        </div>
      </div>
    ),

    submitting: (
      <div className="flex items-center justify-center bg-[#f5f5f0] gap-4" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"/>
        <p className="font-mono text-sm text-gray-700 font-semibold">Submitting report...</p>
        <p className="font-mono text-[10px] text-gray-400">Sending to WETLABS server</p>
      </div>
    ),

    sms: (
      <div className="bg-[#f5f5f0]" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <div className="bg-emerald-600 px-4 py-3 flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">W</div>
          <div><p className="text-white text-xs font-semibold">SMS Confirmation</p><p className="text-white/70 text-[9px]">WETLABS System</p></div>
        </div>
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">W</div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-3 shadow-sm border border-gray-100">
              <p className="font-mono text-[11px] text-gray-800 leading-loose whitespace-pre-line">{`âœ… Report submitted!\n\nID: `}<span className="font-bold text-emerald-700">{reportId}</span>{`\nWetland: ${WETLAND_NAMES[parseInt(wKey)-1]}\nIssue: ${ISSUE_NAMES[parseInt(iKey)-1]}\nSeverity: ${SEV_NAMES[parseInt(sKey)-1]}\n\nThank you. Your officer has been notified.`}</p>
              <p className="text-gray-400 text-[9px] mt-2 text-right font-mono">{timeStr}</p>
            </div>
          </div>
          {apiErr && <p className="font-mono text-[9px] text-amber-600 text-center">{apiErr}</p>}
          {/* WHERE THE DATA GOES */}
          <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm space-y-2">
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Where your report goes:</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 text-sm flex-shrink-0">ðŸ—„ï¸</span>
                <p className="font-mono text-[10px] text-gray-600"><span className="font-bold text-gray-800">Stored</span> in the WETLABS database with your report ID, timestamp and GPS coordinates.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 text-sm flex-shrink-0">ðŸ—ºï¸</span>
                <p className="font-mono text-[10px] text-gray-600"><span className="font-bold text-gray-800">Visible on the map</span> as a coloured marker at the wetland location.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 text-sm flex-shrink-0">ðŸ“Š</span>
                <p className="font-mono text-[10px] text-gray-600"><span className="font-bold text-gray-800">Reviewed by analysts</span> on the dashboard â€” validated against satellite NDVI/NDWI data.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-500 text-sm flex-shrink-0">ðŸ””</span>
                <p className="font-mono text-[10px] text-gray-600"><span className="font-bold text-gray-800">HIGH severity</span> reports trigger an instant alert to the assigned wetland officer.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
          <button onClick={()=>{setWKey('');setIKey('');setSKey('');go('main_menu');}} className="flex-1 py-2.5 border border-emerald-600 text-emerald-600 rounded-xl text-xs font-mono font-semibold">New Report</button>
          <button onClick={reset} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-semibold">Done</button>
        </div>
      </div>
    ),

    my_reports: (
      <div className="bg-[#f5f5f0]" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <UssdHeader sub="My Recent Reports" onBack={()=>go('main_menu')}/>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {reportsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"/>
            </div>
          ) : myReports.length === 0 ? (
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="font-mono text-[11px] text-gray-500">No reports found</p>
              <p className="font-mono text-[9px] text-gray-400 mt-1">Submit your first report</p>
            </div>
          ) : (
            myReports.map((report) => {
              const sevColor = report.severity === 'HIGH' ? 'text-red-600 bg-red-50' : report.severity === 'MEDIUM' ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50';
              const timeAgo = new Date(report.created_at).toLocaleString();
              return (
                <div key={report.report_id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[9px] text-gray-400">{report.report_id.slice(0,8)}</span>
                    <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${sevColor}`}>{report.severity}</span>
                  </div>
                  <p className="font-mono text-[11px] text-gray-800 font-semibold">{report.wetland_code}</p>
                  <div className="flex justify-between mt-1">
                    <span className="font-mono text-[9px] text-gray-500">{report.observation_type}</span>
                    <span className="font-mono text-[9px] text-gray-400">{timeAgo}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    ),

    help: (
      <div className="bg-[#f5f5f0]" style={{width:'100%',height:'460px',minHeight:'460px',maxHeight:'460px',overflow:'hidden',display:'flex',flexDirection:'column',flexShrink:0}}>
        <UssdHeader sub="Help & Support" onBack={()=>go('main_menu')}/>
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
            {[['USSD Code',USSD,'text-emerald-600 font-bold'],['SMS Format','WETLABS FLOOD KYO01 HIGH','text-gray-600'],['Hotline','0800-WETLABS (free)','text-gray-600'],['Works on','Any 2G GSM phone Â· No internet','text-gray-600']].map(([k,v,c])=>(
              <div key={k} className="border-b border-gray-50 pb-2 last:border-0">
                <p className="font-mono text-[10px] text-gray-400 uppercase">{k}</p>
                <p className={`font-mono text-[11px] mt-0.5 ${c}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
          <button onClick={()=>go('main_menu')} className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-semibold">Back to Menu</button>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[#0A1628] bg-grid flex flex-col">
      <div className="sticky top-0 z-10 bg-[#0A1628]/95 backdrop-blur border-b border-teal-500/10 px-6 py-3 flex items-center gap-3">
        <span className="font-mono text-sm font-bold text-teal-400 tracking-widest">WETLABS</span>
        <span className="font-mono text-[9px] text-slate-500">INTERACTIVE PROTOTYPE Â· DIAL {USSD}</span>
        <div className="ml-auto flex gap-2">
          <Link to="/map" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-teal-500/20 text-teal-400 font-mono text-[10px] hover:bg-teal-500/10 transition-all"><Map className="w-3 h-3"/> MAP</Link>
          <Link to="/dashboard" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-teal-500/20 text-teal-400 font-mono text-[10px] hover:bg-teal-500/10 transition-all"><BarChart2 className="w-3 h-3"/> DASHBOARD</Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-10 gap-4">
        <p className="font-mono text-[10px] text-slate-500 tracking-wider">TAP PHONE ICON â†’ DIAL <span className="text-emerald-400 font-bold">{USSD}</span> â†’ PRESS CALL</p>
        <div className="relative w-[280px]" style={{isolation:'isolate'}}>
          <div className="bg-[#1a1a1a] rounded-[44px] border-[3px] border-[#2a2a2a] shadow-[0_30px_80px_rgba(0,0,0,0.8)]" style={{overflow:'hidden'}}>
            <div className="absolute -left-[5px] top-20 w-[3px] h-8 bg-[#333] rounded-l-sm"/>
            <div className="absolute -left-[5px] top-32 w-[3px] h-12 bg-[#333] rounded-l-sm"/>
            <div className="absolute -right-[5px] top-28 w-[3px] h-16 bg-[#333] rounded-r-sm"/>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-28 h-6 bg-[#111] rounded-b-2xl flex items-center justify-center gap-2">
                <div className="w-10 h-1.5 bg-[#222] rounded-full"/>
                <div className="w-2 h-2 bg-[#222] rounded-full"/>
              </div>
            </div>
            <div style={{width:'256px',height:'460px',overflow:'hidden',borderRadius:'24px',display:'flex',flexDirection:'column',position:'relative',contain:'strict'}}>
              {screens[step]}
            </div>
            <div className="flex justify-center py-2">
              <button onClick={reset} className="w-20 h-1 bg-white/20 rounded-full hover:bg-white/40 transition-colors" title="Reset"/>
            </div>
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="font-mono text-[9px] text-slate-600 tracking-widest uppercase">
            {step==='locked'&&'Lock Screen â€” tap phone icon'}
            {step==='dialer'&&`Type ${USSD} then press green call`}
            {step==='calling'&&'Connecting...'}
            {step==='main_menu'&&'USSD Active â€” Main Menu'}
            {step==='wetland'&&'Step 1/4 â€” Select Wetland'}
            {step==='issue'&&'Step 2/4 â€” Select Issue'}
            {step==='severity'&&'Step 3/4 â€” Select Severity'}
            {step==='confirm'&&'Step 4/4 â€” Confirm & Submit'}
            {step==='submitting'&&'Sending to server...'}
            {step==='sms'&&'âœ… Report stored Â· visible on map Â· sent to dashboard'}
            {step==='my_reports'&&'My Previous Reports'}
            {step==='help'&&'Help & Support'}
          </p>
          {step==='sms' && (
            <div className="flex gap-2 justify-center mt-2">
              <Link to="/map" className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-mono text-[10px] hover:bg-emerald-500 transition-all">View on Map â†’</Link>
              <Link to="/dashboard" className="px-3 py-1.5 bg-slate-700 text-teal-400 rounded-lg font-mono text-[10px] hover:bg-slate-600 transition-all">View in Dashboard â†’</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
