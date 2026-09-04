import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// https://docs.nestjs.com/recipes/passport
// ... passing the strategy name directly to the AuthGuard() introduces magic strings in the codebase. Instead, we recommend creating your own class ...
// daher als separete Klasse

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
