import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard/main', title: 'Dashboard', icon: 'assets/images/icon/home.png', class: '', submenu: [], allow: ["Admin", "Test Lead"]
  },


  {
    path: '', title: 'Settings', icon: 'assets/images/icon/settings.png', class: 'menu-toggle', allow: ["Admin"],
    submenu: [
      { path: '/settings/manage-vehicle', title: 'Manage Vehicle', icon: 'assets/images/icon/car.png', class: 'ml-menu', submenu: [], allow: ["Admin"] },
      { path: '/settings/assign', title: 'Relationship Matrix', icon: 'assets/images/icon/relationship.png', class: 'ml-menu', submenu: [], allow: ["Admin"] },
      { path: '/settings/manage-user', title: 'Manage User', icon: 'assets/images/icon/user.png', class: 'ml-menu', submenu: [], allow: ["Admin"] },
      { path: '/settings/manage-test', title: 'Manage Test', icon: 'assets/images/icon/levels.png', class: 'ml-menu', submenu: [], allow: ["Admin"] }
    ]
  },

];

