import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
//Modelos
//Servicios
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LocalService } from './local.service';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

interface parametroInterface {
  nombre: string;
  valor: string;
  //id_parametro_catastro: number;
}

type parametroGeneral = { nombre: string; valor: string };

@Injectable({
  providedIn: 'root',
})
export class ParametrosService {
  parametros: any[];
  block: boolean;

  constructor(
    private apiService: ApiService,
    private localService: LocalService,
    private injector: Injector,
    private router: Router,
    private messageService: MessageService,
    private authSrv: AuthService
  ) {
    this.block = false;
  }

  consultarParametros(
    username: string,
    ipAplicacion: string
  ): Promise<parametroGeneral[]> {
    let parametros: Observable<parametroGeneral[]> = this.apiService.callResult(
      {
        metodo: 'parametros_generales.consultar',
        parametros: {
          usuario: username,
          ip_aplicacion: ipAplicacion,
        },
        showConsole: false,
      }
    );
    return new Promise((resolve, reject) => {
      parametros.subscribe((response: any) => {
        //console.log(response);
        resolve(response);
      }, reject);
    });
  }

  inicializarVariablesGlobales(usuario: string): void {
    this.apiService.callResult({
      metodo: 'inicializa_variables.globales',
      parametros: {
        usuario,
      },
      // showConsole: true,
    });
  }

  async almacenarParametros() {
    const usuario: string = this.authSrv.getUsername();
    let parametros = await this.consultarParametros(usuario, '9.9.9.9');
    this.parametros = parametros;
    this.inicializarVariablesGlobales(usuario);
    this.localService.setJsonValue('parametrosAplicacion', JSON.stringify(parametros));
  }

  getParametro(nombre: string): parametroInterface {
    if (this.block) return;
    if(!Array.isArray(this.parametros) || this.parametros.length < 1) {
      this.parametros = JSON.parse(this.localService.getJsonValue('parametrosAplicacion'));
    }
    // if (!this.parametros) {
    //   this.mandarloAlLogin();
    //   this.block = true;
    //   return null;
    // }
    let parametro = this.parametros && this.parametros.find((item) => item.nombre === nombre);
    if (!parametro) {
      // console.log('BLOQUEAR ESA VISTA');
      return null;
    }
    return parametro;
  }

  getValorParametro(nombre: string) {
    return this.getParametro(nombre)?.valor;
  }

  mandarloAlLogin() {
    const authService = this.injector.get(AuthService);
    this.messageService.clear();
    this.messageService.add({
      severity: 'error',
      summary: 'Error inesperado del sistema',
      sticky: true,
      detail: 'Por favor, intente iniciar sesión nuevamente.',
    });
    authService.cerrarSesion();
    setTimeout(() => {
      location.reload();
    }, 3000);
  }

  /**
   * Genera el PDF del Catastro Predial
   * @param idPredio  es el id del predio
   */
}
