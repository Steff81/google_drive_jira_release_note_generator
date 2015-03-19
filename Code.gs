// ---------------------------------------------------------------------------------------------------------------------------------------------------
// The MIT License (MIT)
// 
// Copyright (c) 2014 Steffen Edinger
// Inspired by Iain Brown - http://www.littlebluemonkey.com/blog/automatically-import-jira-backlog-into-google-spreadsheet

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/* 
This script gets the issues from JIRA for a specific project to generate the release notes in a Spreadsheet for further usage.
Please note, that the name of the headers in the spreadsheet are mapped to the field names of your JIRA Instance,
that means the spreadsheet column header Key will result in the colums values ISSUE-1, ISSUE-2, ISSUE-3...
! Please take care that the name of the sheet (not the document) has to be "Release" (without the quotes) !
*/

//this part of the script is executed when the spreadsheet is opened. 
//there is created a menu entry explicitly for JIRA with several options.
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{name: "Jira Settings", functionName: "jiraSetup"},{name: "Create Release Notes", functionName: "createReleaseNotes"}]; 
  spreadsheet.addMenu("Jira", menuEntries);
 }

//This is the configure script which will be calledfrom the menu
//This need to be done before each Release Note creation run.
function jiraSetup() {
  
  var project = Browser.inputBox("Enter the JIRA project name you want to create the release note from. e.g. PROJECT1", "Project", Browser.Buttons.OK);
  ScriptProperties.setProperty("project", project.toUpperCase());
  
  var host = Browser.inputBox("Enter the HOST name of your JIRA instance eg. company1.atlassian.net ", "Host", Browser.Buttons.OK);
  ScriptProperties.setProperty("host", host);
  
  var userPassword = Browser.inputBox("Enter your Jira UserID and Password in the form User:Password. e.g. name1.name2:yourpassword", "UserID:Password", Browser.Buttons.OK_CANCEL);
  var x = Utilities.base64Encode(userPassword);
  ScriptProperties.setProperty("digest", "Basic " + x);
 
  Browser.msgBox("All Jira settings saved.");  
}  

// parse and return the available fields
function getFields() {
  return Utilities.jsonParse(getDataForAPI("field"));
}  

// get the issues for the release notes
function getIssues() {
  var allData = {issues:[]};
  
  var data = {startAt:0,maxResults:0,total:1};
  var startAt = 0;
  
  var searchString = "search?jql=project+%3D+"+ScriptProperties.getProperty("project")+"+AND+fixVersion+%3D+%22"+ScriptProperties.getProperty("version")+"%22+AND+status+%3D+closed"
  
  //get the issues, all or by using limit and pagination
  while (data.startAt + data.maxResults < data.total) {
    data =  Utilities.jsonParse(getDataForAPI(searchString));  
    allData.issues = allData.issues.concat(data.issues);
    startAt = data.startAt + data.maxResults;
  }  
  return allData;
}  

// get's the data via rest api
function getDataForAPI(path) {
   var url = "https://" + ScriptProperties.getProperty("host") + "/rest/api/2/" + path;
   var digestfull = ScriptProperties.getProperty("digest");
  
   var headers = { 
              "Accept":"application/json", 
              "Content-Type":"application/json", 
              "method": "GET",
              "headers": {"Authorization": digestfull},
              "muteHttpExceptions": true,
              // set to false if you don't want the certificate to be checked
              // in case of self signed ssl certificates for example
              "validateHttpsCertificates" : true,
              // if you need a reverse proxy this setting may be helpful
              "followRedirects" : true
             };
  
  var response = UrlFetchApp.fetch(url, headers);
  
  if (response.getResponseCode() != 200) {
    Browser.msgBox("Error getting data from " + url + ":" + response.getContentText());
    return "";
  } else {
    return response.getContentText();
  }  
}  

// main function which is called to retrieve all issues
function createReleaseNotes() {
  
  var version = Browser.inputBox("Enter the version string for your Jira Project. e.g. Project Release V4.1.1", "Prefix", Browser.Buttons.OK);
  ScriptProperties.setProperty("version", version);  
  
  //get all available Fields from JIRA
  var allFields = getAllFields();
  //get all available Issues from JIRA
  var data = getIssues();
  
  if (allFields === "" || data === "") {
    Browser.msgBox("Error pulling data from Jira.");
    return;
  }  
  
  //read the headings to get the needed fields
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Release");
  var headings = ss.getRange(1, 1, 1, ss.getLastColumn()).getValues()[0];
  
  var y = new Array();
  for (i=0;i<data.issues.length;i++) {
    var dataElement=data.issues[i];
    y.push(getIssue(dataElement, headings, allFields));
  }  
  
  spreadSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Release");
  var last = spreadSheet.getLastRow();
  if (last >= 2) {
    spreadSheet.getRange(2, 1, spreadSheet.getLastRow()-1, spreadSheet.getLastColumn()).clearContent();  
  }  
  
  if (y.length > 0) {
    spreadSheet.getRange(2, 1, data.issues.length,y[0].length).setValues(y);
  }
  spreadSheet = SpreadsheetApp.getActiveSpreadsheet().set
}

// get all available fields
function getAllFields() {
  
  var theFields = getFields();
  var allFields = new Object();
  
  allFields.ids = new Array();
  allFields.names = new Array();
  
  for (var i = 0; i < theFields.length; i++) {
      allFields.ids.push(theFields[i].id);
      allFields.names.push(theFields[i].name.toLowerCase());
  }  
  //Logger.log(allFields);
  return allFields;
}  

// get single issue with needed fields
function getIssue(data,headings,fields) {
  var issue = [];
  for (var i = 0;i < headings.length;i++) {
    if (headings[i] !== "") {
      issue.push(getDataForHeading(data,headings[i].toLowerCase(),fields));
    }  
  }        
  return issue;
}  

// matches headings and data
function getDataForHeading(data,heading,fields) {
 
      if (data.hasOwnProperty(heading)) {
        return data[heading];
      }  
      else if (data.fields.hasOwnProperty(heading)) {
        return data.fields[heading];
      }  
  
      var fieldName = getFieldName(heading,fields);
  
      if (fieldName !== "") {
        if (data.hasOwnProperty(fieldName)) {
          return data[fieldName];
        }  
        else if (data.fields.hasOwnProperty(fieldName)) {
          return data.fields[fieldName];
        }  
      }
  
      var splitName = heading.split(" ");
  
      if (splitName.length == 2) {
        if (data.fields.hasOwnProperty(splitName[0]) ) {
          if (data.fields[splitName[0]] && data.fields[splitName[0]].hasOwnProperty(splitName[1])) {
            return data.fields[splitName[0]][splitName[1]];
          }
          return "";
        }  
      }    
  return "Could not find value for " + heading;   
}  

// Check if heading is really a field and return it
function getFieldName(heading, fields) {
  var index = fields.names.indexOf(heading);
  if ( index > -1) {
     return fields.ids[index]; 
  }
  return "";
}    
               
