import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AppConstants } from 'src/app/const';
import { CommonService } from 'src/app/_helpers/common.service';

@Component({
  selector: 'speed-analytics',
  templateUrl: './speed-analytics.component.html',
  styleUrls: ['./speed-analytics.component.sass', '../durability.component.scss']
})
export class SpeedAnalyticsComponent implements OnInit {

  @Input() public vehicleStats: any;

  overSpeedVehicle: any;
  message: any;
  appConstants: AppConstants = new AppConstants();
  overSpeedVehicleActions: any;

  speedData = [];
  // CurrentPage = 1;
  speedTotalCount = 0;
  speedstart = 0;
  speedlength = this.appConstants.GRID_PAGE_LIMIT;
  speedorder_column = "Issuecategory";
  speedorder_by = "asc";
  search1 = "";
  textValue1 = "";

  constructor(
    private dataService: DataService,
    private _commonService: CommonService
  ) {
    this.groupByOverSpeedVehicle();
    this.getOverspeedVehicleActions();
  }

  ngOnInit(): void {
  }

  groupByOverSpeedVehicle() {
    this.dataService.groupByOverSpeedVehicle().subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.overSpeedVehicle = response.data;
      } else {
        this.message = response.message;
        return;
      }
    });
  }

  getOverspeedVehicleActions() {
    this.dataService
      .getOverspeedVehicleActions({
        start: this.speedstart,
        length: this.speedlength,
        order_column: this.speedorder_column,
        order_by: this.speedorder_by,
        search: this.search1
      })
      .subscribe((response: any) => {
        // console.log(response);
        if (response.status == "success") {
          this.overSpeedVehicleActions = response.data[0].list;
          this.speedData = response.data[0].list;
          // console.log(response.data[0].list);
          this.speedTotalCount = response.data[0].count;
        } else {
          this.message = response.message;
          return;
        }
      });
  }

  speedonSort(event) {
    // console.log(event.column.prop);
    // console.log(event.newValue);
    this.speedstart = 0;
    this.speedorder_column = event.column.prop;
    if (event.newValue == undefined) {
      this.speedorder_by == "asc";
    }
    else {
      this.speedorder_by = event.newValue;
    }
    this.getOverspeedVehicleActions();
  }
  speedonSelect({ selected }) {
    // console.log(selected);
  }


  filterDatatable(event) {
    // console.log(this.textValue1);
    // alert(this.textValue1);
    this.search1 = this.textValue1;
    this.getOverspeedVehicleActions();
  }



  speedonFooterPage(event: any) {
    // console.log(event);
    //  this.length=(this.length*event.page)
    this.speedlength = this.appConstants.GRID_PAGE_LIMIT;
    this.speedstart = event.page * this.appConstants.GRID_PAGE_LIMIT - this.appConstants.GRID_PAGE_LIMIT;
    this.getOverspeedVehicleActions();
  }

  getStatusStyle(status: string) {
    return this._commonService.getStatusStyle(status);
  }

  calcPercentWidth(percent) {
    return this._commonService.calcPercentWidth(percent);
  }

  getImgPathForOSD(typeOfIssue) {
    return this._commonService.getImgPathForOSD(typeOfIssue);
  }

  getImage(user) {
    return this._commonService.getImage(user);
  }

}
