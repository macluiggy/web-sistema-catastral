import {
  Component,
  OnInit
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { InicioService } from 'src/app/shared/services/inicio.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  menuTemporal: MenuItem[];
  menuItemIcon: boolean = false;
  menuItemText: boolean = true;

  disabled_TooltipItem: boolean = true;

  constructor(
    private menuService: MenuService,
    private inicioService: InicioService
  ) {}

  ngOnInit(): void {
    this.menuService.menu.subscribe((menu) => {
      this.menuTemporal = menu;
    });
    if (!this.inicioService.isPagesStorage()) {
      if (this.menuTemporal != null && this.menuTemporal.length > 0)
        this.inicioService.addPageActive(this.menuTemporal[0]);
    } else {
      this.inicioService.setCurrentItem();
    }
  }
  addPage = ({ item }) => {
    this.inicioService.addPageActive(item);
  };
}
