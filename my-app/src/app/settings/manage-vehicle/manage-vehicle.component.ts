import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { AssignComponent } from "../assign/assign.component";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { DatePipe } from "@angular/common";
import { DataService } from "src/app/services/data.service";
import { HttpClient } from "@angular/common/http";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AppConstants } from "src/app/const";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { ConformationDialigComponent } from "src/app/layout/conformation-dialig/conformation-dialig.component";
import { AuthenticationService } from "src/app/services/authentication.service";
import { User } from "src/app/models/user";
import { AppSettings } from "src/app/global";
// import { ModalDirective } from 'ngx-bootstrap/modal';
// declare const M: any;

interface Gender {
  id: string;
  value: string;
}

@Component({
  selector: "app-manage-vehicle",
  templateUrl: "./manage-vehicle.component.html",
  styleUrls: ["./manage-vehicle.component.scss"],
})
export class ManageVehicleComponent implements OnInit {
  @ViewChild("roleTemplate", { static: true }) roleTemplate: TemplateRef<any>;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild("closeModal", { static: false }) closeModal;
  // @ViewChild('closeModal') closeModal: ElementRef
  // @ViewChild('closeModal') public childModal;
  // @ViewChild("notificationModal", { static: false }) notificationModal;
  // @ViewChild('closeAddModal', { static: false }) closeAddModal;
  // @ViewChild('closeEditModal', { static: false }) closeEditModal;
  appConstants: AppConstants = new AppConstants();
  routerChanged = true;
  now = Date.now();
  public currentVisible: number = 4;
  rows = [];
  imagePath = "";
  imagePath1 =
    "data:image/png;base64,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";
  newUserImg = "assets/images/user/user1.jpg";
  data = [];
  isShow = false;
  isReadOnly = false;
  isEdit = 0;
  editId = "";
  register: FormGroup;
  selectedOption: string;
  columns = [
    { name: "Program" },
    { name: "Vehicle Chasis No" },
    { name: "Date of Mfg" },
  ];
  public show = false;
  genders = [];

  CurrentPage = 1;
  TotalCount = 0;

  start = 0;
  length = this.appConstants.GRID_PAGE_LIMIT;
  order_column = "id";
  order_by = "desc";
  search = "";
  textValue = "";
  Opctions = "Create Vehicle";
  Vehiclestatus = [
    { id: "1", value: "Yet to start" },
    { id: "2", value: "running" },
    { id: "3", value: "in work" },
    { id: "4", value: "Completed" },
    { id: "5", value: " breakdown" },
  ];
  filteredVehicleStatus = [
    { id: "1", value: "Yet to start" },
    { id: "2", value: "running" },
    { id: "3", value: "in work" },
    { id: "4", value: "Completed" },
    { id: "5", value: " breakdown" },
  ];
  baseURL = AppSettings.BASE_URL;

  selectedIds = [];
  dialogConfig: MatDialogConfig;

