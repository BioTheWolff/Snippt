import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request as RequestType } from 'express';

require('dotenv').config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // TODO: switch from bearer token to secure HTTP cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractFromCookie(req: RequestType): string {
    if (req.cookies && 'token' in req.cookies && req.cookies.token.length > 0) {
      return req.cookies.token;
    }
    return null;
  }

  async validate(payload: any) {
    return { id: payload.sub, handle: payload.handle, jwtExp: payload.exp };
  }
}
