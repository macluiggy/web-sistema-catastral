import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
 
 
import { GlobalConstants } from 'src/app/util/global';
import { LocalService } from './local.service';
import { CustomReuseStrategy } from 'src/app/cache-reuse.strategy';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  pages$: BehaviorSubject<MenuItem[]> = new BehaviorSubject(this.localService.getJsonValue('pages') || []);
  historialPages$: BehaviorSubject<MenuItem[]> = new BehaviorSubject(this.localService.getJsonValue('historial_pages') || []); // Registro de todas las paginas abiertas
  paddingLeft$: BehaviorSubject<boolean> = new BehaviorSubject(this.localService.getJsonValue('paddingleft') || false);

  activePage$: BehaviorSubject<MenuItem> = new BehaviorSubject(null);

  blockePage$: Subject<boolean> = new Subject();

  currentItem: MenuItem;
  sesionVencida$: Subject<boolean> = new Subject();

  constructor(private router: Router,
    private localService: LocalService)
  {
  }

  public static get urlWMS(): string {
    switch(GlobalConstants.APP) {
        case 'daule':
            return "http://172.16.11.10:8080/geoserver/Daule/wms";
        case 'yaguachi':
            return "http://172.16.11.8:8080/geoserver/Yaguachi/wms";
        case 'playas':
            return "http://172.16.11.8:8080/geoserver/Playas/wms";
        case 'pangua':
            return "http://172.16.11.8:8080/geoserver/Pangua/wms";
        default:
            return "";
    }
  }

  public static get coordenadasGeograficas(): {[key: string]: number} {
    switch(GlobalConstants.APP) {
        case 'daule':
            return {DEFAULT_LAT: -79.983978, DEFAULT_LON: -1.858400 };
        case 'yaguachi':
            return {DEFAULT_LAT: -79.69485, DEFAULT_LON: -2.0968 };
        case 'playas':
            return {DEFAULT_LAT: -80.38808, DEFAULT_LON: -2.63199 };
        case 'pangua':
            return {DEFAULT_LAT: -79.276856, DEFAULT_LON: -1.1007195 };
        default:
            return {DEFAULT_LAT: 0, DEFAULT_LON: 0 };
    }
  }

  activeCurrentUrl() {
    setTimeout(() => {
      const pages = this.pages$.value;
      let url: string = this.router.routerState.snapshot.url;
      const indexInitQueryParams = url && url.search(/\?/g);
      if(indexInitQueryParams && indexInitQueryParams > 0) url = url.slice(0, indexInitQueryParams);
      const current = pages.find(p => p.routerLink === url);
      current && this.addPageActive(current);
    }, 500);
  }

  clearPages() {
    this.pages$ = new BehaviorSubject([]);
    this.historialPages$ = new BehaviorSubject([]);
    this.paddingLeft$ = new BehaviorSubject(false);
    this.activePage$ = new BehaviorSubject(null);
    this.blockePage$ = new Subject();
    this.currentItem = null;
  }

  isPagesStorage(): boolean {
    const pages = this.pages$.value;
    // this.activePage$.next(pages.find(p => p.routerLink === this.router.url));
    // console.log('isPagesStorage', this.router.routerState.snapshot.url)

    return pages.length > 0;
  }

  addPageActive(item: MenuItem): void {
    if(item) {
      const pages = this.pages$.value;
      if (!pages.some(page => page.id === item.id)) {
        this.pages$.next([...pages, item]);
      } else {
        const indexItemPage: number = pages.findIndex(page => page.id === item.id);
        if(JSON.stringify(pages[indexItemPage]) !== JSON.stringify(item)) {
          pages[indexItemPage] = item;
          this.pages$.next([...pages]);
        } else {
          item = pages[indexItemPage];
        }
      }
      this.currentItem = item;
      this.addHistorialPage(item);
      this.activePage$.next(item);
    }

  }

  removePage(item: MenuItem): void {
    if (item) {
      let pages = this.pages$.value;
      pages = pages?.filter(page => page != null && page.id !== item.id);
      this.pages$.next(pages);
      CustomReuseStrategy.deleteRouteSnapshot(item.routerLink.replace(/\//g, '_'));
      
      const activePage = this.activePage$.value;
      if (activePage && activePage.id === item.id) {
        if(pages.length > 0) {
          const page = pages[pages.length - 1];
          this.activePage$.next(page);
          this.currentItem = page;
          if (page) {
            this.router.navigateByUrl(page.routerLink);
          }
        } else {
          this.router.navigateByUrl('/');
          this.activePage$.next(null);
          this.currentItem = null;
        }
      }
    }
  }

  getPageById(id: string) {
    return this.pages$.value.find(page => page.id === id);
  }

  includesPage(item: MenuItem): boolean {
    if (item) {
      let pages = this.pages$.value;
      return pages.some(page => page.id === item.id);
    }
  }

  includesRouterLink(routerLink: string) {
    if (routerLink) {
      let pages = this.pages$.value;
      return pages.some(page => page.routerLink === routerLink);
    }
  }

  setCurrentItem() {
    this.currentItem = this.activePage$.value;
  }

  removeCurrentItem(): void {
    this.removePage(this.currentItem);
  }

  activaBlock(): void {
    this.blockePage$.next(true);
  }

  desactivaBlock(): void {
    this.blockePage$.next(false);
  }

  activaSesionBlock(): void {
    this.sesionVencida$.next(true);
  }

  changePaddingLeft(value: boolean): void {
    this.paddingLeft$.next(value);
  }

  addHistorialPage(item: MenuItem): void {
    const hPages = this.historialPages$.value;
    if (!hPages.some(page => JSON.stringify({...page, expanded: ''}) === JSON.stringify({...item, expanded: ''}))) {
      this.historialPages$.next([...hPages, item]);
    }
  }

  get historialPages() {
    return this.historialPages$.value;
  }

}
