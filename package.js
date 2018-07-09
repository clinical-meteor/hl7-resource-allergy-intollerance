Package.describe({
  name: 'clinical:hl7-resource-allergy-intolerance',
  version: '1.2.10',
  summary: 'HL7 FHIR Resource - AllergyIntolerance',
  git: 'https://github.com/clinical-meteor/hl7-resource-allergy-intolerance',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-platform');
  api.use('mongo');
  api.use('aldeed:simple-schema@1.3.3');
  api.use('aldeed:collection2@2.5.0');
  api.use('simple:json-routes@2.1.0');
  api.use('momentjs:moment@2.17.1');
  api.use('ecmascript@0.9.0');
  api.use('session');
  api.use('http');
  api.use('react-meteor-data@0.2.15');

  api.use('clinical:glass-ui@2.2.4');
  api.use('clinical:extended-api@2.2.2');
  api.use('clinical:base-model@1.3.5');
  api.use('clinical:user-model@1.5.0');
  api.use('clinical:hl7-resource-datatypes@3.0.1');
  api.use('clinical:hl7-resource-bundle@1.3.10');
  api.use('matb33:collection-hooks@0.7.15');
  api.use('clinical:alert@2.1.3');

  api.addFiles('lib/AllergyIntolerances.js');

  api.addFiles('server/rest.js', 'server');
  api.addFiles('server/initialize.js', 'server');
  api.addFiles('server/methods.js', 'server');

  if(Package['clinical:fhir-vault-server']){
    api.use('clinical:fhir-vault-server@0.0.3', ['client', 'server'], {weak: true});
  }

  api.export('AllergyIntolerance');
  api.export('AllergyIntolerances');
  api.export('AllergyIntoleranceSchema');

  api.mainModule('index.jsx', 'client');
});
