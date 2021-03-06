var hist = function(data_in, chart_id, value, chart_title) {

  var margin = {
      "top": 30,
      "right": 30,
      "bottom": 50,
      "left": 30
    },
    width = 600 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, d3.max(data_in, function(d) {
      return d.value[value];
    })])
    .range([height, 0]);

  d3.select("#" + chart_id).remove();

  //var div = d3.select("#cfjs_baseball_container").append("div").attr("id", chart_id);
  var div = d3.select("#cfjs_baseball_container").append("div").attr("id", chart_id);

  //var div = d3.select("#" + chart_id);

  div.append("h4").text(chart_title);

  var svg = div.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
    .data(data_in)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) {
      return "translate(" + x(i / data_in.length) + "," + y(d.value[value]) + ")";
    });

  bar.append("rect")
    .attr("x", 1)
    .attr("width", width / data_in.length - 1)
    .attr("height", function(d) {
      return height - y(d.value[value]);
    });

  var formatCount = d3.format(",.0f");

  /*bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", (width / data_in.length - 1) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return formatCount(d.value.count);
    });*/

  var unique_names = data_in.map(function(d) {
    return d.key;
  });

  var xScale = d3.scale.ordinal().domain(unique_names).rangePoints([0, width]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var xTicks = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 10)
    .attr("transform", function(d) {
      return "rotate(-50)"
    });


  var yAxis = d3.svg.axis()
    .ticks(5)
    .scale(y)
    .orient("left");

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 10);
}

