// Espelho do Enum UserRole do backend (models.py)
export type UserRole = 'admin' | 'commun';

// Espelho do modelo User do backend (models.py)
// Campos retornados pela rota GET /usuarios/me e GET /usuarios/:id (UserResponseSchema)
export interface User {
  id: number;
  name: string;
  nickname: string;
  email: string;
  bio: string | null;
  role: UserRole;
  picture_profile: string | null;
}

// Espelho do SignupRequest — campos necessários para criar um usuário
export interface UserRegisterDTO {
  name: string;
  nickname: string;
  email: string;
  password: string;
  bio?: string;
}

// Espelho do UserUpdateSchema — campos opcionais para editar o perfil
export interface UserUpdateDTO {
  name?: string;
  nickname?: string;
  bio?: string;
}

// Espelho do PaginatedUserResponse — retornado pela rota GET /usuarios/
export interface PaginatedUserResponse {
  current_page: number;
  limit: number;
  total_records: number;
  total_pages: number;
  data: User[];
}
