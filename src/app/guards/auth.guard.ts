import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute,
} from '@angular/router';
 
import { Observable } from 'rxjs';  
import { PrivilegioService } from '../core/services/privilegios/privilegio.service';
 
import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../shared/services/auth.service';
import { LocalService } from '../shared/services/local.service';
import { ParametrosService } from '../shared/services/parametros.service';
 

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('env') private env,
    private authService: AuthService,
    private localService: LocalService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //console.log( this.env.config)

    const {config }=this.env;
    const queryParams = new URLSearchParams(window.location.search);
    const token_param = queryParams.get('token');
    const refresh_param = queryParams.get('refreshToken');
    if (token_param != null) {
      this.authService.setUsuario(token_param, refresh_param);
      const valido =  await this.validacionToken(config);
      if(valido) {
       
      //  this.parametrosService.almacenarParametros();
      }
       
      return valido;
    } else {
      const token = this.localService.getJsonValue('token');
      if ( token == null || token == '' || token == undefined ) {
        // Check token en localStorage
        const tokenLocal = localStorage.getItem('token');
        const refreshTokenLocal = localStorage.getItem('refreshToken');
        if(tokenLocal == null || tokenLocal == undefined || tokenLocal == '') {
          this.localService.removeValue('token');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          this.authService.cerrarSesion();
          window.location.href = `${config.urlHome}/?callback=${config.urlThisApp}`;
          return false;
        } else {
          this.authService.setUsuario(tokenLocal, refreshTokenLocal);
          const valido =  await this.validacionToken(config);
          if(valido) {
         
          
          
          }
          return valido;
        }
      } else {
        const valido =  await this.validacionToken(config);
        if(valido) {
        
         
        
        }
        return valido;
      }
    }
  }
  async validacionToken(config: any): Promise<boolean> {
    const tokenModel = this.authService.getToken()
    const url = `${config.ip}/auth/sso`;
    try {
      let response: any = await fetch(url, {method: 'POST', headers: {
        'Authorization': tokenModel.authorization,
        'Content-Type': 'application/json'
      }});
      const validaToken = await response.json();
      if(validaToken == null || validaToken == undefined || validaToken.datos == null || validaToken.datos == undefined || !validaToken.datos) {
        // INGRESA Y LO SACA DE LA APP PORQUE EL TOKEN ES NO VALIDO
        this.localService.removeValue('token');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.authService.cerrarSesion();
      //  window.location.href = `${config.urlHome}/?callback=${config.urlThisApp}`;
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log('VALIDA ERROR')
      this.localService.removeValue('token');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    //  this.authService.cerrarSesion();
   //   window.location.href = `${config.urlHome}/?callback=${config.urlThisApp}`;
      return false;
    }
  }
}
