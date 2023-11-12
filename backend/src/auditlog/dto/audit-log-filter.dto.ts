import {
  IsArray,
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Action,
  actions,
  TargetType,
  targetTypes,
} from '../../util/dto/log.entry.dto';

export class DateRange {
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  from?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  to?: Date;
}

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
