declare module '*.css';

declare module 'clsx' {
  export type ClassValue =
    | string
    | number
    | boolean
    | undefined
    | null
    | ClassValue[]
    | Record<string, unknown>;

  export function clsx(...inputs: ClassValue[]): string;
  export default clsx;
}
