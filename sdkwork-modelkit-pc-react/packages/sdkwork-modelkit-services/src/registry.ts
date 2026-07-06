import { rootContainer } from '@sdkwork/modelkit-core';
import { IAgentServiceToken } from './agent/interface';
import { AgentService } from './agent/service';
import { IResourcesServiceToken } from './resources/interface';
import { ResourcesService } from './resources/service';
import { IAccountServiceToken } from './account/interface';
import { BillingService } from './account/service';
import { ISystemServiceToken } from './system/interface';
import { SystemSettingsService } from './system/service';
import { IUserServiceToken } from './user/interface';
import { UserService } from './user/service';

/**
 * Bootstraps preference-backed service implementations into the DI container.
 */
export function registerServices() {
  rootContainer.register(IAgentServiceToken, AgentService);
  rootContainer.register(IResourcesServiceToken, ResourcesService);
  rootContainer.register(IAccountServiceToken, BillingService);
  rootContainer.register(ISystemServiceToken, SystemSettingsService);
  rootContainer.register(IUserServiceToken, UserService);
}
