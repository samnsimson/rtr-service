import { UserRole } from '../enums';

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
  organizationId: string;
}
