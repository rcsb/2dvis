/** 
 *  FileName: graph.js
 *  Start: July 5th
 *  Last Modified: Aug 22th
 *  Purpose: Testing, Understanding D3, event listener, javascript
 */

/**
 * print of the message (including the value of the current slider position)
 *
 * @function
 * @param {string}  [id]    - the id of the slider
 * @param {long}    [value] - the current value of the slider
 */
function setInfo( id, value ){                      
  document.getElementById(id).innerHTML="current value is : " + value;
}

/**
 * get the value of the slider
 * 
 * @function
 * @param {string} [id] [the id of the slider]
 * @return {long}  [the current value of the slider]
 */
function getValue( id ){                             
  return document.getElementById(id).value;
}

/**
 * called to display and initial slider
 *
 * @function
 * @param {string} [infoId] [the id that helps determine which message to print that shows the slider value]
 * @param {string} [sliderId] [the id of the slider]
 * @return - No return
 */
function initSlider( infoId, sliderId ){              
  setInfo(infoId, getValue(sliderId));
  document.getElementById(sliderId).addEventListener("change", 
        function(){                                   //execute when the slider value changes
          setInfo(infoId, getValue(sliderId));
        }, false);
}

/**
 * first slider, corresponds with the node that changes the center of the force, which shifts 
 * the structure along y=-x diagonally
 *
 * @function
 * @param {simulation} [simulation] [the simulation data returned from initial rendering]
 * @return - No return
 */
function changeForceCenter( simulation ){             
  var val;                                            
  var newH;                                           //new height of the center
  var newW;                                           //new width of the center

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  val = getValue("One");                              //get value of the slider
  newW = (width + parseInt(val) );                    //change the width corresponds to the new slider value
  newH = (height + parseInt(val) );                   //change the height corresponds to the new slider value

  var centerF = simulation.force("center");           //original center force
  centerF.x(newW/2);
  centerF.y(newH/2);

  simulation.restart();                               //reset the timer
  simulation.alpha(1);                                //restart the simulation, set the alpha value to zero
                                                      //alpha will slowly decrease to zero once the simulation is over
}

/**
 * second slider, correspoonds with the strength for the force that drags the nodes together
 *
 * @function
 * @param {simulation} [simulation] [the simulation data returned from initial rendering]
 * @return - No return
 */
function changeStrength( simulation ){                
  
  var newStrength;                                    //new strength between nodes
  var nodeS = simulation.force("charge");             //original node strength

  newStrength = getValue("Two");
  nodeS.strength(newStrength);

  simulation.restart();                               //reset the timer
  simulation.alpha(1);                                //restart the simulation, set the alpha value to zero
                                                      //alpha will slowly decrease to zero once the simulation is over
}

/**
 * third slider, correspond with the strength of the primary bond
 *
 * @function
 * @param {simulation} [simulation] [the simulation data returned from initial rendering]
 * @return - No return
 */
function changePrimaryStrength( simulation ){        

  var newStrength;                                    //new strength between nodes
  var newLink = simulation.force("link")

  newStrength = getValue("Three");
  newLink.distance(newStrength);

  simulation.restart();                               //reset the timer
  simulation.alpha(1);                                //restart the simulation, set the alpha value to zero
                                                      //alpha will slowly decrease to zero once the simulation is over
}

/**
 * fourth slider, correspond with the strength of the secondary bond
 *
 * @function
 * @param {simulation} [simulation] [the simulation data returned from initial rendering]
 * @return - No return
 */
function changeSecStrength( simulation ){             

  var newStrength;                                    //new strength between nodes
  var newLink2 = simulation.force("link2")

  newStrength = getValue("Four");
  newLink2.distance(newStrength);

  simulation.restart();                               //reset the timer
  simulation.alpha(1);                                //restart the simulation, set the alpha value to zero
                                                      //alpha will slowly decrease to zero once the simulation is over
}

