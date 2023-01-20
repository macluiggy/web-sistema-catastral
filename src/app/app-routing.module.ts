import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './bpm/pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { InicioComponent } from './inicio/pages/inicio/inicio.component';
 

const routes: Routes = [
 {
    path: '', 
    canActivate: [AuthGuard],
    //component: InicioComponent,
    // loadChildren: () => import('./inicio/inicio.module').then((m) => m.InicioModule),
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'inicio2', component: HomeComponent },
    ]
  }, 
  // crear pagina de espera
  //{path: 'inicio', component: InicioComponent}, 
  //{path: '', redirectTo: '/inicio', pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
