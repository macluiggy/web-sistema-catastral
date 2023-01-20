import { Inject, Injectable, OnInit } from "@angular/core"
 
 
import { BehaviorSubject } from "rxjs";
import { ApiRequestService } from "src/app/core/services/api/api-request.service";
 
import { InicioService } from "../inicio.service";
@Injectable({
  providedIn: "root",
})
export class MenuService {

  service: string = 'aplicaciones';
  menu: BehaviorSubject<any> = new BehaviorSubject(null);


  constructor(    
    private inicioService: InicioService, 
    private apiRS: ApiRequestService) {
    this.requestMenu().then((menu) => {
      this.menu.next(menu);
    });
  }

  async obtenerMenuDinamico():Promise<any> {
    const endPoint = `${this.service}/menu_usuario`;
    return await this.apiRS.requestData({metodo: 'GET', endPoint , showMessage: false}).toPromise(); 
  }
  
  async requestMenu() {
    let  menu_change = [];
    let response:any = await this.obtenerMenuDinamico(); 
    if(response ){
      let menu:any [] = response.hijos; 
      if(menu && menu.length > 0){
      //  menu[0].styleClass =  'header-menu' // esta opcon la deben de tener los menus principales
        menu_change = menu.map((menu)=>{
           return this.cambiar_propierdades_menu(menu)
        });
      }
    }
    return menu_change;
  }

  get getMenu() {
    return this.menu.value;
  }

  addPage = ({ item }) => {
    this.inicioService.addPageActive(item)
  }

  cambiar_propierdades_menu(menu) {
    menu.label = menu.etiqueta;
    menu.icon = 'fa ' + menu.icono; 
    //routerLink
    if(menu.label === 'Inicio'){
      menu.routerLink = '/inicio'
    }else{
      menu.routerLink = menu.ruta;
    }   
    // eliminar label icon routerLink
    delete menu.etiqueta;
    delete menu.icono;
    delete menu.ruta;
    if(menu.hijos ){
        if (menu.hijos.length > 0) {
            menu.items = [];
            for (let i = 0; i < menu.hijos.length; i++) {
              if( menu.hijos[i]?.hijos ){
                if (menu.hijos[i]?.hijos === 0){
                  delete menu.hijos[i]?.hijos;
                }
              }
              menu.items.push(this.cambiar_propierdades_menu(menu.hijos[i]));
            }
            // eliminar hijos
            delete menu.hijos
            delete menu.routerLink
        }else {
            menu.command = this.addPage
            delete menu.hijos
        }
    }else{
      menu.command = this.addPage
    }
    return menu;
  }


}
