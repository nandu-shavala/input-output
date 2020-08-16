// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  submenu: RouteInfo[];
  allow?: string[];
}
