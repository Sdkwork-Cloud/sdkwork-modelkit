export interface SkillDef {
  id: string;
  name: string;
  description: string;
  type: 'function' | 'rest' | 'graphql';
  endpoint?: string;
  parameters?: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
  }>;
}
