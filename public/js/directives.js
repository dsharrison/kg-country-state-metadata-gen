'use strict';

/* Directives */

angular.module('countryStateMetadataGenerator.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });
