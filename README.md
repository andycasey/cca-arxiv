# User guide

The user should have read/write access to the Google Slide deck, and the Google Sheet.

The Google Slide deck is where new slides are added, and the Google Sheet keeps track of arXiv pre-prints that have already been added to the Google Slide deck. Having this stored in the Google Sheet means that we can change the Slide style guide, add or edit slides, and not have the script populate multiple slides for the same pre-print.

## If you want to change the style of new slides

Just change the style of the first slide on the Google Slide deck. Next time the script runs, it will use that styling.

## If you want the script to re-create slides for some pre-prints

For example, you changed the styling and you want the most recent 10 papers to be re-created. Just delete the corresponding rows from the Google Sheet. The next time the script runs, it will re-create those slides.

## Run the script manually, instead of waiting for the automatic trigger

Open Google Apps and select the `createSlidesForNewArticles` function from the drop-down menu. Then click the 'Run' button.


# Installation guide

1. Create a new spreadsheet with the column names: "Identifier", "Published", "Updated", and "Title". Note down the ID of your spreadsheet from the page URL.

2. Create a new Google Slides deck. Note down the slide ID from the page URL. Make the first page 'skipped' so it does not appear in presentation mode. This will be the master slide. Format it to your liking, and use the following strings as variables, which will be over-written by the script:

  - `{{Title}}` for the pre-print title
  - `{{Authors}}` for the author names
  - `{{Summary}}` for the summary abstract
  - `{{arXiv}}` for the arXiv number

3. Copy the script in Code.gs of this repository. Enter in the sheet ID and slide ID from earlier steps. 

4. Run the script once, as the first time you run it, it will require some authorizations from you. Confirm that it runs correctly, and that slides are added to the slide deck.

5. Set the script to execute on a daily timer. 
