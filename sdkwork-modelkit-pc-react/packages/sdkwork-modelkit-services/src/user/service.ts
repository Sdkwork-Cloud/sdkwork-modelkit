import {
  loadPreferencePayload,
  MODELKIT_PREFERENCE_NAMESPACES,
  savePreferencePayload,
} from '@sdkwork/modelkit-pc-core/sdk';
import { IUserService, UserProfileInfo } from './interface';
import { DEFAULT_USER_PROFILE } from './defaults';

export * from './interface';

export class ApiUserService implements IUserService {
  private async loadProfile(): Promise<UserProfileInfo> {
    return loadPreferencePayload(
      MODELKIT_PREFERENCE_NAMESPACES.userProfile,
      DEFAULT_USER_PROFILE,
    );
  }

  private async saveProfile(profile: UserProfileInfo): Promise<void> {
    await savePreferencePayload(MODELKIT_PREFERENCE_NAMESPACES.userProfile, profile);
  }

  async fetchProfile(): Promise<UserProfileInfo> {
    return this.loadProfile();
  }

  async updateProfile(data: Partial<UserProfileInfo>): Promise<UserProfileInfo> {
    const profile = await this.loadProfile();
    const updated = { ...profile, ...data };
    await this.saveProfile(updated);
    return updated;
  }

  async changePassword(): Promise<void> {
    return;
  }

  async revokeAllSessions(): Promise<void> {
    const profile = await this.loadProfile();
    await this.saveProfile({
      ...profile,
      sessions: profile.sessions.filter((session) => session.isCurrent),
    });
  }

  async revokeSession(id: number): Promise<void> {
    const profile = await this.loadProfile();
    await this.saveProfile({
      ...profile,
      sessions: profile.sessions.filter((session) => session.id !== id),
    });
  }

  async toggle2FA(enabled: boolean): Promise<void> {
    const profile = await this.loadProfile();
    await this.saveProfile({ ...profile, twoFactorEnabled: enabled });
  }

  async updateAvatar(_file: unknown): Promise<void> {
    return;
  }

  async changeEmail(newEmail: string): Promise<void> {
    const profile = await this.loadProfile();
    await this.saveProfile({ ...profile, email: newEmail });
  }
}

export const UserService = new ApiUserService();
