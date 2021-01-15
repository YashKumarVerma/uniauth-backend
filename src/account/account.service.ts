import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { ApplicationService } from 'src/application/application.service';
import { JwtService } from '@nestjs/jwt';
import { accessTokenJwtConstants } from './constants/access_token.constants';
import { IncomingAuthDto } from './dto/incoming-auth.dto';
import { Injectable } from '@nestjs/common';
import { Application } from 'src/application/application.schema';

@Injectable()
export class AccountService {
  /**
   * Initialize account services
   */
  constructor(
    private jwtService: JwtService,

    @Inject(ApplicationService)
    private readonly applicationService: ApplicationService,
  ) {}

  /**
   * To validate request from application whether to show signIn form or not
   */
  async validateAccessRequest(incomingAuthDto: IncomingAuthDto): Promise<Application> {
    const { client_id, redirect_uri } = incomingAuthDto;

    /** check if given client exists, validate params */
    const details = await this.applicationService.findOneById(client_id);
    if (details === null) {
      throw new BadRequestException('unknown application');
    }

    /** check if redirect URI is one of the authorized URIs */
    if (!details.authorizedRedirect.includes(redirect_uri)) {
      throw new BadRequestException('invalid redirected uri');
    }

    return details;
  }

  /**
   * To generate a new jwt containing access token
   */
  async generateAccessToken(incomingAuthDto: IncomingAuthDto) {
    const { client_id, redirect_uri } = incomingAuthDto;

    /** check if given client exists, validate params */
    const details = await this.applicationService.findOneById(client_id);
    if (details === null) {
      throw new BadRequestException('unknown application');
    }

    /** check if redirect URI is one of the authorized URIs */
    if (!details.authorizedRedirect.includes(redirect_uri)) {
      throw new BadRequestException('invalid redirected uri');
    }

    /** now generate a new access token  */
    const tokenPayload = { token: String(details._id) };
    const token = await this.jwtService.signAsync(tokenPayload, accessTokenJwtConstants);
    return token;
  }
}
