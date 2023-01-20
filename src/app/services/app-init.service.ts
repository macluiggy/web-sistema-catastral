import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

declare global {

  interface Window {
    config: any;
  }

}

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(private httpClient: HttpClient) {}

  public init(): Promise<any> {

    const headers = { "Cache-Control": "no-cache", "Pragma": "no-cache" };

    return from(
      fetch('assets/app-config.json', { headers }).then((resp) => resp.json())
    ).pipe(
      map((config) => {
        //console.log( config );
        window.config = config;
        return;
      })
    ).toPromise() as Promise<any>;
  }
}
