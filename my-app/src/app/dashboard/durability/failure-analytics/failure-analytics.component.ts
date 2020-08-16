import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/_helpers/common.service';
import { AppConstants } from 'src/app/const';
import { ActivatedRoute } from '@angular/router';
import { AppSettings } from 'src/app/global';

@Component({
  selector: 'failure-analytics',
  templateUrl: './failure-analytics.component.html',
  styleUrls: ['./failure-analytics.component.sass', '../durability.component.scss']
})
export class FailureAnalyticsComponent implements OnInit {

  @Input() public vehicleStats: any;
  testId: string = "";
  programId: string = "";

  public pieChartOptions: Highcharts.Options;
  _Highcharts: typeof Highcharts = Highcharts; // required

  failureChartYear_options: echarts.EChartOption;
  failureChartWeek_options: echarts.EChartOption;
  failureChartMonth_options: echarts.EChartOption;

  mtbfChartYear_options: echarts.EChartOption;
  mtbfChartWeek_options: echarts.EChartOption;
  mtbfChartMonth_options: echarts.EChartOption;

  mttrChartYear_options: echarts.EChartOption;
  mttrChartWeek_options: echarts.EChartOption;
  mttrChartMonth_options: echarts.EChartOption;

  breakdownVehicles: any;
  failureTypeActions: any;

  appConstants: AppConstants = new AppConstants();

  Failure_Data = [];
  // CurrentPage = 1;
  Failure_TotalCount = 0;
  Failure_start = 0;
  Failure_length = this.appConstants.GRID_PAGE_LIMIT;
  Failure_order_column = "ActionId";
  Failure_order_by = "asc";
  search2 = "";
  textValue2 = "";

  message: any;

  BASE_URL = AppSettings.BASE_URL;

  constructor(
    private dataService: DataService,
    private _commonService: CommonService,
    private route: ActivatedRoute,
  ) {

    this.testId = this.route.snapshot.paramMap.get("tid");
    this.programId = this.route.snapshot.paramMap.get("pid");

    if (this.testId)
      this.loadFailureTypeChart();

    this.failureChartYear_options = {};
    this.failureChartWeek_options = {};
    this.failureChartMonth_options = {};

    this.mtbfChartYear_options = {};
    this.mtbfChartWeek_options = {};
    this.mtbfChartMonth_options = {};

    this.mttrChartYear_options = {};
    this.mttrChartWeek_options = {};
    this.mttrChartMonth_options = {};
    this.loadTrendChart();

    this.groupByBreakdownVehicles();
    this.getFailureTypeActions();

  }

  loadFailureTypeChart() {
    const formData = {
      test_id: this.testId,
    };
    // this.dataService.loadFailureTypeChart()
    this.dataService
      .failure_types_chart({
        formData,
      })
      .subscribe((response: any) => {
        console.log(response);
        if (response.status == "success") {
          this.loadFailureTypeChartData(response.data);
          console.log(response.data)
        } else {
          this.message = response.message;
          return;
        }
      });
  }

