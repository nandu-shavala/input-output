import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AppConstants } from 'src/app/const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MouseEvent, AgmMap } from "@agm/core";
import * as echarts from "echarts";
import { CommonService } from 'src/app/_helpers/common.service';

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: 'overall-progress',
  templateUrl: './overall-progress.component.html',
  styleUrls: ['./overall-progress.component.sass', '../durability.component.scss']
})

export class OverallProgressComponent implements OnInit {
  @Input() public vehicleStats: any;

  @ViewChild(AgmMap) public agmMap: AgmMap;

  vbChartYear_options: echarts.EChartOption;
  vbChartWeek_options: echarts.EChartOption;
  vbChartMonth_options: echarts.EChartOption;

  dcChartYear_options: echarts.EChartOption;
  dcChartWeek_options: echarts.EChartOption;
  dcChartMonth_options: echarts.EChartOption;


  appConstants: AppConstants = new AppConstants();
  textValue = "";
  data = [];
  CurrentPage = 1;
  TotalCount = 0;
  start = 0;
  length = this.appConstants.GRID_PAGE_LIMIT;
  order_column = "Issuecategory";
  order_by = "asc";
  search = "";
  reasonForBreakdownActions: any;

  vehicleLocation: any;
  reasonsForBrakdown: any;

  // google maps zoom level
  zoom: number = 10;

  // initial center position for the map
  lat: number = 12.87607;
  lng: number = 80.221322;


  message: any;

  constructor(
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private _commonService: CommonService
  ) {
    this.vbChartYear_options = {};
    this.vbChartWeek_options = {};
    this.vbChartMonth_options = {};

    this.loadVBChart();

    this.dcChartYear_options = {};
    this.dcChartWeek_options = {};
    this.dcChartMonth_options = {};

    this.loadDCChart();

    this.groupByReasonsForBreakdown();

    this.getReasonsForBreakdownActions();

  }

