export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  isError?: boolean;
}

export enum PlanStepStatus {
  Pending = 'Pending',
  Completed = 'Completed'
}

export interface PlanStep {
  step: string;
  status: PlanStepStatus;
}

export enum AgentMode {
  Productivity = 'PRODUCTIVITY',
  Creative = 'CREATIVE'
}

export enum Theme {
    Light = 'light',
    Dark = 'dark'
}

export enum AgentPersonality {
    Friendly = 'FRIENDLY',
    Formal = 'FORMAL',
    Humorous = 'HUMOROUS'
}

export interface UserProfile {
    name: string;
    avatarUrl: string;
    theme: Theme;
    agentPersonality: AgentPersonality;
}