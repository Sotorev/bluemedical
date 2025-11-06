export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: UserResponseDto;
  token: string;
}

export interface UserResponseDto {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

