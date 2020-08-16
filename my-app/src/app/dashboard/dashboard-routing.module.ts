import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ValidationTypesComponent } from './validation-types/validation-types.component';
import { VehicleDashboardComponent } from './vehicle-dashboard/vehicle-dashboard.component';

import { DurabilityComponent } from './durability/durability.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'validation-types/:id',
    component: ValidationTypesComponent
  },

  {
    path: 'durability/:pid/:tid',
    component: DurabilityComponent
  }, {
    path: 'vehicle-dashboard/:pid/:tid/:rbaid',
    component: VehicleDashboardComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
