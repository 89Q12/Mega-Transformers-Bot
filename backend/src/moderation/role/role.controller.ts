import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Client, Role } from 'discord.js';
import {
  RoleResponse,
  rolesResponseSchema,
  roleResponseSchema,
  EditRoleData,
} from '../dto/role';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';

const logger = new Logger('RoleController');
@ApiTags('discord/role')
@Controller('discord/role')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get(':guildId/roles')
  @ApiOperation({ summary: 'Get all roles for a guild' })
  @ApiResponse({
    status: 200,
    type: [RoleResponse],
    schema: rolesResponseSchema,
    description: 'Roles were successfully fetched',
  })
  @ApiResponse({
    status: 500,
    description: 'Roles could not be successfully fetched',
  })
  async getGuildRoles(@Param('guildId') guildId: string): Promise<Role[]> {
    const guild = await this.client.guilds.fetch(guildId);
    logger.log(`Found ${guild.roles.cache.size} roles in guild ${guildId}`);
    return (await guild.roles.fetch()).toJSON();
  }
  @Post(':guildId/role/')
  @ApiOperation({ summary: 'Create a role for a guild' })
  @ApiResponse({
    status: 200,
    type: RoleResponse,
    schema: roleResponseSchema,
    description: 'Role was successfully created',
  })
  @ApiResponse({
    status: 500,
    description: 'Role could not be successfully created',
  })
  async createRole(
    @Param('guildId') guildId: string,
    @Body() roleData: EditRoleData,
  ): Promise<Role> {
    const guild = await this.client.guilds.fetch(guildId);
    const role = await guild.roles.create(roleData);
    logger.log(`Created role ${role.name} in guild ${guildId}`);
    return role;
  }
  @Put(':guildId/role/:roleId')
  @ApiOperation({ summary: 'Update a role for a guild' })
  @ApiResponse({
    status: 200,
    type: RoleResponse,
    schema: roleResponseSchema,
    description: 'Role was successfully updated',
  })
  @ApiResponse({
    status: 500,
    description: 'Role could not be successfully updated',
  })
  async updateRole(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
    @Body() roleData: EditRoleData,
  ): Promise<Role> {
    const guild = await this.client.guilds.fetch(guildId);
    const role = guild.roles.cache.get(roleId);
    await role.edit(roleData);
    logger.log(`Updated role ${role.name} in guild ${guildId}`);
    return role;
  }

  @Delete(':guildId/role/:roleId')
  @ApiOperation({ summary: 'Delete a role for a guild' })
  @ApiResponse({
    status: 200,
    type: RoleResponse,
    description: 'Role was successfully deleted',
  })
  @ApiResponse({
    status: 500,
    description: 'Role could not be successfully deleted',
  })
  async deleteRole(
    @Param('guildId') guildId: string,
    @Param('roleId') roleId: string,
  ): Promise<void> {
    const guild = await this.client.guilds.fetch(guildId);
    const role = guild.roles.cache.get(roleId);
    logger.log(`Deleted role ${role.name} in guild ${guildId}`);
    await role.delete();
  }
}
