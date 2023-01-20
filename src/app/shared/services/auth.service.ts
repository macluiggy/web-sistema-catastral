import { Injectable } from '@angular/core';
import { TokenModel, UsuarioModel } from '../models';
import { InicioService } from './inicio.service';
import { LocalService } from './local.service';
 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: TokenModel;

  isLoggedIn: boolean = true;

  constructor(
    private inicioService: InicioService,
    private localService: LocalService,
  ) {
    this.isLoggedIn = !!this.getToken();
  }

  get tokenIsExpired(): boolean {
    return this.getToken()?.isExpired;
  }

  get tokenAutorization(): string {
    return this.token.authorization;
  }

  getToken(): TokenModel {
    if (!this.token) {
      const token = this.localService.getJsonValue('token');
      if (token) this.token = new TokenModel(token);
    }
    this.isLoggedIn = !!this.token;
    return this.token;
  }

  getUsuario(): UsuarioModel {
    const usuario = this.localService.getJsonValue('usuario');
    return new UsuarioModel(usuario);
  }

  getIdUsuario(): bigint {
    const user: UsuarioModel = this.getUsuario();
    return user.id;
  }

  getUsername(): string {
    const username: string = this.localService.getJsonValue('username');
    return username && username.length > 0 ? username : 'NO_USERNAME';
  }

  setUsuario(token: string, refres_token: string) {
    let { email, expires_in, id, nombres } = this.getDecodedAccessToken(token);
    const auxToken: any = {
      token_type: 'Bearer',
      expires_in,
      access_token: token,
      refresh_token: refres_token,
    };
    const auxUsuario: any = {
      id,
      correo_electronico: email,
      nombres: nombres,
      identificacion: nombres,
    };
    this.token = new TokenModel(auxToken);
    const usuario = new UsuarioModel(auxUsuario);
    this.localService.setJsonValue('token', this.token);
    this.localService.setJsonValue('usuario', usuario);
    this.localService.setJsonValue('username', nombres);
  }

  cerrarSesion(): void {
    this.isLoggedIn = false;
    this.token = null;
    this.localService.removeValue('token');
    this.localService.removeValue('usuario');
    this.localService.clear();
    localStorage.clear();
    this.inicioService.clearPages();
  }
  
  getDecodedAccessToken(token: string): any {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
