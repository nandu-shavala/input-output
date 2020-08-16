import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-conformation-dialig',
  templateUrl: './conformation-dialig.component.html',
  styleUrls: ['./conformation-dialig.component.sass']
})
export class ConformationDialigComponent implements OnInit {
  deleteIds: any[];
  label: "Are you sure you want to delete?";

  constructor(
    public dialogRef: MatDialogRef<ConformationDialigComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.label = data.label ?? this.label
  }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close({ confirm: false });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: ["bg-gray"],
    });
  }

  yes_onclick() {
    this.dialogRef.close({ confirm: true });
  }

}
