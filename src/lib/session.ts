import {SessionOptions} from "iron-session";

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: "siwe-auth",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
    },
};
