import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { DialogformComponent } from './dialogform/dialogform.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common'
import * as moment from 'moment';
import {
  ChartComponent, ApexAxisChartSeries, ApexTitleSubtitle, ApexDataLabels, ApexFill, ApexMarkers, ApexYAxis, ApexXAxis, ApexTooltip, ApexStroke, ApexAnnotations
} from "ng-apexcharts";
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AppConstants } from 'src/app/const';
import { HtmlToPdf } from 'src/app/htmlToPdf';
import { AppSettings } from 'src/app/global';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/_helpers/common.service';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: any; //ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  grid: any; //ApexGrid;
  colors: any;
  toolbar: any;
  annotations: any;
};

@Component({
  selector: 'app-vehicle-dashboard',
  templateUrl: './vehicle-dashboard.component.html',
  styleUrls: ['./vehicle-dashboard.component.scss']
})
export class VehicleDashboardComponent implements OnInit {
  rbaid: string;
  programId: string;
  testId: string;
  ftId: string;
  chno: string;
  program: any;
  test: any;
  vehicleFailure: any;
  reasonForBreakdownActions: any;
  message: "";
  startDateVal: Date;
  endDateVal: Date;

  public fname: string = 'John';
  public lname: string = 'Deo';
  public addCusForm: FormGroup;

  firstName: string;
  lastName: string;
  dialogConfig: MatDialogConfig;
  sspgridLoading: false;
  appConstants: AppConstants = new AppConstants();
  htmlToPdf: HtmlToPdf = new HtmlToPdf();

  nullPlaceholder: string;

  @ViewChild("chart", { static: true }) chart: ChartComponent;

  @ViewChildren('apxchart') apxcharts: QueryList<ElementRef>;

  // public chart1options: Partial<ChartOptions>;
  // public chart2options: Partial<ChartOptions>;
  // public chart3options: Partial<ChartOptions>;
  // public chart4options: Partial<ChartOptions>;
  // public chart5options: Partial<ChartOptions>;

