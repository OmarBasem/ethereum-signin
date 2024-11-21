import React, {createContext, useContext, useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import type {User} from '@/types/user';

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth');
            const userData = response.ok ? await response.json() : null;
            setUser(userData);
            if (!userData) router.push('/')
            else if (router.pathname === '/') router.push('/profile');
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser(null);
            router.push('/');
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);


    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
