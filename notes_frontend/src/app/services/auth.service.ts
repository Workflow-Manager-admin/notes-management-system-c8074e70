import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface UserLogin {
  username: string;
  password: string;
}
export interface UserRegister extends UserLogin {}
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  // Change this base URL according to backend location/config!
  private api = '/api/auth';

  private tokenKey = 'access_token';
  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public readonly isLoggedIn$ = this._isLoggedIn.asObservable();

  // PUBLIC_INTERFACE
  login(payload: UserLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, payload).pipe(
      tap(res => {
        this.setToken(res.access_token);
        this._isLoggedIn.next(true);
      })
    );
  }

  // PUBLIC_INTERFACE
  register(payload: UserRegister): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, payload).pipe(
      tap(res => {
        this.setToken(res.access_token);
        this._isLoggedIn.next(true);
      })
    );
  }

  // PUBLIC_INTERFACE
  logout(): void {
    this.clearToken();
    this._isLoggedIn.next(false);
  }

  // PUBLIC_INTERFACE
  getToken(): string | null {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // PUBLIC_INTERFACE
  hasToken(): boolean {
    return this.getToken() !== null;
  }

  private setToken(token: string) {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.setItem(this.tokenKey, token);
    }
  }

  private clearToken() {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.removeItem(this.tokenKey);
    }
  }
}
