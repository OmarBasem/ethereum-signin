import {useCallback, useEffect, useState} from 'react';
import {BrowserProvider} from 'ethers';
import {SiweMessage} from 'siwe';
import {useRouter} from 'next/router';
import {useUser} from "@/contexts/UserContext";
import styles from '@/styles/base.module.css';

const createSiweMessage = async (address: string, statement: string) => {
    const {nonce} = await (await fetch('/api/auth/nonce', {method: 'GET'})).json();
    const {protocol, host, origin} = window.location;
    return new SiweMessage({
        scheme: protocol.slice(0, -1),
        domain: host,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: 1,
        nonce
    }).prepareMessage();
};

const authenticate = async (message: string, signature: string) => {
    return await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message, signature}),
    });
};

export default function Home() {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {setUser} = useUser();

    useEffect(() => {
        if (window.ethereum) setProvider(new BrowserProvider(window.ethereum));
    }, []);

    const signIn = useCallback(async () => {
        if (!provider) return alert("Ethereum wallet not detected!");
        try {
            setLoading(true);
            const signer = await provider.getSigner();
            await provider.send("eth_requestAccounts", []);
            const address = await signer.getAddress();
            const message = await createSiweMessage(address, 'Sign in with Ethereum to the app.');
            const signature = await signer.signMessage(message);
            const response = await authenticate(message, signature);
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                router.push({
                    pathname: data.user ? '/profile' : '/profile/create',
                    query: data.user ? null : {ethAddress: address},
                });
            } else {
                alert("Authentication failed");
            }
        } catch (error) {
            if ((error as { code?: string }).code === 'ACTION_REJECTED') {
                alert("Transaction was canceled.");
            } else {
                alert("Unexpected error: " + JSON.stringify(error));
            }
        } finally {
            setLoading(false);
        }
    }, [provider]);

    return loading ? <p>Loading...</p> : (
        <button onClick={signIn} className={styles.button}>
            Sign in with Ethereum
        </button>
    );
}
