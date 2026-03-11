import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authClient } from "@/lib/auth-client";

// Augment next-auth types
declare module "next-auth" {
    interface User {
        id: string;
        role: string;
    }
    interface Session {
        user: User & {
            id: string;
            role: string;
        }
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await authClient.findUserByEmail(credentials.email);

                if (!user || !user.passwordHash) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                } as any;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user = {
                    ...session.user,
                    name: token.name,
                    email: token.email,
                } as any;
                // Types bypassed for mock simplicity
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev",
};
