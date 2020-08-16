import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Component({
  selector: 'app-dialogform',
  templateUrl: './dialogform.component.html',
  styleUrls: ['./dialogform.component.scss']
})
export class DialogformComponent implements OnInit {

  availblelist: any[] = [];
  xParams: any[] = [];
  yParams: any[] = [];
  selectedparam: any;
  fullList: { parameter: string; type: string; unit: string; order: number; assignable: string }[];
  error: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {
    this.yParams = [...data.yParams];
    this.xParams = [...data.xParams];

    this.fullList = [...data.paramList];

    this.fullList.push(
      { parameter: 'Period', type: 'Output', unit: "Seconds", order: 0, assignable: "x" }
    )

    this.availblelist = this.fullList.filter((item) =>
      ![...this.yParams, ...this.xParams].find((selItem) => item.parameter == selItem.parameter
      ))

  }

  public ngOnInit(): void {

    // this.fullList = [
    //   { parameter: 'Battery Voltage', type: 'Input', unit: "Volts", order: 1, assignable: "xy" },
    //   { parameter: 'Starter Voltage', type: 'Input', unit: "Volts", order: 2, assignable: "xy" },
    //   { parameter: 'Starter Current', type: 'Output', unit: "Amps", order: 3, assignable: "xy" },
    //   { parameter: 'Engine Speed', type: 'Output', unit: "RPM", order: 4, assignable: "xy" },
    //   { parameter: 'Time to Start', type: 'Output', unit: "Seconds", order: 5, assignable: "xy" },
    //   { parameter: 'Period', type: 'Output', unit: "Seconds", order: 6, assignable: "x" }
    // ]

    // this.fullList.forEach(f => {
    //   this.yList.forEach(s => {
    //     if (s.parameter != f.parameter)
    //       this.availblelist.push(f)
    //   })
    // })
  }
  chooseparam(a) {
    this.selectedparam = a
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.yParams, event.previousIndex, event.currentIndex);
  }

  assignY() {
    if (!this.yParams.includes(this.selectedparam)) {
      if (this.selectedparam.assignable.includes("y")) {
        this.xParams = this.xParams.filter(x => x.parameter != this.selectedparam.parameter);
        this.availblelist = this.availblelist.filter(x => x.parameter != this.selectedparam.parameter);
        this.yParams.push(this.selectedparam)
        this.yParams = this.yParams.map((param, i) => { param.order = i + 1; return param; })
        // this.yList = this.yList.sort((a, b) => a.order - b.order)
      } else {
        this.openSnackBar("Selected param cannot be assigned to Y Axis");
      }

    } else {
      this.openSnackBar("Selected param already assigned to Y Axis");
    }
  }

  assignX() {
    if (!this.xParams.includes(this.selectedparam)) {
      if (this.selectedparam.assignable.includes("x")) {
        if (this.xParams.length < 1) {
          this.yParams = this.yParams.filter(x => x.parameter != this.selectedparam.parameter);
          this.availblelist = this.availblelist.filter(x => x.parameter != this.selectedparam.parameter);
          this.xParams.push(this.selectedparam)
          // this.xList = this.xList.sort((a, b) => a.order - b.order)
        } else {
          this.openSnackBar("Cannot assign more than one param to X Axis");
        }
      } else {
        this.openSnackBar("Selected param cannot be assigned to X Axis");
      }
    } else {
      this.openSnackBar("Selected param already assigned to X Axis");
    }
  }

  remove() {
    if (this.selectedparam) {

      if (!this.availblelist.includes(this.selectedparam)) {
        this.yParams = this.yParams.filter(x => x.parameter != this.selectedparam.parameter);
        this.xParams = this.xParams.filter(x => x.parameter != this.selectedparam.parameter);
        this.availblelist.push(this.selectedparam)
        this.availblelist = this.availblelist.sort(function (a, b) {
          var textA = a.parameter.toUpperCase();
          var textB = b.parameter.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
      } else {
        this.openSnackBar("Selected param already unassigned");
      }
    } else {
      this.openSnackBar("Select a param from X or Y Axis to unassign");
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveParams(): void {

    if (this.yParams.length > 0 && this.xParams.length > 0) {
      var yParams = this.yParams.map((param, i) => { param.order = i + 1; return param; })
      var xParams = this.xParams
      this.dialogRef.close({ yParams, xParams });
    } else {
      this.openSnackBar("X Axis or Y Axis params cannot be empty");
    }
  }

  reset(): void {
    this.yParams = this.fullList.filter(a => a.parameter != "Period");
    this.xParams = this.fullList.filter(a => a.parameter == "Period");
    this.availblelist = [];
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: ["bg-gray"],
    });
  }
}
