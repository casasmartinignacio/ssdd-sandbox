import { Module } from '@nestjs/common';
import { JsonDb } from './json-db';

@Module({
  providers: [JsonDb],
  exports: [JsonDb],
})
export class DatabaseModule {}
