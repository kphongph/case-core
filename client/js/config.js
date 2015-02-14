define({
  paths: {
    'jquery': '../vendor/jquery/dist/jquery',
    'bootstrap': '../vendor/bootstrap/dist/js/bootstrap',
    'angular': '../vendor/angular/angular.min',
    'ngResource': '../vendor/angular-resource/angular-resource',
    'ui.router': '../vendor/angular-ui-router/release/angular-ui-router',
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
    'ngResource': ['angular'],
    'ngBootstrap': ['angular'],
    'ngBootstrap-tpls': ['angular'],
    'ui.router': ['angular'],
    'lb.services': ['ngResource']
  }
});
