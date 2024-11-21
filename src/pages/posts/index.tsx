import {useState, useEffect, useRef} from 'react';
import styles from '@/styles/base.module.css';
import {Post} from '@/types/user';
import { useRouter } from 'next/router';

const PostItem = ({item}: { item: Post }) => {
    return (
        <div className={styles.postItem}>
            <p className={styles.postContent}>{item.content}</p>
            <p className={styles.postUser}>By: {item.userEthAddress}</p>
            <p className={styles.postDate}>Created: {new Date(item.createdAt).toLocaleString()}</p>
        </div>
    )
}

export default function PostsFeed() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const loadMoreTrigger = useRef(null);
    const router = useRouter();
    const fetchPosts = async () => {
        if (loading || !hasMore) return;
        try {
            setLoading(true);
            const url = cursor ? `/api/posts?cursor=${cursor}` : '/api/posts';
            const response = await fetch(url);
            const {posts, nextCursor} = await response.json();
            setPosts((prevPosts) => {
                const existingIds = new Set(prevPosts.map((post) => post.id));
                const uniquePosts = posts.filter((post: Post) => !existingIds.has(post.id));
                return [...prevPosts, ...uniquePosts];
            });
            setCursor(nextCursor);
            if (!nextCursor) setHasMore(false);
        } catch (error) {
            console.warn('Error fetching posts:', error);
            setError('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchPosts();
                }
            },
            {threshold: 1.0}
        );
        if (loadMoreTrigger.current) {
            observer.observe(loadMoreTrigger.current);
        }
        return () => observer.disconnect();
    }, [loadMoreTrigger.current, cursor]);


    return (
        <div className={styles.container}>
            <h1>Posts Feed</h1>
            {posts.map((post) => <PostItem key={post.id} item={post}/>)}
            {posts.length === 0 && <p>No posts yet!</p>}
            <div ref={loadMoreTrigger}>
                {hasMore ? loading ? 'Loading...' : 'Scroll down to load more' : 'All posts loaded!'}
            </div>
            <button onClick={() => router.push('/posts/create')} className={styles.button}>Create Post</button>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}
