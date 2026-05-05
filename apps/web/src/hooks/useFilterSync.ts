import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilterStore } from '@stores/filter.store';

export function useFilterSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lastParamsRef = useRef('');

  // On mount: apply URL params → store (so ?wetland_code=X works on load)
  useEffect(() => {
    const code = searchParams.get('wetland_code');
    if (code) {
      useFilterStore.getState().setWetlandCode(code);
      lastParamsRef.current = `wetland_code=${code}`;
    } else {
      lastParamsRef.current = '';
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync store → URL, guarded against loops
  useEffect(() => {
    const unsub = useFilterStore.subscribe((state) => {
      const next = new URLSearchParams();
      if (state.wetland_code) next.set('wetland_code', state.wetland_code);
      if (state.severity?.length) state.severity.forEach(s => next.append('severity', s));
      if (state.observation_type?.length) state.observation_type.forEach(o => next.append('observation_type', o));
      if (state.channel?.length) state.channel.forEach(c => next.append('channel', c));

      const str = next.toString();
      if (str === lastParamsRef.current) return; // no change — skip to prevent loop
      lastParamsRef.current = str;
      setSearchParams(next, { replace: true });
    });
    return unsub;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
