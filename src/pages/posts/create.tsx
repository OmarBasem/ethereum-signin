import {useState, useCallback} from 'react';
import {useRouter} from 'next/router';
import styles from '@/styles/base.module.css';
import {postCharLimit} from "@/lib/constants";

export default function CreatePost() {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }, []);

    const handleCreatePost = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        const trimmedContent = content.trim();
        if (!trimmedContent) {
            setError('Content is empty!');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({content: trimmedContent}),
            });

            console.log('response:', response);

            if (response.ok) {
                router.push('/posts');
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
    }, [router, content]);

    return (
        <div className={styles.container}>
            <h1>Create Post</h1>
            <form onSubmit={handleCreatePost}>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea
                        name="content"
                        value={content}
                        onChange={handleChange}
                        placeholder="Write something..."
                        id="content"
                        maxLength={postCharLimit}
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
