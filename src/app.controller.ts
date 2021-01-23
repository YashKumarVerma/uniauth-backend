import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('root')
@Controller('')
export class AppController {
  /** to show homepage */
  @Get()
  showIndexPage(@Res() res: Response) {
    const templateData = {
      header: 'the next gen auth in vit',
      title: 'UniAuth',
      body: 'the only registration form you will ever fill',
      button: {
        title: 'Get Involved',
        href: 'account/login',
      },
    };
    return res.render('landing', templateData);
  }
}