/**
 * Atom class that creates the object of the atom ( refer to object-oriented javascript)
 * Creates a new atom object ( different from what is created by NGL )
 * @class
 * @param {String} - name of the atom
 * @param {String} - element type of the atom
 */
function Atom( name, element ){                           
  this.name = name;                            //the name property of the atom object
  this.element = element;                      //the element property 
  this.connectedAtoms = [];                    //store the primary bonds for this node(this node is an ATOM OBJECT)
  this.secAtoms = [];                          //store the secondary bond for this node(this node is an ATOM OBJECT)
  this.thirdAtoms = [];
}

/**
 * Create array list for each atom by using the "Atom Class" that holds the bond properties of 
 * this atom. Each element inside the atomMap is an Atom object that is created by the 
 * "Atom Class". However, it is NOT THE SAME AS the atom object that is created by NGL
 *
 * @function
 * @param  {graph} - the graph of that contains all the elements that will be rendered 
 * @return         - No return
 */
function atomArrayList(graph){
  var atomMap = graph.atomMap;
  var totalNumAtom = graph.nodes.length;                      //total number of different nodes that we have

  for( var i=0; i<totalNumAtom; i++){                         //store the atoms' names into the array
    var id = graph.nodes[i].id;                               //get the id of each node
    atomMap[graph.nodes[i].id] = new Atom(id, id[0]);         //create a list for each node that will store the primary bond connection
                                                              //each of the connection is an atom object
                                                              //id represent the name of the node; id[0] represents the element of the node
  }
}

/**
 * Create the primary bond list and push the nodes elements into the correspond atom object
 * array so that we can use it when we need to create secondary or other bond lists and actual
 * link itself
 * 
 * @function
 * @param  {graph} - the graph of that contains all the elements that will be rendered 
 * @return         - No return
 */
function createPrimaryList(graph){
  var atomMap = graph.atomMap;
  var totalPrimaryLink = graph.links.length;                   //total number of the primary links 
  for ( var i=0; i<totalPrimaryLink; i++){

    var source = graph.links[i].source;                        //the primary link list of each node of both ways
    var target = graph.links[i].target;

    if ( source != target ){                                   //prevent the atom links to itself
      atomMap[source].connectedAtoms.push(atomMap[target]);    //store links both ways so it can cover all possibilites
      atomMap[target].connectedAtoms.push(atomMap[source]);
    }
  }
}

/**
 * Create the secondary bond list and push the nodes elements into the correspond atom object
 * 
 * @function
 * @param  {graph} - the graph of that contains all the elements that will be rendered 
 * @return         - No return
 */
function createSecondaryList(graph){
  var atomMap = graph.atomMap;
  var totalPrimaryLink = graph.links.length;
  for ( var i = 0; i < totalPrimaryLink; i++){
    var source = graph.links[i].source;                             //get the source from the .json file
    var target = graph.links[i].target;                             //get the target from the .json file

    //loop through each element in the target primary bond and store them to form the secondary bond for the source
    for ( var j = 0; j < atomMap[target].connectedAtoms.length; j++){       

      //isolate and get all the elements from the target primary link
      var elementInTargetArray = atomMap[target].connectedAtoms[j];         

      //prevent the secondary bond link back to itself
      if ( source != elementInTargetArray.name && target != elementInTargetArray.name ){ 
        atomMap[source].secAtoms.push(atomMap[target].connectedAtoms[j]);
      }
    }

    //doing the exact same thing as the previous for loop except this is from target to source instead of source to
    //target, we do this because we want to make sure the bond is both way, and it covers every possibility
    for ( var k = 0; k < atomMap[source].connectedAtoms.length; k++){
      var elementInSourceArray = atomMap[source].connectedAtoms[k];
      if ( target !== elementInSourceArray.name && source != elementInSourceArray.name ){
        atomMap[target].secAtoms.push(atomMap[source].connectedAtoms[k]);
      }
    }

  }
}