d3.json("https://tranquil-peak-82564.herokuapp.com/api/v1.0/data/baseball/limit/100/",
  function(error, games_json) {

    var cf = crossfilter(games_json);
    var dim_team = cf.dimension(function(d) {
      return d.team_id;
    });
    var dim_team2 = cf.dimension(function(d) {
      return d.team_id;
    });
    var dim_ngames = cf.dimension(function(d) {
      return d.g_all;
    });
    /* add more dimensions here */

    var dim_year = cf.dimension(function(d) {
      return d.year;
    });
    var dim_year2 = cf.dimension(function(d) {
      return d.year;
    });
    var dim_player = cf.dimension(function(d) {
      return d.player_id;
    });
    var dim_player2 = cf.dimension(function(d) {
      return d.player_id;
    });

    var group_team = dim_team2.group();
    /* add more groups here */
    var group_year = dim_year2.group();
    var group_game = dim_ngames.group();
    var group_player = dim_player2.group();
    /* 
    // sanity check
    
    group_team
      .top(Infinity)
      .forEach(function(d, i) {
        console.log(JSON.stringify(d));
      });
      
    */

    /* --------------------------------------------------------- 
    
    	Add a third and 4th variable to this map reduction
      - the third should be the minimum year
      - the fourth should be the maximum year
      - hint: use inequalities
      
    */

    var reduce_init = function() {

      //console.log(JSON.stringify(all_years));
      return {
        "count": 0,
        "total": 0,
        "average": 0,
        "all_years": [],
        "min_year": 0,
        "max_year": 0,
        "display_min_year": 0,
        "display_max_year": 0,
        "year_range": 0,
      };
    }

    var reduce_add = function(p, v, nf) {
      if (v.year in p.all_years) p.all_years[v.year]++;
      else {
        p.all_years[v.year] = 1;
      }
      var keys = Object.keys(p.all_years).map(Number).filter(function(a) {
        return isFinite(a) && p.all_years[a];
      });
      var min = Math.min.apply(Math, keys);
      var max = Math.max.apply(Math, keys);
      p.min_year = min
      p.max_year = max
      if (!isFinite(p.min_year)) {
      	p.display_min_year = 0;
      }
      else {
      	p.display_min_year = p.min_year;
     }
     if (!isFinite(p.max_year)) {
      	p.display_max_year = 0;
      }
      else {
      	p.display_max_year = p.max_year;
     }
      p.year_range = p.display_max_year - p.display_min_year;
      // console.log(p.min_year); //USED FOR TESTING
      // console.log(p.max_year); //USED FOR TESTING
      ++p.count;
      p.total += v.g_all;
      if (p.count == 0)
        p.average=0;
      else
        p.average = p.total/p.count;
      return p;
    }

    var reduce_remove = function(p, v, nf) {
      p.all_years[v.year]--;
      if (p.all_years[v.year] === 0) {
        delete p.all_years[v.year];
      }
      var keys = Object.keys(p.all_years).map(Number).filter(function(a) {
        return isFinite(a) && p.all_years[a];
      });
      var min = Math.min.apply(Math, keys);
      var max = Math.max.apply(Math, keys);
      p.min_year = min;
      p.max_year = max;
      if (!isFinite(p.min_year)) {
      	p.display_min_year = 0;
        }
      else {
      	p.display_min_year = p.min_year;
       }
       if (!isFinite(p.max_year)) {
      	p.display_max_year = 0;
      }
      else {
      	p.display_max_year = p.max_year;
     }
           p.year_range = p.display_max_year - p.display_min_year;
      //   console.log(p.min_year); //USED FOR TESTING
      //   console.log(p.max_year); //USED FOR TESTING
      --p.count;
      p.total -= v.g_all;
      if (p.count == 0)
        p.average=0;
      else
        p.average = p.total/p.count;
      return p;
    }

    /* --------------------------------------------------------- */


    group_team.reduce(reduce_add, reduce_remove, reduce_init);

    /* reduce the more groups here */
    group_year.reduce(reduce_add, reduce_remove, reduce_init);
    group_player.reduce(reduce_add, reduce_remove, reduce_init);
    group_year.reduce(reduce_add, reduce_remove, reduce_init);
    group_game.reduce(reduce_add, reduce_remove, reduce_init);

    var render_plots = function() {
      // count refers to a specific key specified in reduce_init 
      // and updated in reduce_add and reduce_subtract
      // Modify this for the chart to plot the specified variable on the y-axis
      hist(group_team.top(Infinity),
        "appearances_by_team",
        "count",
        "# of Appearances by Team"
      );

      hist(group_year.top(Infinity),
        "appearances_by_year",
        "count",
        "# of Appearances by Year"
      );
      
      hist(group_team.top(Infinity),
        "year_range_team",
        "year_range",
        "Span of Years: Team Appearances"
      );
     

      hist(group_player.top(10),
        "games_by_player",
        "total",
        "# of Games by Player (First 10)"
      );
      
			hist(group_team.top(Infinity),
        "avg_games_by_team",
        "average",
        "Avg # Games by Team"
      );

      /* build more charts here */

    }


    /* --------------------------------------------------------- 
       this is a slider, see the html section above
    */
    var n_games_slider = new Slider(
      "#n_games_slider", {
        "id": "n_games_slider",
        "min": 0,
        "max": 100,
        "range": true,
        "value": [0, 100]
      });

    var year_slider = new Slider(
      "#year_slider", {
        "id": "year_slider",
        "min": 1872,
        "max": 1905,
        "range": true,
        "value": [1872, 1905]
      });

    var m2 = document.getElementById('metric2');

    m2.onchange = function() {
      if (m2.value == 'All') {
          //console.log(m1.indexOf[m1.value]);
          dim_player.filter();
          //dim_team.filterRange([x,x+1]);
        }
      else {
        dim_player.filterExact(m2.value);
      }
      render_plots();
    }

    var m1 = document.getElementById('metric');
      
      m1.onchange = function() {
        if (m1.value == 'All') {
          console.log("yay2");
          //console.log(m1.indexOf[m1.value]);
          dim_team.filter();
          //dim_team.filterRange([x,x+1]);
        }
        if (m1.value =='B') {
          dim_team.filterRange(['B','C']);
        }
        if (m1.value =='C') {
          dim_team.filterRange(['C','D']);
        }
        if (m1.value =='D') {
          dim_team.filterRange(['D','E']);
        }
        if (m1.value =='E') {
          dim_team.filterRange(['E','F']);
        }
        if (m1.value =='I') {
          dim_team.filterRange(['I','J']);
        }
        if (m1.value =='K') {
          dim_team.filterRange(['K','L']);
        }
        if (m1.value =='L') {
          dim_team.filterRange(['L','M']);
        }
        if (m1.value =='N') {
          dim_team.filterRange(['N','O']);
        }
        if (m1.value =='P') {
          dim_team.filterRange(['P','Q']);
        }
        if (m1.value =='S') {
          dim_team.filterRange(['S','T']);
        }
        if (m1.value =='T') {
          dim_team.filterRange(['T','U']);
        }
        if (m1.value =='W') {
          dim_team.filterRange(['W','X']);
        }
        //dim_team.filterExact(m1.value);
        //console.log(m1.value);
        render_plots();
      }

    /* add at least 3 more sliders here */

    // this is an event handler for a particular slider
    n_games_slider.on("slide", function(e) {
      d3.select("#n_games_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

      // filter based on the UI element
      dim_ngames.filter(e);

      // re-render
      render_plots();

      /* update the other charts here 
       hint: each one of your event handlers needs to update all of the charts
      */

    });

    year_slider.on("slide", function(e) {
      d3.select("#year_slider_txt").text("min: " + e[0] + ", max: " + e[1]);

      dim_year.filter(e);
      render_plots();

    });


    /* add at least 3 more event handlers here */


    /* --------------------------------------------------------- */



    render_plots(); // this just renders the plots for the first time

  });
