import { Controller, Get, Logger, Query, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { IncomingAuthDto } from './dto/incoming-auth.dto';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger('account');

  constructor(private readonly accountService: AccountService) {}

  /** to handle requests from client applications */
  @Get('/login')
  @UsePipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  )
  async showLoginPage(@Res() res: Response, @Query() incomingAuthDto: IncomingAuthDto) {
    const { redirect_uri, client_id } = incomingAuthDto;
    try {
      const token = await this.accountService.generateAccessToken(incomingAuthDto);

      /** take 302 to redirect uri with access_token */
      return res.redirect(`${redirect_uri}?access_token=${token}`);
    } catch (e) {
      /** log errors and show error page */
      this.logger.error(`${e.message} for ${client_id}`);
      return res.render('error', e.response);
    }
  }
}
