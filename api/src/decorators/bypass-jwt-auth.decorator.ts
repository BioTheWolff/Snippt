import { SetMetadata } from '@nestjs/common';

export const IS_BYPASSING_JWT_AUTH = 'isBypassingJwtAuth';
export const BypassJwtAuth = () => SetMetadata(IS_BYPASSING_JWT_AUTH, true);
