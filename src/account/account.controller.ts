import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { IncomingAuthDto, IncomingAuthLoginDto } from './dto/incoming-auth.dto';
import { AccountService } from './account.service';
import { scopeMapper } from './minions/scopeMapper.minion';
import { UserService } from 'src/user/user.service';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger('account');

  constructor(
    private readonly accountService: AccountService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  /**
   * to display login form on client-initiated-auth
   */
  @Get('/login')
  @UsePipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  )
  async showLoginPage(@Res() res: Response, @Query() incomingAuthDto: IncomingAuthDto) {
    const { client_id } = incomingAuthDto;
    try {
      const applicationDetails = await this.accountService.validateAccessRequest(incomingAuthDto);
      return res.render('account/login', { app: applicationDetails });
    } catch (e) {
      this.logger.error(`${e.message} for ${client_id}`);
      return res.render('error', e.response);
    }
  }

  /**
   * To handle login form submission on client-initiated-auth
   */
  @Post('/login')
  @UsePipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  )
  async processLoginPage(@Res() res: Response, @Body() incomingAuthDto: IncomingAuthLoginDto) {
    const { client_id } = incomingAuthDto;

    /**
     * validate and get application details from incoming dto
     */
    try {
      const applicationDetails = await this.accountService.validateAccessRequest(incomingAuthDto);

      /**
       * ensure authentication for users
       */
      try {
        const access_token = await this.accountService.authenticateAndGenerateToken(incomingAuthDto);
        res.redirect(`${incomingAuthDto.redirect_uri}/?access_token=${access_token}`);
      } catch (e) {
        /**
         * Render login page with error message from server
         */
        this.logger.error(`${e.message} for ${client_id}`);
        return res.render('account/login', { app: applicationDetails, server: { message: e.message } });
      }
    } catch (e) {
      /**
       * Render error page with validation error mesage
       */
      this.logger.error(`POST ${e.message} for ${client_id}`);
      return res.render('error', e.response);
    }
  }

  /**
   * To show reset password page
   */
  @Get('/password/request')
  async showPasswordRequestPage(@Res() res: Response) {
    try {
      return res.render('password/request');
    } catch (e) {
      return res.render('error', e.response);
    }
  }

  @Get('/password/reset')
  async showPasswordResetPage(@Res() res: Response) {
    try {
      return res.render('password/reset');
    } catch (e) {
      return res.render('error', e.response);
    }
  }
}
