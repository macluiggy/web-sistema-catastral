import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService, SelectItem } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { Request } from '../models/request';
import { map, tap, catchError } from 'rxjs/operators';

//import { GlobalVariable } from '../../util/global';
import { GlobalConstants } from '../../util/global';
import { LocalService } from './local.service'; 
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly typesSeverity = {
    info: ['100'],
    success: ['200', '201'],
    warn: ['204', '400', '401'],
    error: ['500'],
  };
  usuario: string;
  constructor(
    @Inject('env') private env,
    private httpClient: HttpClient,
    private messageService: MessageService,
    private localService: LocalService
  ) {
    const username: string = this.localService.getJsonValue('username');
    this.usuario = username && username.length > 0 ? username : 'NO_USERNAME';
  }

  call<T>(opciones: Request): Observable<boolean | T> {
    const {config} = this.env;
    let url = `${config.ip}/procesos/postgress`;
    let parametros = {};
    if (!opciones.parametros) {
      parametros = { metodo: opciones.metodo };
    } else {
      parametros = { ...opciones.parametros, metodo: opciones.metodo };
    }

    if (opciones.showConsole) {
      console.log(`Request ${opciones.metodo}`, { url, parametros });
    }

    return this.httpClient.post<T>(url, parametros).pipe(
      // map(response => this.dataJsonParse(response)),
      tap((response) => {
        if (opciones.showConsole) {
          console.log(`Response ${opciones.metodo}`, { url, response });
        }
      }),
      tap((response) => this.messageResponse(response)),
      catchError((response) => this.messageResponse(response.error))
    );
  }

  callResult<T>(opciones: Request): Observable<T> {
    return this.call(opciones).pipe(map((response: any) => response?.datos));
  }

  /**
   * @description SOLO DEBE SER USADO PARA LA FUNCIÓN callWithoutErrorMsg
   * @param opciones
   * OPTIONS: http://172.16.14.7:9090/procesos/usuario_perfil.get/yaguachi
   * @returns
   */
  private callWOErrorM<T>(opciones: Request): Observable<boolean | T> {
    const {config }= this.env;
    let url = `${config.ip}/procesos/postgress`;
    let parametros = {};
    if (!opciones.parametros) {
      parametros = { metodo: opciones.metodo };
    } else {
      parametros = { ...opciones.parametros, metodo: opciones.metodo };
    }
    if (opciones.showConsole) {
      console.log(`Request ${opciones.metodo}`, { url, parametros });
    }

    return this.httpClient.post<T>(url, parametros).pipe(
      // map(response => this.dataJsonParse(response)),
      tap((response) => {
        if (opciones.showConsole) {
          console.log(`Response ${opciones.metodo}`, { url, response });
        }
      }),
      tap((response) => of(response)),
      catchError((response) => of(response.error))
    );
  }

  /**
   * @description SOLO DEBE SER USADO PARA LA PANTALLA DE ASIGNACION DE MANZANAS
   * @param opciones
   * @returns
   */
  callWithoutErrorMsg<T>(opciones: Request): Observable<T> {
    //var parametroBD = GlobalVariable.BD;
    let parametroBD = GlobalConstants.BD;
    opciones.metodo = opciones.metodo + parametroBD;
    return this.callWOErrorM(opciones).pipe(
      map((response: any) => (response ? response : null))
    );
  }

  private dataJsonParse(response: any): any {
    return {
      ...response,
      datos: JSON.parse(response.datos),
    };
  }

  private messageResponse(response: any): Observable<any> {
    if (response?.mensaje) {
      this.messageService.clear();
      this.messageService.add({
        sticky: true,
        detail: response.mensaje,
        severity: this.severityCodeStatus(response.codigo),
      });
    }
    // return of(response.codigo === 200);
    return of(response);
  }

  private severityCodeStatus(codigo: number): string {
    for (const severity of Object.keys(this.typesSeverity)) {
      if (this.typesSeverity[severity].some((x) => x === codigo)) {
        return severity;
      }
    }
    return 'warn';
  }

  catalogo(
    metodo: string,
    datos:
      | { usuario: string; tabla: string }
      | { usuario: string; id_tipo_ubicacion: string }
      | {
          usuario: string;
          parroquia?: string | null;
          zona?: string | null;
          sector?: string | null;
        }
      | { usuario: string; id_notaria?: string }
      | { usuario: string; id_tipo_division: string; id_division_padre: string }
      | {},
    showConsole: boolean = false
  ): Observable<any> {
    return this.callResult({ metodo, parametros: datos, showConsole }).pipe(
      map<any[], SelectItem[]>((items: any[]) =>
        items
        ? items.map((item) => {
          let label = item.descripcion ||
                      item.nombre ||
                      item.zona ||
                      item.sector ||
                      item.manzana ||
                      item.codigo_geo || '';
          let value = 0;
          if(item.id_item >= 0) value = item.id_item; 
          else if(item.id_division_territorial >= 0) value = item.id_division_territorial;
          else if(item.id_ubicacion_predio >= 0) value = item.id_ubicacion_predio;
          else if(item.id_notaria >= 0) value = item.id_notaria;
          else if(item.id_catalogo_tabla >= 0) value = item.id_catalogo_tabla;
          else if(item.id_nivel_instruccion >= 0) value = item.id_nivel_instruccion;
          else if(item.id_estado_instruccion >= 0) value = item.id_estado_instruccion;
          else {
            value = 0;
          }
          return { label, value};
        })
      : []
      )
    );
  }
  catalogoCodigoGeo(
    metodo: string,
    datos:
      | { usuario: string; tabla: string }
      | { usuario: string; id_tipo_ubicacion: string }
      | {
          usuario: string;
          parroquia?: string | null;
          zona?: string | null;
          sector?: string | null;
        }
      | { usuario: string; id_notaria?: string }
      | { usuario: string; id_tipo_division: string; id_division_padre: string }
      | {},
    showConsole: boolean = false
  ): Observable<any> {
    return this.callResult({ metodo, parametros: datos, showConsole }).pipe(
      map<any[], SelectItem[]>((items: any[]) =>
        items
          ? items.map((item) => ({
              label: item.codigo_geo,
              value: item.codigo_geo || 0,
            }))
          : []
      )
    );
  }

  divisionTerritorial(
    id_tipo_division_territorial,
    id_division_territorial
  ): Observable<[]> {
    return this.catalogo('catalogo_division_territorial.consultar', {
      usuario: this.usuario,
      id_tipo_division: `${id_tipo_division_territorial}`,
      id_division_padre: `${id_division_territorial}`,
    });
  }

  divisionTerritorialCodigo_geo(
    id_tipo_division_territorial,
    id_division_territorial
  ): Observable<[]> {
    return this.catalogoCodigoGeo('catalogo_division_territorial.consultar', {
      usuario: this.usuario,
      id_tipo_division: `${id_tipo_division_territorial}`,
      id_division_padre: `${id_division_territorial}`,
    });
  }

  save<T>(opciones: Request): Observable<boolean | T> {
    //var parametroBD = GlobalVariable.BD;
    let parametroBD = GlobalConstants.BD;
    // opciones.metodo = opciones.metodo + parametroBD
    const {config} = this.env;
    let url = `${config.ip}/procesos/postgress`;
    // const parametros = opciones.parametros ? opciones.parametros : {}
    let parametros = {};
    if (!opciones.parametros) {
      parametros = { metodo: opciones.metodo };
    } else {
      parametros = { ...opciones.parametros, metodo: opciones.metodo };
    }
    if (opciones.showConsole) {
      console.log(`Request ${opciones.metodo}`, { url, parametros });
    }

    return this.httpClient.post<T>(url, parametros).pipe(
      // map(response => this.dataJsonParse(response)),
      tap((response) => {
        if (opciones.showConsole) {
          console.log(`Response ${opciones.metodo}`, { url, response });
        }
      }),
      tap((response) => this.messageResponse(response)),
      catchError((response) => this.messageResponse(response.error))
    );
  }
}
