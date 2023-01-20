import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalService } from 'src/app/shared/services/local.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
  constructor(private localService: LocalService, private authService: AuthService) {}

  ngOnInit(): void {
    // get token an print

    const response = this.localService.getJsonValue('token');
    //console.log( response );
  }

  //Cerrar sesión
  cerrar_sesion() {
    console.log('cerrar_sesion');

    this.authService.cerrarSesion();
  }
}