/**
 * Create the tertiary bond list and push the nodes elements into the correspond atom object
 * 
 * @function
 * @param  {graph} - the graph of that contains all the elements that will be rendered 
 * @return         - No return
 */
function createTertiaryList(graph){
  var tracker = 0;           //the tracker is use to track how many times that the primary connect atoms aren't equal
  var tracker2 = 0;

  var atomMap = graph.atomMap;
  var totalSecondaryLink = graph.links2.length;
  for ( var i = 0; i < totalSecondaryLink; i++){
    var source = graph.links2[i].source;                                   
    var target = graph.links2[i].target;       

    for ( var j = 0; j < atomMap[target].connectedAtoms.length; j++){      
      var elementInConnected = atomMap[target].connectedAtoms[j];

      for ( var m = 0; m < atomMap[source].connectedAtoms.length; m++){

        //we need to use something like tracker because we need to prevent the tertiary bond is the same as the 
        //primary bond connection. 
        //For example: C2 primary: { N1, C1 }, O1 primary: { H1, C1}
        //when we are checking under C2 primary is N1, we will link C2 and C1 together because neither of O1
        //primary is C2 primary. However, it contradicts, because we can see C1 is the primary of C2
        //Therefore, I decide to use a temp variable like trakcer to compare with the length so we can assure
        //that is has checked all possibilities.

        //There might be a better solution ??
        if ( atomMap[source].connectedAtoms[m].name !== elementInConnected.name ){
          tracker++;
        }  
      }

      if ( tracker === atomMap[source].connectedAtoms.length){
        atomMap[source].thirdAtoms.push(atomMap[target].connectedAtoms[j]);
      }

      tracker = 0;    //reset tracker, be prepared to loop through the next node
    }

    for ( var k = 0; k < atomMap[source].connectedAtoms.length; k++){
      var elementInConnected = atomMap[source].connectedAtoms[k];

      for ( var n =0; n< atomMap[target].connectedAtoms.length; n++){
        if ( atomMap[target].connectedAtoms[n].name !== elementInConnected.name ){
            tracker2++;
        }
      }

      if ( tracker2 === atomMap[target].connectedAtoms.length){
        atomMap[target].thirdAtoms.push(atomMap[source].connectedAtoms[k]);
      }

      tracker2 = 0;   //reset tracker, be prepared to loop through the next node
    }
  }
} 

/**
 * Create the secondary bond link list that will be stored inside graph.links2 (array)
 * 
 * @function
 * @param  {graph} - the graph of that contains all the elements that will be rendered 
 * @return         - No return
 */
function getSecondaryBond(graph){ 
  var atomMap = graph.atomMap;
  var totalNumAtom = graph.nodes.length;
  for ( var i=0; i<totalNumAtom; i++){                               //loop through every node in the data file
    var id = graph.nodes[i].id;                                      //get the name of the node ( which is node.id)   

    //for each node, loop through all the secondary bond correspond with this node
    for ( var j=0; j<atomMap[id].secAtoms.length; j++){ 

      //"element" represents atom object ( which is the target of the secondary bond )                    
      var element = atomMap[id].secAtoms[j];  

      //push every secondary bond into the .json file (in order for it be accessed and use to display the link 
      //by using d3 function)                          
      graph.links2.push( 
        {source: id, target: element.name, value: "1", bond: "1", duplicate: "no", 
          distance: 0, ring: false, alone:false} );       
    }                                                               
  }
}

/**
 * Create the secondary bond link list that will be stored inside graph.links3 (array)
 * 
 * @function
 * @param  {graph} - the graph of that contains all the elements that will be rendered 
 * @return         - No return
 */
