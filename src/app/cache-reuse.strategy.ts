import {RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot} from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {

  public static handlers: { [key: string]: DetachedRouteHandle } = {};

  private static delete: string;

  //THIS METHOD IS USED FOR DELETE ROUTE
  public static deleteRouteSnapshot(name: string): void {
    name = name.replace(/\//g, '_').replace(/\?/g, '_').replace(/\=/g, '_').replace(/\&/g, '_');
    if (CustomReuseStrategy.handlers[name]) {
      delete CustomReuseStrategy.handlers[name];
    } else {
      CustomReuseStrategy.delete = name;
    }
  }

  //THIS METHOD RETURN TRUE WHEN ROUTE REUSE LATER
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return false;
    }
    return true;
  }

  //THIS METHOD IS USD FOR STORE ROUTE STATE
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (CustomReuseStrategy.delete && CustomReuseStrategy.delete === this.getRouteUrl(route)) {
      CustomReuseStrategy.delete = null;
      return;
    }
    CustomReuseStrategy.handlers[this.getRouteUrl(route)] = handle;
  }

  //ATTACHED ROUTE IF ALREADY NOT PRESENT
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!CustomReuseStrategy.handlers[this.getRouteUrl(route)];
  }

  //THIS METHOD IS USED FOR RETRIEVING ROUTE STATE
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!route.routeConfig || route.routeConfig.loadChildren || !CustomReuseStrategy.handlers[this.getRouteUrl(route)]) {
      // Object.keys(CustomReuseStrategy.handlers).forEach(key => delete CustomReuseStrategy.handlers[key]);
      return null;
    }
    return CustomReuseStrategy.handlers[this.getRouteUrl(route)];
  }

  //THIS METHOD RUN WHEN USER CHANGE ROUTE EVEY TIME AND CHECK CURRENT ROUTE WANT TO USED CUSTOM STRATEGY OR NOT
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig &&
      JSON.stringify(future.params) === JSON.stringify(curr.params);
  }

  //FIND OUT ACTUAL ROUTE NAME AND ROUTE THE URL
  private getRouteUrl(route: ActivatedRouteSnapshot): any {
    return route['_routerState'].url.replace(/\//g, '_').replace(/\?/g, '_').replace(/\=/g, '_').replace(/\&/g, '_');
  }
}