  isAdmin: Boolean = false;
  filteredVehiclePrograms: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private dataService: DataService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router,
    private dialogModel: MatDialog,
    private authenticationService: AuthenticationService
  ) {
    let currentUser = this.authenticationService.currentUserValue;
    this.isAdmin = currentUser.role == "Admin";
  }

  createVehicle = new FormGroup({
    vehicleprogram: new FormControl(),
    chasisnumber: new FormControl(),
    dateofmfg: new FormControl(),
    driverassigned: new FormControl(),
    vehiclestatus: new FormControl(),
    pstartdate: new FormControl(),
    penddate: new FormControl(),
  });

  deleteConfirmation(row) {
    this.dialogModel
      .open(ConformationDialigComponent, {
        width: "25%",
        disableClose: true,
        data: { label: "Are you sure you want to delete?" },
      })
      .afterClosed()
      .subscribe((response) => {
        if (response.confirm) {
          this.dataService
            .deleteVehicles({
              deleteIds:
                this.selectedIds.length > 0 ? this.selectedIds : [row.id],
            })
            .subscribe((response: any) => {
              // console.log(response);
              if (response.status == "success") {
                this.list();
                this.showNotification(
                  "bg-green",
                  "Record Deleted Successfully",
                  "bottom",
                  "right"
                );
                // alert(response.message);
              } else {
                // alert(response.message);
                this.showNotification(
                  "bg-red",
                  "OOPS Something Went Wrong. Please Try After Sometime!",
                  "bottom",
                  "right"
                );
                this.list();
              }
            });
        }
      });
  }

  list() {
    this.fetch((data) => {
      // console.log(data);
      this.data = data.map((v) => {
        v.dateOfMfg = v.dateOfMfg != 'None' ? v.dateOfMfg : "";
        return v;
      });
    });
  }

  onFooterPage(event: any) {
    // console.log(event);
    this.length = this.appConstants.GRID_PAGE_LIMIT;
    this.start =
      event.page * this.appConstants.GRID_PAGE_LIMIT -
      this.appConstants.GRID_PAGE_LIMIT;
    this.list();
  }

  ngOnInit() {
    this.list();
    this.register = this.fb.group({
      vehicleprogram: ["", [Validators.required]],
      img: [""],
      chasisnumber: [""],
      dateofmfg: [""],
      driverassigned: [""],
      vehiclestatus: [""],
      pstartdate: [""],
      penddate: [""],
    });
  }

  fetch(cb) {
    this.dataService.VehiclePrograms().subscribe((response: any) => {
      if (response.status == "success") {
        this.genders = this.filteredVehiclePrograms = response.data ?? []
        // console.log(response.data);

        // this.genders = [
        //   { id: "1", value: "Program 1" },
        //   { id: "2", value: "Program 2" },
        //   { id: "3", value: "Program 3" },
        //   { id: "4", value: "Program 4" },
        // ];
      } else {
      }
    });

    this.dataService
      .VehicleList({
        start: this.start,
        length: this.length,
        order_column: this.order_column,
        order_by: this.order_by,
        search: this.search,
      })
      .subscribe((response: any) => {
        if (response.status == "success") {
          // this.SpinnerService.hide();

          const data = response.data[0].list;
          // console.log(data);
          this.TotalCount = response.data[0].count;

          cb(data);
        } else {
          // this.closeModal.nativeElement.click();
          // this.SpinnerService.hide();
          // document.getElementById("openModalButton").click();
        }
      });
  }

  clear() {
    this.createVehicle.setValue({
      vehicleprogram: "",
      chasisnumber: "",
      dateofmfg: "",
      driverassigned: "",
      vehiclestatus: "",
      pstartdate: "",
      penddate: "",
    });
  }

  gotopage(a, value) {
    // console.log(value);
    // localStorage.setItem('vehicleProgramName', value.vehicleProgramName);
    this.router.navigate([a, value.vehicleProgramName]);
  }

  view(row, rowIndex) {
    // date = new FormControl();

    this.clear();
    this.isShow = true;
    this.isReadOnly = true;
    this.Opctions = "View Vehicle";
    // // console.log(new Date());

    const Id = row.id;
    this.dataService.viewVehicle(Id).subscribe((response: any) => {
      // // console.log(response);
      if (response.status == "success") {
        if (
          response.data.vehicleImage == null ||
          response.data.vehicleImage == ""
        ) {
          this.imagePath = this.imagePath1;
        } else {
          // this.imagePath =
          this.imagePath = AppSettings.BASE_URL + response.data.vehicleImage;
        }

        this.createVehicle.setValue({
          vehicleprogram: response.data.vehicleProgramId,
          vehiclestatus: response.data.vehicleStatus.toString(),
          // vehicleprogram : "1",
          chasisnumber: response.data.chassisNo,
          driverassigned: response.data.driverAssigned && response.data.driverAssigned != "null" ? response.data.driverAssigned : "",
          dateofmfg: response.data.dateOfMfg ? new Date(this.date_Formate(response.data.dateOfMfg)) : "",
          pstartdate: new Date(
            this.date_Formate(response.data.plannedTestStartDate)
          ),
          penddate: new Date(
            this.date_Formate(response.data.plannedTestEndDate)
          ),
          // // console.log();April 28, 2020
        });
      } else {
        alert(response.message);
        return;
      }
    });
  }

  date_Formate(date) {
    if (date != null) {
      var stringDate1 = date;
      var splitDate1 = stringDate1.split("/");
      var year1 = splitDate1[2];
      var month1 = splitDate1[1];
      var day1 = splitDate1[0];
      stringDate1 = month1 + "/" + day1 + "/" + year1;
      stringDate1 = this.datePipe.transform(stringDate1, "MMMM d, y");
      // console.log(stringDate1);
      return stringDate1;
    } else {
      return null;
    }
  }

  editRow(row, rowIndex) {
    this.clear();
    this.isShow = false;
    this.isReadOnly = false;
    this.isEdit = 1;
    this.Opctions = "Edit Vehicle";
    this.editId = row.id;
    // console.log(row.id);
    const Id = row.id;
    this.dataService.viewVehicle(Id).subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        //  this.imagePath= "assets/images/icon/car.png",
        if (
          response.data.vehicleImage == null ||
          response.data.vehicleImage == ""
        ) {
          this.imagePath = this.imagePath1;
        } else {
          this.http
            .get(AppSettings.BASE_URL + response.data.vehicleImage, {
              responseType: "blob",
            })
            .pipe(switchMap((blob) => this.convertBlobToBase64(blob)))
            .subscribe(
              (base64ImageUrl) => (this.imagePath = base64ImageUrl.toString())
            );
          // this.imagePath =
        }
        this.createVehicle.setValue({
          vehicleprogram: response.data.vehicleProgramId,
          vehiclestatus: response.data.vehicleStatus.toString(),
          chasisnumber: response.data.chassisNo,
          driverassigned: response.data.driverAssigned && response.data.driverAssigned != "null" ? response.data.driverAssigned : "",
          dateofmfg: response.data.dateOfMfg ? new Date(this.date_Formate(response.data.dateOfMfg)) : "",
          pstartdate: new Date(
            this.date_Formate(response.data.plannedTestStartDate)
          ),
          penddate: new Date(
            this.date_Formate(response.data.plannedTestEndDate)
          ),
        });
      } else {
        alert(response.message);
        return;
      }
    });
    // this.isEdit=0;
  }

  convertBlobToBase64(blob: Blob) {
    return Observable.create((observer) => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        // console.log("Image in Base64: ", event.target.result);
        observer.next(event.target.result);
        observer.complete();
      };
      reader.onerror = (event: any) => {
        // console.log("File could not be read: " + event.target.error.code);
        observer.next(event.target.error.code);
        observer.complete();
      };
    });
  }

  toDataURL = (url) => {
    var data = "";
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      // // console.log(reader.result)
      reader.onloadend = function () {
        // console.log(reader.result);
        data = reader.result.toString();
      };
      reader.readAsDataURL(xhr.response);
    };
    this.imagePath = data;
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  };

  addRow(form: FormGroup, formDirective: FormGroupDirective) {
    this.Opctions = "Create Vehicle";
    this.isShow = false;
    this.isReadOnly = false;
    formDirective.resetForm();
    form.reset();
    this.isEdit = 0;
    this.imagePath = this.imagePath1;
  }

  deleteRow(row) {
    this.deleteConfirmation(row);
    // var result = confirm("Want to delete?");
    // if (result) {
    //   //Logic to delete the item
    //   // console.log(row.id);
    //   const Id = row.id;
    //   this.dataService.deleteVehicle(Id).subscribe((response: any) => {
    //     // console.log(response);
    //     if (response.status == "success") {
    //       this.list();
    //       this.showNotification(
    //         "bg-green",
    //         "Record Deleted Successfully",
    //         "bottom",
    //         "right"
    //       );
    //       // alert(response.message);
    //     } else {
    //       // alert(response.message);
    //       this.showNotification(
    //         "bg-red",
    //         "OOPS Something Went Wrong Please Try After Sometime...",
    //         "bottom",
    //         "right"
    //       );
    //       this.list();
    //     }
    //   });
    // }
  }

  onFileChanged(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.imagePath = event.target.result.toString();
        // console.log(this.imagePath);
      };
    }
    const file = event.target.files[0];
    // console.log(file);
  }

  // transform() {
  //   return this.base64Image;
  // }

  onUpload() { }

  cancel(form: FormGroup) {
    form.reset();
    // this.childModal.hide();
    this.closeModal._elementRef.nativeElement.click();
    // this.closeEditModal.nativeElement.click();
  }

  onAddRowSave(form: FormGroup, formDirective: FormGroupDirective) {
    if (this.createVehicle.invalid) {
      return;
    }

    if (form.value.dateofmfg > new Date()) {
      this.showNotification(
        "bg-red",
        "Date of Mfg cannot be greater than current date!",
        "bottom",
        "right"
      );

      return;
    }

    if (form.value.pstartdate > form.value.penddate) {
      this.showNotification(
        "bg-red",
        "Start date cannot be greater than End date!",
        "bottom",
        "right"
      );

      return;
    }

    const formData = new FormData();
    formData.append("image_str", this.imagePath);
    formData.append("chassisNo", form.value.chasisnumber);
    formData.append(
      "dateOfMfg",
      this.datePipe.transform(form.value.dateofmfg, "yyyy-MM-dd")
    );
    formData.append("driverAssigned", form.value.driverassigned);
    formData.append("vehicleStatus", form.value.vehiclestatus);
    formData.append(
      "plannedTestStartDate",
      this.datePipe.transform(form.value.pstartdate, "yyyy-MM-dd")
    );
    formData.append(
      "plannedTestEndDate",
      this.datePipe.transform(form.value.penddate, "yyyy-MM-dd")
    );

    formData.append("vehicleProgramId", form.value.vehicleprogram);
    // formData.append("vehicleprogramId", this.genders.find(vp => vp["vehicleProgramName"] == form.value.vehicleprogram)["id"]);

    if (this.isEdit == 1) {
      // formData.append("actualTestStartDate", form.value.actualTestStartDate);
      // formData.append("actualTestEndDate", form.value.actualTestEndDate);
      formData.append("assignedtestId", "1");
      formData.append("actualTestStartDate", "2020-03-22");
      formData.append("actualTestEndDate", "2020-03-22");
      formData.append("vehicle_id", this.editId);
      // formData.append("assignedtestId", form.value.assignedtestId);

      this.dataService
        .editVehicle({
          formData,
        })
        .subscribe(
          (res) => {
            this.imagePath = "";
            this.list();

            formDirective.resetForm();
            form.reset();
            this.closeModal._elementRef.nativeElement.click();
            this.showNotification(
              "bg-green",
              "Record Updated Successfully",
              "bottom",
              "right"
            );
            // alert(res.message);
          },
          (err) => {
            this.imagePath = "";
            // console.log(err);
            this.showNotification(
              "bg-red",
              "OOPS Something Went Wrong Please Try After Sometime...",
              "bottom",
              "right"
            );
          }
        );
    } else {
      formData.append("actualTestStartDate", "2020-03-22");
      formData.append("actualTestEndDate", "2020-03-22");
      formData.append("vehicle_id", "");
      formData.append("assignedtestId", "1");
      this.dataService
        .addVehicle({
          formData,
        })
        .subscribe(
          (res) => {
            this.imagePath = "";
            this.list();
            form.reset();
            this.closeModal._elementRef.nativeElement.click();
            this.showNotification(
              "bg-green",
              "Record Added Successfully",
              "bottom",
              "right"
            );
          },
          (err) => {
            this.imagePath = "";
            // console.log(err);
            this.showNotification(
              "bg-red",
              "OOPS Something Went Wrong Please Try After Sometime...",
              "bottom",
              "right"
            );
          }
        );
    }
  }

  filterDatatable(event) {
    // console.log(this.textValue);
    this.search = this.textValue;
    this.start = 0;
    this.length = this.appConstants.GRID_PAGE_LIMIT;
    this.order_column = "id";
    this.order_by = "desc";
    this.list();
  }

  // filterDatatable1(event) {
  //   // get the value of the key pressed and make it lowercase
  //   let val = event.target.value.toLowerCase();
  //   // get the amount of columns in the table
  //   let colsAmt = this.columns.length;
  //   // get the key names of each column in the dataset
  //   let keys = Object.keys(this.filteredData[0]);
  //   // assign filtered matches to the active datatable
  //   this.data = this.filteredData.filter(function (item) {
  //     // console.log()
  //     // console.log(item)
  //     //  console.log(dataStrings)
  //     // iterate through each row's column data
  //     for (let i = 0; i < 15; i++) {
  //       // check for a match .toString()
  //       var dataStrings = String(item[keys[i]]);
  //       console.log(dataStrings);
  //       if (dataStrings !== "" || dataStrings != null) {
  //         if (
  //           dataStrings.toString().toLowerCase().indexOf(val) !== -1 ||
  //           !val
  //         ) {
  //           // found match, return true to add to result set
  //           return true;
  //         }
  //       }
  //     }
  //   });
  //   // whenever the filter changes, always go back to the first page
  //   this.table.offset = 0;
  // }

  // setPage(pageInfo){
  //   alert(pageInfo)
  //   console.log(pageInfo)
  // }

  onSort(event) {
    // console.log(event.column.prop);
    // console.log(event.newValue);
    if (
      event.column.prop == "dateOfMfg" ||
      event.column.prop == "chassisNo" ||
      event.column.prop == "vehicleProgramId"
    ) {
      this.order_column = event.column.prop;
      this.order_by = event.newValue;
      this.list();
    }
  }
  onSelect({ selected }) {
    this.selectedIds = selected.map((a) => a.id);
  }

  getId(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      verticalPosition: "bottom",
      horizontalPosition: "right",
      panelClass: ["bg-red"],
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    // this._snackBar.open(text, "", {
    //   duration: 2000,
    //   verticalPosition: placementFrom,
    //   horizontalPosition: placementAlign,
    //   panelClass: colorName,
    // });
    this._snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: ["bg-gray"],
    });
  }

  showNotification1(colorName, text, placementFrom, placementAlign) {
    this._snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  displayFnVP = (id) => {
    if (this.genders?.length > 0 && id)
      return this.genders.find(rel => rel["id"] == id)["vehicleProgramName"];
  }

  doVehicleProgramsFilter(e) {
    if (this.genders.length > 0)
      this.filteredVehiclePrograms = this.filterobj(this.genders, e.target.value, "vehicleProgramName")
  }

  filterobj(list, query, labelKey) {
    return list.filter(rel =>
      rel[labelKey].toLowerCase().includes(query.toLowerCase()))
  }

  onVehicleProgramSelected() {

  }


  displayFnVS = (id) => {
    if (this.Vehiclestatus?.length > 0 && id)
      return this.Vehiclestatus.find(rel => rel["value"] == id)["value"];
  }

  doVehicleStatusFilter(e) {
    if (this.Vehiclestatus.length > 0)
      this.filteredVehicleStatus = this.filterobj(this.Vehiclestatus, e.target.value, "value")
  }

  onVehicleStatusBlur(e) {
    if (!this.Vehiclestatus.find(vp => vp.value == e.target.value)) {
      // this.filteredVehiclePrograms = ['']
      // vehicleprogram
      // this.targetType = ""
      e.target.value = "";
    }
    // if (!this.Vehiclestatus.includes(e.target.value)) {
    //   // this.vehiclestatus = []
    //   this.createVehicle.setValue({vehiclestatus:""})
    // }

  }


  onVehicleStatusSelected() {

  }

  onVehicleProgramBlur(e) {
    if (!this.genders.find(vp => vp.vehicleProgramName == e.target.value)) {
      // this.createVehicle.setValue({
      //   vehicleprogram: ""})
      // this.filteredVehiclePrograms = ['']
      // vehicleprogram
      // this.targetType = ""
      e.target.value = "";
    }
  }
}

export interface selectRowInterface {
  img: String;
  firstName: String;
  lastName: String;
}
