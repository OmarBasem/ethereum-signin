import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {vi} from 'vitest';
import CreateProfile from '@/pages/profile/create';
import {UserProvider} from "@/contexts/UserContext";

describe('CreateProfile Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    test('renders all input fields and submit button', () => {
        render(<UserProvider><CreateProfile/></UserProvider>);
        expect(screen.getByText('Create Profile')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Bio')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /create/i})).toBeInTheDocument();
    });

    test('displays error message when profile creation fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({error: 'Profile creation failed'}),
        })
        render(<UserProvider><CreateProfile/></UserProvider>);
        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'TestUser'}});
        fireEvent.change(screen.getByLabelText('Bio'), {target: {value: 'This is a test bio.'}});
        fireEvent.click(screen.getByRole('button', {name: /create/i}));
        await waitFor(() => {
            expect(screen.getByText('Profile creation failed')).toBeInTheDocument();
        });
    });

    test('displays unexpected error message on fetch failure', async () => {
        global.fetch = vi.fn().mockRejectedValue('Mocked error');
        render(<UserProvider><CreateProfile/></UserProvider>);
        fireEvent.change(screen.getByLabelText('Username'), {target: {value: 'TestUser'}});
        fireEvent.change(screen.getByLabelText('Bio'), {target: {value: 'This is a test bio.'}});
        fireEvent.click(screen.getByRole('button', {name: /create/i}));
        await waitFor(() => {
            expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
        });
    });
});
