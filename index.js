// Julia Garbe 2020

// Possible future improvement: display movie posters
// let poster = document.getElementById('poster');
// poster.src = Object.values(jcontent)[0][0].Poster;

let nominations = [];

// Load nominations from window if possible
try {
  nominationsStored = window.localStorage.getItem('nominations');
  if(nominationsStored != null && nominationsStored.split(",").length > 0 && nominationsStored != [""]) {
    nominations = nominationsStored.split(",");
  }
}
catch{}

let searchString = "";
let searchResults = [];

// Open new twitter tab with pre-populated nominations tweet
function tweetNominations() {
  tweetText = encodeURI("I nominate: \n" + nominations.join("\n") + "\n");
  window.open('https://twitter.com/intent/tweet?hashtags=shoppies&text=' + tweetText, '_blank');
}

// Search OMDB for list of movies
function search(){
  // Clear search list
  document.getElementById('search-list').innerHTML = "";
  // Display "Searching..."
  document.getElementById('search-list').appendChild(makeUL(searchResults, true));
  document.getElementById('search-list').appendChild(document.createTextNode("Searching..."));
  // Get string from search bar
  searchString = document.getElementById("input").value;
  // Search OMDB for movies that match search string
  var ajaxhttp = new XMLHttpRequest();
  var url = "https://www.omdbapi.com/?s="+searchString+"&type=movie&apikey=6d1e6c67";
  ajaxhttp.open("GET", url, true);

  ajaxhttp.onreadystatechange = function () {
    if(ajaxhttp.readyState == 4 && ajaxhttp.status == 200) {
      var jcontent = JSON.parse(ajaxhttp.responseText);
      try {
        // If possible, map search results to match Title (YYYY) format
        searchResults = jcontent["Search"].map(movie => movie.Title + " (" + movie.Year + ")")
      }
      catch(err) {
        searchResults = [];
      }
      // Reset search list
      document.getElementById('search-list').innerHTML = "";
      document.getElementById('search-list').appendChild(makeUL(searchResults, true));
      if(searchResults.length == 0) {
        document.getElementById('search-list').appendChild(document.createTextNode("No search results."));
      }
    }
  }
 
  ajaxhttp.send(null);
}

// Allow enter key to initiate search
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    search();
  }
});

// Nominate a search result on button click
function nominate(string) {
  nominations.push(string);
}

// Remove a nomination on button click
function remove(string) {
  let index = nominations.indexOf(string);
  nominations.splice(index, 1);
}

// refresh() is called whenever a button is clicked
function refresh(){
  // Reset search and nomination lists
  document.getElementById('search-list').innerHTML = "";
  document.getElementById('nomination-list').innerHTML = ""; 
  document.getElementById('search-list').appendChild(makeUL(searchResults, true));
  document.getElementById('nomination-list').appendChild(makeUL(nominations, false));
  
  // Display "No nominations" or "No search results" if applicable
  if(nominations.length == 0) {
    document.getElementById('nomination-list').appendChild(document.createTextNode("No nominations."));
  }
  if(searchResults.length == 0) {
    document.getElementById('search-list').appendChild(document.createTextNode("No search results."));
  }
  
  // Display banner if 5 nominations are selected
  if(nominations.length >= 5) {
    document.getElementById('banner').style.visibility = 'visible';
  }
  else {
    document.getElementById('banner').style.visibility = 'hidden';
  }
  
  // Set nominations to window storage
  window.localStorage.setItem('nominations', nominations);
}

// Create unordered list of movies with corresponding buttons
function makeUL(array, isSearchList) {
  var list = document.createElement('ul');

  for(var i = 0; i < array.length; i++) {
    // Create list item
    var item = document.createElement('li');
    item.appendChild(document.createTextNode(array[i]));
    
    // Create corresponding button
    var button = document.createElement("button");
    button.setAttribute("class","Polaris-Button");
    button.setAttribute("id","list-button");
    
    if(isSearchList == true) {
      button.innerHTML = "Nominate";
      
      // Disable Nominate button if applicable
      if(nominations.length >= 5 || nominations.indexOf(array[i]) != -1) {
        button.setAttribute("class","Polaris-Button Polaris-Button--disabled");
        button.setAttribute("disabled","");
      }
      item.appendChild(button);
      
      // When Nominate button is clicked, nominate list item movie
      button.addEventListener('click', function(e) {
        let listItemText = this.parentElement.textContent;
        nominate(listItemText.substring(0,listItemText.indexOf(")")+1));
        refresh();
      });
    }
    else {
      button.innerHTML = "Remove";
      item.appendChild(button);
      
      // When Remove button is clicked, remove list item movie
      button.addEventListener('click', function(e) {
        let listItemText = this.parentElement.textContent;
        remove(listItemText.substring(0,listItemText.indexOf(")")+1));
        refresh();
      });
    }
    list.appendChild(item);
  }
  return list;
}

refresh();
