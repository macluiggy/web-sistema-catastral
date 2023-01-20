import { Injectable } from '@angular/core';

//Servicios
import { ApiRequestService } from 'src/app/core/services/api/api-request.service';
import { LocalService } from 'src/app/shared/services/local.service';

export interface Config {
  id?: string | number;
  clave?: string;
  valor?: string;
  etiqueta?: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  private nameLocalService = 'configuraciones';
  private configs: Config[] = [];

  constructor(
    private apiRS: ApiRequestService,
    private localService: LocalService
  ) {
  }

  request() {
    if(!this.existenConfiguraciones()) {
      this.consultarConfiguraciones();
    }
  }

  private consultarConfiguraciones(){
    this.apiRS.requestData({ metodo: 'GET', endPoint: 'catalogo/configuracion', showConsole: false}).subscribe((response: Config[]) => {
      this.configs = response? response: [];
      this.localService.setJsonValue(this.nameLocalService, JSON.stringify(this.configs));
    });
  }

  private existenConfiguraciones() {
    const response = this.localService.getJsonValue(this.nameLocalService);
    const configs = JSON.parse(response);
    if(configs === null || configs === undefined || !Array.isArray(configs) || configs.length < 1) return false;
    else {
      this.configs = configs;
      return true;
    }
  }

  getConfig(clave: string): Config | undefined {
    if(!this.configs || this.configs == null || this.configs == undefined || this.configs.length == 0) {this.configs = JSON.parse(this.localService.getJsonValue(this.nameLocalService))}
    const response = this.configs.find((config) => config.clave === clave);
    if(response === null || response === undefined) return undefined;
    return response;
  }

  getValorConfig(clave: string): string | undefined {
    const config = this.getConfig(clave);
    if(config === undefined) return undefined;
    return config.valor;
  }
}
