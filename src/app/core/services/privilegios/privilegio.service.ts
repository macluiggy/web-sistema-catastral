import { Injectable } from '@angular/core';
import { LocalService } from 'src/app/shared/services/local.service';
import { ApiRequestService } from 'src/app/core/services/api/api-request.service';

@Injectable({
  providedIn: 'root'
})
export class PrivilegioService {


  private nameLocalService = 'privilegios';
  private privilegios: any[] = [];

  constructor(
    private apiRS: ApiRequestService,
    private localService: LocalService
  ) {
  }

  request() {
    if(!this.existenPrivilegios()) {
      this.consultarPrivilegios();
    }
  }

  private consultarPrivilegios(){
    this.apiRS.requestData({ metodo: 'GET', endPoint: 'aplicaciones/privilegio_usuario'}).subscribe((response: any) => {
      this.privilegios = response? response: [];
      this.localService.setJsonValue(this.nameLocalService, JSON.stringify(this.privilegios));
    });
  }

  private existenPrivilegios() {
    const response = this.localService.getJsonValue(this.nameLocalService);
    const privs = JSON.parse(response);
    if(privs === null || privs === undefined || !Array.isArray(privs) || privs.length < 1) return false;
    else {
      this.privilegios = privs;
      return true;
    }
  }

  getPrivilegio(clave: string): any | undefined {
    const response = this.privilegios.find((config) => config.clave === clave);
    if(response === null || response === undefined) return undefined;
    return response;
  }

  tienePrivilegio(clave: string): string | undefined {
    const config = this.getPrivilegio(clave);
    if(config === undefined) return undefined;
    return config.valor;
  }
}
