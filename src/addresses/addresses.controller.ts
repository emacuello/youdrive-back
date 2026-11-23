import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../users/utils/roles.guard.js';
import { Role } from '../users/utils/roles.enum.js';
import { Roles } from '../users/utils/roles.decorator.js';

@ApiTags('ADDRESSES')
@Controller('addresses')
@UseGuards(RolesGuard)
@Roles(Role.User, Role.Admin)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  getAddresses() {
    return this.addressesService.getAddresses();
  }

  @Get(':id')
  getAddressById(@Param('id') id: string) {
    return this.addressesService.getAddressById(id);
  }

  @Put(':id')
  updateAddress(
    @Param('id') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.updateAddress(addressId, updateAddressDto);
  }

  @Delete(':id')
  deleteAddress(@Param('id') id: string) {
    return this.addressesService.deleteAddress(id);
  }

  @Post(':id')
  async addressWithGeolocation(
    @Param('id') userId: string,
    @Body()
    createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.addressWithGeolocation(
      userId,
      createAddressDto,
    );
  }
}
