import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppSettings } from '../global';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private httpClient: HttpClient) {

  }


  public login(body: { username: any; password: any; }) {
    return this.httpClient.post(AppSettings.LOGIN_ENDPOINT,
      {
        uname: body.username,
        pwd: body.password
      }
    );
  }

  public getVehiclePrograms() {
    return this.httpClient.get(AppSettings.VEHICLE_PROGRAMS_ENDPOINT
    );
  }



  public getTestsByProgramId(id) {
    return this.httpClient.get(AppSettings.GET_TESTS_BY_PROGRAM_ID_ENDPOINT(id)
    );
  }

  getProgramById(id: string) {
    return this.httpClient.get(AppSettings.GET_PROGRAM_BY_ID_ENDPOINT(id)
    );
  }

  getTestById(id: string) {
    return this.httpClient.get(AppSettings.GET_TEST_BY_ID_ENDPOINT(id)
    );
  }

  getTests() {
    return this.httpClient.get(AppSettings.TEST_DETAILS_ENDPOINT
    );
  }

  getVehicleStatistics(pid: string, tid: string) {
    return this.httpClient.get(AppSettings.GET_VEHICLE_STATISTICS_BY_PID_AND_TID_ENDPOINT(pid, tid)
    );
  }

  groupByReasonsForBreakdown() {
    return this.httpClient.get(AppSettings.GROUP_BY_REASONS_FOR_BREAKDOWN_ENDPOINT
    );
  }

  loadVBChart() {
    return this.httpClient.get(AppSettings.VEHICLE_BREAKDOWN_CHART_ENDPOINT
    );
  }

  loadDCChart() {
    return this.httpClient.get(AppSettings.DISTANCE_COVERED_CHART_ENDPOINT
    );
  }

  groupByOverSpeedVehicle() {
    return this.httpClient.get(AppSettings.GROUP_BY_OVER_SPEED_VEHICLE_ENDPOINT
    );
  }

  loadFailureTypeChart() {
    return this.httpClient.get(AppSettings.FAILURE_TYPES_CHART_ENDPOINT
    );
  }

  loadTrendChart() {
    return this.httpClient.get(AppSettings.TREND_GRAPH_ENDPOINT
    );
  }

  groupByBreakdownVehicles() {
    return this.httpClient.get(AppSettings.REASONS_FOR_BREAKDOWN_ACTION_GROUP_ENDPOINT
    );
  }

  getOverspeedVehicleActions(body: { start: any; length: any; order_column: any; order_by: any; search: any; }) {
    return this.httpClient.post(AppSettings.GET_OVERSPEED_VEHICLES_ACTIONS_ENDPOINT, {
      start: body.start,
      length: body.length,
      order_column: body.order_column,
      order_by: body.order_by,
      search: body.search
    }
    );
  }

  getFailureTypeActions(body: { start: any; length: any; order_column: any; order_by: any; search: any; }) {
    return this.httpClient.post(AppSettings.GET_FAILURE_TYPE_ACTION_ENDPOINT, {
      start: body.start,
      length: body.length,
      order_column: body.order_column,
      order_by: body.order_by,
      search: body.search
    }
    );
  }

  getReasonsForBreakdownActions(body: { start: any; length: any; order_column: any; order_by: any; search: any; }) {
    return this.httpClient.post(AppSettings.GET_REASONS_FOR_BREAKDOWN_ACTION_ENDPOINT, {
      start: body.start,
      length: body.length,
      order_column: body.order_column,
      order_by: body.order_by,
      search: body.search
    }
    );
  }

  getFailureTypeById(id: string) {
    return this.httpClient.get(AppSettings.GET_FAILURE_TYPES_BY_ID(id)
    );
  }

  getVehicleFailureByChno(chno: string) {
    return this.httpClient.get(AppSettings.GET_VEHICLE_FAILURE_BY_CHNO_ENDPOINT(chno)
    );
  }

  getVehicleDetailsByRbaId(rbaid: string) {
    return this.httpClient.get(AppSettings.GET_VEHICLE_DETAILS_BY_RBAID_ENDPOINT(rbaid)
    );
  }

  getVehicleFailureByRbaId(rbaid: string) {
    return this.httpClient.get(AppSettings.GET_VEHICLE_FAILURE_BY_RBAID_ENDPOINT(rbaid)
    );
  }

  getReasonsForBreakdownactionByChno(chno: string) {
    return this.httpClient.get(AppSettings.GET_REASONS_FOR_BREAKDOWNACTION_BY_CHNO_ENDPOINT(chno)
    );
  }

  getVehicleActionsByChno(body: { chassisno: string; start: any; length: any; order_column: any; order_by: any; search: any; }) {

    return this.httpClient.post(AppSettings.GET_VEHICLE_ACTIONS_BY_CHNO_ENDPOINT, {
      chassisno: body.chassisno,
      start: body.start,
      length: body.length,
      order_column: body.order_column,
      order_by: body.order_by,
      search: body.search
    }
    );
  }

  subSystemPreformanceGrid(type, startDate, endDate, chno, ftid) {
    return this.httpClient.post(AppSettings.SUB_SYSTEM_PERFORMANCE_GRID_ENDPOINT, {
      type: type,
      startDate: startDate,
      endDate: endDate,
      chno: chno,
      ftid: ftid
    }
    );
  }

  public addVehicle(body: { formData }) {

    // console.log(body.formData)
    return this.httpClient.post<any>(AppSettings.CREATE_VEHICLE, body.formData);
  }


  public editVehicle(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.EDIT_VEHICLE, body.formData);
  }

  public assignedlist(body: { formData }) {
    return this.httpClient.post<any>(AppSettings.ASSIGNEDLIST, body.formData);
  }


  public user_program_list(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.USERPROGRAMLIST, body.formData);
  }
  public failure_types_chart(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.FAILURE_TYPES_CHART_ENDPOINT, body.formData);
  }

  public reasonsforbreakdownactiongroup(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.REASONS_FOR_BREAKDOWN_ACTION_GROUP_ENDPOINT, body.formData);
  }



  public program_test_list(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.PROGRAMTESTLIST, body.formData);
  }


  public relationship_list(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.RELATIONSHIPLIST, body.formData);
  }

  public relationship_list_for_name(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.RELATIONSHIPLISTFORNAME, body.formData);
  }
  public source_target_name_list(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.SOURCETARGETNAMELIST, body.formData);
  }


  public delete_relationship_list_for_name(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.DELETERSLIST, body.formData);
  }




  public assign(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.ASSIGN, body.formData);
  }
  public change_profile(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.CHANGEPROFILE, body.formData);
  }


  public add_profile(body: { formData }) {

    return this.httpClient.post<any>(AppSettings.ADDPROFILE, body.formData);
  }

  public deleteVehicle(id) {

    return this.httpClient.delete(AppSettings.DELETEVEHICLE(id)
    );
  }

  public deleteVehicles(body: { deleteIds: any }) {

    return this.httpClient.post(AppSettings.DELETE_VEHICLES_ENDPOINT,
      {
        ids: body.deleteIds
      }
    );
  }

  public viewVehicle(id) {
    return this.httpClient.get(AppSettings.VIEWVEHICLE(id)
    );
  }




  public VehiclePrograms() {
    return this.httpClient.get(AppSettings.VEHICLEPROGRAMS
    );
  }

  public SourceTypeList() {
    return this.httpClient.get(AppSettings.SOURCETYPELIST
    );
  }

  public deleteRelationships(body: { data: any }) {

    return this.httpClient.post(AppSettings.DELETE_RELATIONSHIPS_ENDPOINT,
      {
        data: body.data
      }
    );
  }





  public ProfileList() {
    return this.httpClient.get(AppSettings.PROFILELIST
    );
  }

  public RelationshipList() {
    return this.httpClient.get(AppSettings.RELATIONSHIPLIST
    );
  }


  public getParamsByFtId(ftId: string) {
    return this.httpClient.get(AppSettings.GET_PARAMS_BY_FTID(ftId)
    );
  }

  public VehicleList(body: { start: any; length: any; order_column: any; order_by: any; search: any; }) {
    return this.httpClient.post(AppSettings.VEHICLELIST, {
      start: body.start,
      length: body.length,
      order_column: body.order_column,
      order_by: body.order_by,
      search: body.search
    }
    );
  }


}
