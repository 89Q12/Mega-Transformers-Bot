import {
  Body,
  Controller,
  Delete,
  Get,
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

@ApiTags('discord/role')
@Controller('discord/role')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
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
    await role.delete();
  }
}
