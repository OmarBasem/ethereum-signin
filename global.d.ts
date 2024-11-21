import {SessionData} from "@/types/session-data";
import {IronSession} from "iron-session";

interface Ethereum {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

declare module 'next' {
  interface NextApiRequest {
    session: IronSession & SessionData;
  }
}

export {};
