import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.enum.js';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
