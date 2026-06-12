const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';
const USER_EMAIL_KEY = 'user_email';
const USER_NAME_KEY = 'user_name';

export const tokenService = {
  saveToken: (token: string): boolean => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      return true;
    } catch (e) {
      console.error('Error saving token:', e);
      return false;
    }
  },

  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      console.error('Error retrieving token:', e);
      return null;
    }
  },

  hasToken: (): boolean => {
    const token = tokenService.getToken();
    return !!token && token.length > 0;
  },

  saveUserInfo: (userId: number, email: string, firstName: string, lastName: string): boolean => {
    try {
      localStorage.setItem(USER_ID_KEY, userId.toString());
      localStorage.setItem(USER_EMAIL_KEY, email);
      localStorage.setItem(USER_NAME_KEY, `${firstName} ${lastName}`);
      return true;
    } catch (e) {
      console.error('Error saving user info:', e);
      return false;
    }
  },

  getUserId: (): number | null => {
    try {
      const id = localStorage.getItem(USER_ID_KEY);
      return id ? parseInt(id, 10) : null;
    } catch (e) {
      console.error('Error retrieving user ID:', e);
      return null;
    }
  },

  getUserEmail: (): string | null => {
    try {
      return localStorage.getItem(USER_EMAIL_KEY);
    } catch (e) {
      console.error('Error retrieving user email:', e);
      return null;
    }
  },

  getUserName: (): string | null => {
    try {
      return localStorage.getItem(USER_NAME_KEY);
    } catch (e) {
      console.error('Error retrieving user name:', e);
      return null;
    }
  },

  clearAll: (): boolean => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
      localStorage.removeItem(USER_EMAIL_KEY);
      localStorage.removeItem(USER_NAME_KEY);
      return true;
    } catch (e) {
      console.error('Error clearing authentication data:', e);
      return false;
    }
  }
};
