export interface UserProfileInfo {
  name: string;
  email: string;
  avatar?: string;
  twoFactorEnabled: boolean;
  sessions: any[];
  notifications: {
    billing: boolean;
    productUpdates: boolean;
  };
}

export const IUserServiceToken = Symbol.for('IUserService');

export interface IUserService {
  fetchProfile(): Promise<UserProfileInfo>;
  updateProfile(data: Partial<UserProfileInfo>): Promise<UserProfileInfo>;
  changePassword(): Promise<void>;
  revokeAllSessions(): Promise<void>;
  revokeSession(id: number): Promise<void>;
  toggle2FA(enabled: boolean): Promise<void>;
  updateAvatar(file: any): Promise<void>;
  changeEmail(newEmail: string): Promise<void>;
}
