//window.onload = function(){};
//let poster = document.getElementById('poster');
//poster.src = Object.values(jcontent)[0][0].Poster;

// const nominations; //list
// window.localstorage.setItem('nominations', Json.stringify(nominations);

// //...

// const nominations = Json.parse(window.localstorage.getItem('nominations'))

// if(array.length == 0 {
//   document.getElementById('search-list').appendChild(document.createTextNode("No search results."));
// }

let searchString = "";
let nominations = [];
let searchResults = [];

function tweetNominations() {
  tweetText = encodeURI("I nominate: \n" + nominations.join("\n") + "\n");
  window.open('https://twitter.com/intent/tweet?hashtags=shoppies&text=' + tweetText, '_blank');
}

function search(){
  document.getElementById('search-list').innerHTML = "";
  searchString = document.getElementById("input").value;
  var ajaxhttp = new XMLHttpRequest();
  var url = "https://www.omdbapi.com/?s="+searchString+"&type=movie&apikey=6d1e6c67";
  ajaxhttp.open("GET", url, true);

  ajaxhttp.onreadystatechange = function () {
      if(ajaxhttp.readyState == 4 && ajaxhttp.status == 200) {
        var jcontent = JSON.parse(ajaxhttp.responseText);
        try {
          searchResults = jcontent["Search"].map(movie => movie.Title + " (" + movie.Year + ")")
        }
        catch(err) {
          searchResults = [];
        }
        document.getElementById('search-list').appendChild(makeUL(searchResults, true));

      }
  }
 
  ajaxhttp.send(null);
}

// Allow enter key to initiate search
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    search();
  }
});

function remove(string) {
  const index = nominations.indexOf(string);
  if (index > -1) {
    nominations.splice(index, 1);
  }
}

function nominate(string) {
  nominations.push(string);
}

function refresh(){
  document.getElementById('search-list').innerHTML = "";
  document.getElementById('nomination-list').innerHTML = "";  
  document.getElementById('search-list').appendChild(makeUL(searchResults, true));
  document.getElementById('nomination-list').appendChild(makeUL(nominations, false));
  
  if(nominations.length == 0) {
    document.getElementById('nomination-list').appendChild(document.createTextNode("No nominations."));
  }
  if(nominations.length >= 5) {
    document.getElementById('banner').style.visibility = 'visible';
  }
  else {
    document.getElementById('banner').style.visibility = 'hidden';
  }
}

function makeUL(array, isSearchList) {
    var list = document.createElement('ul');


  
    for(var i = 0; i < array.length; i++) {
        var item = document.createElement('li');
        item.appendChild(document.createTextNode(array[i]));
      
        var button = document.createElement("button");
        if(isSearchList == true) {
          button.innerHTML = "Nominate";
          button.setAttribute("class","Polaris-Button");
          if(nominations.length >= 5 || nominations.indexOf(array[i]) != -1) {
            button.setAttribute("class","Polaris-Button Polaris-Button--disabled");
            button.setAttribute("disabled","");
          }
          
          button.setAttribute("id","list-button");
          item.setAttribute("id","nominations-list-item");
          item.appendChild(button);
          button.addEventListener('click', function(e) {
            let listItemText = this.parentElement.textContent;
            nominate(listItemText.substring(0,listItemText.indexOf(")")+1));
            refresh();
          });
        }
        else {
          button.innerHTML = "Remove";
          button.setAttribute("class","Polaris-Button");
          button.setAttribute("id","list-button");
          item.setAttribute("id","nominations-list-item");
          item.appendChild(button);
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

// document.getElementById('search-list').appendChild(makeUL(searchResults, true));
// document.getElementById('nomination-list').appendChild(makeUL(nominations, false));

if(nominations.length == 0) {
  document.getElementById('nomination-list').appendChild(document.createTextNode("No nominations."));
}

if(searchResults.length == 0) {
  document.getElementById('search-list').appendChild(document.createTextNode("No search results."));
}


// this should happen when list item button is pressed, so it updates
if(nominations.length >= 5) {
  document.getElementById('banner').style.visibility = 'visible';
}
