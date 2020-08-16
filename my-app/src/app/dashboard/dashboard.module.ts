import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';

import { ValidationTypesComponent } from './validation-types/validation-types.component';
import { DurabilityComponent } from './durability/durability.component';
import { VehicleDashboardComponent } from './vehicle-dashboard/vehicle-dashboard.component';


import { NgxEchartsModule } from "ngx-echarts";
import { ChartsModule as chartjsModule } from 'ng2-charts';
import { MorrisJsModule } from 'angular-morris-js';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GaugeModule } from 'angular-gauge';
import { AgmCoreModule } from '@agm/core';
import { DialogformComponent } from './vehicle-dashboard/dialogform/dialogform.component';
import { ProgressComponent } from './progress/progress.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HighchartsChartModule } from 'highcharts-angular';
import { OverallProgressComponent } from './durability/overall-progress/overall-progress.component';
import { SpeedAnalyticsComponent } from './durability/speed-analytics/speed-analytics.component';
import { FailureAnalyticsComponent } from './durability/failure-analytics/failure-analytics.component';


@NgModule({
  declarations: [MainComponent, ValidationTypesComponent, DurabilityComponent, VehicleDashboardComponent, DialogformComponent, ProgressComponent, OverallProgressComponent, SpeedAnalyticsComponent, FailureAnalyticsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    NgxDatatableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatBadgeModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSliderModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    chartjsModule,
    MorrisJsModule,
    NgxChartsModule,
    NgApexchartsModule,
    GaugeModule.forRoot(),
    AgmCoreModule,
    DragDropModule,
    HighchartsChartModule
  ]
})

export class DashboardModule { }

