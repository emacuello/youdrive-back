import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity.js';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { Car } from '../cars/entities/car.entity.js';
import { geolocationService } from './geolocation.service.js';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Car) private readonly carsRepository: Repository<Car>,
    private readonly geolocation: geolocationService,
  ) {}

  async getAddresses() {
    const addresses = await this.addressRepository.find();

    // const start = (page - 1) * limit;
    // const end = start + limit;

    // addresses = addresses.slice(start, end);
    return addresses;
  }

  async getAddressById(id: string) {
    const address = await this.addressRepository.findOneBy({ id });

    if (!address) throw new NotFoundException('Dirección no encontrada');

    return address;
  }

  async updateAddress(addressId: string, updateAddressDto: UpdateAddressDto) {
    await this.addressRepository.update(addressId, updateAddressDto);
    const foundAddressArr = await this.addressRepository.find({
      where: { id: addressId },
      relations: ['user'],
    });

    const foundAddress = foundAddressArr[0];

    if (!foundAddress) throw new NotFoundException('Dirección no encontrada');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = foundAddress;

    rest.latitude = Number(rest.latitude);
    rest.longitude = Number(rest.latitude);

    const updatedAddress = this.addressWithGeolocation(
      foundAddress.user.id,
      rest,
    );

    return updatedAddress;
  }

  async deleteAddress(id: string) {
    const address = await this.addressRepository.findOneBy({ id });

    if (!address) throw new NotFoundException('Dirección no encontrada');

    await this.addressRepository.delete({ id });

    return address;
  }
  async addressWithGeolocation(
    userId: string,
    createAddressDto: CreateAddressDto,
  ) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const { address, city, state, country } = createAddressDto;

    const fullAddress = `${address}, ${city}, ${state}, ${country}`;

    console.log(fullAddress);

    const { latitude, longitude } =
      await this.geolocation.getCordinates(fullAddress);

    if (latitude) {
      await this.addressRepository.update(
        { user: { id: userId } },
        {
          latitude,
          longitude,
        },
      );
    }

    const updatedAddress = await this.addressRepository.findOneBy({
      user: { id: userId },
    });
    return updatedAddress;
  }
}
