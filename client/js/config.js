define({
  paths: {
    'jquery': '../vendor/jquery/dist/jquery',
    'bootstrap': '../vendor/bootstrap/dist/js/bootstrap',
    'angular': '../vendor/angular/angular.min',
    'angular-th': 'https://code.angularjs.org/1.2.5/i18n/angular-locale_th-th',
    'ngRoute': '../vendor/angular-route/angular-route.min',
    'ngResource': '../vendor/angular-resource/angular-resource',
    'ngBootstrap': '../vendor/angular-bootstrap/ui-bootstrap',
    'ngBootstrap-tpls': '../vendor/angular-bootstrap/ui-bootstrap-tpls',
    'lb.services': 'js/lb-services',
    'util.services': 'js/util'
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
    'angular-th': ['angular'],
    'ngBootstrap-tpls': ['angular'],
    'lb.services': ['ngResource'],
    'util.services': ['angular', 'lb.services'],
  }
});
