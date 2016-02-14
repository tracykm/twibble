// makeBuubleChart([
//   {word: "price", id: 1, total_amount: 5, group: "low", tweets: [0]},
//   {word: "college", id: 2, total_amount: 10, group: "high", tweets: [2]},
//   {word: "families", id: 3, total_amount: 1, group: "low", tweets: [3,4]}
// ]);

var CustomTooltip = require('./customTooltip.js');


  var BubbleChart, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  BubbleChart = (function() {
    function BubbleChart(data) {
      this.hide_details = __bind(this.hide_details, this);
      this.show_details = __bind(this.show_details, this);
      this.show_name = __bind(this.show_name, this);
      this.hide_years = __bind(this.hide_years, this);
      this.display_years = __bind(this.display_years, this);
      this.move_towards_year = __bind(this.move_towards_year, this);
      this.display_by_year = __bind(this.display_by_year, this);
      this.move_towards_center = __bind(this.move_towards_center, this);
      this.display_group_all = __bind(this.display_group_all, this);
      this.start = __bind(this.start, this);
      this.clear = __bind(this.clear, this);
      this.create_vis = __bind(this.create_vis, this);
      this.create_nodes = __bind(this.create_nodes, this);
      var max_amount;
      this.data = data;
      this.width = 940;
      this.height = 500;
      this.tooltip = CustomTooltip("gates_tooltip", 240);
      this.center = {
        x: this.width / 2,
        y: this.height / 2
      };
      this.year_centers = {
        "2008": {
          x: this.width / 3,
          y: this.height / 2
        },
        "2009": {
          x: this.width / 2,
          y: this.height / 2
        },
        "2010": {
          x: 2 * this.width / 3,
          y: this.height / 2
        }
      };
      var color = ['#FF530D', '#E82C0C', '#FF0000', '#E80C7A', '#FF0DFF']
      this.layout_gravity = -0.01;
      this.damper = 0.1;
      this.vis = null;
      this.gnodes = [];
      this.nodes = [];
      this.force = null;
      this.circles = null;
      this.fill_color = d3.scale.ordinal().domain([1, 2, 3, 4, 5]).range(['#FF530D', '#E82C0C', '#FF0000', '#E80C7A', '#FF0DFF']);
      max_amount = d3.max(this.data, function(d) {
        return parseInt(d.total_amount);
      });
      this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);
      this.create_nodes();
      this.create_vis();
    }

    BubbleChart.prototype.create_nodes = function() {
      this.data.forEach((function(_this) {
        return function(d) {
          var node;
          node = {
            id: d.id,
            radius: _this.radius_scale(parseInt(d.total_amount)),
            value: d.total_amount,
            name: d.word,
            tweets: d.tweet_ids,
            org: d.organization,
            group: d.group,
            year: d.start_year,
            x: Math.random() * 900,
            y: Math.random() * 800
          };
          return _this.nodes.push(node);
        };
      })(this));
      return this.nodes.sort(function(a, b) {
        return b.value - a.value;
      });
    };

    BubbleChart.prototype.create_vis = function() {
      var that;
      this.vis = d3.select("#vis").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");

      this.gnodes = this.vis.selectAll('g.gnode')
        .data(this.nodes)
       .enter()
       .append('g')
       .classed('gnode', true);

       var colors = ['#FF530D', '#E82C0C', '#FF0000', '#E80C7A', '#FF0DFF'];
       var id = 0;
      var nodes = this.gnodes.append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .attr("id", function(d) {
        id = d.id;
        return "bubble_" + d.id;
      }).attr("fill", colors[ (Math.floor(Math.random() * 4) + 1 ) ]).on("mouseover", function(d, i) {
              // that.show_name(d, i, this);
              // this.attr("fill", "black")
              // return that.show_details(d, i, this);
            }).on("mouseout", function(d, i) {
              // return that.hide_details(d, i, this);
            });



      var labels = this.gnodes.append("text")
                         .text(function(d) { return (d.name); })
                         .attr("transform", function(d) {
                                return 'translate(' + [(d.radius/2)*-1, 0] + ')';
                            });

      // this.gnodes.attr("transform", function(d) {
      //        return 'translate(' + [d.x, d.y] + ')';
      //    });


      // that = this;
      // nodes.enter().append("circle").attr("r", 0).attr("fill", (function(_this) {
      //   return function(d) {
      //     return _this.fill_color(d.group);
      //   };
      //
      //
      // })(this)).attr("stroke-width", 2).attr("stroke", (function(_this) {
      //   return function(d) {
      //     return d3.rgb(_this.fill_color(d.group)).darker();
      //   };
      // })(this)).attr("id", function(d) {
      //   return "bubble_" + d.id;
      // }).on("mouseover", function(d, i) {
      //   that.show_name(d, i, this);
      //   // return that.show_details(d, i, this);
      // }).on("mouseout", function(d, i) {
      //   // return that.hide_details(d, i, this);
      // });
      //
      // this.gnodes.each(function(d){
      //   var cx = d.x;
      //   console.log(cx);
      //   d.selectAll("text").data(this.nodes, function(d) {
      //     return d.name;
      //   }).enter().append("text").text(function(d){
      //     return d.name
      //   })
      // });
      // debugger
      return nodes.transition().duration(2000).attr("r", function(d) {
        return d.radius;
      });
    };

    BubbleChart.prototype.charge = function(d) {
      return -Math.pow(d.radius, 2.0) / 8;
    };

    BubbleChart.prototype.start = function() {
      return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
    };

    BubbleChart.prototype.clear = function() {
      return d3.select("svg").remove();
    };

    BubbleChart.prototype.display_group_all = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.gnodes.each(_this.move_towards_center(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
        };
      })(this));
      this.force.start();
      return this.hide_years();
    };

    BubbleChart.prototype.move_towards_center = function(alpha) {
      return (function(_this) {
        return function(d) {

          _this.gnodes.attr("transform", function(d) {
                 return 'translate(' + [d.x, d.y] + ')';
             });

          d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
          return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
        };
      })(this);
    };

    BubbleChart.prototype.display_by_year = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.gnodes.each(_this.move_towards_year(e.alpha)).attr("cx", function(d) {
            return (d.x);
          }).attr("cy", function(d) {
            return d.y;
          });
        };
      })(this));
      this.force.start();
      return this.display_years();
    };

    BubbleChart.prototype.move_towards_year = function(alpha) {
      return (function(_this) {
        return function(d) {
          var target;
          target = _this.year_centers[d.year];
          d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
          return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
        };
      })(this);
    };

    BubbleChart.prototype.display_years = function() {
      var years, years_data, years_x;
      years_x = {
        "2008": 160,
        "2009": this.width / 2,
        "2010": this.width - 160
      };
      years_data = d3.keys(years_x);
      years = this.vis.selectAll(".years").data(years_data);
      return years.enter().append("text").attr("class", "years").attr("x", (function(_this) {
        return function(d) {
          return years_x[d];
        };
      })(this)).attr("y", 40).attr("text-anchor", "middle").text(function(d) {
        return d;
      });
    };

    BubbleChart.prototype.hide_years = function() {
      var years;
      return years = this.vis.selectAll(".years").remove();
    };

    BubbleChart.prototype.show_details = function(data, i, element) {
      var content;
      d3.select(element).attr("stroke", "black");
      content = "<span class=\"name\">Word:</span><span class=\"value\"> " + data.name + "</span><br/>";
      content += "<span class=\"name\">Usess:</span><span class=\"value\"> " + (addCommas(data.value)) + "</span><br/>";
      content += "<span class=\"name\">Year:</span><span class=\"value\"> " + data.year + "</span>";
      return this.tooltip.showTooltip(content, d3.event);
    };

    BubbleChart.prototype.show_name = function(data, i, element) {
      var content;
      d3.select(element).attr("stroke", "black");
      content = "<span class=\"name\">Word:</span><span class=\"value\"> " + data.name + "</span><br/>";
      return this.tooltip.showTooltip(content, d3.event);
    };
    var color = ['#FF530D', '#E82C0C', '#FF0000', '#E80C7A', '#FF0DFF']

    BubbleChart.prototype.hide_details = function(data, i, element) {
      d3.select(element).attr("stroke", (function(_this) {
        return function(d) {
          return d3.rgb(_this.fill_color(color[d.id])).darker();
        };
      })(this));
      return this.tooltip.hideTooltip();
    };

    return BubbleChart;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

    var chart, render_vis;
    chart = null;
    render_vis = function(myExternalData) {
      chart = new BubbleChart(myExternalData);
      chart.start();
      return root.display_all();
    };
    clear_chart = function(){
      if(chart){
        chart.clear()
      }
    };
    root.display_all = (function(_this) {
      return function() {
        return chart.display_group_all();
      };
    })(this);
    root.display_year = (function(_this) {
      return function() {
        return chart.display_by_year();
      };
    })(this);
    root.toggle_view = (function(_this) {
      return function(view_type) {
        if (view_type === 'year') {
          return root.display_year();
        } else {
          return root.display_all();
        }
      };
    })(this);


    // tweets = [
    //   "The U.S. pays the highest price in the world for prescription drugs; 1 out of 5 patients cannot afford to fill their prescriptions.",
    //   "I want to thank the Democrats of Minnesota for making sure that Paul's work and more importantly his vision is never forgotten.",
    //   "It's unacceptable that millions of college graduates can't afford to buy their first home or car because of outrageously high student debt.",
    //   "Raids are not the answer. We cannot continue to employ inhumane tactics involving rounding up and deporting thousands of immigrant families.",
    //   "I've put forward an immigration plan that protects children and keeps families together. It is time for @HillaryClinton to do the same.",
    // ]

module.exports = {render: render_vis, clear: clear_chart};
