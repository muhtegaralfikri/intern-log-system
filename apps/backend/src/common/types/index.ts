export interface ActivityData {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  date: Date;
}

export interface UserSkillData {
  id: string;
  userId: string;
  skillId: string;
  level: number;
  skill: {
    id: string;
    name: string;
    category: string;
  };
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  avatarUrl?: string;
  supervisorId?: string;
}
