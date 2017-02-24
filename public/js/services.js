'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('countryStateMetadataGenerator.services', []).
  value('version', '0.1').
  service('selectionStore', function(){

    var store = {};
    var storedData = {};
    store.set = function(data) {
      storedData = data;
    };
    store.get = function() {
      return storedData;
    };

    return store;
  }).
  service('stateMetadataGenerator', function() {

    var gen = {};
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
  }).
  service('countryMetadataGenerator', function(){
    var gen = {};
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
  });
