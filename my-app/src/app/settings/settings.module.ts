import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings-routing.module';
import { ManageVehicleComponent } from './manage-vehicle/manage-vehicle.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageTestComponent } from './manage-test/manage-test.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignComponent } from './assign/assign.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConformationDialigComponent } from '../layout/conformation-dialig/conformation-dialig.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [ManageVehicleComponent, ManageUserComponent, ManageTestComponent, AssignComponent, ConformationDialigComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatTooltipModule,
    SettingsRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class SettingsModule { }
