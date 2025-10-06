// /api/auth/[...nextauth].ts
import CredentialsProvider from 'next-auth/providers/credentials';

CredentialsProvider({
  name: 'Mock',
  credentials: {
    username: { label: 'Username', type: 'text' }
  },
  async authorize(credentials) {
    if (!credentials || !credentials.username) {
      return null; // gracefully deny access
    }
  
    return {
      id: 'mock-user',
      name: credentials.username
    };
  }
  
})
