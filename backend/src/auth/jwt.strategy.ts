import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

export interface JwtUser {
  userId: string;
  username: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.KEYCLOAK_INTERNAL_URL}/realms/daily-lens/protocol/openid-connect/certs`,
      }),
      issuer: process.env.KEYCLOAK_ISSUER,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<JwtUser> {
    return {
      userId: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
    };
  }
}