  loadFailureTypeChartData(data) {
    let total = data.series.map(item => item.value).reduce((prev, next) => prev + next);
    let pieSeries = data.series.map((s, i) => { return { name: s.name, y: s.value } });
    this.pieChartOptions = ({
      colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, color],
            [1, Highcharts.color(color).brighten(-0.6).get('rgb')] // darken
          ]
        };
      }),
      chart: {
        events: {
          load: function () {
            var seriesElPos = this["seriesGroup"].getBBox();

            this.title.attr({
              y: seriesElPos.height / 2 + seriesElPos.y + 25
            });
          }
        }
      },
      title: {
        text: `<div style="text-align: center !important"><b style="font-size: 13px">
        ${total}
        </b><br>Failures</div>`,
        useHTML: true,
        verticalAlign: 'middle',
        y: -25,
        style: {
          "fontSize": "10px"
        }
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 10,
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      legend: {
        labelFormatter: function () {
          // console.log(this);
          return this.name + " (" + this["percentage"].toFixed(1) + "%)";
        }
      },
      plotOptions: {
        pie: {
          center: ['50%', '50%'],
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}',
            connectorColor: '#000'
          },
          showInLegend: true,
          shadow: {
            width: 10,
            offsetX: 1,
            offsetY: 1,
            opacity: 0.05
          },
          borderWidth: 3
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        type: "pie",
        name: 'Failure Types',
        data: pieSeries,
        innerSize: '60%',
      }]
    }) as Highcharts.Options
  }

  loadTrendChart() {
    this.dataService.loadTrendChart().subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.failureChartYear_options = this._commonService.loadChartData(
          {
            xAxis: response.data.yearData.xAxis,
            yAxis: response.data.yearData.nooffailures,
          },
          "No. of failures",
          "Weeks",
          { top: "40", left: "35" },
          "#0F9D58"
        );
        this.failureChartMonth_options = this._commonService.loadChartData(
          {
            xAxis: response.data.monthData.xAxis,
            yAxis: response.data.monthData.nooffailures,
          },
          "No. of failures",
          "Days",
          { top: "40", left: "35" },
          "#0F9D58"
        );
        this.failureChartWeek_options = this._commonService.loadChartData(
          {
            xAxis: response.data.weekData.xAxis,
            yAxis: response.data.weekData.nooffailures,
          },
          "No. of failures",
          "Days",
          { top: "40", left: "35" },
          "#0F9D58"
        );

        this.mtbfChartYear_options = this._commonService.loadChartData(
          {
            xAxis: response.data.yearData.xAxis,
            yAxis: response.data.yearData.MTBF,
            unit: "Days"
          },
          "MTBF",
          "Weeks",
          { top: "40", left: "35" },
          "#5950a1"
        );
        this.mtbfChartMonth_options = this._commonService.loadChartData(
          {
            xAxis: response.data.monthData.xAxis,
            yAxis: response.data.monthData.MTBF,
            unit: "Days"
          },
          "MTBF",
          "Days",
          { top: "40", left: "35" },
          "#5950a1"
        );
        this.mtbfChartWeek_options = this._commonService.loadChartData(
          {
            xAxis: response.data.weekData.xAxis,
            yAxis: response.data.weekData.MTBF,
            unit: "Days"
          },
          "MTBF",
          "Days",
          { top: "40", left: "35" },
          "#5950a1"
        );

        this.mttrChartYear_options = this._commonService.loadChartData(
          {
            xAxis: response.data.yearData.xAxis,
            yAxis: response.data.yearData.MTTR,
            unit: "Hours"
          },
          "MTTR",
          "Weeks",
          { top: "40", left: "35" },
          "#3e6c70"
        );
        this.mttrChartMonth_options = this._commonService.loadChartData(
          {
            xAxis: response.data.monthData.xAxis,
            yAxis: response.data.monthData.MTTR,
            unit: "Hours"
          },
          "MTTR",
          "Days",
          { top: "40", left: "35" },
          "#3e6c70"
        );
        this.mttrChartWeek_options = this._commonService.loadChartData(
          {
            xAxis: response.data.weekData.xAxis,
            yAxis: response.data.weekData.MTTR,
            unit: "Hours"
          },
          "MTTR",
          "Days",
          { top: "40", left: "35" },
          "#3e6c70"
        );
      } else {
        this.message = response.message;
        return;
      }
    });
  }

  groupByBreakdownVehicles() {
    const formData = {
      test_id: this.testId,
    };
    this.dataService
      .reasonsforbreakdownactiongroup({
        formData,
      })
      // this.dataService.groupByBreakdownVehicles()
      .subscribe((response: any) => {
        // console.log(response);
        if (response.status == "success") {
          this.breakdownVehicles = response.data;
        } else {
          this.message = response.message;
          return;
        }
      });
  }

  getFailureTypeActions() {
    this.dataService
      .getFailureTypeActions({
        start: this.Failure_start,
        length: this.Failure_length,
        order_column: this.Failure_order_column,
        order_by: this.Failure_order_by,
        search: this.search2
      })
      .subscribe((response: any) => {
        // console.log(response);
        if (response.status == "success") {
          this.failureTypeActions = response.data[0].list;
          this.Failure_Data = response.data[0].list;
          this.Failure_TotalCount = response.data[0].count;
        } else {
          this.message = response.message;
          return;
        }
      });
  }

  Failure_onSort(event) {
    this.Failure_order_column = event.column.prop;
    // this. = event.newValue;
    if (event.newValue == undefined) {
      this.Failure_order_by == "asc";
    }
    else {
      this.Failure_order_by = event.newValue;
    }
    this.getFailureTypeActions();
  }


  Failure_onSelect({ selected }) {
    // console.log(selected);
  }


  failurefilterDatatable(event) {
    // console.log(this.textValue2);
    // alert(this.textValue2);
    this.search2 = this.textValue2;
    this.getFailureTypeActions();
  }


  Failure_onFooterPage(event: any) {
    // console.log(event);
    //  this.length=(this.length*event.page)
    this.Failure_length = this.appConstants.GRID_PAGE_LIMIT;
    this.Failure_start = event.page * this.appConstants.GRID_PAGE_LIMIT - this.appConstants.GRID_PAGE_LIMIT;
    this.getFailureTypeActions();
  }

  overallSearch(event) {
    this.search2 = this.textValue2;
    this.Failure_start = 0;
    this.Failure_length = this.appConstants.GRID_PAGE_LIMIT;
    this.Failure_order_column = "Issuecategory";
    this.Failure_order_by = "asc";
    this.getFailureTypeActions();

  }

  getImage(user) {
    return this._commonService.getImage(user);
  }

  getStatusStyle(status: string) {
    return this._commonService.getStatusStyle(status);
  }

  calcPercentWidth(percent) {
    return this._commonService.calcPercentWidth(percent);
  }

  getSumOfFailureTypes(breakdownVehicles) {
    return breakdownVehicles.reduce((a, b) => a + (b["Failurepercent"] || 0), 0)
  }

  ngOnInit(): void {
  }

}
