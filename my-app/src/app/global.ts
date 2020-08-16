export class AppSettings {
  //Phygitalz Demo
  // public static BASE_URL = "http://208.109.11.17/phygitalz/api/";

  //Phygitalz Live
  public static BASE_URL = "http://208.109.13.199/phygitalz/api/";

  //Local
  // public static BASE_URL = 'http://127.0.0.1:5000/';

  public static LOGIN_ENDPOINT = AppSettings.BASE_URL + "login";
  public static VEHICLE_PROGRAMS_ENDPOINT = AppSettings.BASE_URL + "vehicle_programs";
  public static TEST_DETAILS_ENDPOINT = AppSettings.BASE_URL + "test_detail";
  public static VEHICLE_STATISTICS_ENDPOINT = AppSettings.BASE_URL + "vehicle_statistics";
  public static GET_TESTS_BY_PROGRAM_ID_ENDPOINT(id: string) { return AppSettings.BASE_URL + `get_tests_by_program_id/${id}` };
  public static GET_PROGRAM_BY_ID_ENDPOINT(id: string) { return AppSettings.VEHICLE_PROGRAMS_ENDPOINT + `/${id}` };
  public static GET_TEST_BY_ID_ENDPOINT(id: string) { return AppSettings.TEST_DETAILS_ENDPOINT + `/${id}` };
  public static GET_VEHICLE_STATISTICS_BY_PID_AND_TID_ENDPOINT(pid: string, tid: string) { return AppSettings.VEHICLE_STATISTICS_ENDPOINT + `/${pid}/${tid}` };
  public static GROUP_BY_REASONS_FOR_BREAKDOWN_ENDPOINT = AppSettings.BASE_URL + "reasons_for_breakdown_group";
  public static VEHICLE_BREAKDOWN_CHART_ENDPOINT = AppSettings.BASE_URL + "vehicle_breakdown_chart";
  public static DISTANCE_COVERED_CHART_ENDPOINT = AppSettings.BASE_URL + "distance_covered_chart";
  public static GROUP_BY_OVER_SPEED_VEHICLE_ENDPOINT = AppSettings.BASE_URL + "over_speed_vehicle_group";
  public static FAILURE_TYPES_ENDPOINT = AppSettings.BASE_URL + "failure_types";
  public static FAILURE_TYPES_CHART_ENDPOINT = AppSettings.BASE_URL + "failure_types_chart";
  public static TREND_GRAPH_ENDPOINT = AppSettings.BASE_URL + "trend_graph";
  public static REASONS_FOR_BREAKDOWN_ACTION_GROUP_ENDPOINT = AppSettings.BASE_URL + "reasons_for_breakdown_action_group";
  public static GET_OVERSPEED_VEHICLES_ACTIONS_ENDPOINT = AppSettings.BASE_URL + "get_overspeed_vehicles_actions";
  public static GET_FAILURE_TYPE_ACTION_ENDPOINT = AppSettings.BASE_URL + "get_failure_type_action";
  public static GET_REASONS_FOR_BREAKDOWN_ACTION_ENDPOINT = AppSettings.BASE_URL + "get_reasons_for_breakdownaction";
  public static GET_FAILURE_TYPES_BY_ID(id: string) { return AppSettings.FAILURE_TYPES_ENDPOINT + `/${id}` };
  public static GET_VEHICLE_FAILURE_BY_CHNO_ENDPOINT(chno: string) { return AppSettings.BASE_URL + "vehicle_failure_by_chno" + `/${chno}` };
  public static GET_VEHICLE_DETAILS_BY_RBAID_ENDPOINT(rbaId: string) { return AppSettings.BASE_URL + "vehicle_details_by_rbaid" + `/${rbaId}` };
  public static GET_REASONS_FOR_BREAKDOWNACTION_BY_CHNO_ENDPOINT(chno: string) { return AppSettings.BASE_URL + "get_reasons_for_breakdownaction_by_chno" + `/${chno}` };
  public static GET_REASONS_FOR_BREAKDOWN_ACTION_BY_ID_ENDPOINT(id: string) { return AppSettings.GET_REASONS_FOR_BREAKDOWN_ACTION_ENDPOINT + `/${id}` };
  public static GET_VEHICLE_FAILURE_BY_RBAID_ENDPOINT(rbaId: string) { return AppSettings.BASE_URL + "vehicle_failure_by_rbaid" + `/${rbaId}` };
  public static GET_PARAMS_BY_FTID(ftId: string) { return AppSettings.BASE_URL + "get_params_by_ftid" + `/${ftId}` };
  // public static GET_VEHICLE_ACTIONS_BY_CHNO_ENDPOINT(chno: string) { return AppSettings.BASE_URL + "get_vehicle_actions_by_chno" + `/${chno}` };
  public static GET_VEHICLE_ACTIONS_BY_CHNO_ENDPOINT = AppSettings.BASE_URL + "get_vehicle_actions_by_chno";
  public static SUB_SYSTEM_PERFORMANCE_GRID_ENDPOINT = AppSettings.BASE_URL + "subsystem_performance_grid";
  public static VEHICLELIST = AppSettings.BASE_URL + "vehicle";
  public static VEHICLEPROGRAMS = AppSettings.BASE_URL + "vehicle_programs";
  public static SOURCETYPELIST = AppSettings.BASE_URL + "source_target_list";
  public static PROFILELIST = AppSettings.BASE_URL + "profile_list";
  public static RELATIONSHIPLIST = AppSettings.BASE_URL + "relationship_list";
  public static CREATE_VEHICLE = AppSettings.BASE_URL + "create_vehicle";
  public static EDIT_VEHICLE = AppSettings.BASE_URL + "update_vehicle";
  public static ASSIGNEDLIST = AppSettings.BASE_URL + "assigned_list";
  public static USERPROGRAMLIST = AppSettings.BASE_URL + "user_program_list";
  public static PROGRAMTESTLIST = AppSettings.BASE_URL + "program_test_list";
  public static RELATIONSHIPLISTFORNAME = AppSettings.BASE_URL + "relationship_list_for_name";

  public static SOURCETARGETNAMELIST = AppSettings.BASE_URL + "source_target_name_list";



  public static DELETERSLIST = AppSettings.BASE_URL + "delete_relationship_list_for_name";
  public static ASSIGN = AppSettings.BASE_URL + "assign";
  public static CHANGEPROFILE = AppSettings.BASE_URL + "change_profile";
  public static ADDPROFILE = AppSettings.BASE_URL + "add_profile";
  public static VIEWVEHICLE(id: string) { return AppSettings.BASE_URL + `vehicle/${id}` };
  public static DELETEVEHICLE(id: string) { return AppSettings.BASE_URL + `vehicle/${id}` };
  static DELETE_VEHICLES_ENDPOINT = AppSettings.BASE_URL + "delete_vehicles";
  public static DRIVER_ENDPOINT = AppSettings.BASE_URL + "driver";
  public static DELETE_RELATIONSHIPS_ENDPOINT = AppSettings.BASE_URL + "delete_relationships";

}
