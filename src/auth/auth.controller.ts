import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto, signIn } from '../users/dto/create-user.dto.js';
import { GoogleAuthGuard } from './utils/auth.guard.js';
import type { Request, Response } from 'express';
import { GoogleStrategy } from './utils/GoogleStrategy.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { RolesGuard } from '../users/utils/roles.guard.js';
// import { Role } from '../users/utils/roles.enum.js';
// import { Roles } from '../users/utils/roles.decorator.js';

@ApiTags('AUTH')
@Controller('auth')
// @UseGuards(RolesGuard)
// @Roles(Role.User, Role.Admin)
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleStrategy: GoogleStrategy,
  ) {}

  @Post('signin')
  signIn(@Body() user: signIn) {
    return this.authService.signIn(user);
  }

  @Post('signup')
  signUp(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @ApiBearerAuth()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req: Request, @Res() res: Response) {
    const { token, payload } = req.user;
    const LOGIN_URL = process.env.LOGIN_URL;
    const GOOGLE_REDIRECT_FRONT = process.env.GOOGLE_REDIRECT_FRONT;
    const createUser = await this.authService.validateUser(payload);
    if (!createUser) {
      res.redirect(`${LOGIN_URL}`);
      return { msg: 'Error al crear el usuario' };
    }
    res.redirect(`${GOOGLE_REDIRECT_FRONT}?token=${token}`);
  }

  @Get('status')
  user(@Req() request: Request) {
    console.log(request.session, 'sesion in status');

    console.log(request.user);
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
