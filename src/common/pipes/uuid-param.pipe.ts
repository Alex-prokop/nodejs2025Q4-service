import { ParseUUIDPipe, ParseUUIDPipeOptions } from '@nestjs/common';

export class UuidParamPipe extends ParseUUIDPipe {
  constructor(options?: ParseUUIDPipeOptions) {
    super({
      version: '4',
      ...options,
    });
  }
}
