export interface SoftwareItem {
  id: number;
  name: string;
  icon: string;
  version: string;
  publisher: string;
  type: string;
  os: string[];
  size: string;
  desc: string;
  tags: string[];
  installed: boolean;
  rating: number;
  banner: string;
  website?: string;
  screenshots: string[];
}

export interface SoftwareSubmitInput {
  name: string;
  publisher: string;
  category: string;
  version: string;
  os: string[];
  size: string;
  website: string;
  desc: string;
}

export interface ISoftwareService {
  getSoftwareList(): Promise<SoftwareItem[]>;
  getCategories(): Promise<string[]>;
  submitSoftware(input: SoftwareSubmitInput): Promise<SoftwareItem>;
  installSoftware(id: number): Promise<void>;
  uninstallSoftware(id: number): Promise<void>;
}
