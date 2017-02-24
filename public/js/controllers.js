'use strict';

/* Controllers */

angular.module('countryStateMetadataGenerator.controllers', []).
  controller('MetadataBuilderCtrl', function ($scope, $http, selectionStore, countryMetadataGenerator, stateMetadataGenerator) {

    $scope.iso_3166_2 = {};
    $scope.filteredEntries = {};
    $scope.selectedEntries = [];
    $scope.selectedCountries = [];

    $http({
      method: 'GET',
      url: '/api/iso_3166_2'
    }).
    success(function (data, status, headers, config) {
      $scope.iso_3166_2 = data;
      $scope.filteredEntries = $scope.iso_3166_2;
      console.dir($scope.iso_3166_2);
      $scope.status = true;
    }).
    error(function (data, status, headers, config) {
      $scope.status = false;
    });

    $scope.query = '';

    $scope.filter = function(query) {

      if(query && query.length) {
        $scope.filteredEntries = {};
        for(var key in $scope.iso_3166_2) {
          var entry = $scope.iso_3166_2[key];
          if(entry.name.toLowerCase().includes(query.toLowerCase())) {
            $scope.filteredEntries[entry.code] = entry;
          }
        };
      }
      else {
        $scope.filteredEntries = $scope.iso_3166_2;
      }
    }

    $scope.updateSelection = function() {
      $scope.selectedEntries = [];
      for(var key in $scope.iso_3166_2) {
        var entry = $scope.iso_3166_2[key];
        if(entry.selected) {
          $scope.selectedEntries.push(entry);
        }
      };
    }

    $scope.download = function() {

      var zip = new JSZip();
      var customMetadataFolder = zip.folder('KGRenewal-custom-metadata').folder('customMetadata');

      $scope.selectedEntries.forEach(function(country){
        customMetadataFolder.file(`KGRenewal__Country.${country.code}.md`, countryMetadataGenerator.do(country));
        country.states.forEach(function(state){
          customMetadataFolder.file(`KGRenewal__State.${state.code.replace('-', '_')}.md`, stateMetadataGenerator.do(state));
        });
      });

      zip.generateAsync({type:"base64"})
      .then(function (content) {
          var element = document.createElement('a');
          element.setAttribute('href', 'data:application/zip;charset=utf-8;base64,' + content);
          element.setAttribute('download', 'custom-metadata.zip');

          element.style.display = 'none';
          document.body.appendChild(element);

          element.click();

          document.body.removeChild(element);
      });
    };

  });
