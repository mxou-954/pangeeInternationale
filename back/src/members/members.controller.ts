import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post(':farmerId')
  create(@Body() createMemberDto: CreateMemberDto, @Param('farmerId') fieldId: string) {
    return this.membersService.create(createMemberDto, fieldId);
  }

  @Get(':farmerId')
  findAll(@Param('farmerId') fieldId: string) {
    return this.membersService.findAll(fieldId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(+id);
  }

  @Patch(':memberId')
  update(@Param('memberId') memberId: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(memberId, updateMemberDto);
  }

  @Delete(':memberId')
  remove(@Param('memberId') memberId: string) {
    return this.membersService.remove(memberId);
  }
}
