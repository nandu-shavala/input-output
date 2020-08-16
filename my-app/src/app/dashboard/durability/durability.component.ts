import { Component, OnInit, ViewChild } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl } from "@angular/forms";
import { MouseEvent, AgmMap } from "@agm/core";
import * as echarts from "echarts";
import { ApexNonAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexTheme } from "ng-apexcharts";
import { DataService } from "src/app/services/data.service";
import { AppSettings } from "src/app/global";
import { AppConstants } from 'src/app/const';
import { HtmlToPdf } from 'src/app/htmlToPdf';

import { MatSnackBar } from '@angular/material/snack-bar';

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  theme: ApexTheme;
  title: ApexTitleSubtitle;
};
declare const ApexCharts: any;

@Component({
  selector: "app-durability",
  templateUrl: "./durability.component.html",
  styleUrls: ["./durability.component.scss"],
})
export class DurabilityComponent implements OnInit {
  tabs = ["First", "Second", "Third"];
  selected = new FormControl(0);

  @ViewChild("durability", { static: true }) chart: DurabilityComponent;

  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;



  BASE_URL: string;
  programId: string;
  testId: string = "";
  program: any;
  test: any;
  message: "";
  vehicleStats: any;

  htmlToPdf: HtmlToPdf = new HtmlToPdf();

  pdfLoading: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private _snackBar: MatSnackBar
  ) {
    this.BASE_URL = AppSettings.BASE_URL;
    this.programId = this.route.snapshot.paramMap.get("pid");
    this.testId = this.route.snapshot.paramMap.get("tid");
    this.getProgramById(this.programId);
    this.getTestById(this.testId);
    this.getVehicleStatistics(this.programId, this.testId);
  }

  ngOnInit() { }



  getStatusStyle(status: string) {
    if (status.toLowerCase() == "in progress") {
      return "label shadow-style bg-yellow text-black";
    } else if (status.toLowerCase() == "closed") {
      return "label shadow-style bg-green text-black";
    } else if (status.toLowerCase() == "open") {
      return "label shadow-style bg-blue text-black";
    } else {
      return "label shadow-style bg-orange text-black";
    }
  }


  getVehicleStatistics(pid: string, tid: string) {
    this.dataService
      .getVehicleStatistics(pid, tid)
      .subscribe((response: any) => {
        // console.log(response);
        if (response.status == "success") {
          this.vehicleStats = response.data;
        } else {
          this.message = response.message;
          return;
        }
      });
  }

  getTestById(id: string) {
    this.dataService.getTestById(id).subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.test = response.data;
      } else {
        this.message = response.message;
        return;
      }
    });
  }

  getProgramById(id: string) {
    this.dataService.getProgramById(id).subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.program = response.data;
      } else {
        this.message = response.message;
        return;
      }
    });
  }


  calculateInterval(yAxis: number[]) {
    if (yAxis) {
      var minVal = Math.min(...yAxis) > 10 ? Math.min(...yAxis) - 10 : Math.min(...yAxis);
      var maxVal = Math.max(...yAxis) + 10;

      var interval = (this.ceil5(maxVal) - this.floor5(minVal)) / 5;

      return this.ceil5(interval);
    }
  }

  floor5(x: number): number {
    return Math.floor(x / 5) * 5;
  }

  ceil5(x: number): number {
    return Math.ceil(x / 5) * 5;
  }

  gotopage(a) {
    this.router.navigate([a]);
  }

  captureScreen(name) {
    this.pdfLoading = true;
    this.htmlToPdf.captureScreen(name, "Durability Test Dashboard", this.pdfComplete);
  }

  pdfComplete = () => {
    this.pdfLoading = false;
  }
}
