import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { Address } from '../addresses/entities/address.entity.js';
import { Car } from '../cars/entities/car.entity.js';
import { Posts } from '../posts/entities/post.entity.js';
import { Review } from '../reviews/entities/review.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../users/utils/roles.enum.js';

// Fotos de Wikimedia Commons (CC BY / CC BY-SA), estables y sin bloqueo de hotlink.
const img = (path: string) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/1280px-${path.split('/').pop()}`;

const USERS = [
  { email: 'admin@youdrive.demo', name: 'Admin YouDrive', roles: Role.Admin },
  { email: 'lucia@youdrive.demo', name: 'Lucía Fernández', roles: Role.User },
  { email: 'martin@youdrive.demo', name: 'Martín Gómez', roles: Role.User },
];

const CARS = [
  { owner: 1, brand: 'Toyota', model: 'Corolla Hybrid', year: 2020, mileage: '45000', color: 'Blanco', price: 45000,
    image: img('b/b8/2020_Toyota_Corolla_Hybrid_front_NYIAS_2019.jpg'),
    title: 'Toyota Corolla híbrido, ideal para ruta',
    city: 'Córdoba', state: 'Córdoba', lat: -31.4201, lon: -64.1888 },
  { owner: 1, brand: 'Volkswagen', model: 'Gol Trend', year: 2015, mileage: '98000', color: 'Gris', price: 22000,
    image: img('0/04/2015_Volkswagen_Gol_Trend_1.6_Pack_III%2C_I-Motion_%28front%29.jpg'),
    title: 'VW Gol Trend económico para la ciudad',
    city: 'Rosario', state: 'Santa Fe', lat: -32.9442, lon: -60.6505 },
  { owner: 2, brand: 'Ford', model: 'Ranger XLT', year: 2019, mileage: '70000', color: 'Plata', price: 60000,
    image: img('c/cb/2019_Ford_Ranger_2.5_XLT_4X2.jpg'),
    title: 'Ford Ranger XLT para viajes y carga',
    city: 'Mendoza', state: 'Mendoza', lat: -32.8895, lon: -68.8458 },
  { owner: 2, brand: 'Fiat', model: 'Cronos Precision', year: 2024, mileage: '12000', color: 'Rojo', price: 35000,
    image: img('f/fa/2024_Fiat_Cronos_1.3_GSE_Precision.jpg'),
    title: 'Fiat Cronos 0 km, amplio y cómodo',
    city: 'Buenos Aires', state: 'CABA', lat: -34.6037, lon: -58.3816 },
  { owner: 1, brand: 'Chevrolet', model: 'Onix sedán', year: 2020, mileage: '52000', color: 'Azul', price: 30000,
    image: img('0/0b/2020_SAIC-GM_Chevrolet_Onix_sedan.jpg'),
    title: 'Chevrolet Onix sedán con baúl grande',
    city: 'La Plata', state: 'Buenos Aires', lat: -34.9214, lon: -57.9545 },
  { owner: 2, brand: 'Peugeot', model: '208 Allure', year: 2020, mileage: '40000', color: 'Negro', price: 32000,
    image: img('5/5b/2020_Peugeot_208_Allure.jpg'),
    title: 'Peugeot 208 Allure, moderno y ágil',
    city: 'Mar del Plata', state: 'Buenos Aires', lat: -38.0055, lon: -57.5426 },
];

// Datos de demo para el portafolio: solo corre si la base no tiene usuarios.
@Injectable()
export class DemoSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DemoSeedService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    if ((await this.dataSource.getRepository(User).count()) > 0) return;

    await this.dataSource.transaction(async (db) => {
      const password = await bcrypt.hash('password123', 10);
      const users = await db.save(
        USERS.map((u) => db.create(User, { ...u, password, aboutMe: 'Usuario de demo de YouDrive.' })),
      );

      for (const c of CARS) {
        const owner = users[c.owner];
        const car = await db.save(
          db.create(Car, {
            brand: c.brand, model: c.model, year: c.year, mileage: c.mileage,
            color: c.color, image_url: [c.image], user: owner,
          }),
        );
        await db.save(
          db.create(Address, {
            address: 'Centro', city: c.city, state: c.state, country: 'Argentina',
            latitude: c.lat, longitude: c.lon, user: owner, car,
          }),
        );
        const post = await db.save(
          db.create(Posts, {
            title: c.title,
            description: `${c.brand} ${c.model} ${c.year}, ${c.color.toLowerCase()}, ${c.mileage} km. Retiro en ${c.city}.`,
            price: c.price, user: owner, car,
          }),
        );
        await db.save(
          db.create(Review, { rating: 5, comment: 'Excelente experiencia, el auto impecable.', user: users[0], post }),
        );
      }
    });
    this.logger.log(`Seed de demo cargado: ${USERS.length} usuarios y ${CARS.length} publicaciones`);
  }
}
