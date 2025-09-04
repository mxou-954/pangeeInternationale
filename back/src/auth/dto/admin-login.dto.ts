// src/login/dto/create-login.dto.ts
import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AdminLoginDto  {
  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(4) // ajuste si tu veux
  @MaxLength(128)
  password: string;
}
