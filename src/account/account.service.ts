import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { ApplicationService } from 'src/application/application.service';
import { JwtService } from '@nestjs/jwt';
import { accessTokenJwtConstants } from './constants/access_token.constants';
import { IncomingAuthDto, IncomingAuthLoginDto } from './dto/incoming-auth.dto';
import { Injectable } from '@nestjs/common';
import { Application } from 'src/application/application.schema';
import { scopeMapper } from './minions/scopeMapper.minion';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.schema';

@Injectable()
export class AccountService {
  private readonly logger = new Logger('accounts');

  /**
   * Initialize account services
   */
  constructor(
    private jwtService: JwtService,

    @Inject(ApplicationService)
    private readonly applicationService: ApplicationService,

    @Inject(UserService)
    private readonly userService: UserService,
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

    details.scope = details.scope.map((givenScope) => scopeMapper(givenScope));

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

    details.scope = details.scope.map((givenScope) => scopeMapper(givenScope));

    /** now generate a new access token  */
    const tokenPayload = { token: String(details._id) };
    const token = await this.jwtService.signAsync(tokenPayload, accessTokenJwtConstants);
    return token;
  }

  /**
   * Service to a user into servers
   */
  async authenticateAndGenerateToken(incomingAuthDto: IncomingAuthLoginDto): Promise<{ token: string; user: User }> {
    /** check username and password */
    const { email, password } = incomingAuthDto;
    const loggedInUser = await this.userService.login({ email, password });
    this.logger.verbose(`Access granted by ${loggedInUser?.name}`);

    /** generate access token */
    const accessToken = await this.generateAccessToken(incomingAuthDto);
    return { token: accessToken, user: loggedInUser };
  }
}
