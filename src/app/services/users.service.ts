import { Injectable } from '@angular/core';

// guardo esto pa no reutilizar mi lok
const STORAGE_KEY_USERS = 'newspaper_users';
const STORAGE_KEY_SESSION = 'newspaper_current_user';


export interface User {
  email: string;
  password: string;
}

// para guardar el usuario en sesion, solo guardo el email
export interface SessionUser {
  email: string;
}


@Injectable({ providedIn: 'root' })
export class UsersService {
  private getUsersFromStorage(): User[] {
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    return stored ? JSON.parse(stored) : [];
  }

  private setUsersInStorage(users: User[]): void {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }

  getUsers(): User[] {
    return this.getUsersFromStorage();
  }

  // como el metodo iniciar del mongoose del otro dia
  setUsersEjemplo(): void {
    const users = this.getUsersFromStorage();
    if (users.length === 0) {
      const defaultUsers: User[] = [
        { email: 'admin@test.com', password: '123456' },
        { email: 'usuario@test.com', password: 'clave123' },
      ];
      this.setUsersInStorage(defaultUsers);
    }
  }

  findUserByEmailAndPassword(email: string, password: string): User | null {
    const users = this.getUsersFromStorage();
    const normalizedEmail = email.trim().toLowerCase();
    return (
      users.find(
        (u) => u.email.trim().toLowerCase() === normalizedEmail && u.password === password
      ) ?? null
    );
  }

  registerUser(email: string, password: string): User | null {
    const users = this.getUsersFromStorage();
    const normalizedEmail = email.trim().toLowerCase();

    // si ya existe, devuelvo el existente y no duplico
    const existing = users.find(
      (u) => u.email.trim().toLowerCase() === normalizedEmail
    );
    if (existing) {
      return existing;
    }

    const newUser: User = { email: normalizedEmail, password };
    users.push(newUser);
    this.setUsersInStorage(users);
    return newUser;
  }

  addUser(user: User): void {
    const users = this.getUsersFromStorage();
    const normalizedEmail = user.email.trim().toLowerCase();

    const exists = users.some(
      (u) => u.email.trim().toLowerCase() === normalizedEmail
    );
    if (exists) return;

    users.push({ email: normalizedEmail, password: user.password });
    this.setUsersInStorage(users);
  }

  existsByEmail(email: string): boolean {
    const users = this.getUsersFromStorage();
    return users.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
  }

  setCurrentSession(user: User): void {
    const session: SessionUser = { email: user.email };
    sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
  }

  getCurrentSession(): SessionUser | null {
    const stored = sessionStorage.getItem(STORAGE_KEY_SESSION);
    return stored ? JSON.parse(stored) : null;
  }

  clearSession(): void {
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
  }
}