  public commonOptions: Partial<ChartOptions> = {
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "straight"
    },
    toolbar: {
      tools: {
        selection: false
      }
    },
    markers: {
      size: 0,
      hover: {
        size: 6
      }
    },
    tooltip: {
      followCursor: false,
      theme: "light",
      x: {
        show: false
      },
      marker: {
        show: false
      },
      y: {
        title: {
          formatter: function (series) {
            return "";
          }
        }
      },
    },
    grid: {
      clipMarkers: false
    }
  };
  vehicleFailures: any;

  vehicleActions: [];
  CurrentPage = 1;
  vehicleTotalCount = 0;
  vehiclestart = 0;
  vehiclelength = this.appConstants.GRID_PAGE_LIMIT;
  vehicleordercolumn = "chassisno";
  vehicleorderby = "asc";
  search = "";
  textValue = "";
  vehicleChassisNo = "";

  subSystemPerformance: any;
  commonParams: any[] = [];
  baselineYield: any;
  showDateRange: boolean;
  chartValues: any;
  selectedParamGroup: any[];
  xParams: { parameter: string; type: string; unit: string; order: number; assignable: string; }[];
  yParams: { parameter: string; type: string; unit: string; order: number; assignable: string; }[];

  graphColors: string[];
  pdfLoading: boolean = false;
  paramList: any[];
  gridValues: {};
  constructor(private dialogModel: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dataService: DataService,
    public datepipe: DatePipe,
    private _snackBar: MatSnackBar,
    private _commonService: CommonService
  ) {
    this.programId = this.route.snapshot.paramMap.get('pid');
    this.testId = this.route.snapshot.paramMap.get('tid');
    this.rbaid = this.route.snapshot.paramMap.get('rbaid');

    this.getProgramById(this.programId);
    this.getTestById(this.testId);
    this.getVehicleDetailsByRbaId(this.rbaid);

    this.showDateRange = false;

    // this.yParams = [
    //   { parameter: 'Battery Voltage', type: 'Input', unit: "Volts", order: 1, assignable: "xy" },
    //   { parameter: 'Starter Voltage', type: 'Input', unit: "Volts", order: 2, assignable: "xy" },
    //   { parameter: 'Starter Current', type: 'Output', unit: "Amps", order: 3, assignable: "xy" },
    //   { parameter: 'Engine Speed', type: 'Output', unit: "RPM", order: 4, assignable: "xy" },
    //   { parameter: 'Time to Start', type: 'Output', unit: "Seconds", order: 5, assignable: "xy" }
    // ]

    this.xParams = [
      { parameter: 'Period', type: 'Time', unit: "Seconds", order: 0, assignable: "x" }
    ]

    this.graphColors = ["#000080", "#0047ab", "#003366", "#4b0082", "#27314a", "#183e40", "#000036", "#0283b3", "#023db3", "#703aa6"]


    this.nullPlaceholder = "-";
  }

  ngOnInit(): void {
    this.addCusForm = this.fb.group({
      IdProof: null,
      firstname: [this.fname, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      lastname: [this.lname, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      email: [null, [Validators.required, Validators.email]],
    });
  }

  openSnackBar(message: string, duration: number = 2000) {
    this._snackBar.open(message, "", {
      duration: duration,
      verticalPosition: "bottom",
      horizontalPosition: "right",
      panelClass: ["bg-gray"],
    });
  }

  captureScreen(name) {
    this.pdfLoading = true;
    this.htmlToPdf.captureScreen(name, "Vehicle Sub System Performance Dashborad", this.pdfComplete);
  }

  pdfComplete = () => {
    this.pdfLoading = false;
  }

  getVehicleFailureByChno(chno: string) {
    this.dataService.getVehicleFailureByChno(chno).subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.reasonForBreakdownActions = response.data;
      }
      else {
        this.message = response.message
        return;
      }
    })
  }

  getVehicleDetailsByRbaId(rbaId: string) {
    this.dataService.getVehicleDetailsByRbaId(rbaId).subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.vehicleFailure = response.data;
        if (response.data) {
          response.data.failureimage = AppSettings.BASE_URL + response.data.failureimage;
          this.vehicleChassisNo = response.data.ChassisNo;
          this.ftId = response.data.failureTypeId;
          this.getParamsByFtId(this.ftId)
          this.getVehicleActionsByChno(response.data.ChassisNo)
        }
        else {
          this.vehicleActions = []
        }
      }
      else {
        this.message = response.message
        return;
      }
    })
  }

  Failure_onFooterPage(event: any) {
    // console.log(event);
    //  this.length=(this.length*event.page)
    this.vehiclelength = this.appConstants.GRID_PAGE_LIMIT;
    this.vehiclestart = event.page * this.appConstants.GRID_PAGE_LIMIT - this.appConstants.GRID_PAGE_LIMIT;
    this.getVehicleActionsByChno(this.vehicleChassisNo);
  }


  overallSearch(event) {
    this.search = this.textValue;
    this.vehiclestart = 0;
    this.vehiclelength = this.appConstants.GRID_PAGE_LIMIT;
    this.vehicleordercolumn = "chassisno";
    this.vehicleorderby = "asc";
    this.getVehicleActionsByChno(this.vehicleChassisNo);

  }

  vehicle_onSort(event) {
    // console.log(event.column.prop);
    // console.log(event.newValue);
    this.vehiclestart = 0;
    this.vehicleordercolumn = event.column.prop;
    // this. = event.newValue;
    if (event.newValue == undefined) {
      this.vehicleorderby == "asc";
    }
    else {
      this.vehicleorderby = event.newValue;
    }
    this.getVehicleActionsByChno(this.vehicleChassisNo);
  }

  vehicle_onSelect({ selected }) {
    // console.log(selected);
  }


  getParamsByFtId(ftId: string) {
    this.dataService.getParamsByFtId(ftId)
      .subscribe((response: any) => {
        // console.log(response.data);
        if (response.status == "success") {
          if (response.data.length > 0) {
            this.yParams = response.data;
            this.paramList = response.data;
            this.subSystemPreformanceGrid(0, "", "");
          }

          else {
            this.yParams = [];
            this.paramList = [];
          }

        }
        else {
          this.message = response.message
          return;
        }
      })
  }

  getVehicleActionsByChno(chno: string) {
    this.dataService.getVehicleActionsByChno
      ({
        chassisno: chno,
        start: this.vehiclestart,
        length: this.vehiclelength,
        order_column: this.vehicleordercolumn,
        order_by: this.vehicleorderby,
        search: this.search
      })
      .subscribe((response: any) => {
        // console.log(response.data[0].list);
        if (response.status == "success") {
          this.vehicleActions = response.data[0].list;
          this.vehicleTotalCount = response.data[0].count;
        }
        else {
          this.message = response.message
          return;
        }
      })
  }

  getTestById(id: string) {
    this.dataService.getTestById(id).subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.test = response.data;
      }
      else {
        this.message = response.message
        return;
      }
    })
  }

  getProgramById(id: string) {
    this.dataService.getProgramById(id).subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        let program = response.data
        program.programImage = AppSettings.BASE_URL + program.programImage
        this.program = program;
      }
      else {
        this.message = response.message
        return;
      }
    })
  }

  selectedIndexChange(index: number) {
    if (index == 3) {
      this.startDateVal = null;
      this.endDateVal = null;
      this.showDateRange = true;
    }
    else {
      this.showDateRange = false;
      this.subSystemPreformanceGrid(index);
    }
  }

  subSystemPreformanceGrid(type = 0, startDate = "", endDate = "") {



    let isValid = true;

    if (!this.vehicleChassisNo || !this.ftId)
      isValid = false

    if (type == 3) {
      if (startDate == "" && endDate == "") {
        this.openSnackBar("Dates are not selected");
        isValid = false
      }
      else if (startDate == "") {
        this.openSnackBar("Start Date is not selected");
        isValid = false
      }
      else if (endDate == "") {
        this.openSnackBar("End Date is not selected");
        isValid = false
      }
      else if (this.startDateVal > this.endDateVal) {
        this.openSnackBar("End Date cannot be lesser than Start Date");
        isValid = false
      }
    }

    if (isValid) {
      this.dataService.subSystemPreformanceGrid(type, startDate, endDate, this.vehicleChassisNo, this.ftId).subscribe((response: any) => {
        // console.log(response);
        if (response.status == "success") {
          if (response.data.commonparams.length <= 0 && response.message != "Success") {
            this.openSnackBar(response.message, 5000);
          }
          else if (response.data.commonparams.length <= 0) {
            this.openSnackBar("Sub System Performance data not available");
          }

          this.subSystemPerformance = response.data.subsystemperformance;
          this.commonParams = response.data.commonparams;
          this.baselineYield = response.data.baselineyield;
          this.applyGridValues();
          this.initCharts();
          this.applyChartValues(this.commonParams.length - 1, "BATTERYVOLTAGE")

        }
        else {
          this.message = response.message
          return;
        }
      })
    }
  }

  getSpecLimit(parameter: string) {
    var obj = this.subSystemPerformance.filter(x => x.parameters == parameter)[0];
    return obj.lcl + " to " + obj.ucl;
  }

  getMin(parameter: string) {
    var obj = this.subSystemPerformance.filter(x => x.parameters == parameter)[0];
    let lowestVal = this.lowestValue(parameter);
    if (lowestVal <= obj.lcl)
      return undefined
    return obj.lcl;
  }

  getMax(parameter: string) {
    var obj = this.subSystemPerformance.filter(x => x.parameters == parameter)[0];
    let peakVal = this.peakValue(parameter);
    if (peakVal >= obj.ucl)
      return undefined
    return obj.ucl;
  }

  getLCL(parameter: string) {
    var obj = this.subSystemPerformance.filter(x => x.parameters == parameter)[0];
    return obj.lcl;
  }

  getUCL(parameter: string) {
    var obj = this.subSystemPerformance.filter(x => x.parameters == parameter)[0];
    return obj.ucl;
  }

  getParamTypeLength(parameter: any, list: any[]) {
    return list.filter(a => a.type == parameter.type).length;
  }

  selectParamGroup(yParams, xParams) {

    let params: any[] = []
    let idx = 1;
    yParams.forEach((param) => {
      let obj = Object.assign({}, param);
      obj.chartOptions = this.commonParams.length > 0 ? this.getChartOptionsByParam(param.parameter, xParams[0].parameter, this.getParamCol(param.parameter), idx++, param.unit) : {}
      params.push(obj);
    })

    this.selectedParamGroup = params;
  }


  getParamCol(param: string) {
    var param_col = "";
    switch (param) {
      case "Battery Voltage":
        param_col = "BATTERYVOLTAGE"
        break;
      case "Starter Voltage":
        param_col = "STARTERVOLTAGE"
        break;
      case "Starter Current":
        param_col = "STARTERCURRENT"
        break;
      case "Engine Speed":
        param_col = "ENGINESPEED"
        break;
      case "Time to Start":
        param_col = "TIMETOSTART"
        break;
      default:
        break;
    }

    return param_col
  }

  applyGridValues() {
    if (this.commonParams.length <= 0) {
      this.gridValues = {};
      return;
    }

    let params = this.paramList.map(a => a.parameter);
    var arr = params.map((p, i) => {
      let paramCol = this.getParamCol(p);

      return {
        "param": p,
        "data": {
          "specLimit": this.getSpecLimit(p),
          "lowestValue": this.lowestValueObject(p),
          "peakValue": this.peakValueObject(p),
          "belowLCL": this.belowLCL(p),
          "withinSpec": this.withinSpec(p),
          "aboveUCL": this.aboveUCL(p),
          "initialPerformance": this.initialPerformanceObject(p),
          "finalPerformance": this.finalPerformanceObject(p),
          "deviationFromSpecification": this.deviationFromSpecification(p),
          "deviationFromStdAvg": this.deviationFromStdAvg(p)
        }
      }
    })

    let gridValues = arr.reduce(function (map, obj) {
      map[obj["param"]] = obj["data"];
      return map;
    }, {});

    this.gridValues = gridValues;
  }

  lowestValue(parameter: string) {
    if (this.commonParams.length <= 0)
      return ""
    let paramCol = this.getParamCol(parameter);
    let minVal = Math.min.apply(Math, this.commonParams.map(function (o) {
      return o[paramCol];
    }))
    return minVal;
  }

  lowestValueObject(parameter: string) {
    if (this.commonParams.length <= 0)
      return ""
    let paramCol = this.getParamCol(parameter);
    var result = this.commonParams.reduce(function (res, obj) {
      return (obj[paramCol] < res[paramCol]) ? obj : res;
    });

    return {
      "hasPoint": this.ltLCLgtUCL(parameter, result[paramCol]),
      "value": result[paramCol],
      "xValue": this.xParams[0].parameter == "Period" ? result["TimeStamp"] : result[this.getParamCol(this.xParams[0].parameter)]
    };
  }

  ltLCLgtUCL(parameter, val) {
    let { lcl, ucl } = this.subSystemPerformance.filter(x => x.parameters == parameter)[0];
    return val < lcl || val > ucl
  }

  peakValue(parameter: string) {
    if (this.commonParams.length <= 0)
      return ""
    let paramCol = this.getParamCol(parameter);
    let minVal = Math.max.apply(Math, this.commonParams.map(function (o) {
      return o[paramCol];
    }))
    return minVal;
  }

  peakValueObject(parameter: string) {
    if (this.commonParams.length <= 0)
      return ""
    let paramCol = this.getParamCol(parameter);
    var result = this.commonParams.reduce(function (res, obj) {
      return (obj[paramCol] > res[paramCol]) ? obj : res;
    });

    return {
      "hasPoint": this.ltLCLgtUCL(parameter, result[paramCol]),
      "value": result[paramCol],
      "xValue": this.xParams[0].parameter == "Period" ? result["TimeStamp"] : result[this.getParamCol(this.xParams[0].parameter)]
    };
  }

  belowLCL(parameter: string) {
    if (this.commonParams.length <= 0)
      return ""
    let lcl = this.subSystemPerformance.filter(x => x.parameters == parameter)[0].lcl;
    let paramCol = this.getParamCol(parameter);
    let belowLCLCount = this.commonParams.filter(x => x[paramCol] < lcl).length
    return belowLCLCount;
  }

  withinSpec(parameter: string) {
    if (this.commonParams.length <= 0)
      return ""
    let { lcl, ucl } = this.subSystemPerformance.filter(x => x.parameters == parameter)[0];
    let paramCol = this.getParamCol(parameter);
    let withinSpecCount = this.commonParams.filter(x => x[paramCol] >= lcl && x[paramCol] <= ucl).length
    return withinSpecCount;
  }

  aboveUCL(parameter: string) {
    if (this.commonParams.length <= 0)
      return ""
    let UCL = this.subSystemPerformance.filter(x => x.parameters == parameter)[0].ucl;
    let paramCol = this.getParamCol(parameter);
    let belowLCLCount = this.commonParams.filter(x => x[paramCol] > UCL).length
    return belowLCLCount;
  }

  initialPerformance(parameter: string) {
    if (this.commonParams.length <= 0)
      return ""
    let paramCol = this.getParamCol(parameter);
    let initialPerformanceVal = this.commonParams[0][paramCol];
    return initialPerformanceVal;
  }

  initialPerformanceObject(parameter: string) {
    if (this.commonParams.length <= 0)
      return {}
    let paramCol = this.getParamCol(parameter);
    let result = this.commonParams[0];
    return {
      "hasPoint": this.ltLCLgtUCL(parameter, result[paramCol]),
      "value": result[paramCol],
      "xValue": this.xParams[0].parameter == "Period" ? result["TimeStamp"] : result[this.getParamCol(this.xParams[0].parameter)]
    };
  }

  finalPerformance(parameter: string) {
    if (this.commonParams.length <= 0)
      return ""
    let paramCol = this.getParamCol(parameter);
    let finalPerformanceVal = this.commonParams.slice(-1)[0][paramCol];
    return finalPerformanceVal;
  }

  finalPerformanceObject(parameter: string) {
    if (this.commonParams.length <= 0)
      return ""
    let paramCol = this.getParamCol(parameter);
    let result = this.commonParams.slice(-1)[0];
    return {
      "hasPoint": this.ltLCLgtUCL(parameter, result[paramCol]),
      "value": result[paramCol],
      "xValue": this.xParams[0].parameter == "Period" ? result["TimeStamp"] : result[this.getParamCol(this.xParams[0].parameter)]
    };
  }

  deviationFromSpecification(parameter: string) {
    if (this.commonParams.length <= 0)
      return "0"
    let paramCol = this.getParamCol(parameter);
    // let sumofparam = this.commonParams.reduce((a, b) => a + (b[paramCol] || 0), 0) / this.commonParams.length;
    let finalPerf = this.finalPerformance(parameter);
    let { lcl, ucl } = this.subSystemPerformance.filter(x => x.parameters == parameter)[0];
    if (finalPerf < lcl) {
      return (((finalPerf - lcl) / lcl) * 100).toFixed(0);
    } else if (finalPerf > ucl) {
      return (((finalPerf - ucl) / ucl) * 100).toFixed(0);
    }
    return 0
  }

  deviationFromSpecificationWithActualValue(parameter: string, actualValue: number) {
    if (this.commonParams.length <= 0)
      return "0"
    let { lcl, ucl } = this.subSystemPerformance.filter(x => x.parameters == parameter)[0];
    if (actualValue < lcl) {
      return (((actualValue - lcl) / lcl) * 100).toFixed(0);
    } else if (actualValue > ucl) {
      return (((actualValue - ucl) / ucl) * 100).toFixed(0);
    }
    return 0
  }

  deviationFromStdAvg(parameter: string) {
    if (this.commonParams.length <= 0)
      return "0"
    let paramCol = this.getParamCol(parameter);
    // let sumofparam = this.commonParams.reduce((a, b) => a + (b[paramCol] || 0), 0) / this.commonParams.length;
    let finalPerf = this.finalPerformance(parameter);
    let baseline = this.baselineYield[paramCol];
    return (((finalPerf - baseline) / baseline) * 100).toFixed(0);
  }

  deviationFromStdAvgWithActualValue(parameter: string, actualValue: number) {
    if (this.commonParams.length <= 0)
      return "0"
    let paramCol = this.getParamCol(parameter);
    let baseline = this.baselineYield[paramCol];
    return (((actualValue - baseline) / baseline) * 100).toFixed(0);
  }

  subSystemPerfFilter() {
    let startDate = this.datepipe.transform(this.startDateVal, 'yyyy-MM-dd') ?? ""
    let endDate = this.datepipe.transform(this.endDateVal, 'yyyy-MM-dd') ?? ""
    this.subSystemPreformanceGrid(3, startDate, endDate);
  }


  getStatusStyle(status: string) {
    if (status.toLowerCase() == "in progress") {
      return "label shadow-style bg-yellow text-black"
    }
    else if (status.toLowerCase() == "closed") {
      return "label shadow-style bg-green text-black"
    }
    else if (status.toLowerCase() == "open") {
      return "label shadow-style bg-blue text-black"
    }
    else {
      return "label shadow-style bg-orange text-black"
    }
  }

  openDialog(): void {
    const doc = document.documentElement;
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    if (top != 0 || left != 0) {
      window.scrollTo({
        top: 0,
        left: 0
      });
    }

    const dialogRef = this.dialogModel.open(DialogformComponent, {
      width: '60%', disableClose: true, data: { yParams: this.yParams, xParams: this.xParams, paramList: this.paramList }
    }).afterClosed()
      .subscribe(selectedParams => {
        if (top != 0 || left != 0) {
          window.scroll({
            top: top,
            left: left,
            behavior: "smooth"
          });
        }
        if (selectedParams) {
          this.yParams = selectedParams.yParams;
          this.xParams = selectedParams.xParams;
          this.applyGridValues();
          this.initCharts();
        }
      });
  }

  isParamSelected(parameter: string) {
    return this.yParams.some(obj => obj.parameter == parameter)
  }

  getChartOptionsByParam(yParam: string, xParam: string, chartName = "", index: number = 0, unit = "") {

    var xaxis = {
      type: xParam == "Period" ? "datetime" : "numeric",
      labels: {
        datetimeUTC: false,
        show: true
      },
      title: {
        text: xParam,
        offsetY: 13,
        style: {
          fontFamily: "SF",
          color: "#000"
        }
      },
    }
    return ({
      series: [
        {
          name: chartName,
          data: this.getSeriesByParam(yParam, xParam)
        }
      ],
      chart: {

        id: chartName,
        group: "social",
        type: "area",
        height: 230,
        events: {
          mouseMove: (event, chartContext, config) => {
            this.applyChartValues(config.dataPointIndex, config.globals.chartID)
          },
          // mounted: (chartContext) => {
          //   if (chartContext) {
          //     chartContext.w.globals.selectedDataPoints.push(10)
          //   }
          // }
        }
      },
      colors: [typeof this.graphColors[index] ? this.graphColors[index] : "#2d7aed"],
      yaxis: {
        tickAmount: 2,
        min: this.getMin(yParam),
        max: this.getMax(yParam),
        labels: {
          minWidth: 40
        },
        title: {
          text: `${yParam} (${unit})`,
          style: {
            fontFamily: "SF",
            color: "#000",
            cssClass: "yAxis-title"
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.8,
          opacityTo: 0.2,
          // stops: [0, 70, 10]
        }
      },
      xaxis: xaxis,
      annotations: {
        yaxis: [{
          y: this.getLCL(yParam),
          borderColor: '#FF0000',
          strokeDashArray: 2,
          opacity: 0.1,
          label: {
            offsetX: 25,
            offsetY: 16,
            borderWidth: 0,
            text: 'LCL',
            position: 'left',
            borderRadius: 10,
            style: {
              background: "rgba(46, 49, 49, 0.3)",
              cssClass: 'apexcharts-yaxis-annotation-label',
              color: '#FFF',
              fontWeight: "5000"
            },
          }
        },
        {
          y: this.getUCL(yParam),
          borderColor: '#FF6347',
          strokeDashArray: 2,
          opacity: 0.1,
          label: {
            offsetX: 27,
            offsetY: -2,
            borderWidth: 0,
            text: 'UCL',
            position: 'left',
            borderRadius: 10,
            style: {
              background: "rgba(46, 49, 49, 0.3)",
              cssClass: 'apexcharts-yaxis-annotation-label',
              color: '#FFF',
              fontWeight: "5000"
            },
          },

        }

        ],
        // points: points
      }
    }) as Partial<ChartOptions>;
  }

  applyChartValues(index: number, chartName: string) {
    if (this.commonParams.length <= 0 || index < 0) {
      this.chartValues = {};
      return;
    }

    let params = this.paramList.map(a => a.parameter);
    var arr = params.map((p, i) => {
      let paramCol = this.getParamCol(p);
      let actualValue = 0;
      if (this.xParams[0].parameter == "Period")
        actualValue = this.commonParams[index][this.getParamCol(p)]
      else {
        var xParamCol = this.getParamCol(this.xParams[0].parameter);
        actualValue = [...this.commonParams].sort((a, b) => a[xParamCol] - b[xParamCol])[index][this.getParamCol(p)]
      }

      return {
        "param": paramCol,
        "data": {
          "actualValue": actualValue,
          "deviationFromSpec": this.deviationFromSpecificationWithActualValue(p, actualValue),
          "deviationFromStdAvg": this.deviationFromStdAvgWithActualValue(p, actualValue)
        }
      }
    })

    let chartValues = arr.reduce(function (map, obj) {
      map[obj["param"]] = obj["data"];
      return map;
    }, {});

    chartValues["activeParam"] = chartName;

    if (this.xParams[0].parameter == "Period")
      chartValues["TimeStamp"] = this.commonParams[index]["TimeStamp"]
    else {
      var xParamCol = this.getParamCol(this.xParams[0].parameter);
      chartValues["TimeStamp"] = [...this.commonParams].sort((a, b) => a[xParamCol] - b[xParamCol])[index]["TimeStamp"]
    }
    this.chartValues = chartValues;
  }

  getSeriesByParam(yParam: string, xParam: string) {
    if (this.commonParams.length <= 0)
      return;
    let yParamCol = this.getParamCol(yParam);
    let xParamCol = "";
    if (xParam != "Period") {
      xParamCol = this.getParamCol(xParam);
    }
    var series = this.commonParams.map(function (o) {
      return [!xParamCol ? moment(o["TimeStamp"], "DD-MM-YYYY HH:mm:ss").toDate() : o[xParamCol], o[yParamCol]];
      // return [moment.unix(o["TimeStamp"]), o[paramCol]];
    })

    // console.log(yParam, series)
    return series;
  }

  public initCharts(): void {
    this.selectParamGroup(this.yParams, this.xParams);
  }

  // checkIfInView(element) {
  //   var offset = element.getBoundingClientRect().top - $(window).scrollTop();

  //   if (offset > window.innerHeight) {
  //     // Not in view so scroll to it
  //     $('html,body').animate({ scrollTop: offset }, 1000);
  //     return false;
  //   }
  //   return true;
  // }

  public navToChart(parameter, obj) {

    if (!obj.hasPoint)
      return false

    var element = document.getElementById(this.getParamCol(parameter));
    element.scrollIntoView({ block: 'center', behavior: "smooth", inline: "start" });

    let index = 0

    if (this.xParams[0].parameter == "Period")
      index = this.commonParams.findIndex(x => x[this.getParamCol(parameter)] === obj.value);
    else {
      var xParamCol = this.getParamCol(this.xParams[0].parameter);
      index = [...this.commonParams].sort((a, b) => a[xParamCol] - b[xParamCol]).findIndex(x => x[this.getParamCol(parameter)] === obj.value);
    }

    this.applyChartValues(index, this.getParamCol(parameter))


    this.apxcharts.forEach(el => {
      if (el instanceof ChartComponent) {
        if (el.chart.id == this.getParamCol(parameter)) {
          el.removeAnnotation("pointAnnotation")
          var point = {
            id: "pointAnnotation",
            x: this.xParams[0].parameter == "Period" ? moment(obj.xValue, "DD-MM-YYYY HH:mm:ss").toDate().getTime() : obj.xValue,
            y: obj.value,
            marker: {
              size: 6,
              fillColor: "#FF0000",
              strokeColor: "#fff",
              radius: 2
            }
          }

          el.addPointAnnotation(point, true)

          // el.toggleDataPointSelection(0, 1)

        } else {
          el.removeAnnotation("pointAnnotation")
        }
      }
    })

    // if (this.apxcharts && parameter) {
    //   this.initCharts({
    //     param: parameter,
    //     value: obj.value,
    //     timestamp: moment(obj.timestamp, "DD-MM-YYYY HH:mm:ss").toDate()
    //   })
    // }
  }


  getImage(user) {
    return this._commonService.getImage(user);
  }
}


