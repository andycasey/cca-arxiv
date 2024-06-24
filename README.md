1. Create a new spreadsheet with the column names: "Identifier", "Published", "Updated", and "Title". Note down the ID of your spreadsheet from the page URL.

2. Create a new Google Slides deck. Note down the slide ID from the page URL. Make the first page 'skipped' so it does not appear in presentation mode. This will be the master slide. Format it to your liking, and use the following strings as variables, which will be over-written by the script:

  - `{{Title}}` for the pre-print title
  - `{{Authors}}` for the author names
  - `{{Summary}}` for the summary abstract
  - `{{arXiv}}` for the arXiv number

3. Copy the script in Code.gs of this repository. Enter in the sheet ID and slide ID from earlier steps. 

4. Run the script once, as the first time you run it, it will require some authorizations from you. Confirm that it runs correctly, and that slides are added to the slide deck.

5. Set the script to execute on a daily timer. 
