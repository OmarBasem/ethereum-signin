export interface SessionData {
    siwe?: {
        address: string;
        chainId: number;
    } | null;
    nonce?: string | null;
}
