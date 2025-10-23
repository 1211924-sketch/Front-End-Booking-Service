import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

type LoginDto    = { email: string; password: string };
type RegisterDto = { name: string; email: string; password: string };
type ResetRequestDto = { email: string };
type ResetDto    = { token: string; newPassword: string };

type AuthResponse = { token: string; user: any };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);


  private _token: string | null = null;
  private _user$ = new BehaviorSubject<any | null>(null);

  user$ = this._user$.asObservable();

  token() { return this._token; }
  isAuthenticated() { return !!this._token; }

  login(dto: LoginDto) {
    return this.http.post<AuthResponse>(
      environment.apiBase + environment.endpoints.login, dto
    ).pipe(
      tap(res => {
        this._token = res.token;
        this._user$.next(res.user);
      }),
      map(res => res.user)
    );
  }

  register(dto: RegisterDto) {
    return this.http.post<AuthResponse>(
      environment.apiBase + environment.endpoints.register, dto
    ).pipe(
      tap(res => {
        this._token = res.token;
        this._user$.next(res.user);
      }),
      map(res => res.user)
    );
  }

  requestPasswordReset(dto: ResetRequestDto) {
    return this.http.post(
      environment.apiBase + environment.endpoints.requestReset, dto
    );
  }

  resetPassword(dto: ResetDto) {
    return this.http.post(
      environment.apiBase + environment.endpoints.reset, dto
    );
  }

  me() {
    return this.http.get<AuthResponse>(
      environment.apiBase + environment.endpoints.me
    ).pipe(
      tap(res => {
        // بعض الـ APIs ترجع user فقط
        if ((res as any).token) this._token = (res as any).token;
        this._user$.next(res.user ?? res);
      })
    );
  }

  logout() {
    this._token = null;
    this._user$.next(null);
  }
}
