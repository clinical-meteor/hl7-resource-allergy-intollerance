// =======================================================================
// Using DSTU2  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// https://www.hl7.org/fhir/DSTU2/allergyintolerance.html
//
//
// =======================================================================

import { CardActions, CardText, DatePicker, RaisedButton, TextField, SelectField, MenuItem } from 'material-ui';
import { Col, Grid, Row } from 'react-bootstrap';

import { Bert } from 'meteor/clinical:alert';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { browserHistory } from 'react-router';
import { get } from 'lodash';
import PropTypes from 'prop-types';

let defaultAllergyIntolerance = {
  "resourceType": "AllergyIntolerance",
    'identifier': [{
      'use': 'oficial',
      'value': ''
    }],
    'clinicalStatus': 'active',
    'verificationStatus': '',
    'type': 'allergy',
    'category': ['food'],
    'code': null,
    'patient': null,
    "onsetDateTime": null,
    "reaction": [{
      "description": ""
    }],
    "criticality": 'high'
};

Session.setDefault('allergyIntoleranceUpsert', false);
Session.setDefault('selectedAllergyIntolerance', false);

export class AllergyIntoleranceDetail extends React.Component {
  getMeteorData() {
    let data = {
      clinicalStatus: 0,
      verificationStatus: 0,
      category: 0,
      type: 0,
      criticality: 0,
      allergyIntoleranceId: false,
      allergy: defaultAllergyIntolerance,
      showDatePicker: false      
    };

    if(this.props.showDatePicker){
      data.showDatePicker = this.props.showDatePicker
    }

    if (Session.get('allergyIntoleranceUpsert')) {
      data.allergy = Session.get('allergyIntoleranceUpsert');

      switch (get(data.allergy, 'clinicalStatus')) {
        case 'active':
          data.clinicalStatus = 0;  
          break;
        case 'inactive':
          data.clinicalStatus = 1;         
          break;
        case 'resolved':
          data.clinicalStatus = 2;     
          break;      
      }

      switch (get(data.allergy, 'verificationStatus')) {
        case 'unconfirmed':
          data.verificationStatus = 0;  
          break;
        case 'confirmed':
          data.verificationStatus = 1;         
          break;
        case 'refuted':
          data.verificationStatus = 2;     
          break;      
        case 'entered-in-error':
          data.verificationStatus = 3;     
          break;      
      }

      switch (get(data.allergy, 'category')) {
        case 'food':
          data.category = 0;  
          break;
        case 'medication':
          data.category = 1;         
          break;
        case 'environment':
          data.category = 2;     
          break;      
        case 'biologic':
          data.category = 3;     
          break;      
      }

      switch (get(data.allergy, 'category')) {
        case 'allergy':
          data.type = 0;  
          break;
        case 'intollerance':
          data.type = 1;         
          break;
      }

      switch (get(data.allergy, 'criticality')) {
        case 'low':
          data.criticality = 0;  
          break;
        case 'high':
          data.criticality = 1;         
          break;
        case 'unable-to-assess':
          data.criticality = 2;     
          break;      
      }

    } else {
        console.log("selectedAllergyIntolerance", Session.get('selectedAllergyIntolerance'));

        let selectedAllergyIntolerance = AllergyIntolerances.findOne({_id: Session.get('selectedAllergyIntolerance')});
        console.log("selectedAllergyIntolerance", selectedAllergyIntolerance);

        if (selectedAllergyIntolerance) {
          data.allergy = selectedAllergyIntolerance;
        }
    }

    if (Session.get('selectedAllergyIntolerance')) {
      data.allergyIntoleranceId = Session.get('selectedAllergyIntolerance');
    }  


    console.log('AllergyIntoleranceDetail[data]', data);
    return data;
  }
  renderDatePicker(showDatePicker, datePickerValue){
    if (typeof datePickerValue === "string"){
      datePickerValue = new Date(datePickerValue);
    }
    if (showDatePicker) {
      return (
        <DatePicker 
          name='datePicker'
          hintText="Date of Confirmation" 
          container="inline" 
          mode="landscape"
          value={ datePickerValue ? datePickerValue : null}    
          onChange={ this.changeState.bind(this, 'datePicker')}      
          />
      );
    }
  }
  render() {
    return (
      <div id={this.props.id} className="allergyIntoleranceDetail">
        <CardText>
          <Row>
            <Col md={3} >
              <SelectField
                id='clinicalStatusInput'
                ref='clinicalStatus'
                name='clinicalStatus'
                floatingLabelText='Clinical Status'
                value={this.data.clinicalStatus}
                onChange={ this.changeState.bind(this, 'clinicalStatus')}
                floatingLabelFixed={true}
                fullWidth
              >
                <MenuItem value={0} primaryText="active" />
                <MenuItem value={1} primaryText="inactive" />
                <MenuItem value={2} primaryText="resolved" />
              </SelectField>

              {/* <TextField
                value={ get(this, 'data.allergy.clinicalStatus', '') }
                // onChange={ this.changeState.bind(this, 'clinicalStatus')}
                // hintText="active | inactive | resolved'"
                floatingLabelFixed={true}
                fullWidth
                /><br/>   */}
            </Col>
            <Col md={3} >
              <SelectField
                id='verificationStatusInput'
                ref='verificationStatus'
                name='verificationStatus'
                floatingLabelText='Verification Status'
                value={this.data.verificationStatus}
                onChange={ this.changeState.bind(this, 'verificationStatus')}
                floatingLabelFixed={true}
                fullWidth
              >
                <MenuItem value={0} primaryText="unconfirmed" />
                <MenuItem value={1} primaryText="confirmed" />
                <MenuItem value={2} primaryText="refuted" />
                <MenuItem value={3} primaryText="entered-in-error" />
              </SelectField>
              {/* <TextField
                id='verificationStatusInput'
                ref='verificationStatus'
                name='verificationStatus'
                floatingLabelText='Verification Status'
                value={ get(this, 'data.allergy.verificationStatus', '') }
                onChange={ this.changeState.bind(this, 'verificationStatus')}
                hintText="unconfirmed | confirmed | refuted | entered-in-error"
                floatingLabelFixed={true}
                fullWidth
                /><br/>   */}
            </Col>

            <Col md={3} >
              <SelectField
                  id='categoryInput'
                  ref='category'
                  name='category'
                  floatingLabelText='Category'
                  value={this.data.category}
                  onChange={ this.changeState.bind(this, 'category')}
                  floatingLabelFixed={true}
                  fullWidth
                >
                  <MenuItem value={0} primaryText="food" />
                  <MenuItem value={1} primaryText="medication" />
                  <MenuItem value={2} primaryText="environment" />
                  <MenuItem value={3} primaryText="biologic" />
                </SelectField>
              {/* <TextField
                id='categoryInput'
                ref='category'
                name='category'
                floatingLabelText='Category'
                value={ get(this, 'data.allergy.category', '') }
                onChange={ this.changeState.bind(this, 'category')}
                hintText="food | medication | environment | biologic'"
                floatingLabelFixed={true}
                fullWidth
                /><br/> */}
            </Col>
            <Col md={3} >
              <SelectField
                id='typeInput'
                ref='type'
                name='type'
                floatingLabelText='Type'
                value={this.data.type}
                onChange={ this.changeState.bind(this, 'type')}
                floatingLabelFixed={true}
                fullWidth
              >
                <MenuItem value={0} primaryText="allergy" />
                <MenuItem value={1} primaryText="intollerance" />
              </SelectField>
              {/* <TextField
                id='typeInput'
                ref='type'
                name='type'
                floatingLabelText='Type'
                value={ get(this, 'data.allergy.type', '') }
                onChange={ this.changeState.bind(this, 'type')}
                floatingLabelFixed={true}
                fullWidth
                /><br/> */}
            </Col>
          </Row>

          <Row>
            <Col md={4} >
              <TextField
                id='identifierInput'
                ref='identifier'
                name='identifier'
                floatingLabelText='Identifier'            
                value={ get(this, 'data.allergy.identifier[0].value', '') }
                onChange={ this.changeState.bind(this, 'identifier')}
                hintText="Shellfish"
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={4} >
              <TextField
                id='reactionInput'
                ref='reaction'
                name='reaction'
                floatingLabelText='Reaction Description'
                value={ get(this, 'data.allergy.reaction[0].description', '') }
                onChange={ this.changeState.bind(this, 'reaction')}
                hintText="Hives"
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={4} >
              <SelectField
                id='criticalityInput'
                ref='criticality'
                name='criticality'
                floatingLabelText='Criticality'
                value={this.data.criticality}
                onChange={ this.changeState.bind(this, 'criticality')}
                floatingLabelFixed={true}
                fullWidth
              >
                <MenuItem value={0} primaryText="low" />
                <MenuItem value={1} primaryText="high" />
                <MenuItem value={2} primaryText="unable-to-assess" />
              </SelectField>

              {/* <TextField
                id='criticalityInput'
                ref='criticality'
                name='criticality'
                floatingLabelText='Criticality'
                value={ get(this, 'data.allergy.criticality', '') }
                onChange={ this.changeState.bind(this, 'criticality')}
                hintText="Severe"
                floatingLabelFixed={true}
                fullWidth
                /><br/>    */}
            </Col>            
          </Row>
          <Row>
            <Col md={4} >
              <TextField
                id='patientDisplayInput'
                ref='patientDisplay'
                name='patientDisplay'
                floatingLabelText='Patient'
                value={ get(this, 'data.allergy.patient.display', '') }
                onChange={ this.changeState.bind(this, 'patientDisplay')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={4} >
              <TextField
                id='recorderDisplayInput'
                ref='recorderDisplay'
                name='recorderDisplay'
                floatingLabelText='Recorder'
                value={ get(this, 'data.allergy.recorder.display', '') }
                onChange={ this.changeState.bind(this, 'recorderDisplay')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>



          <br/>
          { this.renderDatePicker(this.data.showDatePicker, get(this, 'data.allergy.onsetDateTime') ) }
          <br/>
          

        </CardText>
        <CardActions>
          { this.determineButtons(this.data.allergyIntoleranceId ) }
        </CardActions>
      </div>
    );
  }
  addToContinuityOfCareDoc(){
    console.log('addToContinuityOfCareDoc', Session.get('allergyIntoleranceUpsert'));

    var allergyIntoleranceUpsert = Session.get('allergyIntoleranceUpsert');

    alert('Temporarily disabled')
    // var newAllergy = {
    //   "resourceType": "AllergyIntolerance",
    //   'identifier': allergyIntoleranceUpsert.identifier,
    //   'clinicalStatus': allergyIntoleranceUpsert.clinicalStatus,
    //   'verificationStatus': allergyIntoleranceUpsert.verificationStatus,
    //   'type': allergyIntoleranceUpsert.type,
    //   'category': allergyIntoleranceUpsert.category,
    //   'code': null,
    //   'patient': null,
    //   "onsetDateTime": allergyIntoleranceUpsert.onsetDateTime
    // }

    // console.log('Lets write this to the profile... ', newAllergy);

    // Meteor.users.update({_id: Meteor.userId()}, {$addToSet: {
    //   'profile.continuityOfCare.allergyIntolerances': newAllergy
    // }}, function(error, result){
    //   if(error){
    //     console.log('error', error);
    //   }
    //   if(result){
    //     browserHistory.push('/continuity-of-care');
    //   }
    // });
  }

  determineButtons(allergyId){
    if (allergyId) {
      return (
        <div>
          <RaisedButton id="saveAllergyIntoleranceButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton id="deleteAllergyIntoleranceButton" label="Delete" onClick={this.handleDeleteButton.bind(this)} />

          <RaisedButton id="addAllergyToContinuityCareDoc" label="Add to CCD" primary={true} onClick={this.addToContinuityOfCareDoc.bind(this)} style={{float: 'right'}} />
        </div>
      );
    } else {
      return(
        <RaisedButton id="saveAllergyIntoleranceButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  // this could be a mixin
  changeState(field, event, value){
    let allergyUpdate;

    if(process.env.NODE_ENV === "test") console.log("AllergyIntoleranceDetail.changeState", field, event, value);

    // by default, assume there's no other data and we're creating a new allergy
    if (Session.get('allergyIntoleranceUpsert')) {
      allergyUpdate = Session.get('allergyIntoleranceUpsert');
    } else {
      allergyUpdate = defaultAllergyIntolerance;
    }

    // if there's an existing allergy, use them
    if (Session.get('selectedAllergyIntolerance')) {
      allergyUpdate = this.data.allergy;
    }

    switch (field) {
      case "identifier":
        allergyUpdate.identifier = [{
          use: 'official',
          value: value
        }];
        break;
      case "verificationStatus":
        switch (value) {
          case 0:
            allergyUpdate.verificationStatus = 'unconfirmed';
            break;
          case 1:
            allergyUpdate.verificationStatus = 'confirmed';            
            break;
          case 2:
            allergyUpdate.verificationStatus = 'refuted';        
            break;
          case 3:
            allergyUpdate.verificationStatus = 'entered-in-error';        
            break;
        }       
        break;
      case "clinicalStatus":
        switch (value) {
          case 0:
            allergyUpdate.clinicalStatus = 'active';
            break;
          case 1:
            allergyUpdate.clinicalStatus = 'inactive';            
            break;
          case 2:
            allergyUpdate.clinicalStatus = 'resolved';        
            break;
        }        
        break;
      case "type":
        switch (value) {
          case 0:
            allergyUpdate.type = 'allergy';
            break;
          case 1:
            allergyUpdate.type = 'intolerance';            
            break;
        }   
        // allergyUpdate.type = value;
        break;
      case "reaction":
        allergyUpdate.reaction = [{
          description: value
        }];
        break;
      case "category":
        // 'food', 'medication', 'environment', 'biologic'      
        switch (value) {
          case 0:
            allergyUpdate.category = ['food'];
            break;
          case 1:
            allergyUpdate.category = ['medication'];            
            break;
          case 2:
            allergyUpdate.category = ['environment'];        
            break;
          case 3:
            allergyUpdate.category = ['biologic'];        
            break;
        }   
        break;
      case "patientDisplay":
        allergyUpdate.patient = {
          display: value
        }
        break;
      case "recorderDisplay":
        allergyUpdate.recorder = {
          display: value
        }
        break;
      case "datePicker":
        allergyUpdate.onsetDateTime = value;
        break;
      case "criticality":
        switch (value) {
          case 0:
            allergyUpdate.criticality = 'low';
            break;
          case 1:
            allergyUpdate.criticality = 'high';            
            break;
          case 2:
            allergyUpdate.criticality = 'unable-to-assess';        
            break;
        }   
        // allergyUpdate.criticality = value;
        break;
  
      default:

    }

    if(process.env.NODE_ENV === "test") console.log("allergyUpdate", allergyUpdate);
    Session.set('allergyIntoleranceUpsert', allergyUpdate);
  }

  handleSaveButton(){
    let allergyIntoleranceUpdate = Session.get('allergyIntoleranceUpsert');

    if(process.env.NODE_ENV === "test") console.log("allergyIntoleranceUpdate", allergyIntoleranceUpdate);

    if (Session.get('selectedAllergyIntolerance')) {
      if(process.env.NODE_ENV === "test") console.log("Updating allergyIntolerance...");
      delete allergyIntoleranceUpdate._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      allergyIntoleranceUpdate.resourceType = 'AllergyIntolerance';

      AllergyIntolerances.update(
        {_id: Session.get('selectedAllergyIntolerance')}, {$set: allergyIntoleranceUpdate }, function(error, result) {
          if (error) {
            console.log("error", error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "AllergyIntolerances", recordId: Session.get('selectedAllergyIntolerance')});
            Session.set('allergyIntolerancePageTabIndex', 1);
            Session.set('selectedAllergyIntolerance', false);
            Session.set('allergyIntoleranceUpsert', false);
            Bert.alert('AllergyIntolerance updated!', 'success');
          }
        });
    } else {

      if(process.env.NODE_ENV === "test") console.log("create a new allergyIntolerance", allergyIntoleranceUpdate);

      AllergyIntolerances.insert(allergyIntoleranceUpdate, function(error, result) {
        if (error) {
          console.log("error", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "AllergyIntolerances", recordId: result});
          Session.set('allergyIntolerancePageTabIndex', 1);
          Session.set('selectedAllergyIntolerance', false);
          Session.set('allergyIntoleranceUpsert', false);
          Bert.alert('AllergyIntolerance added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('allergyIntolerancePageTabIndex', 1);
  }

  handleDeleteButton(){
    AllergyIntolerances.remove({_id: Session.get('selectedAllergyIntolerance')}, function(error, result){
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "AllergyIntolerances", recordId: Session.get('selectedAllergyIntolerance')});
        Session.set('allergyIntolerancePageTabIndex', 1);
        Session.set('selectedAllergyIntolerance', false);
        Session.set('allergyIntoleranceUpsert', false);
        Bert.alert('AllergyIntolerance removed!', 'success');
      }
    });
  }
}

AllergyIntoleranceDetail.propTypes = {
  hasUser: PropTypes.object
};
ReactMixin(AllergyIntoleranceDetail.prototype, ReactMeteorData);
export default AllergyIntoleranceDetail;