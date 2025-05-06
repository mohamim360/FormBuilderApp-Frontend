// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  language: 'EN' | 'ES';
  theme: 'LIGHT' | 'DARK';
  blocked: boolean;
}

export interface JwtPayload {
  userId: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

// Template types
export enum QuestionType {
  SINGLE_LINE_TEXT = 'SINGLE_LINE_TEXT',
  MULTI_LINE_TEXT = 'MULTI_LINE_TEXT',
  INTEGER = 'INTEGER',
  CHECKBOX = 'CHECKBOX',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
}

export enum TemplateAccess {
  PUBLIC = 'PUBLIC',
  RESTRICTED = 'RESTRICTED',
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  isRequired: boolean;
  showInTable: boolean;
  order: number;
  options?: string[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  topic: string;
  imageUrl?: string;
  isPublic: boolean;
  access: TemplateAccess;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
  };
  questions: Question[];
  tags: Tag[];
  allowedUsers: {
    id: string;
    name: string;
    email: string;
  }[];
  _count: {
    forms: number;
    likes: number;
  };
}

export interface TemplateStats {
  formsCount: number;
  likesCount: number;
  questionsStats: Array<{
    questionId: string;
    questionTitle: string;
    type: QuestionType;
    stats: Record<string, unknown>;
  }>;
}

// Form types
export interface Answer {
  id: string;
  questionId: string;
  textValue?: string;
  integerValue?: number;
  booleanValue?: boolean;
  question?: Question;
}

export interface Form {
  id: string;
  templateId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  answers: Answer[];
  template?: {
    id: string;
    title: string;
    author: {
      id: string;
      name: string;
      email: string;
    };
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}