import {useState, useCallback} from 'react';
import {useRouter} from 'next/router';
import styles from '@/styles/base.module.css';
import {useUser} from '@/contexts/UserContext';
import {bioCharLimit, usernameCharLimit} from "@/lib/constants";

export default function CreateProfile() {
    const router = useRouter();
    const {setUser} = useUser();
    const [form, setForm] = useState({username: '', bio: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {ethAddress} = router.query;

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prevForm) => ({...prevForm, [e.target.name]: e.target.value}));
    }, []);

    const handleCreateProfile = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        if (!form.username) {
            setError('Username is required');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('/api/profile/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ethAddress, ...form}),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                router.push('/profile');
            } else {
                const {error: responseError} = await response.json();
                setError(responseError || 'Error creating the profile');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, [form, ethAddress]);

    return (
        <div className={styles.container}>
            <h1>Create Profile</h1>
            <form onSubmit={handleCreateProfile}>
                <div>
                    <label>Ethereum Address</label>
                    <p>{ethAddress}</p>
                </div>
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
                {error && <p role="alert" className={styles.errorMessage}>{error}</p>}
                <button disabled={loading} type="submit" className={styles.button}>
                    {loading ? 'Loading...' : 'Create'}
                </button>
            </form>
        </div>
    );
}