function getTertiaryBond(graph){
  var atomMap = graph.atomMap;
  var totalNumAtom = graph.nodes.length;
  for ( var i=0; i<totalNumAtom; i++){                                      
    var id = graph.nodes[i].id;                                             
    for ( var j=0; j<atomMap[id].thirdAtoms.length; j++){                     
      var element = atomMap[id].thirdAtoms[j];                                
      graph.links3.push( 
        {source: id, target: element.name, value: "1", bond: "1", duplicate: "no", 
         distance: 0, ring: false, alone: false} );         
    }                                                                      
  } 
}

/**
 * change the ring property to links2 and links3 based on the node's own ring property in the nodes 
 * array inside graph.
 * For each link, loop through the nodes array and check if both target and source has the same ring properties 
 * and change the value of the ring property of that link accordingly
 * 
 * @function
 * @param  {array} [array1] - the array that needs to change the ring property 
 * @param  {array} [array2] - the nodes array inside graph ( to be compared and check the value of ring property)
 * @return         - No return
 */
function addRingProperty(array1, array2){
  //add the diffenet ring property based on the node
  for ( var i = 0; i < array1.length; i++){ 
    for ( var j = 0; j < array2.length; j++){
      if ( array1[i].source === array2[j].id ){
        if ( array2[j].ring){
          for ( var k = 0; k < array2.length; k++){
            if ( array1[i].target === array2[k].id ){
              if ( array2[k].ring){
                array1[i].ring = true;
              }
            }
          }
        }
      }
    }
  }

  return array1;
}

/**
 * eliminate any duplicate elements inside the array based on the property's (duplicate: false) value
 * 
 * @function
 * @param  {graph} - the graph of that contains all the elements that will be rendered 
 * @return         - No return
 */
function eliminateBothWay(array){
  for ( var i = 0; i < array.length; i++){
    if ( array[i].duplicate == "yes"){
      array.splice(i,1);    //delete that element
      i--;                  //decrement the index so index still remains correct
    }
  }

  return array;
}

/**
 * get the distance betweeens nodes for non-primary bonds
 * 
 * @function
 * @param  {array} [array1] - the array that needs to change the ring property 
 * @param  {array} [array2] - the nodes array inside graph ( to be compared and check the value of ring property)
 * @return         - No return
 */
function getDistance(array1, array2){              

  //loop through all possible nodes and get the name
  for ( var i=0; i<array2.length; i++){              
    var id = array2[i].id;                                             
    for ( var j=0; j<array1.length; j++){           //loop through all links and compare name 
      if ( id === array1[j].source){                //if source matches, then follow the same process and find target
        for ( var k = 0; k<array2.length; k++){
          if ( array2[k].id === array1[j].target){ 

            //if target is found, then calculate the distance by using distanceTo( NGL function for atom object(NGL) )  
            array1[j].distance = array2[i].atom.distanceTo(array2[k].atom);
          }
        }
      }
    }                                                                
  }
}

/**
 * Check if there is a duplicate element inside the array. Duplicates include ( AB <-> AB or AB <->BA )
 * 
 * @function
 * @param  {array} [array] - the array that will be check for duplicates
 * @return         - No return
 */
function detectDuplicate(array) {
  //change the duplicate property to yes if the target and source are the same
  for ( var i = 0; i < array.length; i++){
    for ( var j = 0; j < array.length; j++){
      if ( array[j].duplicate !== "yes" ){
        if ( (array[i].source === array[j].target) && (array[i].target === array[j].source) ){
          array[i].duplicate = "yes";
        }
      }
    }
  }

  //change the duplicate property to yes if they have the same source and target
  for ( var i = 0; i < array.length; i++){
    for ( var j = i + 1; j < array.length; j++){
      if ( array[j].duplicate !== "yes" ){
        if ( (array[i].source === array[j].source) && (array[i].target === array[j].target) ){
          array[i].duplicate = "yes";
        }
      }
    }
  }
}

/**
 * detect if the node is alone. Change the node's alone property accordingly
 * 
 * @function
 * @param {graph} [graph] [the graph of that contains all the elements that will be rendered]
 * @return - No return
 */
