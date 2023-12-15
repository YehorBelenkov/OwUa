// /src/app/interfaces/auth-response.interface.ts
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
      displayName: string;
      email: string;
      id: number;
      photoUrl: string | null;
    };
  }