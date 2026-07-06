import { createContext, useContext } from 'react';

/**
 * Lightweight Dependency Injection Container
 */
export class ServiceContainer {
  private services = new Map<symbol, any>();

  /**
   * Register a service implementation with a specific token.
   */
  register<T>(token: symbol, implementation: T): void {
    this.services.set(token, implementation);
  }

  /**
   * Resolve a service by its token.
   */
  resolve<T>(token: symbol): T {
    const service = this.services.get(token);
    if (!service) {
      throw new Error(`Service not found for token: ${token.toString()}`);
    }
    return service as T;
  }
}

export const rootContainer = new ServiceContainer();

// --- React Integration ---

export const DIContext = createContext<ServiceContainer>(rootContainer);

/**
 * React Hook to resolve a service from the DI container.
 */
export function useService<T>(token: symbol): T {
  const container = useContext(DIContext);
  if (!container) {
    throw new Error('useService must be used within a DIProvider');
  }
  return container.resolve<T>(token);
}