function detectAlone(array1, array2){
  var tracker = 0;

  for ( var i = 0; i < array2.length; i++){
    for ( var j = 0; j < array1.length; j++){
      if ( (array2[i].id === array1[j].source) || (array2[i].id === array1[j].target) ){
        tracker++;
      }
    }

    //reset tracker everytime no matter what (assure the next loop could be correct)
    if( tracker === 1){
      array2[i].alone = true;
      tracker = 0;
    }else{
      tracker = 0;
    }
  }

  for ( var i = 0; i < array2.length; i++){
    for ( var j = 0; j < array1.length; j++){
      if ( array1[j].source === array2[i].id || array1[j].target === array2[i].id ){
        if ( array2[i].alone){
            array1[j].alone = true;          
        }
      }
    }
  }
}

/**
 * Prepare for the graph data. Using NGL library to load the protein data file (including nodes and distance), then 
 * call correspond functions above the create bond lists and links, elimnate duplicates, add ring property. Finally,
 * render the graph by using d3.js (force-directed graph) library function
 * 
 * @function
 * @return         - No return
 */
function prepareGraph(){
  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var crystalTerD = 0;
  var crystalSecD = 0;
  var trackerForCrystalSec = 0;

  var xV = 0;
  var yV = 0;
  var a, b, c, d;
  var z = false;

  var graph = {
    "nodes": [
    ],
    "links": [
    ],
    "links2":[
    ],
    "links3":[
    ],
    atomMap: {}
  };

  document.addEventListener( "DOMContentLoaded", function(){
    stage = new NGL.Stage( "viewport" );
    stage.loadFile( "http://files.rcsb.org/ligands/download/RET.cif", {
        defaultRepresentation: false,
        sele: "/0"
    } ).then( function( comp ){
        comp.addRepresentation( "ball+stick", { sele: "not #H", multipleBond: true } );
        comp.addRepresentation( "label", {
          sele: "not #H", labelType: "atomname", color: "white", radius: 0.7,
          xOffset: -0.3, yOffset: -0.3
        } );
       // comp.addRepresentation( "axes", { sele: "/0 and not #H", scale: 0.3 } );
        stage.centerView();
        var s = comp.structure.getView( new NGL.Selection( "/0 and not #H" ) );     //only select the first module
        //console.log( s );                                                         //also exclude hydrogen
        //console.log( "principal axes", s.getPrincipalAxes() );

        var principleAxes = s.getPrincipalAxes();
        var axisLine = principleAxes[ 2 ];
        var normal = new NGL.Vector3().subVectors( axisLine[ 0 ], axisLine[ 1 ] ).normalize();

        //I have no idea what I am doing, just following what Alex has done before
        //PLEASE, I NEED HELP :< :((((
        //SOMEONE SAVE ME! I am DUMB
        var av = new NGL.Vector3( normal.y, (-normal.x), 0);      //create the perpendicular vector on the normal
        var bv = new NGL.Vector3().crossVectors( normal, av );    //orthogonoal to av and normal vector

        var plane = new NGL.Plane(normal);
        var tempV = new NGL.Vector3();      //store the coordinates of the nodes

        var aaaa = 0;
        var bbbb = 0;
        var i0;

        s.eachAtom( function( ap ){

          tempV.copy( ap );
          //console.log( ap.x);
          aaaa = ( plane.projectPoint(tempV)).dot( av );
          bbbb = ( plane.projectPoint(tempV)).dot( bv ); 

            //store all the nodes data to the nodes array in graph
            graph.nodes.push(
              {id: ap.atomname, group: "1", size: "4", bond: "1", atom: ap.clone(), ring: ap.isRing(), 
              alone: false, duplicate: "no", element: (ap.atomname).substring(0,1), fx: 0,
              fy: 0 });   
        } );

        for ( var i = 0; i < graph.nodes.length; i++){
          aaaa = ( plane.projectPoint(tempV.copy( graph.nodes[i].atom ))).dot( av );
          bbbb = ( plane.projectPoint(tempV.copy( graph.nodes[i].atom ))).dot( bv ); 
          i0 = new NGL.Vector3(aaaa, bbbb, 0);

          xV += i0.x;
          yV += i0.y;
        }

        xV = xV / graph.nodes.length;
        yV = yV / graph.nodes.length;

        for ( var i = 0; i < graph.nodes.length; i++){
          aaaa = ( plane.projectPoint(tempV.copy( graph.nodes[i].atom ))).dot( av );
          bbbb = ( plane.projectPoint(tempV.copy( graph.nodes[i].atom ))).dot( bv ); 
          i0 = new NGL.Vector3(aaaa, bbbb, 0);

          graph.nodes[i].fx = ( (i0.x - xV) * 60) + (width/2);
          graph.nodes[i].fy = ( (i0.y - yV) * 60) + (height/2); 
        }

        s.eachBond( function( bp ){

         // console.log(bp.clone());
        if( bp.atom1.element==="H" || bp.atom2.element==="H" ) return;
          
          //store all the primary bond data to link array in graph
          graph.links.push(                                                 
            {source: bp.atom1.atomname, target: bp.atom2.atomname, value: "1", bond: bp.bondOrder,  
             distance: bp.atom1.distanceTo(bp.atom2),atom1: bp.atom1, atom2: bp.atom2, ring: false, alone: false} 
            );
          });

          detectDuplicate(graph.links);                 //detect and change the duplicate property for primary link
          atomArrayList(graph);                         //pass in links and create the list of each atom array 
          createPrimaryList(graph);                     //create the primary link list of the nodes
          createSecondaryList(graph);                   //create secondary link list that link every other atom together
          getSecondaryBond(graph);                       
          detectDuplicate(graph.links2);                //detect, search and change the duplicate property for links2
          addRingProperty(graph.links2, graph.nodes);   //add ring property to secondary bonds that are inside the ring
          createTertiaryList(graph);
          getTertiaryBond(graph);
          detectDuplicate(graph.links3);                 //detect and change the duplicate property for links3
          addRingProperty(graph.links3, graph.nodes);    //add ring property to teitary bonds that are inside the ring
          eliminateBothWay(graph.links);                 //delete all both ways links in primary link
          eliminateBothWay(graph.links2);                //delete all both ways links in secondary link
          eliminateBothWay(graph.links3);                //delete all both ways links in tertiary link
          

          detectAlone(graph.links, graph.nodes);
          detectAlone(graph.links2, graph.nodes);
          detectAlone(graph.links3, graph.nodes);

          //get the distance of the secondary bond and add to the distance property in links2 array
          getDistance(graph.links2, graph.nodes);        

          // try to make the secondary bond distance inside the ring equal
          for ( var i = 0; i < graph.links2.length; i++){
            if ( graph.links2[i].ring ){            
              crystalSecD += graph.links2[i].distance;            
              trackerForCrystalSec++;
            }
          }
          crystalSecD = crystalSecD / trackerForCrystalSec;

          for ( var j = 0; j < graph.links2.length; j++){
            if ( graph.links2[j].ring){
              graph.links2[j].distance = crystalSecD;
            }
          }

          getDistance(graph.links3, graph.nodes);

          // try to make the tertiary bond distance inside the ring equal
          crystalTerD = (graph.links3[0].distance + graph.links3[1].distance + graph.links3[2].distance)/3;
          graph.links3[0].distance = crystalTerD;
          graph.links3[1].distance = crystalTerD;
          graph.links3[2].distance = crystalTerD;

          addRingProperty(graph.links, graph.nodes);      //add ring property to primary bonds that are inside the ring 

          var renderingVal = initRendering(graph);

          //start rendering inside the comp function so we can make sure the file has FINISHED loading
          simulation = renderingVal[0];
          displaySecondary = renderingVal[1];
          displayTertiary = renderingVal[2];  
      } );
  } );   
}

