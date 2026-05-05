import { describe, it, expect, beforeEach } from 'vitest';
import { useFilterStore } from '@stores/filter.store';

describe('FilterStore', () => {
  beforeEach(() => useFilterStore.setState({
    from: '2026-01-01', to: '2026-12-31',
    page: 1, per_page: 500,
  }));

  it('sets severity filter correctly', () => {
    useFilterStore.getState().setSeverity(['HIGH','MEDIUM']);
    expect(useFilterStore.getState().severity).toEqual(['HIGH','MEDIUM']);
  });

  it('resets page to 1 when filter changes', () => {
    useFilterStore.setState({ page: 5 });
    useFilterStore.getState().setSeverity(['HIGH']);
    expect(useFilterStore.getState().page).toBe(1);
  });

  it('resets all filters to defaults', () => {
    useFilterStore.getState().setSeverity(['HIGH']);
    useFilterStore.getState().setObservationType(['FLOOD']);
    useFilterStore.getState().resetFilters();
    expect(useFilterStore.getState().severity).toBeUndefined();
    expect(useFilterStore.getState().observation_type).toBeUndefined();
  });

  it('getActiveFilters returns only defined fields', () => {
    useFilterStore.getState().setSeverity(['LOW']);
    const filters = useFilterStore.getState().getActiveFilters();
    expect(filters.severity).toEqual(['LOW']);
    expect(filters.page).toBe(1);
  });
});
