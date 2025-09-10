import { UserRole } from 'src/common';
import { User } from '../entities/user.entity';

export class UserServiceHelper {
  constructor() {}

  isRecruiterLike(user: User): boolean {
    return (
      user.role === UserRole.RECRUITER ||
      user.role === UserRole.RECRUITER_MANAGER ||
      user.role === UserRole.ADMIN ||
      user.role === UserRole.ORGANIZATION_OWNER ||
      user.role === UserRole.ORGANIZATION_ADMIN
    );
  }
}
