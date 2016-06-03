/*The Evolution of Ebola: 2014-2016
C3 Data Visualizations developed by: Ashley Yu, Dana Li

Data Source: https://data.hdx.rwlabs.org/ebola
*/

// C3 init

// JSON Data Sets

var my_data = [
  ["2014", 2397, 3110, 7354, 7, 19, 1]
];

var data_sum = [
	["2014", 12888]
];

var data_end = [
	["Guinea", 2397,3351],
  ["Liberia",3110,3160],
  ["Sierra Leone",7354,8704],
  ["Mali",7,7],
  ["Nigeria",19,19],
  ["Senegal",1,1]
];

var my_data2 = [
  ["Senegal",1,1,1,1,1]
];

// Chart parameters 

var my_chart_parameters2 = {
  "data": {
    "columns": my_data2,
    "selection": {
      "enabled": true
    }
  },
  "point": {
    "r": 8,
    "focus": {
      "expand": {
        "r": 7,
        "enabled": true
      }
    }
  },
  "axis": {
    x: {
      type: 'category',
      categories: ['Dec14', 'Apr15', 'Aug15', 'Dec15', 'Mar16']
    },
    y: {
      label: '# of confirmed Ebola cases'
    }
  },
  "tooltip": {
    "show": true,
    "grouped": false
  }
};

var my_chart_end = {
"data": {
    "columns": data_end,
    "type": 'bar',
    "selection": {
      "enabled": true
    }
  },
  "axis": {
  	"x": {
    "type": 'category',
    "categories": ["2014","2016"]
    }
  }
}; 

var my_chart_sum = {
 "data": {
    "columns": data_sum,
    "type": 'bar',
    "selection": {
      "enabled": true
    }
  },
  "bar": {
        "width": {
            "ratio": 0.2
        }
        },
  "axis": {
  	"x": {
    "type": 'category',
    "categories": ["Africa"]
    }
  }
};


var my_chart_parameters = {
  "data": {
    "columns": my_data,
    "type": 'bar',
    "selection": {
      "enabled": true
    }
  },
  "axis": {
  	"x": {
    "type": 'category',
    "categories": ["Guinea", "Liberia", "Sierra Leone", "Mali", "Nigeria", "Senegal"]
    }
  }
};


var my_chart_sumobj = c3.generate(my_chart_sum);
var my_chart_object;
var my_chart_endobj;

// slides

var slide_0 = function() {
	my_chart_sumobj.groups([["2014"]]);
  document.getElementById("message").innerHTML = "In 2014, 12,888 cases of ebola were confirmed in Africa.";
};

var slide_1 = function() {
	my_chart_object = c3.generate(my_chart_parameters);
	my_chart_object.groups([["2014"]]);
  document.getElementById("message").innerHTML = "Sierra Leone made up a staggering 7,354 cases, more than half the total.";
};

var slide_2 = function() {
	my_chart_object.load({
  columns: [
  ["2015", 3351, 3160, 8704, 7, 19, 1]
  ]
  })
  document.getElementById("message").innerHTML = "Guinea, Liberia, and Sierra Leone all saw an increase in Ebola in 2015.";
};

var slide_3 = function() {
  my_chart_object.load({
    columns: [
       ["2016", 3353, 3160, 8704, 7, 19, 1]
    ]
  });
  document.getElementById("message").innerHTML = "So far, 2016 remains approximately stable.";
};

var slide_4 = function() {
	//my_chart_object2 = c3.generate(my_chart_parameters2);
  //my_chart.object2.focus("Senegal");
  my_chart_object= c3.generate(my_chart_parameters2);
  //my_chart_object2.load({
  //  columns: [
  //    ["Senegal",1,1,1,1,1]
  //  ]
  //});
  //my_chart_object.select(["data1"], [2]);
  document.getElementById("message").innerHTML = "The number of ebola cases in some countries remained constant, Senegal with just 1.";
};

var slide_5 = function() {
  my_chart_object.load({
    columns: [
      ["Mali",7,7,7,7,7]
    ]
  });
  document.getElementById("message").innerHTML = "Mali with 7...";
};

var slide_6 = function() {
   my_chart_object.load({
    columns: [
      ["Nigeria",19,19,19,19,19]
    ]
  });
  document.getElementById("message").innerHTML = "Nigeria with 19...";
};

var slide_7 = function() {
  my_chart_object.load({
    columns: [
      ["Guinea",2397,3159,3337,3351,3353]
    ]
  });
  document.getElementById("message").innerHTML = "But in Guinea, it's a totally different story. This is where the outbreak first started.";
};

var slide_8 = function() {
  my_chart_object.load({
    columns: [
      ["Liberia",3110,3151,3157,3160,3160]
    ]
  });
  document.getElementById("message").innerHTML = "Similar situation in Liberia.";
};

var slide_9 = function() {
  my_chart_object.load({
    columns: [
      ["Sierra Leone",7354,8588,8698,8704,8704]
    ]
  });
  document.getElementById("message").innerHTML = "And Sierra Leone had by far the most number of confirmed ebola cases.";
};

var slide_10 = function() {
  my_chart_object.unload({
    ids: "Senegal" 
  });
  my_chart_object.unload({
    ids: "Mali" 
  });
  my_chart_object.unload({
    ids: "Nigeria" 
  });
  document.getElementById("message").innerHTML = "If we focus on Guinea, Liberia, and Sierra Leone...";
};

var slide_11 = function() {
  my_chart_object.regions([{
    start: 0,
    end: 1
  }]);
  document.getElementById("message").innerHTML = "We see that the sharpest increase in confirmed ebola cases took place at the beginning of 2015.";
};

var slide_12 = function() {
my_chart_endobj = c3.generate(my_chart_end);
my_chart_endobj.groups([["Guinea", "Liberia", "Sierra Leone", "Mali", "Nigeria", "Senegal"]]);
  document.getElementById("message").innerHTML = "Overall, we see the cases of ebola have not gone down in Africa the last 2 years, but rather up.";
};

var slides = [slide_0, slide_1, slide_2, slide_3, slide_4, slide_5, slide_6, slide_7, slide_8, slide_9, slide_10, slide_11, slide_12];

// cycle through slides

var current_slide = 0;

var run = function() {
  slides[current_slide]();
  current_slide += 1;

  if (current_slide === 1) {
    document.getElementById("start_btn").innerHTML = "Start";
  } else if (current_slide === slides.length) {
   current_slide = 0;
    document.getElementById("start_btn").innerHTML = "Replay";
  } else {
    document.getElementById("start_btn").innerHTML = "Continue";
  }
};

// button event handler

document.getElementById('start_btn').addEventListener("click", run);

// init

run();