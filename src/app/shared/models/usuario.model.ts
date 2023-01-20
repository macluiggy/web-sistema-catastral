export class UsuarioModel {

  id: bigint;
  correo_electronico: string;
  nombres: string;
  apellidos: string;
  identificacion: string;
  avatar: string;

  constructor(data: UsuarioModel) {
    if (data) {
      this.id = data.id;
      this.correo_electronico = data.correo_electronico;
      this.nombres = data.nombres;
      this.apellidos = data.apellidos;
      this.identificacion = data.identificacion;
      this.avatar = data.avatar ?? '';
    }
  }
}
