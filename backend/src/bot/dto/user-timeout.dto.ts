import { IsNumber, IsString } from 'class-validator';

export default class UserTimeOutDto {
  @IsString()
  channel: string;

  @IsString()
  user: string;

  @IsString()
  reason: string;

  @IsNumber()
  duration: number;
}
