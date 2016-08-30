
// for file graph.js
describe('Graph.js', function() {

  // EXAMPLE
  // describe('#indexOf()', function() {
  //   it('should return -1 when the value is not present', function() {
  //     assert.equal(-1, [1,2,3].indexOf(4));
  //   });
  // });


  //for different function
  describe('basic', function(){
	it('should return true', function(){
		console.log(4);
	});
  });


  //for eliminate both way function 
  describe('testEliminateDuplicate', function(){
  	it('should eliminate 1', function(){
  		var array = [];
  		array.push( { id: "a", duplicate: "no" } );
  		array.push( { id: "b", duplicate: "no" } );
  		array[0].duplicate = "yes"

   		var array2 = [];
   		array2.push( { id: "b", duplicate: "no" } );
   		console.log( array2);

  		assert.deepEqual( array2 ,eliminateBothWay(array));
  	});

  	it('should eliminate 2', function(){
  		var array = [];
  		array.push( { id: "a", duplicate: "no" } );
  		array.push( { id: "b", duplicate: "no" } );
  		array[1].duplicate = "yes"

   		var array2 = [];
   		array2.push( { id: "b", duplicate: "no" } );

  		assert.deepEqual( [{ id: "a", duplicate: "no" }], eliminateBothWay(array));
  	});

  	it('should eliminate 3', function(){
  	 	var array = [];
  		array.push( { id: "a", duplicate: "no", duplicaa: "yes" } );
  		array.push( { id: "b", duplicate: "no", duplicaa: "yes" } );
  		array.push( { id: "c", duplicate: "no", duplicaa: "no" } );
  		array.push( { id: "d", duplicate: "no", duplicaa: "no" } );

  		array[1].duplicate = "yes";

  		var array2 = [];
  		array2.push( { id: "a", duplicate: "no", duplicaa: "yes" } );
  		array2.push( { id: "c", duplicate: "no", duplicaa: "no" } );
  		array2.push( { id: "d", duplicate: "no", duplicaa: "no" } );

  		assert.deepEqual( array2, eliminateBothWay(array));
  	 });
  });

  //add ring property ( graph.links2, graph.nodes );
  describe('testAddRing', function(){
  	it( 'should add ring 1', function(){
  		var links = [];
  		var nodes = [];
  		nodes.push( 
  			{id: "a", ring: false},
  			{id: "b", ring: false},
  			{id: "c", ring: true},
  			{id: "d", ring: false},
  			{id: "e", ring: true});

  		links.push(
  			{source: "a", target: "c", ring: false},
  			{source: "b", target: "a", ring: false},
  			{source: "c", target: "e", ring: false},
  			{source: "d", target: "e", ring: false});

  		var array = [
  		{source: "a", target: "c", ring: false},
  		{source: "b", target: "a", ring: false},
  		{source: "c", target: "e", ring: true},
  		{source: "d", target: "e", ring: false}];

  		var array2 = [];

  		assert.deepEqual(array, addRingProperty(links, nodes));
  	});
  });
});