  loadVBChart() {
    this.dataService.loadVBChart().subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.vbChartYear_options = this._commonService.loadChartData(
          response.data.yearData,
          "No. of breakdowns",
          "Weeks",
          { top: "40", left: "35" },
          "#472d54"
        );
        this.vbChartMonth_options = this._commonService.loadChartData(
          response.data.monthData,
          "No. of breakdowns",
          "Days",
          { top: "40", left: "35" },
          "#472d54"
        );
        this.vbChartWeek_options = this._commonService.loadChartData(
          response.data.weekData,
          "No. of breakdowns",
          "Days",
          { top: "40", left: "35" },
          "#472d54"
        );
      } else {
        this.message = response.message;
        return;
      }
    });
  }

  loadDCChart() {
    this.dataService.loadDCChart().subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.dcChartYear_options = this._commonService.loadChartData(
          Object.assign({
            xAxis: response.data.yearData.xAxis,
            yAxis: [{
              name: "Distance Covered",
              type: 'line',
              data: response.data.yearData.yAxis[0],
              color: "#0F9D58"
            },
            {
              name: "Planned Kms",
              type: 'line',
              data: response.data.yearData.yAxis[1],
              color: "#535f6e"
            }]
          }, { unit: "Kms." }),
          "Distance Covered",
          "Weeks",
          { top: "40", left: "20" },
          "#365680",
          true
        );
        this.dcChartMonth_options = this._commonService.loadChartData(
          Object.assign({
            xAxis: response.data.monthData.xAxis,
            yAxis: [{
              name: "Distance Covered",
              type: 'line',
              data: response.data.monthData.yAxis[0],
              color: "#0F9D58"
            },
            {
              name: "Planned Kms",
              type: 'line',
              data: response.data.monthData.yAxis[1],
              color: "#535f6e"
            }]
          }, { unit: "Kms." }),
          "Distance Covered",
          "Days",
          { top: "40", left: "27" },
          "#365680",
          true
        );
        this.dcChartWeek_options = this._commonService.loadChartData(
          Object.assign({
            xAxis: response.data.weekData.xAxis,
            yAxis: [{
              name: "Distance Covered",
              type: 'line',
              data: response.data.weekData.yAxis[0],
              color: "#0F9D58"
            },
            {
              name: "Planned Kms",
              type: 'line',
              data: response.data.weekData.yAxis[1],
              color: "#535f6e"
            }]
          }, { unit: "Kms." }),
          "Distance Covered",
          "Days",
          { top: "40", left: "27" },
          "#365680",
          true
        );
      } else {
        this.message = response.message;
        return;
      }
    });
  }

  getImgPathForRFB(typeOfIssue) {
    return this._commonService.getImgPathForRFB(typeOfIssue)
  }

  getStatusStyle(status: string) {
    return this._commonService.getStatusStyle(status);
  }

  calcPercentWidth(percent) {
    return this._commonService.calcPercentWidth(percent);
  }

  removeTimeFromDateString(strDate: string) {
    return strDate.split(",")[0];
  }

  groupByReasonsForBreakdown() {
    this.dataService.groupByReasonsForBreakdown().subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.reasonsForBrakdown = response.data;
      } else {
        this.message = response.message;
        return;
      }
    });
  }

  overallSearch(event) {
    this.search = this.textValue;
    this.start = 0;
    this.length = this.appConstants.GRID_PAGE_LIMIT;
    this.order_column = "Issuecategory";
    this.order_by = "asc";
    this.getReasonsForBreakdownActions();

  }

  onSelect({ selected }) {
    // console.log(selected);
  }

  onSort(event) {
    // console.log(event.column.prop);
    // console.log(event.newValue);
    this.start = 0;
    this.order_column = event.column.prop;
    // this. = event.newValue;
    if (event.newValue == undefined) {
      this.order_by == "asc";
    }
    else {
      this.order_by = event.newValue;
    }
    this.getReasonsForBreakdownActions();
  }

  onFooterPage(event: any) {
    // console.log(event);
    //  this.length=(this.length*event.page)
    this.length = this.appConstants.GRID_PAGE_LIMIT;
    this.start = event.page * this.appConstants.GRID_PAGE_LIMIT - this.appConstants.GRID_PAGE_LIMIT;
    this.getReasonsForBreakdownActions();
  }

  getReasonsForBreakdownActions() {
    this.dataService
      .getReasonsForBreakdownActions({
        start: this.start,
        length: this.length,
        order_column: this.order_column,
        order_by: this.order_by,
        search: this.search
      })
      .subscribe((response: any) => {
        // console.log(response);
        if (response.status == "success") {
          this.reasonForBreakdownActions = response.data[0].list;
          this.data = response.data[0].list;
          this.TotalCount = response.data[0].count;
          // alert(response.data[0].count)
          this.getReasonsForBreakdownactionByChno(response.data[0].list[0].chassisino)
          console.log(this.reasonForBreakdownActions);
        } else {
          this.message = response.message;
          return;
        }
      });
  }

  locate(event) {
    if (event.target.value)
      this.getReasonsForBreakdownactionByChno(event.target.value);
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true,
    });
  }

  getReasonsForBreakdownactionByChno(chno: string) {
    this.dataService
      .getReasonsForBreakdownactionByChno(chno)
      .subscribe((response: any) => {
        // console.log(response);
        if (response.status == "success") {
          if (response.data) {
            this.vehicleLocation = response.data;
            if (response.data.latitude && response.data.longitude)
              this.recenterMap(response.data.latitude, response.data.longitude)
            else {
              this.openMapSnackBar("Location details not available in the databse for the given vehicle")
              this.vehicleLocation = null;
            }
          } else {
            this.openMapSnackBar("Vehicle details not available in the databse")
            this.vehicleLocation = null;
          }
        } else {
          this.message = response.message;
          return;
        }
      });
  }

  recenterMap = (lt, lg) => {
    this.lat = Number(lt);
    this.lng = Number(lg);
  };

  openMapSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      verticalPosition: "bottom",
      horizontalPosition: "right",
      panelClass: ["bg-gray"],
    });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }



  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log("dragEnd", m, $event);
  }

  markers: marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: "A",
      draggable: true,
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: "B",
      draggable: false,
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: "C",
      draggable: true,
    },
  ];

  getImage(user) {
    return this._commonService.getImage(user);
  }

  ngOnInit(): void {
  }

}
