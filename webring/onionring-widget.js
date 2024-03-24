// onionring.js is made up of four files - onionring-widget.js (this one!), onionring-index.js, onionring-variables.js and onionring.css
// it's licensed under the cooperative non-violent license (CNPL) v4+ (https://thufie.lain.haus/NPL.html)
// it was originally made by joey + mord of allium (蒜) house, last updated 2020-11-24

// === ONIONRING-WIDGET ===
//this file contains the code which builds the widget shown on each page in the ring. ctrl+f 'EDIT THIS' if you're looking to change the actual html of the widget

var tag = document.getElementById(ringID); //find the widget on the page

thisSite = window.location.href; //get the url of the site we're currently on
thisIndex = null;

// go through the site list to see if this site is on it and find its position
for (i = 0; i < sites.length; i++) {
  if (thisSite.startsWith(sites[i])) { //we use startswith so this will match any subdirectory, users can put the widget on multiple pages
    thisIndex = i;
    break; //when we've found the site, we don't need to search any more, so stop the loop
  }
}

function randomSite() {
  otherSites = sites.slice(); //create a copy of the sites list
  otherSites.splice(thisIndex, 1); //remove the current site so we don't just land on it again
  randomIndex = Math.floor(Math.random() * otherSites.length);
  location.href = otherSites[randomIndex];
}

//if we didn't find the site in the list, the widget displays a warning instead
if (thisIndex == null) {
  tag.insertAdjacentHTML('afterbegin', `
<table>
  <tr>
    <td>This site isn't part of the ${ringName} webring yet. You should talk to the manager to have your site added to the list!</td>
  </tr>
</table>
  `);
}
else {
  //find the 'next' and 'previous' sites in the ring. this code looks complex
  //because it's using a shorthand version of an if-else statement to make sure
  //the first and last sites in the ring join together correctly
  previousIndex = (thisIndex - 1 < 0) ? sites.length - 1 : thisIndex - 1;
  nextIndex = (thisIndex + 1 >= sites.length) ? 0 : thisIndex + 1;

  indexText = ""
  //if you've chosen to include an index, this builds the link to that
  if (useIndex) {
    indexText = `<a href='${indexPage}'>index</a> | `;
  }

  //this is the code that displays the widget - EDIT THIS if you want to change the structure
  tag.insertAdjacentHTML('afterbegin', `
  <div id="daily-checkers-logo" class="logo-outer">
    <img src="https://nekkostarr.nekoweb.org/daily-checkers-frontend/img/checkerBoardSpriteTileNeg45Deg.png"
        alt="" class="slanted-board">
    <a href='${sites[previousIndex]}' title="Previous" class="piece-1">&lt;</a>
    <a title="Member List" href='${indexPage}' class="index daily">The Daily</a>
    <img ${useRandom ? "onclick='randomSite()'" : ""} class="clock" src="https://nekkostarr.nekoweb.org/daily-checkers-frontend/img/clock.gif"
        alt="A ticking clock" title="Random">
    <a title="Member List" href='${indexPage}' class="index checkers">Checkers</a>
    <a href='${sites[nextIndex]}' title="Next" class="piece-2">&gt;</a>
</div> 
  `);

}