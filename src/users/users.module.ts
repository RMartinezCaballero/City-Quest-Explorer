import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProfileController } from './user-profile.controller';

@Module({
  imports: [PassportModule],
  providers: [UsersService],
  controllers: [UserProfileController, UsersController],
  exports: [UsersService],
})
export class UsersModule {}
