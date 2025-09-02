import { UserRole } from '../enums';

export interface CurrentUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  organizationId?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdById?: string;
}
