import { Component, OnInit, HostListener } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { DatePipe } from "@angular/common";
import { DataService } from "src/app/services/data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AppSettings } from "src/app/global";

import * as $ from 'jquery';
import 'bootstrap';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConformationDialigComponent } from 'src/app/layout/conformation-dialig/conformation-dialig.component';

@Component({
  selector: "app-assign",
  templateUrl: "./assign.component.html",
  styleUrls: ["./assign.component.scss"],
})
export class AssignComponent implements OnInit {
  sourceTypes: string[];
  targetTypes: string[];
  Profiles: string[];
  relationships: [];
  SourceObjectName: [];
  targetObjectName: [];

  sourceType: string = "";
  targetType: string = "";
  relationshiplist: string = "";
  profileDDList: string = "";
  relationshiplist_save: string = "";
  source_name: string = "";
  target_name: string = "";
  gridData: [];
  target: [];
  relationshiplist_name: [];
  relationship_id: string;
  show_id = false;
  rowFilter = false;

  show_list = false;
  disabled = true;
  color_primary = '';
  public sourceSearchText: any;
  public targetSearchText: any;
  public profileNameText: any;
  public result: any;
  vehicleProgramName: string;
  baseURL = AppSettings.BASE_URL;
  relationship: [];
  totalValue = '';
  relationShipCountList: [];
  visiable = true;
  filteredSource: string[];
  filteredTarget: string[];
  filteredRelationship: [];
  filteredPopRelationship: [];
  filteredProfile: string[];

  filteredSourceObjectName: string[];
  filteredTargetObjectName: string[];

  selectedCells: any[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private dialogModel: MatDialog,
  ) {
    this.vehicleProgramName = this.route.snapshot.paramMap.get("id");
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.selectedCells = [];
    $('#main-table td').removeClass("selected");
  }

  getSourceObjectName() {

    // this.dataService.SourceTypeList().subscribe((response: any) => {
    //   if (response.status == "success") {
    //     this.sourceTypes = this.filteredSource = response.data.source ?? [];
    //     this.targetTypes = this.filteredTarget = response.data.source ?? [];
    //   } else {
    //   }
    // });
    const formData = {
      source: this.sourceType,
      target: this.targetType,
      // source_name: this.source_name,
      // target_name: this.target_name,
      // show_id: ""
    };
    this.dataService
      .source_target_name_list({
        formData,
      })
      .subscribe(
        (res) => {
          // console.log(res)
          this.SourceObjectName = this.filteredSourceObjectName = res.data.source ?? [];
          this.targetObjectName = this.filteredTargetObjectName = res.data.target ?? [];

        },
        (err) => { }
      );
  }

