import { Component, OnInit } from '@angular/core';
import { LocalService } from 'src/app/shared/services/local.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html'
})

export class InicioComponent implements OnInit {

  constructor(private localService: LocalService) { }

  ngOnInit(): void {
    // get token an print
 
    const response = this.localService.getJsonValue('token');
    //console.log( response );
  }

}
