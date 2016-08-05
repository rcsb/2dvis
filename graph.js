/** 
 *  FileName: graph.js
 *  Start: July 5th
 *  Last Modified: Aug 5th
 *  Purpose: Testing, Understanding D3, event listener, javascript
 */

////////////////////////////////Start of Trying to create Secondary bond//////////////////////////////////

var totalNumAtom;       //total number of atoms
var totalPrimaryLink;   //total number of primary link
var atomMap = {};       //store all the primary link of each atom follow by the order of the node is .json file
var secBond = [];       //array store the secondary bonds
var links2 = [];        //the second link that store the secondary bond ( similar to the link array in nodeData.json)

function Atom( name, element ){                                          //Atom class that creates the object of the atom ( refer to object-oriented javascript)
  this.name = name;                                                      //the name property of the atom object
  this.element = element;                                                //the element property 
  this.connectedAtoms = [];                                              //store the primary bonds for this node(this node is an ATOM OBJECT)
  this.secAtoms = [];                                                    //store the secondary bond for this node(this node is an ATOM OBJECT)
}

function atomArrayList(graph){
  totalNumAtom = graph.nodes.length;                                      //the total number of different nodes that we have

  for( var i=0; i<totalNumAtom; i++){                                     //store the atoms' names into the array
    var id = graph.nodes[i].id;                                           //get the id of each node
    atomMap[graph.nodes[i].id] = new Atom(id, id[0]);                     //create a list for each node that will store the primary bond connection
                                                                          //each of the connection is an atom object
                                                                          //id represent the name of the node; id[0] represents the element of the node
  }
}

function createPrimaryList(graph){

  totalPrimaryLink = graph.links.length;                                   //total number of the primary links 
  for ( var i=0; i<totalPrimaryLink; i++){

    var source = graph.links[i].source;                                    //the primary link list of each node of both ways
    var target = graph.links[i].target;
    
    if ( source != target){                                                //prevent the atom links to itself
      atomMap[source].connectedAtoms.push(atomMap[target]);                //store links both ways so it can cover all possibilites
      atomMap[target].connectedAtoms.push(atomMap[source]);
    }
  }
}

function createSecondaryList(graph){

  for ( var i = 0; i < totalPrimaryLink; i++){
    var source = graph.links[i].source;                                     //get the source from the .json file
    var target = graph.links[i].target;                                     //get the target from the .json file

    for ( var j = 0; j < atomMap[target].connectedAtoms.length; j++){       //loop through each element in the target primary bond and
                                                                            //store them to form the secondary bond for the source

      var elementInTargetArray = atomMap[target].connectedAtoms[j];         //isolate and get all the elements from the target primary link

      //prevent the secondary bond link back to itself
      if ( source != elementInTargetArray.name && target != elementInTargetArray.name ){ 
        atomMap[source].secAtoms.push(atomMap[target].connectedAtoms[j]);
      }
    }

    //doing the exact same thing as the previous for loop except this is from target to source instead of source to target
    //we do this because we want to make sure the bond is both way, and it covers every possibility
    for ( var k = 0; k < atomMap[source].connectedAtoms.length; k++){
      var elementInSourceArray = atomMap[source].connectedAtoms[k];
      if ( target != elementInSourceArray.name && source != elementInSourceArray.name ){
        atomMap[target].secAtoms.push(atomMap[source].connectedAtoms[k]);
      }
    }
  }
}
  
function getSecondaryBond(graph){ 

  for ( var i=0; i<totalNumAtom; i++){                                      //loop through every node in the data file
    var id = graph.nodes[i].id;                                             //get the name of the node ( which is node.id)      
    for ( var j=0; j<atomMap[id].secAtoms.length; j++){                     //for each node, loop through all the secondary bond correspond with this node
      var element = atomMap[id].secAtoms[j];                                //"element" represents atom object ( which is the target of the secondary bond )
      graph.links2.push( 
        {source: id, target: element.name, value: "1", bond: "1"} );        //push every secondary bond into the .json file (in order for it 
    }                                                                       //be accessed and use to display the link by using d3 function)
  }
}
////////////////////////////////End of Trying to create Secondary bond////////////////////////////////////
  

////////////////////////////////////Start of Slider Adjustment////////////////////////////////////////////
function setInfo( id, value ){                                              //print of the message (including the value of the current slider position)
  document.getElementById(id).innerHTML="current value is : " + value;
}

function getValue( id ){                                                    //get the value of the slider
  return document.getElementById(id).value;
}

function initSlider( infoId, sliderId ){                                    //called to display and initial slider
  setInfo(infoId, getValue(sliderId));
  document.getElementById(sliderId).addEventListener("change", 
        function(){                                                         //execute when the slider value changes
          setInfo(infoId, getValue(sliderId));
        }, false);
}

//initialize the slider and display values
initSlider( "info", "One" );
initSlider( "info2", "Two" );
initSlider( "info3", "Three" );
initSlider( "info4", "Four" );

//Event listener for change force center 
var el = document.getElementById("One");
el.addEventListener("input", changeForceCenter, false);

function changeForceCenter(){                         //first slider, corresponds with the node that changes the center of the force
  var val;                                            //which shifts the structure along y=-x diagonally 
  var newH;                                           //new height of the center
  var newW;                                           //new width of the center

  val = getValue("One");                              //get value of the slider
  newW = (width + parseInt(val) );                    //change the width corresponds to the new slider value
  newH = (height + parseInt(val) );                   //change the height corresponds to the new slider value

  var centerF = simulation.force("center");           //original center force
  centerF.x(newW/2);
  centerF.y(newH/2);

  simulation.restart();                               //reset the timer
  simulation.alpha(1);                                //restart the simulation, set the alpha value to zero
                                                      //alpha value will slowly decrease to zero once the simulation is finishes
}

