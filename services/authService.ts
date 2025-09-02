import { pfSenseService } from './pfsenseService';
import { User } from '../types';

// This is a mock auth service. In a real app, this would involve tokens, sessions, etc.

export const authService = {
  login: async (username: string, password: string): Promise<User | null> => {
    const data = await pfSenseService.fetchDashboardData();
    const user = data.users.find(u => u.username === username && u.password === password);
    
    if (user && !user.disabled) {
      // In a real app, you'd set a session cookie or token here.
      // For this demo, we'll just return the user object.
      return user;
    }
    
    return null;
  },

  logout: (): void => {
    // In a real app, you would clear the session/token here.
    console.log("User logged out.");
  }
};
