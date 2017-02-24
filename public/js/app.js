'use strict';

// Declare app level module which depends on filters, and services

angular.module('countryStateMetadataGenerator', [
  'countryStateMetadataGenerator.controllers',
  'countryStateMetadataGenerator.filters',
  'countryStateMetadataGenerator.services',
  'countryStateMetadataGenerator.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/build', {
      templateUrl: 'partials/build'
    }).
    otherwise({
      redirectTo: '/build'
    });

  $locationProvider.html5Mode(true);
});
