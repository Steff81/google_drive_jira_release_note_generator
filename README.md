google_drive_jira_release_note_generator
========================================

Generates Release Notes from your JIRA instance via Rest API to a Google Drive Spreadsheet.

This script gets the issues from JIRA for a specific project to generate the release notes in a Spreadsheet for further usage. Please note, that the name of the headers in the spreadsheet are mapped to the field names of your JIRA Instance, that means the spreadsheet column header Key will result in the colums values PROJECT-1, PROJECT-2, PROJECT-3...

! Please take care that the name of the sheet (not the document) has to be "Release" (without the quotes) !

Usage:   
1. Open Google Drive and create a new spreadsheet.     
2. Name the Document "ReleaseNotes" and the spreadsheet "Release"    
3. In Cell A1 write: Key, in the Cell A2 write: Summary    
4. Open the Script Editor and Insert the script from this repo    
4. Save the Sheet and reopen it.    
5. Give the Sheet the allowed permission if asked.   
6. Now you should see Menu Entries JIRA     
7. Open JIRA Settings and fill in all required information   
8. After the settings are saved goto to the menu again and chosse "Create Release Notes"   
9. Enter the name of the Release you want to create the release notes for   
     
Have fun the issues will appear below the heading.   
    
You can extend the release note with all available fields by adding a new header field   
The name of the heading have to match the field name in JIRA.    
It is also possible to add customFields to the header.   

Your spreadsheet will look like this:  
![Spreadsheet](http://steffenedinger.de/wordpress/wp-content/uploads/2014/10/Schnappschuss-2014-10-10-19.55.34.png "Spreadsheet")
