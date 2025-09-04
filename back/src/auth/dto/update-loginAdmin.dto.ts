import { PartialType } from '@nestjs/mapped-types';
import { AdminLoginDto  } from './admin-login.dto';

export class UpdateLoginAdminDto extends PartialType(AdminLoginDto ) {}
