'use strict';

/**
 * Initialize Angular.js services for this application.
 */
angular.module('countryStateMetadataGenerator.services', []).

  /**
   * Create a service to generate metadata for country entries.
   * @return {Object}   A generator object with the do() method to perform
   *                      the XML generation.
   */
  service('countryMetadataGenerator', function(){

    /**
     * The gen object to hold the service methods.
     * @type {Object}
     */
    var gen = {};

    /**
     * Generate KGRenewal__Country__mdt metadata for the given state entry.
     * @method do
     * @param  {Object} country The country entry to convert.
     * @return {String} KGRenewal__Country__mdt data for the state.
     */
    gen.do = function(country) {
      return `<?xml version="1.0" encoding="UTF-8"?>
  <CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>${country.name}</label>
    <protected>false</protected>
    <values>
        <field>KGRenewal__IsoCode__c</field>
        <value xsi:type="xsd:string">${country.code}</value>
    </values>
  </CustomMetadata>`;
    };

    return gen;
  }).

  /**
   * Create a service to generate metadata for state entries.
   * @return {Object}   A generator object with the do() method to perform
   *                      the XML generation.
   */
  service('stateMetadataGenerator', function() {

    /**
     * The gen object to hold the service methods.
     * @type {Object}
     */
    var gen = {};

    /**
     * Generate KGRenewal__State__mdt metadata for the given state entry.
     * @method do
     * @param  {Object} state The state entry to convert.
     * @return {String} KGRenewal__State__mdt data for the state.
     */
    gen.do = function(state) {
      return `<?xml version="1.0" encoding="UTF-8"?>
<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <label>${state.name}</label>
    <protected>false</protected>
    <values>
        <field>KGRenewal__Country__c</field>
        <value xsi:type="xsd:string">${state.parent}</value>
    </values>
    <values>
        <field>KGRenewal__IsoCode__c</field>
        <value xsi:type="xsd:string">${state.code.replace(state.parent + '-', '')}</value>
    </values>
</CustomMetadata>`;
    };

    return gen;
  });
