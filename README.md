Google Drive - JIRA Release Notes Generation Script
==================================================

Generates Release Notes from your JIRA instance via Rest API to a Google Drive Spreadsheet.   
   
Requirements:   
- You must have the JIRA REST API enabled in your JIRA instance to use this script.     
- You need a Goole Drive Account.   
- You need a Jira Account.  
- You need the permissions to the JIRA project you want to create the release note for.   

This script gets the issues from JIRA for a specific project to generate the release notes in a Spreadsheet for further usage. Please note, that the name of the headers in the spreadsheet are mapped to the field names of your JIRA Instance, that means the spreadsheet column header Key will result in the colums values ISSUE-1, ISSUE-2, ISSUE-3...   
    
! Please take care that the name of the sheet (not the document) has to be "Release" (without the quotes) !   
    
Usage:   
1. Open Google Drive and create a new spreadsheet.     
2. Name the Document "ReleaseNotes" and the spreadsheet "Release"    
3. In Cell A1 write: Key, in the Cell A2 write: Summary    
4. Open the Script Editor and Insert the script from this repo (Tools -> Scripteditor)  
5. Save the file in the script Editor and enter any name.     
6. Save the Sheet and reopen it.    
7. Now you should see Menu entry JIRA.   
8. Open JIRA->Settings and fill in all required information.     
9. Give the Sheet the allowed permission if needed.  
10. After the settings are saved goto to the menu again and choose JIRA->Create Release Notes     
11. Enter the name as string of the Release you want to create the release notes for (Release must be in the same project that was entered during the setup settings)   
     
Have fun, the issues data will appear below the corresponding headers.   
    
You can extend the release note with all available fields by adding a new header field   
The name of the heading have to match the field name in JIRA.    
It is also possible to add customFields to the header.   

Your spreadsheet will look like this:  
![Spreadsheet](http://steffenedinger.de/wordpress/wp-content/uploads/2014/10/Schnappschuss-2014-10-10-19.55.34.png "Spreadsheet")
