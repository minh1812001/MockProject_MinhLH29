import { Injectable } from '@angular/core';
import { RegisterRequest, User } from '../Model/user.model';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      isActive: true,
      phone: '+84123456789',
      address: 'Ho Chi Minh City, Vietnam',
    },
    {
      id: 2,
      username: 'user1',
      email: 'user1@example.com',
      password: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      isActive: true,
      phone: '+84987654321',
      address: 'Hanoi, Vietnam',
    },
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);
  public users$ = this.usersSubject.asObservable();

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  register(userData: RegisterRequest): Observable<User> {
    const newUser: User = {
      id: this.users.length + 1,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      phone: userData.phone,
      address: userData.address,
    };

    this.users.push(newUser);
    this.usersSubject.next(this.users);
    return of(newUser);
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...userData,
        updatedAt: new Date(),
      };
      this.usersSubject.next(this.users);
      return of(this.users[userIndex]);
    } else {
      throw new Error('User not found');
    }
  }

  deleteUser(id: number): Observable<boolean> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      this.usersSubject.next(this.users);
      return of(true);
    }
    return of(false);
  }

  isUsernameExists(username: string): boolean {
    return this.users.some((user) => user.username === username);
  }

  isEmailExists(email: string): boolean {
    return this.users.some((user) => user.email === email);
  }
}
