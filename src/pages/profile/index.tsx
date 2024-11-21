import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/contexts/UserContext';
import styles from '@/styles/base.module.css';

export default function Profile() {
    const router = useRouter();
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        if (user) setLoading(false);
    }, [user]);

    const handleEditProfile = useCallback(() => {
        if (user) {
            router.push('/profile/edit');
        }
    }, [user, router]);

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/');
        } catch (err) {
            console.error('Error logging out:', err);
        } finally {
            setLoading(false);
        }
    }, [setUser, router]);

    const goToCreate = () => router.push('/posts/create');
    const goToFeed = () => router.push('/posts');

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.container}>
            <h1>My Profile</h1>
            {user ? (
                <div className={styles.userInfo}>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Ethereum Address:</strong> {user.ethAddress}</p>
                    <p><strong>Bio:</strong> {user.bio || 'No bio available'}</p>
                    <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <button onClick={goToCreate} className={styles.button}>Create Post</button>
                    <button onClick={goToFeed} className={styles.button}>View Posts</button>
                    <button onClick={handleEditProfile} className={styles.button}>Edit Profile</button>
                    <button onClick={handleLogout} className={`${styles.button} ${styles.buttonSecondary}`}>
                        Logout
                    </button>
                </div>
            ) : (
                <p>User data not available.</p>
            )}
        </div>
    );
}
