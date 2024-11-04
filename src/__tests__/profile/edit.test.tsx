import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EditProfile from '@/pages/profile/edit';
import {UserProvider} from "@/contexts/UserContext";

describe('EditProfile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays success message and navigates back on successful update', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(<UserProvider><EditProfile /></UserProvider>);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'UpdatedUser' } });
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'Updated bio.' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  test('displays error message on failed profile update', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed to update profile' }),
    });

    render(<UserProvider><EditProfile /></UserProvider>);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'UpdatedUser' } });
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'Updated bio.' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to update profile/i)).toBeInTheDocument();
    });
  });

  test('displays unexpected error message on network failure', async () => {
    global.fetch = vi.fn().mockRejectedValue('Mocked Error');

    render(<UserProvider><EditProfile /></UserProvider>);

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'UpdatedUser' } });
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'Updated bio.' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
    });
  });
});