/**
 * Create the secondary bond link list that will be stored inside graph.links3 (array)
 * 
 * @function
 * @param  {graph}        - the graph of that contains all the elements that will be rendered 
 * @return {simulation}   - simulation of the rendering; it will be pssed in to the slider to adjust certain values
 */
function initRendering( graph ){

  console.log(graph);

  var barObject = new Object();
  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var simulation = d3.forceSimulation()
      .force("link3", d3.forceLink().id(function(d) { return d.id; })
                       .strength(function(d){
                                    if ( d.ring ){
                                      return 5;
                                    }
                                    else if ( d.alone){
                                      return 2.5;
                                    }
                                    else{
                                      return 3;
                                    }})
                       .distance(function(d) { 
                                    return d.distance * 55 ;
                                  }))
      .force("link2", d3.forceLink().id(function(d) { return d.id; })                  //secondary bond force
                        .strength(function(d) {
                                      if ( d.ring) {
                                        return 5;
                                      }
                                      else if ( d.alone){
                                        return 2.5;
                                      }
                                      else{
                                        return 2;
                                      }})
                        .distance(function(d){ 
                                    return d.distance * 50;
                                  }))
      .force("link", d3.forceLink().id(function(d) { return d.id; })
                        .strength(function(d) { 
                                    if( d.ring ){
                                      return 5;
                                    }
                                    else if (d.alone){
                                      return 1;
                                    }
                                    else{         
                                        return 0.5;
                                    }})
                        .distance(function(d){ 
                                    return d.distance * 25;
                                  }))
      .force("charge", d3.forceManyBody().strength(getValue("Two")))                     
      .force("center", d3.forceCenter(width / 2, height / 2))
      .alpha(0.5);

  var link2 = svg.selectAll(".link2")                          //secondary bond force
      .data(graph.links2)
      .enter().append("g");

  /**
   * Decides to display the secondary bond
   * 
   * @function
   */
  function displaySecondary(){
    var barValue = getValue("bar1");
    if ( barValue === "FALSE" ){
      link2.attr("class", "link2 foo");     //display secondary bond
    }else{
      link2.attr("class", "link2");         //hide secondary bond
    }
  }

  link2.append("line")
      .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

  var link3 = svg.selectAll(".link3")                          //secondary bond force
      .data(graph.links3)
      .enter().append("g");

  /**
   * Decides to display the Tertiary bond
   * 
   * @function
   */
  function displayTertiary(){
    var barValue = getValue("bar2");
    if ( barValue === "FALSE" ){
      link3.attr("class", "link3 foo2");     //display secondary bond
    }else{
      link3.attr("class", "link3");         //hide secondary bond
    }
  }

  link3.append("line")
      .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

  var color = d3.scaleOrdinal(d3.schemeCategory20);   //change color

  var radius = d3.scaleSqrt()
    .range([0, 6]);

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("g")
      .attr("class", "link");

  link.append("line")
      .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });

  link.filter(function(d) { return (d.bond > 1 && d.bond < 3); }).append("line")
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
      .style("fill", function(d) { return color(d.element.color); });

  node.append("text")               //show the text value
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);  

  simulation.force("link2")                                     //secondary bond force
      .links(graph.links2);

  simulation.force("link3")                                     //tertiary bond force
      .links(graph.links3);


  function ticked() {
    //delete the fx and fy property ( hence, unfix the intial position)
    for ( var i = 0; i < graph.nodes.length; i++){
      delete graph.nodes[i].fx;
      delete graph.nodes[i].fy;
    }

    link.selectAll("line")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    link2.selectAll("line")                                     //display the link for secondary bond force
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    link3.selectAll("line")                                     //display the link for tertiary bond force
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    // simulation.stop();
  }

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

  return [simulation, displaySecondary, displayTertiary];
}

