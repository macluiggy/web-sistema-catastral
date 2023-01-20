import { Injectable, Inject } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { MessageService } from "primeng/api"
import { Observable, of } from "rxjs"
import { map, tap, catchError } from "rxjs/operators"
import { LocalService } from "src/app/shared/services/local.service"
 
export interface Request {
  metodo: 'POST' | 'GET' | 'DELETE' | 'PUT';
  endPoint?: string;
  data?: any;
  params?: HttpParams;
  showConsole?: boolean;
  showMessage?: boolean;
  dev?: boolean;
}

export interface Response {
  codigo?: number | string;
  datos?: any;
  error?: boolean;
  mensaje?: string;
}

@Injectable({
  providedIn: "root",
})
export class ApiRequestService {
  private readonly typesSeverity = {
    info: [100],
    success: [200, 201],
    warn: [204, 400, 401],
    error: [500],
  }

  constructor(
    @Inject("env") private env,
    private httpClient: HttpClient,
    private messageService: MessageService,
    private localService: LocalService
  ) {
  }

  requestAll(opciones: Request): Observable<Response> {
    const {config }= this.env;
    let showMessage = false;
    let ip = config.ip;
    if(!config.production && opciones.dev) {
      ip = config.ipDev;
    }
    if(opciones.endPoint.trim().split('')[0] === '/') opciones.endPoint = opciones.endPoint.trim().substring(1);
    let url = `${ip}/${opciones.endPoint.trim()}`;

    if (opciones.showConsole) {
      console.log(`Request ${url}`, { ...opciones })
    }
    if(opciones.showMessage !== null && opciones.showMessage !== undefined && (opciones.showMessage == true || opciones.showMessage == false)) {
      showMessage = opciones.showMessage;
    }

    if(opciones.metodo === 'POST') {
      return this.httpClient.post(url, opciones.data).pipe(
        tap((response) => {
          if (opciones.showConsole) {
            console.log(`Response ${url}`, {...response})
          }
        }),
        tap((response) => this.messageResponse(response, showMessage)),
        catchError((response) => this.messageResponse(response.error, showMessage))
      )
    } else if(opciones.metodo === 'GET') {
      return this.httpClient.get(url, { params: opciones.params }).pipe(
        tap((response) => {
          if (opciones.showConsole) {
            console.log(`Response ${url}`, {...response})
          }
        }),
        tap((response) => this.messageResponse(response, showMessage)),
        catchError((response) => this.messageResponse(response.error, showMessage))
      )
    } else if(opciones.metodo === 'DELETE') {
      return this.httpClient.delete(url, { params: opciones.params}).pipe(
        tap((response) => {
          if (opciones.showConsole) {
            console.log(`Response ${url}`, {...response})
          }
        }),
        tap((response) => this.messageResponse(response, showMessage)),
        catchError((response) => this.messageResponse(response.error, showMessage))
      )
    } else if(opciones.metodo === 'PUT') {
      return this.httpClient.put(url, opciones.data).pipe(
        tap((response) => {
          if (opciones.showConsole) {
            console.log(`Response ${url}`, {...response})
          }
        }),
        tap((response) => this.messageResponse(response, showMessage)),
        catchError((response) => this.messageResponse(response.error, showMessage))
      )
    } else {
      return this.messageResponse({error: true, mensaje: `Metodo ${opciones.metodo} no implementado`, codigo: 500}, true);
    }
  }

  requestData(opciones: Request): Observable<any> {
    return this.requestAll(opciones).pipe(map((response: Response) => response?.datos));
  }

  messageResponse(response: Response, show: boolean): Observable<Response> {
    if (show && response && response.mensaje && response.mensaje.toString().trim() != '') {
      this.messageService.add({
        detail: response.mensaje,
        severity: response.error == true? 'error':'success',
      });
    }
    return of(response)
  }

  private severityCodeStatus(codigo: number): string {
    for (const severity of Object.keys(this.typesSeverity)) {
      if (this.typesSeverity[severity].some((x) => x == codigo)) {
        return severity
      }
    }
    return "warn"
  }
}
