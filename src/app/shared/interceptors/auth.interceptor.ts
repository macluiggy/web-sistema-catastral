import {Injectable, Inject} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpClient} from '@angular/common/http';
import {from, Observable, throwError} from 'rxjs';

import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ApiRequestService } from 'src/app/core/services/api/api-request.service';
import { InicioService } from '../services/inicio.service';
 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  block: boolean = false;
  private contador401: number = 0;

  constructor( @Inject('env') private env,
              private authService: AuthService,
              private apiRS: ApiRequestService,
              private inicioService: InicioService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this.handle(request, next));
  }

  async handle(request: HttpRequest<unknown>, next: HttpHandler) {
    await this.checkRefreshToken();
    let setHeaders:any = { 'Authorization': this.authService.getToken().authorization, 'Content-Type': 'application/json' };
    if( !this.env.config.production ) setHeaders = { ...setHeaders, 'Aplication-Token': this.env.config.appToken }
    request = request.clone({
      setHeaders
    });
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          console.log('UNAUTHORIZATED FROM INTERCEPTOR')
          if(this.contador401 == 1) {
            this.inicioService.activaSesionBlock();
          }
          this.contador401++;
          // const { config } = this.env;
          // this.authService.cerrarSesion();
          // window.location.href = `${config.urlHome}/?callback=${config.urlThisApp}`;
        }

        return throwError(error);
      })
    ).toPromise();
  }

  async checkRefreshToken() {
    const tokenModel = this.authService.getToken()
    // console.log('isExpired', tokenModel.isExpired, tokenModel.expires_in, tokenModel.refresh_token);
    if (this.block == false && tokenModel != null && tokenModel != undefined && tokenModel.refresh_token != null && tokenModel.refresh_token != undefined && tokenModel.refresh_token != '' && this.contador401 == 1) {
      this.block = true;
      const {config}  = this.env;
      const url = `${config.ip}/auth/refresh_token`;
      try {
        let response: any = await fetch(url, {method: 'POST', headers: {
          'Authorization': tokenModel.authorizationRefresh,
          'Content-Type': 'application/json'
        }});
        response = await response.json();
        this.apiRS.messageResponse(response, true);
        if(response == null || response == undefined || response?.error?.error == true || response?.datos == null || response?.datos == undefined || response?.datos?.token == null ||  response?.datos?.token == undefined) {
        } else {
          this.authService.setUsuario(response.datos.token, tokenModel.refresh_token);
          this.contador401 = 0;
        }
        this.block = false;
      } catch (error) {
        this.apiRS.messageResponse(error, true);
        this.block = false;
      }
    } else if(this.block == false && tokenModel != null && tokenModel != undefined && this.contador401 == 1  && (tokenModel.refresh_token == null || tokenModel.refresh_token == undefined || tokenModel.refresh_token == '')) {
      // console.log('LA SESION HA EXPIRADO. VUELVA A INICIAR SESION.')
      this.inicioService.activaSesionBlock();
    }
  }
}
