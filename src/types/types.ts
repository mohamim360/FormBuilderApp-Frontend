export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum QuestionType {
  SINGLE_LINE_TEXT = 'SINGLE_LINE_TEXT',
  MULTI_LINE_TEXT = 'MULTI_LINE_TEXT',
  INTEGER = 'INTEGER',
  CHECKBOX = 'CHECKBOX',
  SINGLE_CHOICE = 'SINGLE_CHOICE'
}

export enum TemplateAccess {
  PUBLIC = 'PUBLIC',
  RESTRICTED = 'RESTRICTED'
}

export enum Language {
  EN = 'EN',
  ES = 'ES'
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  language: Language;
  theme: Theme;
  socialAuthId?: string;
  socialAuthProvider?: string;
  blocked: boolean;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  topic: string;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  accessType: TemplateAccess;
  author: Pick<User, 'id' | 'name' | 'email'>;
  questions: Question[];
  tags: Tag[];
  allowedUsers: Pick<User, 'id' | 'name' | 'email'>[];
  _count?: {
    forms: number;
    likes: number;
  };
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  isRequired: boolean;
  showInTable: boolean;
  order: number;
  options: string[];
  templateId: string;
}

export interface Form {
  id: string;
  templateId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  sendEmailCopy: boolean;
  template: Template;
  user: Pick<User, 'id' | 'name' | 'email'>;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  formId: string;
  textValue?: string;
  integerValue?: number;
  booleanValue?: boolean;
  question: Question;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  templateId: string;
  user: Pick<User, 'id' | 'name' | 'email'>;
}

export interface Like {
  id: string;
  userId: string;
  templateId: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}