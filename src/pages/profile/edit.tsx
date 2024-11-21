import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/base.module.css';
import { useUser } from '@/contexts/UserContext';
import { User } from "@/types/user";
import {bioCharLimit, usernameCharLimit} from "@/lib/constants";

export default function EditProfile() {
    const router = useRouter();
    const { user, setUser } = useUser();

    const [form, setForm] = useState({ username: '', bio: '' });
    const [status, setStatus] = useState({ error: null as string | null, success: null as string | null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prevForm) => ({ ...prevForm, [e.target.name]: e.target.value }));
    }, []);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        if (user?.username === form.username && user?.bio === form.bio) {
            router.back();
            return;
        }
        setLoading(true);
        setStatus({ error: null, success: null });
        try {
            const response = await fetch('/api/profile/edit', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ethAddress: user?.ethAddress, ...form }),
            });
            if (response.ok) {
                setUser({ ...user, ...form } as User);
                setStatus({ error: null, success: 'Profile updated successfully' });
                router.back();
            } else {
                const { error } = await response.json();
                setStatus({ error: error || 'Failed to update profile', success: null });
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setStatus({ error: 'An unexpected error occurred', success: null });
        } finally {
            setLoading(false);
        }
    }, [form, user, setUser, router]);

    return (
        <div className={styles.container}>
            <h1>Edit Profile</h1>
            {status.error && <p className={styles.errorMessage}>{status.error}</p>}
            {status.success && <p className={styles.successMessage}>{status.success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                        id="username"
                        maxLength={usernameCharLimit}
                    />
                </div>
                <div>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Tell us something about yourself"
                        id="bio"
                        maxLength={bioCharLimit}
                    />
                </div>
                <div>
                    <button disabled={loading} type="submit" className={styles.button}>
                        {loading ? 'Loading...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => router.back()}
                            className={`${styles.button} ${styles.buttonSecondary}`}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
