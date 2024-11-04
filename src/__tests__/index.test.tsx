import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Home from '@/pages/index';
import {UserProvider} from "@/contexts/UserContext";


describe('Login component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the sign-in button with default text', () => {
    render(<UserProvider><Home /></UserProvider>);
    const button = screen.getByRole('button', { name: /sign in with ethereum/i });
    expect(button).toBeInTheDocument();
  });
});
