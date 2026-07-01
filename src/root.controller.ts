import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class RootController {
  @Get()
  @ApiExcludeEndpoint()
  @Redirect('/api', 302)
  redirectToSwagger() {
    // Redirect to Swagger API docs
  }
}
