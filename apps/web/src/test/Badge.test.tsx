import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeverityBadge, ObsTypeBadge } from '@components/ui/Badge';

describe('SeverityBadge', () => {
  it('renders HIGH severity with correct label', () => {
    render(<SeverityBadge severity="HIGH" />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders MEDIUM severity', () => {
    render(<SeverityBadge severity="MEDIUM" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders LOW severity', () => {
    render(<SeverityBadge severity="LOW" />);
    expect(screen.getByText('Low')).toBeInTheDocument();
  });
});

describe('ObsTypeBadge', () => {
  it('renders human-readable observation type label', () => {
    render(<ObsTypeBadge type="VEGETATION_CHANGE" />);
    expect(screen.getByText('Vegetation Change')).toBeInTheDocument();
  });

  it('renders FLOOD type', () => {
    render(<ObsTypeBadge type="FLOOD" />);
    expect(screen.getByText('Flood')).toBeInTheDocument();
  });
});
