// src/person/dto/address.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class Address {
    street: string;
    city: string;
    country: string;
}
