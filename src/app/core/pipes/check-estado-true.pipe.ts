import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkEstadoTrue'
})
export class CheckEstadoTruePipe implements PipeTransform {

  transform(value: unknown): unknown {
    if(Array.isArray(value)) {
      return value.filter((item) => item.estado_registro != false);
    }
    return [];
  }

}
