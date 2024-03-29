import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { ConnectedModule } from './connected/connected.module';
import { PreConnectModule } from './pre-connect/pre-connect.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    ConnectedModule,
    PreConnectModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
