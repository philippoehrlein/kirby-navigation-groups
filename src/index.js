import SidebarNavigation from './components/SidebarNavigation.vue';
panel.plugin('philippoehrlein/kirby-sidebar-navigation', {
  icons: {
    'seperator': '<path d="M2 11H4V13H2V11ZM6 11H18V13H6V11ZM20 11H22V13H20V11Z"></path>',
    'addgroup': '<path d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM4 5V19H20V7H11.5858L9.58579 5H4ZM11 12V9H13V12H16V14H13V17H11V14H8V12H11Z"></path>'
  },
  fields: {
    sidebarnavigation: SidebarNavigation
  }
  
});
