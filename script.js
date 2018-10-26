document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
  var docBod = document.getElementById('docBod');  //Obtain the body
  var docHead = document.getElementById('docHead');

  var f = 1;    //First page
  var maxPage = 7;

  loadBody(docHead,docBod,f);

  var nbutton = document.getElementById('next');
  var pbutton = document.getElementById('prev');


  pbutton.style.display = 'none';

  //Next button
  nbutton.addEventListener('click', function(event){
  if (f < maxPage) {
      docHead.innerHTML = ""
      docBod.innerHTML = "";    //Reload body
      f++;    //Increase page

      loadBody(docHead,docBod,f);

      if(f==2){
          pbutton.style.display = 'inline';
      }

    }
    if (f == maxPage){
        nbutton.style.display = 'none';
    }
  });

  //Previous button
  pbutton.addEventListener('click', function(event){
    if (f > 1) {
      docHead.innerHTML = ""
      docBod.innerHTML = "";
      f--;    //Decrease page

      loadBody(docHead,docBod,f);

      if(f == (maxPage - 1)){
        nbutton.style.display = 'inline'
      }
    }
    if (f == 1){
        pbutton.style.display = 'none';
    }
  });
}


function loadBody (docHead, docBod, f){
  var col = ["Name","Climate","Population","Movies"];


  var planetHead = createNode('h3');
  appendParent(docHead,planetHead)
  planetHead.textContent = 'Planets Page - ' + f;   //f = page #

  var table = createNode("table");

  // CREATE TABLE HEAD .
	var tHead = createNode("thead");

	// CREATE ROW FOR TABLE HEAD .
	var hRow = createNode("tr");

  // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
	for (var i = 0; i < (col.length); i++) {  //Sin contar Films
			var th = createNode("th");
			th.innerHTML = col[i];
      appendParent(hRow,th);

	}
  appendParent(tHead,hRow);
  appendParent(table,tHead);


  // CREATE TABLE BODY .
	var tBody = createNode("tbody");

  loadJson(tBody, f);

  appendParent(table,tBody);
  appendParent(docBod,table);


}


function loadJson(tBody , f){

  var URLhost = 'https://swapi.co/api/planets/?page=' + f;    //Depending of the page
  //Get API
  fetch(URLhost)
  .then(data => data.json())
  .catch(err => console.error(err))
  .then(response => {

    console.log(response)
    for (var k = 0; k < response.results.length; k++) {
      (function(y) {


        var bRow = createNode("tr"); // CREATE ROW FOR EACH RECORD

        var tname = createNode("td");
        tname.innerHTML = response.results[y].name;
        bRow.appendChild(tname);

        var tclimate = createNode("td");
        tclimate.innerHTML = response.results[y].climate;
        bRow.appendChild(tclimate);

        var tpopu = createNode("td");
        tpopu.innerHTML = response.results[y].population;
        bRow.appendChild(tpopu);

        var tmovies = createNode("td");

        // ------------------- Access to another API ------------------------
        //Verify if the list is empty or not
        if (response.results[y].films.length > 0) {

          var movieList = createNode('ol');

          tmovies.appendChild(movieList);
          //Go through the list of films
          for (var e = 0; e < response.results[y].films.length; e++) {
            (function(x) {
              //Access each API
                fetch(response.results[y].films[x])
                .then(newData => newData.json())
                .catch(err => console.error(err))
                .then(newResponse => {

                  //Get title of the film
                  var movie = createNode('li');
                  movie.textContent = newResponse.title;
                  movieList.appendChild(movie);
                })
                .catch(err => console.error(err));
            })(e); //Close
          }
        }
        appendParent(bRow,tmovies);
        appendParent(tBody,bRow);

      })(k);
    }

  })
  .catch(err => console.error(err));

}

function createNode(ele){
  return document.createElement(ele);
}
function appendParent(parent, ele){
  return parent.appendChild(ele);
}
