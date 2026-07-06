import { UserProfileInfo } from './interface';

export const DEFAULT_USER_PROFILE: UserProfileInfo = {
  name: '',
  email: '',
  twoFactorEnabled: false,
  sessions: [],
  notifications: {
    billing: true,
    productUpdates: true,
  },
};
