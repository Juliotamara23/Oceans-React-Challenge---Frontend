export enum UserRole {
  ADMIN = 'admin',
  WAITER = 'waiter', // Mesero
}

// Interfaz para los datos del usuario logueado que esperas recibir de la API
export interface User {
  id: string;
  username: string;
  role: UserRole;
}

// Interfaz para el payload de registro (lo que envías a la API al registrar)
export interface RegisterInput {
  username: string;
  password: string;
  role?: UserRole;
}

// Interfaz para el payload de login (lo que envías a la API al iniciar sesión)
export interface LoginInput {
  username: string;
  password: string;
}

// Opcional: Si la API devuelve un objeto con el token y el usuario en el login
// export interface AuthResponse {
//   accessToken: string;
//   user: User;
// }