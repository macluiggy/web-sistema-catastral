import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';

const routes: Routes = [
   {
    path: '', 
    //component: InicioComponent, 
    children: [
      {path: 'inicio', component:InicioComponent  },
      //{path: 'bpm', loadChildren: () => import('./../bpm/bpm.module').then((m) => m.BpmModule)},
      { path: '**', redirectTo: 'inicio' }
    ]
  },
  //{path: 'inicio', component: InicioComponent}, 
 // {path: '', redirectTo: '/inicio', pathMatch: 'full'} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
