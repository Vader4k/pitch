import { type DefaultSession } from 'next-auth';


declare module "next-auth" {
    interface Session {
        id: string;
        user: {
            name: string;
            email: string;
            image: string;
        } & DefaultSession["user"]
    }

    interface JWT {
        id: string;
    }
}