function createSlidesForNewArticles() {
  const sheetId = "1uuTPLAno-bL0X7CZpXnak4IdjCZmFa97v2jwJm4yaPE";
  const presentationId = "1vR57B2ckxiIPgAL6rwlOedPWnuCr9LvqlI1itZD86LA";
  const sourceSlideIndex = 0;

  // Open the spreadsheet and get the data range
  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  var last_row = sheet.getLastRow();
  const dataRange = sheet.getRange("A2:A" + last_row); 
  const existing_arXiv_identifiers = dataRange.getValues().map(sublist => sublist.map(num => String(num))[0]);

  var feed = queryArXiv();
  var entries = parseArXiv(feed);

  last_row += 1;

  // The first sheet key is what we check against for uniqueness
  sheet_keys = ["arXiv", "published", "updated", "title"]
  entries.forEach(entry => {
    // Check whether this entry has already been added to the slide deck or not.    
    if (existing_arXiv_identifiers.indexOf(entry[sheet_keys[0]]) === -1) {
      createNewSlide(entry, presentationId, sourceSlideIndex);
      for (let column = 0; column < sheet_keys.length; column++) {
        sheet.getRange(last_row, 1 + column).setValue(entry[sheet_keys[column]]);
      }
      last_row += 1;
    }
  });
}

function queryArXiv() {
  var response = UrlFetchApp.fetch(
      "https://export.arxiv.org/api/query"
  +   "?search_query=all:%22Center%20for%20Computational%20Astrophysics%22"
  +   "&start=0"
  +   "&max_results=10" // hard assertion that there won't be 10 new CCA arXiv pre-prints per day
  +   "&sortBy=submittedDate"
  +   "&sortOrder=descending"
  );
  return response.getContentText();
}

function parseArXiv(feed) {
  // replace new lines with spaces to prevent the XmlService stripping them
  var document = XmlService.parse(feed.replace("\n", " \n"));
  keys_simple_parse = ["id", "title", "published", "updated", "summary"];
  var entries = [];
  document.getRootElement().getChildren().forEach(item => {
    if (item.getName() == "entry") {
      // this should be able to use item.getChild(), but Google's XML service doesn't do it..
      var parsed_entry = {authors: []};
      item.getChildren().forEach(sub_item => {
        name = sub_item.getName();
        if (keys_simple_parse.indexOf(name) !== -1) {
          parsed_entry[name] = (
            sub_item
            .getText()
            .replace(/\n/g, ' ')
            .replace(/\r/g,  ' ')
            .replace(/^\s+/, "") // remove starting whitespace.
            //.replace("$", "$$") // for auto-latex
          );
        }
        if (name == "author") {
          // parse the author info
          parsed_author = {
            affiliations: [],
            has_cca_affiliation: false
          }
          sub_item.getChildren().forEach(author_attr => {
            if (author_attr.getName() == "name") {
              parsed_author["name"] = author_attr.getText().replace(/^\s+/, "");
            }
            else {
              affiliation_text = author_attr.getText();
              parsed_author["affiliations"].push(affiliation_text);
              if (
                (affiliation_text.indexOf("Center for Computational Astrophysics") !== -1)
              | (affiliation_text.indexOf("Centre for Computational Astrophysics") !== -1)
                ) {
                parsed_author["has_cca_affiliation"] = true;
              }
            }
          })
          parsed_entry["authors"].push(parsed_author)
        }
      });
      const arxiv_number = parsed_entry["id"].split("/").pop().split("v")[0];
      parsed_entry["arXiv"] = arxiv_number;
      entries.push(parsed_entry);
    }
  })
  return entries;
}




function copySlideReplaceText(presentationId, sourceSlideIndex, replaceTextMap) {
  // Open source and target presentations
  const sourcePresentation = SlidesApp.openById(presentationId);
  // Get the source slide and create a new slide in the target presentation
  const sourceSlide = sourcePresentation.getSlides()[sourceSlideIndex];
  const newSlide = sourceSlide.duplicate();

  // Loop through elements in the source slide
  newSlide.getShapes().forEach(element => {
    // Check if the element type is text and replace text based on the map
    if (element.getText() && replaceTextMap) {
      for (const [oldText, newText] of Object.entries(replaceTextMap)) {
        element.getText().replaceAllText(oldText, newText);
      }
    }
  });
  newSlide.setSkipped(false);
}


function createNewSlide(article, presentationId, sourceSlideIndex=0, show_max_authors=30) {
  // Create a mapping from the template entries 
  if (article["authors"].length > show_max_authors) {
    var author_names = article["authors"][0]["name"];
    var cca_author_names = []
    article["authors"].forEach(author => {
      if (author["has_cca_affiliation"]) {
        cca_author_names.push(author["name"]);
      }
    })
    if ((cca_author_names.length > 0) & (cca_author_names[0] != article["authors"][0]["name"])) {
      author_names = author_names + " et al., including " + cca_author_names.join(", ");
    }
    else {
      author_names += " et al.";
    }
  }
  else {
    var author_names = []
    article["authors"].forEach(author => {
      author_names.push(author["name"]);
    })
    author_names = author_names.join(", ")
  }
  const replaceTextMap = { 
    "{{Summary}}": article["summary"],
    "{{Title}}": article["title"],
    "{{Authors}}": author_names,
    "{{arXiv}}": article["arXiv"],
  }; // Map   
  copySlideReplaceText(presentationId, sourceSlideIndex, replaceTextMap);
}

