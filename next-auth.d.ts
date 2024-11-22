// next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: 'USER' | 'ADMIN'; // Add the role type here
        };
    }

    interface User {
        role: 'USER' | 'ADMIN'; // Add the role type here as well
    }

    interface JWT {
        role: 'USER' | 'ADMIN'; // Extend the JWT type
    }
}
