import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { AppSettings } from "src/app/global";
import { AuthenticationService } from "src/app/services/authentication.service";
import { User } from "src/app/models/user";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  vehiclePrograms: [];
  message: "";
  currentUser: User;
  userId: any;
  constructor(
    private router: Router,
    private dataService: DataService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.userId = this.authenticationService.currentUserValue.id;
    // console.log(this.authenticationService.currentUserValue)
    this.initVehiclePrograms();
  }

  ngOnInit() {
    // this.user_program_list();
  }
  user_program_list() {
    const formData = {
      user_id: 4,

      
    };
    console.log(formData);
    this.dataService
      .user_program_list({
        formData,
      })
      .subscribe(
        (res) => {
          console.log(res.data);
        },
        (err) => {}
      );
  }
  gotopage(a, id = "") {
    this.router.navigate([a, id]);
  }

  initVehiclePrograms() {
    // this.dataService.getVehiclePrograms().subscribe((response: any) => {
      // console.log(response);
      const formData = {
        user_id: this.userId,
      };
      this.dataService
      .user_program_list({
        formData,
      })
      .subscribe(
        (response: any) => {
      if (response.status == "success") {
        let programs = [];
        response.data.forEach((program) => {
          program.image = AppSettings.BASE_URL + program.image;
          programs.push(program);
        });
        this.vehiclePrograms = response.data;
        // console.log(response.data);
      } else {
        this.message = response.message;
        return;
      }
    });
  }
}
