import { Component, OnInit, Input, ViewChild,HostListener } from '@angular/core'; 
import { AuthService } from 'src/app/shared/services/auth.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { img_menu, img_collapse, img_sistema } from '../../../assets/data/images'; 
 
@Component({
  selector: 'sgtm-header',
  templateUrl: './header.component.html', 
})
export class HeaderComponent implements OnInit {

  box_SignOff: Boolean = false;  //cerrar sesion
  menu_completo: Boolean = false; //Menu completo
  menu_collapse: Boolean = true; //Menu collapse
  modo_oscuro: Boolean = true; // Mode Oscuro
  modo_claro: Boolean = false; //Mode claro
  modal_Apps: boolean; //Modal Apps
  position_modal: string; // Modal posición
  name_user: string; //Nombre de Uusario
  inicial_name: string; // Inicial del Nombre de Uusario

  img_sistema:string = img_sistema;//Imagen Sistema
  img_menu:string = img_menu;//Icono menu
  img_collapse:string = img_collapse;//Icono menu collapse
 

  constructor( private MenuService: MenuService,private authService:AuthService ) { }

  ngOnInit(): void { 
    this.name_user = 'Nombre de usuario'; //Nombre de usuario
    this.inicial_name = this.name_user.charAt(0); //Inicial usuario   

  } 

  //Cerrar sesión
  User(): void {
    this.box_SignOff = !this.box_SignOff; 
  }

  @HostListener('menu')
  //Menú
  menu(): void { 
    //this.MenuService.tooltipMenu();
    //Toggle Icon
    this.menu_completo = !this.menu_completo; 
    this.menu_collapse = !this.menu_collapse; 
  }

  //Modo Oscuro
  darkMode(): void {
    this.modo_oscuro = !this.modo_oscuro; 
    this.modo_claro = !this.modo_claro; 
    if( this.modo_oscuro == true){
      console.log('modo_oscuro');
    }
    if(this.modo_claro == true){
      console.log('modo_claro');
    }
  }
 
  //Notificaciones
  showNotificacion(){
    //url Home Notificacion
  }
  
  //Modal Apps
  menuApps(position: string) {
      this.modal_Apps = true;
      this.position_modal = position;
  }

  //Cerrar sesión
  cerrar_sesion(){ 
    console.log('cerrar_sesion');
    
    this.authService.cerrarSesion();
  }

}
