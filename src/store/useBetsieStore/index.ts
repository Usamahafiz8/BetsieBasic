import { create } from "zustand";
import * as Keychain from "react-native-keychain";

import { baseUrl } from "../../api/baseUrl";

type Provider = 'google' | 'facebook' | 'apple';

type User = {
  id: number;
  email: string;
  userType: 'Google' | 'Facebook' | 'Email' | 'Apple';
  playerName?: string | null;
  phoneNumber?: string | null;
  profilePicture?: string | null;
};

type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;   // ✅ added
  loading: boolean;
  hasLoggedOut?: boolean;
  
  setUser: (user: User | null) => void;
  saveAuthData: (token: string, user: User, refreshToken?: string) => Promise<void>; // ✅ updated
  setTokens: (token: string, refreshToken: string) => Promise<void>; // ✅ added

  loginWithProvider: (
    provider: Provider,
    thirdPartyToken: string,
  ) => Promise<void>;
  tryAutoLogin: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useBetsieStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,   // ✅ added
  loading: true,
  hasLoggedOut: false,

  setUser: async (user) => {
  set({ user });
  try {
    const { token, refreshToken } = get();
    if (token) {
      await Keychain.setGenericPassword(
        JSON.stringify({ user, refreshToken }),
        token
      );
    }
  } catch (err) {
    console.error('Error persisting user update:', err);
  }
},


  saveAuthData: async (token, user, refreshToken) => {
    try {
      await Keychain.setGenericPassword(JSON.stringify({ user, refreshToken }), token);
      set({
        token,
        refreshToken: refreshToken || null,
        user,
        loading: false,
      });
    } catch (err) {
      console.error('Error saving auth data:', err);
      throw err;
    }
  },

  setTokens: async (token, refreshToken) => {
    const { user } = get();
    await Keychain.setGenericPassword(JSON.stringify({ user, refreshToken }), token);
    set({ token, refreshToken });
  },

  loginWithProvider: async (provider, thirdPartyToken) => {
    try {
      set({ loading: true });

      const res = await fetch(`${baseUrl}/users/${provider}-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(provider === 'google'
            ? { idToken: thirdPartyToken }
            : { accessToken: thirdPartyToken }),
        }),
      });

      if (!res.ok) throw new Error(`${provider} login failed`);

      const data = await res.json();
      console.log("🚀 ~ data:", data)
      console.log("🚀 ~ data:", data.user);

      // ✅ expects backend to return both tokens
      await get().saveAuthData(data.token, data.user, data.refreshToken);
    } catch (err) {
      console.error(`${provider} login error:`, err);
      set({ loading: false });
      throw err;
    }
  },

  tryAutoLogin: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const token = credentials.password;
        const parsed = credentials.username
          ? JSON.parse(credentials.username)
          : null;
        set({
          token,
          refreshToken: parsed?.refreshToken ?? null,
          user: parsed?.user ?? null,
          loading: false,
        });
        return;
      }
      set({ loading: false });
    } catch (err) {
      console.error('Auto-login error:', err);
      set({ loading: false });
    }
  },

  logout: async () => {
    await Keychain.resetGenericPassword();
    set({ user: null, token: null, refreshToken: null, hasLoggedOut: true });
  },
}));
