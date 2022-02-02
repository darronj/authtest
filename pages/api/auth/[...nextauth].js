import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import AzureADProvider from 'next-auth/providers/azure-ad';
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    /* Azure Active Directory */
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID
    }),

    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
      authorization: {
        params: { scope: 'openid email profile token id_token' }
      }
    })
  ],
  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: 'jwt'

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 1 * 24 * 60 * 60, // 1 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {
    //   console.log(token);
    //   const domain = token.email?.split('@')[1] || 'unknown';
    //   console.log(domain);
    //   const isBLOX =
    //     domain && ['gastudio.com', 'bloxbuilt.com'].includes(domain);
    //   console.log(isBLOX);
    //   will go to db to get user roles & permissions to add to the claims
    //   const jwtClaims = {
    //     sub: token.id?.toString(),
    //     name: token.name,
    //     email: token.email,
    //     iat: Date.now() / 1000,
    //     exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    //     'https://hasura.io/jwt/claims': {
    //       'x-hasura-allowed-roles': ['user'],
    //       'x-hasura-default-role': 'user',
    //       'x-hasura-role': 'user',
    //       'x-hasura-user-id': token.id
    //     }
    //   };
    //   const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: 'HS256' });
    //   return encodedToken;
    //   // return token;
    // }
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    // async session({ session, token, user }) { return session },
    async jwt({ token, user, account, profile, isNewUser, id_token }) {
      console.log('token: ', token);
      console.log('id_token: ', id_token);
      console.log('user: ', user);
      console.log('account: ', account);
      console.log('profile: ', profile);
      console.log('isNewUser: ', isNewUser);

      if (account?.provider === 'auth0') {
        return {
          ...profile
        };
      }

      // need to handle additional providers
      console.log(account?.provider);

      // not Auth0, so we need to get the roles from the database

      return token;
    }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  theme: {
    colorScheme: 'light'
  },

  // Enable debug messages in the console if you are having problems
  debug: false
});
