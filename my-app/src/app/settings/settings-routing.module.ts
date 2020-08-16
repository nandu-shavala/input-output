import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageVehicleComponent } from './manage-vehicle/manage-vehicle.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageTestComponent } from './manage-test/manage-test.component';
import { AssignComponent } from './assign/assign.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage-vehicle',
    pathMatch: 'full'
  },
  {
    path: 'manage-vehicle',
    component: ManageVehicleComponent
  },
  {
    path: 'manage-user',
    component: ManageUserComponent
  }, {
    path: 'manage-test',
    component: ManageTestComponent
  },
  {
    path: 'assign',
    component: AssignComponent
  },
  {
    path: 'assign/:id',
    component: AssignComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }


