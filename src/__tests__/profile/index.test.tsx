import {render, screen, waitFor} from '@testing-library/react';
import {vi, describe, beforeEach, test, expect} from 'vitest';
import Profile from '../../pages/profile';
import {UserContext} from '../../contexts/UserContext';
import {UserProvider} from "../../contexts/UserContext";
import {useState} from "react";
import {User} from "../../types/user";

describe('Profile Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders loading state initially', async () => {
        render(<UserProvider><Profile/></UserProvider>);
        await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());
    });

    test('renders user data correctly on successful fetch', async () => {
        const mockUser = {
            id: '1',
            ethAddress: '0x1234',
            username: 'TestUser',
            bio: 'This is a',
            createdAt: '2024-01-01T00:00:00.000Z',
        };
        const MockUserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
            const [user, setUser] = useState(mockUser);
            return (
                <UserContext.Provider
                    value={{user, setUser: setUser as React.Dispatch<React.SetStateAction<User | null>>}}>
                    {children}
                </UserContext.Provider>
            );
        };
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockUser,
        });

        render(<MockUserProvider><Profile/></MockUserProvider>);

        await waitFor(() => {
            expect(screen.getByText(/username/i)).toBeInTheDocument();
            expect(screen.getByText(mockUser.username)).toBeInTheDocument();
            expect(screen.getByText(/ethereum address/i)).toBeInTheDocument();
            expect(screen.getByText(mockUser.ethAddress)).toBeInTheDocument();
            expect(screen.getByText(/bio/i)).toBeInTheDocument();
            expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
            expect(screen.getByText(/joined/i)).toBeInTheDocument();
            expect(screen.getByText(new Date(mockUser.createdAt).toLocaleDateString())).toBeInTheDocument();
        });
    });

    test('renders "No bio available" if bio is not provided', async () => {
        const mockUser = {
            id: '1',
            ethAddress: '0x1234',
            username: 'TestUser',
            createdAt: '2024-01-01T00:00:00.000Z',
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockUser,
        });

        render(<UserProvider><Profile/></UserProvider>);

        await waitFor(() => {
            expect(screen.getByText(/no bio available/i)).toBeInTheDocument();
        });
    });
});
