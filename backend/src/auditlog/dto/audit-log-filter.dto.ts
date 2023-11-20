import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Action,
  actions,
  TargetType,
  targetTypes,
} from '../../util/dto/log.entry.dto';

export class AuditLogFilterDto {
  @ApiPropertyOptional({ type: 'string', format: 'date-time' })
  @IsOptional()
  createdFrom?: string;
  @ApiPropertyOptional({ type: 'string', format: 'date-time' })
  @IsOptional()
  createdTill?: string;
  @ApiPropertyOptional({ type: ['string'], enum: targetTypes })
  @IsOptional()
  @IsArray()
  @IsString()
  @IsIn(targetTypes)
  targetTypes?: TargetType[];
  @ApiPropertyOptional({ type: ['string'], enum: actions })
  @IsOptional()
  @IsArray()
  @IsString()
  @IsIn(actions)
  actions?: Action[];
}
