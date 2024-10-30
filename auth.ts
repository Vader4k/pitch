// Import necessary dependencies from NextAuth and local configurations
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

// Configure and export NextAuth functionality
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Set up authentication providers - currently only using GitHub
  providers: [GitHub],
  
  // Define callback functions for various authentication stages
  callbacks: {
    // Triggered when a user signs in
    async signIn({
      user: { name, image, email },    // Destructure user data from GitHub
      profile: { id, login, bio },     // Destructure profile data from GitHub
    }) {
      // Check if user already exists in Sanity database
      const existingUser = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
        id,
      });
      
      // If user doesn't exist, create new author record in Sanity
      if (!existingUser) {
        await writeClient.create({
          _type: "author",             // Specify document type in Sanity
          id,                          // GitHub ID
          name,                        // User's full name
          image,                       // Profile image URL
          username: login,             // GitHub username
          email,                       // User's email
          bio: bio || "",              // User's bio (empty string if none)
        });
      }
      return true;                     // Allow sign in to proceed
    },

    // Handles JWT token creation and updates
    async jwt({ token, account, profile }) {
      // Only modify token if we have account and profile data (during initial sign-in)
      if (account && profile) {
        // Fetch user data from Sanity to get internal _id
        const user = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile?.id,
        });
        // Add Sanity document ID to the JWT token
        token.id = user?._id;
      }
      return token;
    },

    // Manages session data
    async session({ session, token }) {
      // Add Sanity document ID to the session
      Object.assign(session, { id: token.id });
      return session;
    }
  },
});