var e2 = document.getElementById("Two");
e2.addEventListener("input", changeStrength, false);

function changeStrength(){                            //second slider, correspoonds with the strength for the force that drags the nodes together
  
  var newStrength;                                    //new strength between nodes
  var nodeS = simulation.force("charge");             //original node strength

  newStrength = getValue("Two");
  nodeS.strength(newStrength);

  simulation.restart();                               //reset the timer
  simulation.alpha(1);                                //restart the simulation, set the alpha value to zero
                                                      //alpha value will slowly decrease to zero once the simulation is finished
}

var e3 = document.getElementById("Three");        
e3.addEventListener("input", changePrimaryStrength, false);

function changePrimaryStrength(){                     //third slider, correspond with the strength of the primary bond

  var newStrength;                                    //new strength between nodes
  var newLink = simulation.force("link")

  newStrength = getValue("Three");
  newLink.distance(newStrength);

  simulation.restart();                               //reset the timer
  simulation.alpha(1);                                //restart the simulation, set the alpha value to zero
                                                      //alpha value will slowly decrease to zero once the simulation is finished
}

var e4 = document.getElementById("Four");
e4.addEventListener("input", changeSecStrength, false);

function changeSecStrength(){                         //fourth slider, correspond with the strength of the secondary bond

  var newStrength;                                    //new strength between nodes
  var newLink2 = simulation.force("link2")

  newStrength = getValue("Four");
  newLink2.distance(newStrength);

  simulation.restart();                               //reset the timer
  simulation.alpha(1);                                //restart the simulation, set the alpha value to zero
                                                      //alpha value will slowly decrease to zero once the simulation is finished
}

///////////////////////////////////////End of Slider Adjustment/////////////////////////////////////////////////////


//////////////////////////////////Start of Displaying /////////////////////////////////////////////////////
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var simulation = d3.forceSimulation()
    .force("link2", d3.forceLink().id(function(d) { return d.id; }))                  //secondary bond force
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(getValue("Two")))                    //feed the value of slider #2 into the strength of the force charge(which 
                                                                                      //decides whethere to bring nodes closer or further away)
    .force("center", d3.forceCenter(width / 2, height / 2));

var graph = {
  "nodes": [
    {"id": "O1", "group": 1, "size": 10, "color": "O"},
    {"id": "H1", "group": 1, "size": 8, "color": "H"},
    {"id": "C1", "group": 1, "size": 16, "color": "C"},
    {"id": "N1", "group": 1, "size": 12, "color": "N"},
    {"id": "H2", "group": 1, "size": 8, "color": "H"},
    {"id": "C2", "group": 1, "size": 16, "color": "C"},
    {"id": "C3", "group": 1, "size": 16, "color": "C"},
    {"id": "C4", "group": 1, "size": 16, "color": "C"},
    {"id": "C5", "group": 1, "size": 16, "color": "C"},
    {"id": "O2", "group": 1, "size": 10, "color": "O"}
  ],
  "links": [
    {"source": "O2", "target": "C1", "value": 1, "bond": 2},
    {"source": "C1", "target": "O1", "value": 1, "bond": 1},
    {"source": "O1", "target": "H1", "value": 1, "bond": 1},
    {"source": "C1", "target": "C2", "value": 1, "bond": 1},
    {"source": "C2", "target": "N1", "value": 1, "bond": 1},
    {"source": "N1", "target": "H2", "value": 1, "bond": 1},
    {"source": "N1", "target": "C5", "value": 1, "bond": 1},
    {"source": "C2", "target": "C3", "value": 1, "bond": 1},
    {"source": "C3", "target": "C4", "value": 1, "bond": 1},
    {"source": "C4", "target": "C5", "value": 1, "bond": 1}
  ],
  "links2":[
  ]                                                      //the data of the .json graph file
};

atomArrayList(graph);                                    //pass in json file links and create the list of each atom array 
createPrimaryList(graph);                                //create the primary link list of the nodes
createSecondaryList(graph);                                                         //create secondary link list that link every other atom together
getSecondaryBond(graph);                                                            //get the secondary bond and try to display 


var link2 = svg.selectAll(".link2")                          
    .data(graph.links2)
    .enter().append("g")
    .attr("class", "link2");

link2.append("line")
    .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

/**************/
var color = d3.scaleOrdinal(d3.schemeCategory20);   //change color

var radius = d3.scaleSqrt()
  .range([0, 6]);


var link = svg.selectAll(".link")
    .data(graph.links)
  .enter().append("g")
    .attr("class", "link");

link.append("line")
    .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

link.filter(function(d) { return d.bond > 1; }).append("line")
    .attr("class", "separator");

var node = svg.selectAll(".node")
    .data(graph.nodes)
  .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

node.append("circle")
    .attr("r", function(d) { return radius(d.size); })
    .style("fill", function(d) { return color(d.color); });

node.append("text")               //show the text value
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.id; });

simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(graph.links);  

simulation.force("link2")                                     //the secondary bond force
    .links(graph.links2);

function ticked() {
  link.selectAll("line")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  link2.selectAll("line")                                     //display the link for the secondary bond force
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

      console.log("where am i");

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

console.log(graph);


function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//////////////////////////////////End of Displaying /////////////////////////////////////////////////////


