import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PhotoUrlSigner } from './photo-url.signer.js';

@Injectable()
export class SignedPhotoUrlGuard implements CanActivate {
  constructor(private readonly photoUrlSigner: PhotoUrlSigner) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { id } = request.params;
    const { exp, sig } = request.query;

    if (typeof exp !== 'string' || typeof sig !== 'string') {
      throw new UnauthorizedException('Missing signed URL parameters');
    }

    if (!this.photoUrlSigner.verify(id, Number(exp), sig)) {
      throw new UnauthorizedException('Invalid or expired photo URL');
    }

    return true;
  }
}
