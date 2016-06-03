var Donut = function() {
  this.data = {
    "name": "Donut",
    "children": [{
      "name": "Cake",
      "children": [{
        "name": "Batters",
        "children": [{
        "name": "Regular"
      	}, {
        "name": "Chocolate"
      	}, {
        "name": "Blueberry"
      	}, {
        "name": "Devil's Food"
      	}]
      }, {
        "name": "Toppings",
        "children": [{
        "name": "None"
      	}, {
        "name": "Glazed"
      	}, {
        "name": "Sugar"
      	}, {
        "name": "Powdered Sugar"
      	}, {
        "name": "Chocolate with Sprinkles"
      	}, {
        "name": "Chocolate"
      	}, {
        "name": "Maple"
      	}]
      }]
    }, {
      "name": "Raised",
      "children": [{
        "name": "Batter (Regular)"
      }, {
        "name": "Toppings",
        "children": [{
        "name": "None"
      	}, {
        "name": "Glazed"
      	}, {
        "name": "Sugar"
      	}, {
        "name": "Chocolate"
      	}, {
        "name": "Maple"
      	}]
      }]
    }, {
      "name": "Old Fashioned",
      "children": [{
        "name": "Batters",
        "children": [{
        "name": "Regular"
      	}, {
        "name": "Chocolate"
      	}]
      }, {
        "name": "Toppings",
        "children": [{
        "name": "None"
      	}, {
        "name": "Glazed"
      	}, {
        "name": "Chocolate"
      	}, {
        "name": "Maple"
      	}]
      }]
    }, {
      "name": "Bar",
      "children": [{
        "name": "Batter (Regular)"
      }, {
        "name": "Toppings",
        "children": [{
        "name": "Chocolate"
      	}, {
        "name": "Maple"
      	}]
      }, {
        "name": "Fillings",
        "children": [{
        "name": "None"
      	}, {
        "name": "Custard"
      	}, {
        "name": "Whipped Cream"
      	}]
      }]
    }, {
      "name": "Twist",
      "children": [{
        "name": "Batter (Regular)"
      }, {
        "name": "Toppings",
        "children": [{
        "name": "Glazed"
      	}, {
        "name": "Sugar"
      	}]
      }]
    }, {
      "name": "Filled",
      "children": [{
        "name": "Batter (Regular)"
      }, {
        "name": "Toppings",
        "children": [{
        "name": "Glazed"
      	}, {
        "name": "Powdered Sugar"
      	}, {
        "name": "Chocolate"
      	}, {
        "name": "Maple"
      	}]
      }, {
        "name": "Fillings",
        "children": [{
        "name": "Custard"
      	}, {
        "name": "Whipped Cream"
      	}, {
        "name": "Strawberry Jelly"
      	}, {
        "name": "Raspberry Jelly"
      	}]
      }]
    }]
  };
};

var donut = (new Donut()).data;
//flare_min.children = flare_min.children.splice(-3);
//flare_min.children = flare_min.children.slice(-2);

var height = 700, width = 500;

var diameter = 800;

var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = diameter,
    height = diameter;

var tree = d3.layout.tree()
    .size([360, diameter / 2 - 80])
    .separation(function(a, b) { return (a.parent == b.parent ? 1 : 10) / a.depth; });

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("#hierarchy").append("svg")
    .attr("width", width )
    .attr("height", height )
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

donut.x0 = height / 2;
donut.y0 = 0;

var i = 0;
var duration = 750;

update(donut);

root = donut;

function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

root.children.forEach(collapse);
update(root);

function update(source) {
	
  var nodes = tree.nodes(donut);
  var links = tree.links(nodes);
  
  var node = svg.selectAll("g.node")
	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var nodeEnter = node.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", click);

  nodeEnter.append("circle")
	  .attr("r", 1e-6)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
    .style("stroke", "steelblue")
  	.style("stroke-width", "1.5px");

  nodeEnter.append("text")
	  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6)
    .style("font", "10px sans-serif")
  	.style("stroke", "black")
  	.style("stroke-width", ".01px");

  /*var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });*/
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  nodeUpdate.select("circle")
	  .attr("r", 5)
	  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
  	.style("stroke", "steelblue")
  	.style("stroke-width", "1.5px");

  nodeUpdate.select("text")
	  .style("fill-opacity", 1)
    .style("font", "12px arial")
    //.style("font", "10px sans-serif")
  	.style("stroke", "black")
  	.style("stroke-width", ".01px");

  var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

  nodeExit.select("circle")
	  .attr("r", 1e-6);

  nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

  var link = svg.selectAll("path.link")
	  .data(links, function(d) { return d.target.id; });

  link.enter().insert("path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
		var o = {x: source.x0, y: source.y0};
		return diagonal({source: o, target: o});
	  })
    .style("fill", "none")
  	.style("stroke", "#ccc")
  	.style("stroke-width", "1.5px");

  link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

  link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
		var o = {x: source.x, y: source.y};
		return diagonal({source: o, target: o});
	  })
	  .remove();

  nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
  });
}

function click(d) {
  if (d.children) {
	d._children = d.children;
	d.children = null;
  } else {
	d.children = d._children;
	d._children = null;
  }
  update(d);
}