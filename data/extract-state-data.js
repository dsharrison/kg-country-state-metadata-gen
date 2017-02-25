/**
 * Use the script below on the /i18n/ConfigureCountry.apexp page to quickly
 * print all state values to the console as a JSON array.
 */
var data = [];
var rows = document.querySelectorAll('#configurecountry\\:form\\:stateRelatedListComponent\\:configStateCountryRelList\\:list\\:table\\:tb tr');
rows.forEach(function(row){

  var nameCell = row.querySelector('td:nth-child(4)');
  var codeCell = row.querySelector('td:nth-child(5)');

  var state = {
    name: nameCell.innerText,
    code: codeCell.innerText
  }

  data.push(state);
});

console.log(JSON.stringify(data));
