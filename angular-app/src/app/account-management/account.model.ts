export type AccountRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_HEAD_OFFICE' | 'ROLE_SUPER_ADMIN';

export const ACCOUNT_ROLES: AccountRole[] = ['ROLE_USER', 'ROLE_HEAD_OFFICE', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'];

export interface Account {
  id: number;
  login: string;
  email: string;
  activated: boolean;
  language: string;
  roles: AccountRole[];
  createdDate: string | null;
  modifiedBy: string;
  modifiedDate: string | null;
}
