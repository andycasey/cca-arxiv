
# Setup Guide

1. [Create a new Google Sheet](https://docs.google.com/spreadsheets/create) with the column names: "Identifier", "Published", "Updated", and "Title". 

2. Note down the ID of your spreadsheet from the page URL. If the URL has the form ``https://docs.google.com/spreadsheets/d/THIS-IS-YOUR-SHEET-ID/edit?gid=0#gid=0` then the text where `THIS-IS-YOUR-SHEET-ID` is in the template, is your spreadsheet ID.

2. Create a new Google Slides deck. Format the first slide to your liking. This will be the "template" slide. Set the slide to 'skipped' mode so it doesn't appear in presentation mode. You can use the following strings as variables, which will be over-written by the script when it creates new slides:
  - `{{Title}}` for the pre-print title
  - `{{Authors}}` for the author names
  - `{{Summary}}` for the summary abstract
  - `{{arXiv}}` for the arXiv number

3. Note down the ID of your Google Slides deck. This will be in a similar format to what you saw for the Spreadsheet.

4. From your Spreadsheet, navigate the menu to Extensions -> Apps Script. Copy the script in `Code.gs` of this repository. Update the first few lines of the script to include your sheet ID and slide ID.

5. In Google Apps Script, Run the `createSlidesForNewArticles` function. It requires some authorizations from you the first time it runs. Confirm that it runs correctly. You should see slides get added to the slide deck, and papers appearing in the Google Sheet.

5. Navigate to the Triggers menu in Google Apps Script, and set the script to run on some frequency (e.g., daily, or weekly).


# User Guide

The user should already have read/write access to the Google Slide deck, and the Google Sheet.

The Google Slide deck is where new slides are added. The Google Sheet keeps track of which arXiv pre-prints that have already been added to the Google Slide deck. Having this information in the Google Sheet means that we can edit or remove slides (e.g., like a conference proceeding, or a paper without any CCA researchers which accidentally appeared in the list) and the script won't re-add those papers if they are already listed in the Google Sheet.

If you do want the script to re-create slides with particular papers, then you can just delete the relevant rows in the Google Sheet, and the next time the script runs it will create slides for those deleted papers.

## Changing the slide style

You can change the style of new slides by changing the first slide in the Google Slide deck. You can do things like set text to shrink if it overflows, change text styling, and placement of logos. The next time the script runs, it will use your new styling.


If you want to change the styling for all the papers in your slide deck, just delete the corresponding rows from the Google Sheet once you've finished changing your styling. You can run the script straight away from Google Apps Script by selecting the `createSlidesForNewArticles` function from the drop-down menu and clicking 'Run', or just wait until it next executes automatically.