  ngOnInit(): void {
    this.getSourceTypeList();
    this.getProfileList();

    // this.ontargetType()
    $(".test").on("mouseover mouseout", "td:not(.rowhdr)", function () {
      $(this).toggleClass("darkk");
      $(this)
        .prevAll()
        .addBack()
        .add(
          $(this)
            .parent()
            .prevAll()
            .children(":nth-child(" + ($(this).index() + 1) + ")")
        )
        .toggleClass("hover");

      $("table thead tr th").eq($(this).index()).add(this).toggleClass("hover");
    });

    $(function () {
      var pressed = false;
      var start = undefined;
      var startX, startWidth;

      $(".test").on("mousedown touchstart", ".rel-header", (function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        start = $(e.currentTarget);
        pressed = true;
        startX = e.type == "mousedown" ? e.pageX : e.originalEvent["touches"][0].pageX;
        startWidth = $(e.currentTarget).width();
        $(start).addClass("resizing");
      }));

      $(document).on("mousemove touchmove", (function (e) {
        if (pressed) {
          var moveX = e.type == "mousemove" ? e.pageX : e.originalEvent["touches"][0].pageX;
          $(start).width(startWidth + (moveX - startX));
        }
      }));

      $(document).on("mouseup touchend touchcancel", (function (e) {
        if (pressed) {
          $(start).removeClass("resizing");
          pressed = false;
        }
      }));
    });
  }



  onSourceTypeBlur() {

    if (!this.sourceTypes.includes(this.sourceType)) {
      this.sourceType = "";
      this.filteredSource = this.sourceTypes;
    }

  }

  onTargetTypeBlur() {
    if (!this.targetTypes.includes(this.targetType)) {
      this.targetType = "";
      this.filteredTarget = this.targetTypes;
    }
  }

  onRelationshipBlur() {
    if (this.relationships && !this.relationships.find(a => a["id"] == this.relationshiplist)) {
      this.relationshiplist = ""
      this.filteredRelationship = this.relationships;
    }
  }

  onPopRelationshipBlur() {
    if (this.relationships && !this.relationships.find(a => a["id"] == this.relationshiplist_save)) {
      this.relationshiplist_save = "";
      this.filteredPopRelationship = this.relationships;
    }
  }

  onProfileBlur() {
    if (!this.Profiles.includes(this.profileDDList)) {
      this.profileDDList = "";
      this.filteredProfile = this.Profiles;
    }
  }

  doSourceTypeFilter() {

    if (this.sourceTypes.length > 0)
      this.filteredSource = this.filter(this.sourceTypes, this.sourceType)
    this.getSourceObjectName();
  }

  doTargetTypeFilter() {
    if (this.targetTypes.length > 0)
      this.filteredTarget = this.filter(this.targetTypes, this.targetType)
    this.getSourceObjectName();
  }

  doProfileFilter() {
    if (this.Profiles.length > 0)
      this.filteredProfile = this.filter(this.Profiles, this.profileDDList)
  }

  filter(list, query) {
    if (query) {
      return list.filter(val =>
        // used 'includes' here for demo, you'd want to probably use 'indexOf'
        val.toLowerCase().includes(query.toLowerCase()));
    }

    else {
      return list;
    }

  }

  doRelationshipFilter() {
    this.filteredRelationship = this.filterobj(this.relationships, this.relationshiplist)
  }

  doPopRelationshipFilter() {
    this.filteredPopRelationship = this.filterobj(this.relationships, this.relationshiplist_save)
  }

  filterobj(list, query) {
    if (query)
      return list.filter(rel =>
        rel["name"].toLowerCase().includes(query.toLowerCase()))
    else
      return list
  }

  onSourceTypeChange() {
    // alert('HI')
    this.sourceSearchText = '';
    // this.targetSearchText = '';
    this.relationshiplist = '';
    this.relationship_List();
    // this.ontargetTypeForOnint();
    // .ontargetType();
  }

  ontargetTypeChange() {
    this.disabled = false;
    // this.color_primary="";
    // this.sourceSearchText = '';
    this.targetSearchText = '';
    this.relationshiplist = ''
    this.relationship_List();
    // this.ontargetTypeForOnint();

  }

  onrelationshiplist() {
    // this.ontargetType();
  }

  displayFnRel = (id) => {
    if (this.relationships?.length > 0 && id)
      return this.relationships.find(rel => rel["id"] == id)["name"];
  }

  onrelationshipDropDown() { }


  touchstart(e, source_label: any, i: any) {
    var source_res = source_label.split("-");
    var target_label = this.target[i] as string;
    let target_res = target_label.split("-");

    let source_name = source_res[source_res.length - 1]
    let target_name = target_res[target_res.length - 1]

    let currentTarget = e.currentTarget;

    let timeout_id = setTimeout(() => {
      // if ($(e.currentTarget).children().length == 0) {
      var has_rel = $(currentTarget).children().length != 0;

      if (this.selectedCells.length == 0 || this.selectedCells[0].has_rel == has_rel) {
        e.preventDefault();
        if (!$(currentTarget).hasClass('selected')) {
          $(currentTarget).addClass('selected');
          this.selectedCells.push({
            "source": source_name,
            "target": target_name,
            "has_rel": has_rel
          })
        } else {
          $(currentTarget).removeClass('selected');
          this.selectedCells = this.selectedCells.filter(cell => !(cell.source == source_name && cell.target == target_name))

        }
      } else {
        this.showNotification("bg-gray", "Cannot group cell with existing relation and cell with no relation!", "bottom", "right", 3500);
      }

      e.stopPropagation();
      e.stopImmediatePropagation();
    }, 1000);
    $(e.currentTarget).bind('mouseup mouseleave touchend', function () {
      clearTimeout(timeout_id);
    });
  }

  RowSelected(e, source_label: any, i: any) {
    e.stopPropagation();
    var source_res = source_label.split("-");
    var target_label = this.target[i] as string;
    let target_res = target_label.split("-");

    let source_name = source_res[source_res.length - 1]
    let target_name = target_res[target_res.length - 1]

    if (!e.ctrlKey && !e.shiftKey) {
      if (!$(e.currentTarget).hasClass('selected')) {
        this.selectedCells = [];
        $('#main-table td').removeClass("selected");
        this.source_name = source_name;
        this.target_name = target_name;
        this.relationship_list_name();

        $('#myDropDownModal').modal('show');
      } else {
        // deleteConfirmation
        if (this.selectedCells[0].has_rel == true) {
          this.deleteConfirmation()
        } else {
          if (this.selectedCells.length > 0) {
            this.source_name = "";
            this.target_name = "";
          }
          this.relationship_list_name();
          $('#myDropDownModal').modal('show');
        }
      }

    } else {
      var has_rel = $(e.currentTarget).children().length != 0;


      if (this.selectedCells.length == 0 || this.selectedCells[0].has_rel == has_rel) {

        if (!$(e.currentTarget).hasClass('selected')) {
          if (e.shiftKey) {
            if (this.selectedCells.length == 0) {
              $(e.currentTarget).addClass('selected');
              this.selectedCells.push({
                "source": source_name,
                "target": target_name,
                "has_rel": has_rel
              })
            } else {
              if ($(e.currentTarget).siblings('.selected').length > 0) {
                let currentIndex = $(e.currentTarget).index();
                let firstSelectedCell = $(e.currentTarget).siblings("td.selected").first();
                let firstSelectedIndex = firstSelectedCell.index();

                let startIdx = currentIndex > firstSelectedIndex ? firstSelectedIndex : currentIndex;
                let endIdx = firstSelectedIndex == startIdx ? currentIndex : firstSelectedIndex;
                let sibs = $(e.currentTarget).siblings("td").addBack();

                for (let idx = startIdx; idx <= endIdx; idx++) {
                  let cell = sibs.eq(idx);
                  let cellData = cell.data();
                  let source_name = cellData.sourcename.split("-").slice(-1)[0];
                  let target_name = cellData.targetname.split("-").slice(-1)[0];
                  var has_rel_cell = cell.children().length != 0;
                  if (!cell.hasClass('selected') && has_rel_cell == has_rel) {
                    cell.addClass("selected");
                    this.selectedCells.push({
                      "source": source_name,
                      "target": target_name,
                      "has_rel": has_rel
                    })
                  }

                }
              }
            }
          }
          else {
            $(e.currentTarget).addClass('selected');
            this.selectedCells.push({
              "source": source_name,
              "target": target_name,
              "has_rel": has_rel
            })
          }

        } else {
          $(e.currentTarget).removeClass('selected');
          this.selectedCells = this.selectedCells.filter(cell => !(cell.source == source_name && cell.target == target_name))

        }
      } else {
        this.showNotification("bg-gray", "Cannot group cell with existing relation and cell with no relation!", "bottom", "right", 3500);
      }
    }
  }

  getRelPopupName() {
    return this.relationshiplist_name && this.relationshiplist_name.length > 0 ? "Assign or Delete Relationship" : "Assign Relationship";
  }

  relationship_list_name() {
    const formData = {
      source: this.sourceType,
      target: this.targetType,
      source_name: this.source_name,
      target_name: this.target_name,
      // show_id: ""
    };
    this.dataService
      .relationship_list_for_name({
        formData,
      })
      .subscribe(
        (res) => {
          this.relationshiplist_name = res.data;
          if (res.data.length > 0) {
            this.show_list = true;
          } else {
            this.show_list = false;
          }
        },
        (err) => { }
      );
  }

  deleteConfirmation() {
    this.dialogModel
      .open(ConformationDialigComponent, {
        width: "25%",
        disableClose: true,
        data: { label: "Are you sure you want to delete selected relationships?" },
      })
      .afterClosed()
      .subscribe((response) => {
        if (response.confirm) {
          this.dataService
            .deleteRelationships({
              data:
              {
                source: this.sourceType,
                target: this.targetType,
                relation_pairs: this.selectedCells
              }
            })
            .subscribe((response: any) => {
              // console.log(response);
              if (response.status == "success") {
                this.showNotification(
                  "bg-gray",
                  "Relationships deleted successfully!",
                  "bottom",
                  "right"
                );
                this.searchGrid()
                // alert(response.message);
              } else {
                // alert(response.message);
                this.showNotification(
                  "bg-gray",
                  "OOPS Something Went Wrong. Please Try After Sometime!",
                  "bottom",
                  "right"
                );
              }
            });
        }
      });
  }

  deleterelationshiplistname(relationshipname, id) {
    // alert(id);
    const formData = {
      source: this.sourceType,
      target: this.targetType,
      source_name: this.source_name,
      target_name: this.target_name,
      relationship: id,
    };
    this.dataService
      .delete_relationship_list_for_name({
        formData,
      })
      .subscribe(
        (res) => {
          this.ontargetType();
          this.relationship_list_name();
          this.showNotification("bg-gray", res.message, "bottom", "right");
        },
        (err) => { }
      );
    //     /delete_relationship_list_for_name
    // {
    //     "source": "Program",
    //     "target": "Test",
    //     "source_name": "Program 1",
    //     "target_name": "Vibration",
    //     "relationship": "7"

    // }

    this.relationshiplist_name.splice(relationshipname, 1);
    this.relationship_id = this.relationshiplist_save;
  }

  onrelationshiplist_save() { }

  ontargetTypeForOnint() {
    this.selectedCells = [];
    $('#main-table td').removeClass("selected");
    // this.gridData = []
    const formData = {
      source: this.sourceType,
      target: this.targetType,
      source_name: this.sourceSearchText,
      target_name: this.targetSearchText,
      relationship: this.relationshiplist,
      show_id: this.show_id == true ? "Yes" : "No",
      hide_rows_columns: this.rowFilter == true ? "Yes" : "No",

    };
    //console.log(formData)
    this.dataService
      .assignedlist({
        formData,
      })
      .subscribe(
        (res: any) => {
          // console.log(res)
          this.gridData = res.data.source ?? [];
          this.target = res.data.target ?? [];
          this.relationship = res.data.relationship ?? [];
          this.totalValue = res.data.relationship_total_count;
          this.relationShipCountList = res.data.relationship_count;
          if (res.data.relationship_total_count == 0) {
            this.visiable = false
          }
          else {
            this.visiable = true
            var element = document.getElementById("table-scroll");
            setTimeout(() => {
              if (element) {
                element.scrollIntoView({ block: 'start', behavior: "smooth", inline: "start" });
              }
            }, 750);
          }
        },
        (err) => { }
      );
    // alert(this.targetTypelist)
    if (this.targetType == undefined) {
      this.disabled = true;
    }
    else {
      this.disabled = false;

    }


    // this.relationship_List();
  }

  getRelByImage(path) {
    if (path && this.relationships.find(rel => rel["image"] == path)) {
      return this.relationships.find(rel => rel["image"] == path)["name"];
    } else {
      return "";
    }

  }

  ontargetType() {
    let chkshow_id = "";
    let chkFiltershow_id = "";

    //this.getProfileList();
    if (this.show_id == true) {
      chkshow_id = "Yes";
    } else if (this.show_id == false) {
      chkshow_id = "No";
    }

    if (this.rowFilter == true) {
      chkFiltershow_id = "Yes";
    } else if (this.rowFilter == false) {
      chkFiltershow_id = "No";
    }


    const formData = {
      source: this.sourceType,
      target: this.targetType,
      // "source":"Program",
      // "target":"Test",
      source_name: this.sourceSearchText,
      target_name: this.targetSearchText,
      relationship: this.relationshiplist,
      show_id: chkshow_id,
      hide_rows_columns: chkFiltershow_id,
    };

    // console.log(formData)
    this.dataService
      .assignedlist({
        formData,
      })
      .subscribe(
        (res) => {
          this.gridData = res.data.source ?? [];
          this.target = res.data.target ?? [];
          this.relationship = res.data.relationship ?? [];
        },
        (err) => { }
      );
    // } else {
    // }
  }

  relationship_List() {
    if (this.sourceType && this.targetType) {
      const formData = {
        source: this.sourceType,
        target: this.targetType,
      };
      this.dataService
        .relationship_list({
          formData,
        })
        .subscribe(
          (res) => {
            this.relationshiplist = ""
            this.relationships =
              this.filteredRelationship =
              this.filteredPopRelationship = res.data ?? [];
          },
          (err) => { }
        );
    }
    else {
      this.relationships = [];
      this.filteredRelationship = this.filteredPopRelationship = [];
    }
  }

  getProfileList() {
    this.dataService.ProfileList().subscribe((response: any) => {
      if (response.status == "success") {
        // this.sourceType = response.data.source;
        this.Profiles = this.filteredProfile = response.data ?? [];

        // this.genders = [
        // { id: "1", value: "Program 1" },
        // { id: "2", value: "Program 2" },
        // { id: "3", value: "Program 3" },
        // { id: "4", value: "Program 4" },
        // ];
      } else {
      }
    });
  }
  // sourceSearch() {
  //   this.ontargetType();
  // }

  // targetSearch() {
  //   this.ontargetType();
  // }

  onCheckBoxClick() {
    // this.ref._checked = !this.ref._checked;
    this.show_id = !this.show_id
    this.searchGrid()
    // this.ontargetType();
  }

  onFilterCheckBoxClick() {
    // this.ref._checked = !this.ref._checked;
    this.rowFilter = !this.rowFilter
    this.searchGrid()
    // this.ontargetType();
  }

  saveProfile() {
    // alert(this.show_id)
    if (this.profileNameText) {
      if (
        this.sourceType && this.targetType
      ) {
        const formData = {
          source: this.sourceType,
          target: this.targetType,
          source_name: this.sourceSearchText,
          target_name: this.targetSearchText,
          profile_name: this.profileNameText,
        };

        this.dataService
          .add_profile({
            formData,
          })
          .subscribe(
            (res) => {
              // this.empleyoo= res.data.source;
              // this.target= res.data.target;
              // this.relationship= res.data.relationship;

              if (res.status == "success") {
                this.profileNameText = "";
                this.getProfileList();
                $("#btnProfileClose").click()
                this.showNotification(
                  "bg-gray",
                  "Profile Added Successfully",
                  "bottom",
                  "right"
                );
              } else {
                this.showNotification(
                  "bg-gray",
                  res.message,
                  "bottom",
                  "right"
                );
              }

            },
            (err) => { }
          );
      } else {
        $("#btnProfileClose").click();
        this.showNotification(
          "bg-gray",
          "Please select Source Type and Target Type",
          "bottom",
          "right"
        );
      }
    } else {
      this.showNotification(
        "bg-gray",
        "Please enter the profile name",
        "bottom",
        "right"
      );
    }
  }

  searchGrid() {
    this.selectedCells = [];
    $('#main-table td').removeClass("selected");
    this.ontargetTypeForOnint()
  }

  onprofileDDList() {
    const formData = {
      profile_name: this.profileDDList,
    };

    this.dataService
      .change_profile({
        formData,
      })
      .subscribe(
        (res) => {
          this.sourceType = res.data.source ?? [];
          this.targetType = res.data.target ?? [];
          this.sourceSearchText = res.data.source_name ?? "";
          this.targetSearchText = res.data.target_name ?? "";

          // this.ontargetType();
          // this.empleyoo= res.data.source;
          // this.target= res.data.target;
          // this.relationship= res.data.relationship;
          this.profileNameText = "";
        },
        (err) => { }
      );
  }

  getSourceTypeList() {
    this.dataService.SourceTypeList().subscribe((response: any) => {
      if (response.status == "success") {
        this.sourceTypes = this.filteredSource = response.data.source ?? [];
        this.targetTypes = this.filteredTarget = response.data.source ?? [];
        if (this.vehicleProgramName) {
          this.sourceType = "Program";
          this.targetType = "Test";
          this.sourceSearchText = this.vehicleProgramName;
          this.ontargetTypeForOnint();
          this.relationship_List();
          this.getSourceObjectName();
        }
        // localStorage.getItem("vehicleProgramName");
        // this.Router.snapshot.paraMap.get()
        // this.relationship_List();
        // this.ontargetType()
      } else {
      }
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      verticalPosition: "bottom",
      horizontalPosition: "right",
      panelClass: ["bg-gray"],
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign, duration = 2000) {
    this._snackBar.open(text, "", {
      duration: duration,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  assign() {
    if (this.relationshiplist_save) {

      if (this.relationshiplist_name.length > 0) {
        this.showNotification(
          "bg-gray",
          "Please delete existing relationship!",
          "bottom",
          "right"
        );
        return;
      }

      var selectedCells = this.selectedCells.length > 0 ? this.selectedCells : [{ source: this.source_name, target: this.target_name }]


      selectedCells.forEach((cell, cellIndex) => {
        const formData = {
          source: this.sourceType,
          target: this.targetType,
          source_name: cell.source,
          target_name: cell.target,
          relationship: this.relationshiplist_save,
        };

        this.dataService
          .assign({
            formData,
          })
          .subscribe(
            (res) => {
              if (res.status == "success") {

                if (cellIndex + 1 == selectedCells.length) {
                  this.selectedCells = [];
                  $('#main-table td').removeClass("selected");
                  this.ontargetType();
                  this.profileNameText = "";
                  $("#btnRelationshipClose").click()
                  this.showNotification(
                    "bg-gray",
                    "Updated Successfully",
                    "bottom",
                    "right"
                  );
                }

              }
              else {
                this.showNotification(
                  "bg-gray",
                  res.message,
                  "bottom",
                  "right"
                );
              }

            },
            (err) => {
              this.showNotification(
                "bg-gray",
                "OOPS somthing went wrong",
                "bottom",
                "right"
              );
            }
          );
      })

    } else {
      this.showNotification(
        "bg-gray",
        "Please select a relationship!",
        "bottom",
        "right"
      );
      return false;
    }
    return true;
  }

  // doSourceTypeFilter() {
  //   if (this.sourceTypes.length > 0)
  //     this.filteredSource = this.filter(this.sourceTypes, this.sourceType)
  // }


  doSourceObjectNameFilter() {
    if (this.SourceObjectName.length > 0)
      this.filteredSourceObjectName = this.filter(this.SourceObjectName, this.sourceSearchText)
  }

  doTargetObjectNameFilter() {
    if (this.targetObjectName.length > 0)
      this.filteredTargetObjectName = this.filter(this.targetObjectName, this.targetSearchText)
  }

  // onSourceObjectNameBlur()
  // {
  //   if (!this.SourceObjectName.includes(this.sourceType)) {
  //     this.sourceType = ""
  //   }
  // }


}
