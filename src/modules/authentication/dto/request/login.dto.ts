import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    default: '0218216699',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  mobile: string;
  @ApiProperty({
    default: 'password123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
