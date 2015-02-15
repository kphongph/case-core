define({
  paths: {
    'jquery': '../vendor/jquery/dist/jquery',
    'bootstrap': '../vendor/bootstrap/dist/js/bootstrap',
    'angular': '../vendor/angular/angular.min',
    'ngRoute': '../vendor/angular-route/angular-route.min',
    'ngResource': '../vendor/angular-resource/angular-resource',
    'ngBootstrap': '../vendor/angular-bootstrap/ui-bootstrap',
    'ngBootstrap-tpls': '../vendor/angular-bootstrap/ui-bootstrap-tpls',
    'lb.services': 'js/lb-services'
  },
  shim: {
    'bootstrap': {
      'deps': ['jquery']
    },
    'angular': {
      'deps': ['jquery'],
      exports: 'angular'
    },
    'ngRoute': ['angular'],
    'ngResource': ['angular'],
    'ngBootstrap': ['angular'],
    'ngBootstrap-tpls': ['angular'],
    'lb.services': ['ngResource']
  }
});
