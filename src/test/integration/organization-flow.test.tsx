import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrganizationsPage from '@/pages/OrganizationsPage';
import { supabase } from '@/integrations/supabase/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </BrowserRouter>
);

describe('Organization Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display organizations list', async () => {
    const mockOrganizations = [
      { id: '1', name: 'Org 1', slug: 'org-1', logo_url: null, created_at: new Date().toISOString() },
      { id: '2', name: 'Org 2', slug: 'org-2', logo_url: null, created_at: new Date().toISOString() },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: mockOrganizations, error: null }),
      }),
    } as any);

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    } as any);

    render(<OrganizationsPage />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/Organizaciones/i)).toBeInTheDocument();
    });
  });
});
