import { Body, Controller, Get, Inject, Logger, Post, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
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

  /** to handle requests from client applications */
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
      applicationDetails.scope = applicationDetails.scope.map((givenScope) => scopeMapper(givenScope));
      return res.render('account/login', { app: applicationDetails });
    } catch (e) {
      this.logger.error(`${e.message} for ${client_id}`);
      return res.render('error', e.response);
    }
  }

  @Post('/login')
  @UsePipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  )
  async processLoginPage(@Res() res: Response, @Body() incomingAuthDto: IncomingAuthLoginDto) {
    /** external catch block to handle valdation, server errors */
    const { client_id } = incomingAuthDto;
    try {
      /** get application details from incoming dto */
      const applicationDetails = await this.accountService.validateAccessRequest(incomingAuthDto);
      applicationDetails.scope = applicationDetails.scope.map((givenScope) => scopeMapper(givenScope));

      /** handle user authentication */
      try {
        /** check username and password */
        const { email, password } = incomingAuthDto;
        const loggedInUser = await this.userService.login({ email, password });
        this.logger.verbose(`Access granted by ${loggedInUser?.name}`);

        /** generate access token */
        const access_token = await this.accountService.generateAccessToken(incomingAuthDto);

        /** redirect user to redirect window */
        res.redirect(`${incomingAuthDto.redirect_uri}/?access_token=${access_token}`);
      } catch (e) {
        /** if user details match failed, then show error to user */
        this.logger.error(`${e.message} for ${client_id}`);
        return res.render('account/login', { app: applicationDetails, server: { message: e.message } });
      }
    } catch (e) {
      this.logger.error(`POST ${e.message} for ${client_id}`);
      return res.render('error', e.response);
    }
  }
}
