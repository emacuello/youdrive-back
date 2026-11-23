import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from '../addresses/entities/address.entity.js';
import { CreateUserDto, signIn } from '../users/dto/create-user.dto.js';
import { User } from '../users/entities/user.entity.js';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserGoogle } from './types/userGoogle.type.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import {
  PayloadGoogleType /* ResponseGoogle */,
} from './types/response.interfaces.js';
import { JwtPayload } from '../rentals/interfaces/payload.interfaces.js';
import { AddressesService } from '../addresses/addresses.service.js';
import { Role } from '../users/utils/roles.enum.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    private jwtService: JwtService,
    private notificationService: NotificationsService,
    private addressesService: AddressesService,
  ) {}
  async signIn(user: signIn) {
    const { email, password } = user;
    const userDB = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .getOne();
    if (!userDB) throw new BadRequestException('Credenciales incorrectas');
    if (userDB.userGoogle)
      throw new BadRequestException(
        'Credenciales creadas mediante google, por favor elegir ese metodo de ingreso',
      );
    if (userDB.isDeleted) throw new NotAcceptableException('Cuenta baneada');
    const pass = await bcrypt.compare(password, userDB.password);
    if (!pass) throw new BadRequestException('Credenciales incorrectas');
    const payload: JwtPayload = { sub: userDB.email, role: userDB.roles };
    const token = this.jwtService.sign(payload);

    if (!token) {
      throw new BadRequestException('token invalido');
    }
    return { token: token };
  }

  async signUp(user: CreateUserDto) {
    const duplicateUser = await this.userRepository.findOneBy({
      email: user.email,
    });

    if (duplicateUser)
      throw new BadRequestException('El ya se encuentra registrado');

    const { email, name, password, nDni, phone, ...rest } = user;
    const newUser = this.userRepository.create({
      email,
      name,
      password,
      nDni,
      phone,
    });
    const hashPass = await bcrypt.hash(newUser.password, 10);
    if (!hashPass)
      throw new BadRequestException('Error al cifrar la contraseña');
    newUser.password = hashPass;
    const newAdress = await this.addressRepository.save({
      ...rest,
    });
    newUser.addresses = [newAdress];
    await this.userRepository.save(newUser);

    const newAddress = await this.addressesService.addressWithGeolocation(
      newUser.id,
      { ...rest },
    );

    console.log(newAddress);

    // ENVIO DE EMAIL!
    await this.notificationService.newNotification(email, 'welcome');
    return { message: 'Usuario registrado con exito!' };
  }
  async generateJwtToken(user: Omit<UserGoogle, 'token'>) {
    const payload: JwtPayload = { sub: user.email, role: Role.User };

    return this.jwtService.sign(payload);
  }
  async validateUser(user: PayloadGoogleType) {
    const { email, name, image_url } = user;

    const findUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (findUser) {
      if (findUser.isDeleted) return false;
      return true;
    }
    console.log(
      'Usuario no encontrado. Ingresando datos en la base de datos....',
    );

    const newUser = await this.userRepository.save({
      email,
      name,
      image_url,
      userGoogle: true,
    });
    if (!newUser) false;
    await this.notificationService.newNotification(newUser.email, 'welcome');
    return true;
  }
  async findUser(id: string) {
    console.log(id);

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    console.log(user);
    return user;
  }
}
