'use strict';

/**
 * Initialize Angular.js controllers for this application.
 */
angular.module('countryStateMetadataGenerator.controllers', []).

  /**
   * Main controller for the metadata builder. This controller initializes the
   * list of available countries and allows user to select which countries to
   * include in their download. It then preps and dowloads a zip file with
   * formatted metadata for use in the Kinetic Growth application.
   */
  controller('MetadataBuilderCtrl', function ($scope, $http, countryMetadataGenerator, stateMetadataGenerator) {

    /**
     * Country and state codes pulled from the api.
     * @type {Object}
     */
    $scope.countries = {};

    /**
     * Search query provided by the user to find a country.
     * @type {String}
     */
    $scope.query = '';

    /**
     * Filtered list of codes based on the query supplied by the user. When no
     * query has been supplied this list contains all codes.
     * @type {Object}
     */
    $scope.filteredEntries = {};

    /**
     * Countries that have been selected by the user for inclusion in the download.
     * @type {Array}
     */
    $scope.selectedEntries = [];

    /**
     * Filter the list of countries based on the user query. This does a case-insensitive
     * match and updates the $scope.filteredEntries object to contain only
     * matching countries.
     * @method filter
     * @param  {String} query The search string.
     */
    $scope.filter = function(query) {

      // If we have a query, search for matching countries
      if(query && query.length) {
        $scope.filteredEntries = {};
        for(var key in $scope.countries) {
          var entry = $scope.countries[key];
          if(entry.name.toLowerCase().includes(query.toLowerCase())) {
            $scope.filteredEntries[entry.code] = entry;
          }
        };
      }
      // Otherwise just set the filtered list to the full list
      else {
        $scope.filteredEntries = $scope.countries;
      }
    };

    /**
     * Update the selected entries list after the user has changed the selected
     * status of a country.
     * @method updateSelection
     */
    $scope.updateSelection = function() {
      $scope.selectedEntries = [];
      for(var key in $scope.countries) {
        var entry = $scope.countries[key];
        if(entry.selected) {
          $scope.selectedEntries.push(entry);
        }
      };
    };

    /**
     * Download the selected countries (with their states) as a zip file.
     * @method download
     */
    $scope.download = function() {

      // Initialize a new JSZip object for zip file generation.
      var zip = new JSZip();

      // Prep our top level folder with the customMetadata folder inside.
      var customMetadataFolder = zip.folder('KGRenewal-custom-metadata').folder('customMetadata');

      // For each selected country use the countryMetadataGenerator service to
      // generate the XML and add it as a file in the customMetadata folder.
      $scope.selectedEntries.forEach(function(country){
        customMetadataFolder.file(`KGRenewal__Country.${country.code}.md`, countryMetadataGenerator.do(country));

        // For each state in the selected country use the stateMetadataGenerator
        // service to generate the XML and add it as a file in the customMetadata
        // folder. The file for states will be <CountryCode>_<StateCode> to ensure
        // that we have unique file names and that states are easy to identify
        // without reading the XML.
        country.states.forEach(function(state){
          customMetadataFolder.file(`KGRenewal__State.${state.code.replace('-', '_')}.md`, stateMetadataGenerator.do(state));
        });
      });

      // Generate our zip using the async method which uses a promise to handle
      // the success.
      zip.generateAsync({type:"base64"})
      .then(function (content) {

        // Create a new anchor tag in the DOM
        var element = document.createElement('a');

        // Use a data url to set the download contents of the link using the
        // base64 content returned by the zip generator.
        element.setAttribute('href', 'data:application/zip;charset=utf-8;base64,' + content);

        // Force a file download on the link
        element.setAttribute('download', 'kgrenewal-custom-metadata.zip');

        // Hide the element and append it to the DOM
        element.style.display = 'none';
        document.body.appendChild(element);

        // Click the element to trigger a download
        element.click();

        // Remove the element from the DOM once the download is in progress
        document.body.removeChild(element);
      });
    };

    // Get the list of codes from the API and assign them do the data. If there
    // is an error getting the codes the $scope.status flag will be set to false.
    $http({
      method: 'GET',
      url: '/api/codes'
    }).
    success(function (data, status, headers, config) {
      $scope.countries = data;
      $scope.filteredEntries = $scope.countries;
      $scope.status = true;
    }).
    error(function (data, status, headers, config) {
      $scope.status = false;
    });

  });
