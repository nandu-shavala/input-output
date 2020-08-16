
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { DataService } from 'src/app/services/data.service';
import { AppSettings } from 'src/app/global';

declare const $: any;
declare const Chart: any;
declare const window: any;




@Component({
  selector: 'app-validation-types',
  templateUrl: './validation-types.component.html',
  styleUrls: ['./validation-types.component.scss']
})
export class ValidationTypesComponent implements OnInit {
  tests: [];
  programId: string;
  program: any;
  message: ""; 
  switchh: any = 'grid';
  constructor(private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService) {
    this.programId = this.route.snapshot.paramMap.get('id');
    // this.getTests();
    this.getProgramById(this.programId);
    this.getTestsByProgramId(this.programId);
  }

  ngOnInit() {

  }


  getProgramById(id: string) {
    this.dataService.getProgramById(id).subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        this.program = response.data;
      }
      else {
        this.message = response.message
        return;
      }
    })
  }

  getTests() {
    this.dataService.getTests().subscribe((response: any) => {
      // console.log(response);
      if (response.status == "success") {
        response.data.forEach(test => {
          test.testImage = AppSettings.BASE_URL + test.testImage
        });
        this.tests = response.data;
      }
      else {
        this.message = response.message
        return;
      }
    })
  }

  getTestsByProgramId(id: string) {
    const formData = {
      program_id: id,
    };
    // this.dataService.getTestsByProgramId(id)
    this.dataService
    .program_test_list({
      formData,
    })
    .subscribe((response: any) => {
      console.log(response);
      if (response.status == "success") {
        response.data.forEach(test => {
          test.image = AppSettings.BASE_URL + test.image
        });
        this.tests = response.data;
      }
      else {
        this.message = response.message
        return;
      }
    })
  }

  gotopage(a) {
    this.router.navigate([a]);
  }
  switchview(a) {
    this.switchh = a;
  }
  gotodurability(a, programId, testId) {
    this.router.navigate([a, programId, testId]);
  }

}
