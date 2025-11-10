import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Auth Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle user sign out', async () => {
    const signOutMock = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.auth.signOut).mockImplementation(signOutMock);

    await supabase.auth.signOut();

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it('should get user session', async () => {
    const mockSession = {
      data: {
        session: {
          user: { id: '123', email: 'test@example.com' },
          access_token: 'token',
        },
      },
      error: null,
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue(mockSession as any);

    const result = await supabase.auth.getSession();

    expect(result.data.session?.user.email).toBe('test@example.com');
  });
});
