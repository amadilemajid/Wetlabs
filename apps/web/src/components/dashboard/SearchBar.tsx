import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { useFilterStore } from '@stores/filter.store';
import { useUiStore } from '@stores/ui.store';
import { useWetlands } from '@features/wetlands/hooks/useWetlands';

interface SearchOption {
  id: string;
  label: string;
  category: 'wetland' | 'severity' | 'region' | 'district' | 'watershed';
  value: string;
  metadata?: any;
}

const SEVERITY_OPTIONS: SearchOption[] = [
  { id: 'sev-1', label: 'High Severity',   category: 'severity', value: 'HIGH'   },
  { id: 'sev-2', label: 'Medium Severity', category: 'severity', value: 'MEDIUM' },
  { id: 'sev-3', label: 'Low Severity',    category: 'severity', value: 'LOW'    },
];

// Hardcoded geographic data for known wetlands
const WETLAND_METADATA: Record<string, { region: string; district: string; watershed: string }> = {
  'KYO01': { region: 'Central Region', district: 'Kayunga District', watershed: 'Lake Kyoga Basin' },
  'KYO02': { region: 'Central Region', district: 'Nakasongola District', watershed: 'Lake Kyoga Basin' },
  'VIC01': { region: 'Central Region', district: 'Wakiso District', watershed: 'Lake Victoria Basin' },
  'VICTORIA': { region: 'Central Region', district: 'Kampala District', watershed: 'Lake Victoria Basin' },
  'ALB01': { region: 'Western Region', district: 'Kasese District', watershed: 'Lake Albert Basin' },
  'KAT01': { region: 'Western Region', district: 'Mbarara District', watershed: 'Lake Katwe Basin' },
};

export function SearchBar() {
  const [query, setQuery]     = useState('');
  const [isOpen, setIsOpen]   = useState(false);
  const [filtered, setFiltered] = useState<SearchOption[]>([]);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const inputRef    = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { setSeverity, setWetlandCode } = useFilterStore();
  const { selectWetland } = useUiStore();

  // Use the shared React Query cache — no duplicate fetch
  const { data: wetlandsData } = useWetlands();

  // Extract wetlands with enriched metadata
  const wetlandOptions: SearchOption[] = (wetlandsData?.features ?? []).map((f, i) => {
    const code = f.properties.wetland_code;
    const metadata = WETLAND_METADATA[code] || { region: 'Unknown', district: 'Unknown', watershed: 'Unknown' };
    return {
      id:       `wetland-${i}`,
      label:    f.properties.wetland_name,
      category: 'wetland',
      value:    code,
      metadata: { ...f.properties, ...metadata },
    };
  });

  // Extract unique regions, districts, watersheds from enriched metadata
  const regions = new Set<string>();
  const districts = new Set<string>();
  const watersheds = new Set<string>();
  
  wetlandOptions.forEach(opt => {
    if (opt.metadata?.region) regions.add(opt.metadata.region);
    if (opt.metadata?.district) districts.add(opt.metadata.district);
    if (opt.metadata?.watershed) watersheds.add(opt.metadata.watershed);
  });

  const regionOptions: SearchOption[] = Array.from(regions).map((r, i) => ({
    id: `region-${i}`,
    label: r,
    category: 'region',
    value: r,
  }));

  const districtOptions: SearchOption[] = Array.from(districts).map((d, i) => ({
    id: `district-${i}`,
    label: d,
    category: 'district',
    value: d,
  }));

  const watershedOptions: SearchOption[] = Array.from(watersheds).map((w, i) => ({
    id: `watershed-${i}`,
    label: w,
    category: 'watershed',
    value: w,
  }));

  const allOptions = [...wetlandOptions, ...regionOptions, ...districtOptions, ...watershedOptions, ...SEVERITY_OPTIONS];

  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      setIsOpen(false);
      return;
    }
    const q = query.toLowerCase();
    const results = allOptions.filter(o => o.label.toLowerCase().includes(q));
    setFiltered(results);
    setIsOpen(true);
    if (inputRef.current) {
      const r = inputRef.current.getBoundingClientRect();
      setDropdownPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
  }, [query, wetlandsData]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setIsOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSelect = (option: SearchOption) => {
    if (option.category === 'severity') {
      setSeverity([option.value as any]);
    } else if (option.category === 'wetland') {
      setWetlandCode(option.value);
      selectWetland(option.value);
    } else if (option.category === 'region' || option.category === 'district' || option.category === 'watershed') {
      // Filter wetlands by region/district/watershed using enriched metadata
      const matchingWetlands = wetlandOptions.filter(w => {
        if (option.category === 'region') return w.metadata?.region === option.value;
        if (option.category === 'district') return w.metadata?.district === option.value;
        if (option.category === 'watershed') return w.metadata?.watershed === option.value;
        return false;
      });
      // Select the first matching wetland
      if (matchingWetlands.length > 0) {
        const code = matchingWetlands[0].value;
        setWetlandCode(code);
        selectWetland(code);
      }
    }
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (filtered.length > 0) handleSelect(filtered[0]);
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const categoryColor: Record<string, string> = {
    wetland:   'bg-blue-100 text-blue-700',
    severity:  'bg-red-100 text-red-700',
    region:    'bg-green-100 text-green-700',
    district:  'bg-purple-100 text-purple-700',
    watershed: 'bg-orange-100 text-orange-700',
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#6B8A99' }} />
        <input
          ref={inputRef}
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search wetlands, regions, districts, watersheds, or severity..."
          className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          style={{ background: '#FFFFFF', borderColor: '#B8CFDF', color: '#2C3E50' }}
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
            style={{ color: '#6B8A99' }}>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && createPortal(
        <div
          className="fixed bg-white border rounded-lg shadow-2xl z-[9999] max-h-72 overflow-y-auto"
          style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, borderColor: '#E1E8ED' }}
        >
          {filtered.map((option) => (
            <button key={option.id} type="button" onClick={() => handleSelect(option)}
              className="w-full px-4 py-3 text-left hover:bg-teal-50 border-b last:border-b-0 flex items-center justify-between"
              style={{ borderColor: '#E1E8ED' }}
            >
              <span className="text-sm" style={{ color: '#2C3E50' }}>{option.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[option.category]}`}>
                {option.category}
              </span>
            </button>
          ))}
        </div>,
        document.body
      )}

      {isOpen && query && filtered.length === 0 && createPortal(
        <div
          className="fixed bg-white border rounded-lg shadow-2xl z-[9999] p-4 text-center text-sm"
          style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, borderColor: '#E1E8ED', color: '#6B8A99' }}
        >
          No results for "{query}"
        </div>,
        document.body
      )}
    </div>
  );
}
