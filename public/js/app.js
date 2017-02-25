'use strict';

/**
 * Initialize Angular.js application.
 */

angular.module('countryStateMetadataGenerator', [
  'countryStateMetadataGenerator.controllers',
  'countryStateMetadataGenerator.services',
]).
config(function ($routeProvider, $locationProvider) {

  // Configure the route to the build page
  $routeProvider.
    when('/build', {
      templateUrl: 'partials/build'
    }).
    otherwise({
      redirectTo: '/build'
    });

  // Set location to use HTML5 history
  $locationProvider.html5Mode(true);
});
