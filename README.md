# XCBuddiesHack
Xcontest Air Buddies - add any flight with a greasemonkey script
* Install the Tampermonkey extension in Chromium (I did not try other browser and Greasemonkey yet)
* Install the [XCBuddiesHack.user.js](https://github.com/ngmhun/XCBuddiesHack/raw/main/XCBuddiesHack.user.js)
* Go to the XContest flight listing pages *(should work for all countries, not only for the World XContest)*, for example:
    - [Daily score PG page](https://www.xcontest.org/world/en/flights/daily-score-pg/)
    - [Flight search page](https://www.xcontest.org/world/en/flights-search/)
* You should see a new button in the top menu: **Select flights**.
* By pressing this button, checkboxes will appear in the flight list.
* You can select any number of flights with these checkboxes, or you can select all items on the page with the checkbox in the table header.
* You can clear the list of selected flights with the **Clear flights** button.
* Then you can go to a flight and there you will have another button: **Add flights**
* By pressing the **Add flights** button, your previously selected flights will appear above the "Air Buddies" list, where you can add these flights to the map with the checkboxes.

Thanks to Szilárd Farkas, this [gist](https://gist.github.com/lupus78/172adef33fc5163956b3b5adcbc19fa1) contains the main idea.

Version: 0.3

TODO: fix bugs, add features :-)
