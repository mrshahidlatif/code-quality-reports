function ScatterPlot(){
    var $el = d3.select("#chart");
    var size = 0;
    var margin = 5;
    var colorAcessor = null;
    var colorScale = d3.scale.ordinal(d3.schemeCategory10);
    var data;
    //not used parameters :
    var dimensions = [], excluded_dimensions = ["cname", "index", "neighbors", "rfc", "dam", "moa", "mfa", "cam", "ic", "cbm", "avg_cc"];
    var dotRadius = 3;
    var mouseout = function(d,i){};
    var mouseover = function(d,i){};
    var threshold = 12;
    var dotOpacity = 0.4;
    var colorScaleDimensions = d3.scale.ordinal(d3.schemeDark2);

    // Intern variables
    var svg, x, y, root;
    var width, height;
    var force;

    var tooltip = d3.select('body',window.parent.document)
        .append('div')
        .attr('class', 'tooltip')
        .style("opacity", 0);

    function clone(obj) {
        if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
            return obj;

        if (obj instanceof Date)
            var temp = new obj.constructor(); //or new Date(obj);
        else
            var temp = obj.constructor();

        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }

        return temp;
    }

    var object = {}, prev_data = [];
    object.render = function() {
        var w = d3.select($el).style("width");
        var h = d3.select($el).style("height");
        svg = d3.select($el).append("svg").attr('width', w).attr("height", h);
        root = svg.append("g")
            .attr("transform", "translate(" + margin + "," + 2 + ")");
        if(prev_data != null && prev_data.length > 0) {
            var chart_data = clone(prev_data);
            data = chart_data;
        } else prev_data = clone(data);
        data.forEach(function(d, i){
            d3.keys(d).map(function(item){
                try {if(excluded_dimensions.indexOf(item) == -1 && !isNaN(parseFloat(d[item]))) {
                    d[item] = parseFloat(d[item]);
                }} catch(e){}
            });
            d.index = i;
            d.neighbors = [];
        });
        size = size - 20;

        var xValue = function(d) {return d[dimensions[0]];}, // data -> value
            xScale = d3.scale.linear().range([0, size]),     // value -> display
            xMap = function(d) { return xScale(xValue(d));}; // data -> display

        var yValue = function(d) { return d[dimensions[1]];}, // data -> value
            yScale = d3.scale.linear().range([size, 0]),			// value -> display
            yMap = function(d) { return yScale(yValue(d));}; // data -> display

        xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
        yScale.domain([-1, d3.max(data, yValue)+1]);

        var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(4);
        var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(4);
        root.append("g")
            .attr("class", "axis x-axis")
            .style("font-size","12px")
            .attr("transform", "translate( 0, " +size+")") // move axis to bottom of chart
            .call(xAxis);
        //     .call(d3.axis(xScale).ticks(5).tickFormat(function (d) {  if ((d / 1000) >= 1) { d = d / 1000 + "K";} return d;
        //   }));

        // x-axis label
        root.append("text")
            .attr("class", "label")
            .attr("x", size/2)
            .attr("y", size+ 25)
            .style("text-anchor", "middle")
            .text(dimensions[0])
            .style("font-size","14px");

        // y-axis
        root.append("g")
            .attr("class", "axis y-axis")
            .style("font-size","12px")
            .attr("transform", "translate("+ 0 + ",0)") // move axis to bottom of chart
            .call(yAxis);
        //     .call(d3.axisLeft(yScale).ticks(5).tickFormat(function (d) {  if ((d / 1000) >= 1) { d = d / 1000 + "K";} return d;
        //   }));

        // y-axis label
        root.append("text")
            .attr("class", "label")
            .attr("x", 0-(size/2))
            .attr("y", 0-margin*0.7)
            .attr("transform", "rotate(-90)") // rotate text -90 degrees from x, y
            .style("text-anchor", "middle")
            .text(dimensions[1])
            .style("font-size","14px");

        root.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .attr("id",function(d){
                //adding class name to each dot DOM
                var fName = d.cname.split(".")
                var cName = fName[fName.length-1];
                return cName;
            })
            .style("fill", function(d) {
                return "#8d8e8e";
            })
            .on("mouseover", function(d) { 
                var lst = d.cname.split(".");
                var className = lst[lst.length-1];
                showHoverHighlighting(className);
                //Show the new tooltip
               d3.select('.tooltip')
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(className)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 5) + "px");
            })
            .on("mouseout", function(d) {
                var lst = d.cname.split(".");
                var className = lst[lst.length-1];
                removeHoverHighlighting(className);
                mouseout(d);

               //Hiding the tooltip
               tooltip.transition()
                .duration(500)
                .style("opacity", 0);
                
            }).on("click",function(d){
                var str = d.cname;
                updateClassDescription(generateClassDescription(str.split('.').pop()));
                var url = "sourcecode/src/" + str.replace(/[.]/g, "/") + ".java";
                $("#detailsHeader").text("File "+str.split(".").pop()+ ".java");
                $("#detailsContent").empty();
                $("#detailsContent").append($('<pre id="sourcecodeContainer"><code id="sourcecode" class="language-java"></code></pre>'));
                // TODO: replace by asynchronous load
                var src = $.ajax({
                  url: url,
                  async: false
                }).responseText;
                src = src.substring(src.indexOf("package "));   // cut out license text
                $("#sourcecode").text(src);
                Prism.highlightElement($("#sourcecode")[0]);

                
              });

        data.forEach(function(d, i){
            d.x = xMap(d) + margin;
            d.y = yMap(d) + margin;
        });

        return object;
    };

    function place_labels(labelData, xScale, yScale){
        window.collide = d3.bboxCollide((a) => {
            return [
				[a.offsetCornerX, a.offsetCornerY],
				[a.offsetCornerX + a.width, a.offsetCornerY + a.height]
			]
        }).strength(0.5).iterations(1);

        window.yScale = yScale;
        var nonOtherNodes = [];
        var findNeighbors = function (data, k) {
            return data.map(datum => {
                    data.map(neighbor => {
                        var xDiff = Math.abs(datum.x - neighbor.x);
                        var yDiff = Math.abs(datum.y - neighbor.y);
                        var distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
                        var currentFartherNeighbor = datum.neighbors.find(dataNeighbor => dataNeighbor[0] > distance);
                        if (distance > 0) {
                            datum.neighbors.length < k ?
                                datum.neighbors.push([distance, neighbor.index]) : currentFartherNeighbor ?
                                datum.neighbors.splice(datum.neighbors.indexOf(currentFartherNeighbor), 1,
                                    [distance, neighbor.index]) : false;
                            datum.neighbors.sort((a, b) => b[0] - a[0]);
                        }
                        return datum;
                    });
                });
        }

        findNeighbors(labelData, 10);
        labelData.forEach(function (d, i) {
            if (d.neighbors && d.neighbors.length > 0) {
                var neighbor = d.neighbors.pop();
                var isOutlier = neighbor[0] > OUTLIER_THRESHOLD;
                if (isOutlier) {
                    nonOtherNodes.push(d);
                    try {if(d.index) data[d.index].isOutlier = isOutlier;} catch(e){}
                }
            }
        });

        svg.selectAll('.dot').style("fill", function(d, i) {
            if(d.isOutlier) {
                return "red";
            } else {
                return colorScale(i);
            }

        });


        window.makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(nonOtherNodes.map((d, i) => {
                return {
                    data: {x: d.x, y: d.y, pointIdx: d.index},
                    note: {
                        label: d.cname ? d.cname.split(".").pop() : "label",
                        align: "middle",
                        fixed: true
                    },
                    connector: { type: "elbow" }
                }
            }))
            .accessors({x: d => d.x, y: d => d.y})
            .on('noteover', function (annotation) {
                this.classed('activelabel', true);
                svg.append("circle").classed("shadow-tooltip", true)
                    .style("fill", "blue").attr("r", 5)
                    .attr("cx", annotation.data.x).attr("cy", annotation.data.y);
            })
            .on('noteout', function (annotation) {
                this.classed('activelabel', false);
                svg.selectAll('.shadow-tooltip').remove();
            });


        svg.selectAll('.annotation-test').remove();
        svg.append('g').classed('annotation-test', true).call(makeAnnotations);

		var labelArray = makeAnnotations.annotations();

        labelArray.forEach((d, i) => {
            d.position = nonOtherNodes[i];
        });

        const noteBoxes = makeAnnotations.collection().noteNodes;
        window.labelForce = d3.forceSimulation(noteBoxes)
               /*  .force("x", d3.forceX(a => a.positionX).strength(a => Math.max(0.15, Math.min(3, Math.abs(a.x - a.positionX) / 20))))
                .force("y", d3.forceY(a => a.positionY).strength(a => Math.max(0.25, Math.min(3, Math.abs(a.x - a.positionX) / 20)))) */
                .force("collision", window.collide)
				/* .alpha(0.5)
				.on('tick', d => {
                    labelArray.forEach((d, i) => {
                        const match = noteBoxes[i];
                        try {d.dx = match.x - match.positionX;} catch(e){}
                        try {d.dy = match.y - match.positionY;} catch(e){}
                    });
                    makeAnnotations.update();
                }); */

		labelArray.forEach((d, i) => {
			d.width = noteBoxes[i].width;
			d.height = noteBoxes[i].height - 3;
			d.positionX = noteBoxes[i].positionX;
			d.positionY = noteBoxes[i].positionY;
			d.offsetCornerX = noteBoxes[i].offsetCornerX;
			d.offsetCornerY = 0;//noteBoxes[i].offsetCornerY;
			d.index = i;


			var stepLength = d.height,
				stepRotateAngle = 2 * Math.PI / 100,
				cost = undefined,
				initCost = 10000,
				minPosition = {};

			for(var j = 0; j < 10; j++){

				var len = stepLength * j, angle = 0;

				while(angle < 2 * Math.PI){
					d.x = d.positionX + len * Math.sin(angle);
					d.y = d.positionY + len * Math.cos(angle);

					cost = calculateCost(labelData, nonOtherNodes, d, labelArray, j);

					if(cost <= initCost){
						initCost = cost;
						minPosition = {x: d.x, y: d.y, a:angle, j:j};
					}
					angle += stepRotateAngle;
				}
			}

			d.x = minPosition.x; d.y = minPosition.y;

			/* svg.append("rect")
				.attr("x", d.x + d.offsetCornerX)
				.attr("y", d.y + d.offsetCornerY)
				.attr("width", d.width)
				.attr("height", d.height)
				.attr("stroke", "#aaa")
				.style("fill", "transparent"); */

			/* if(d.note.label == "RevalidatingDOMParser"){
				labelArray.forEach((dd)=>{
					if(dd.note.label == "XMLEntityReaderFactory"){
						console.log(isOverlapTwoLabel(dd,d,true));


						svg.append("rect")
							.attr("x", d.x + d.offsetCornerX)
							.attr("y", d.y + d.offsetCornerY)
							.attr("width", d.width)
							.attr("height", d.height)
							.attr("stroke", "#aaa")
							.attr("stroke-width", 1)
							.style("fill", "transparent");


						svg.append("rect")
							.attr("x", dd.x + dd.offsetCornerX)
							.attr("y", dd.y + dd.offsetCornerY)
							.attr("width", dd.width)
							.attr("height", dd.height)
							.attr("stroke", "#f00")
							.attr("stroke-width", 1)
							.style("fill", "transparent");

					}

				})
			} */
			// if(d.note.label == "XSchemaValidator")
				// d.note.label,calculateCost(labelData, nonOtherNodes, d, labelArray, minPosition.j,true);

			/* svg.append("circle")
				.style("fill", "green").attr("r", 2)
				.attr("cx", d.x).attr("cy", d.y); */

			svg.append("line")
				.attr("stroke", "#555")
				.attr("x1", d.x)
				.attr("y1", (d.y + d.height < d.positionY)? d.y + d.height: d.y)
				.attr("x2", d.positionX)
				.attr("y2", d.positionY);
		});
    }

	var calculateCost = function(n, m, checkLabel, labels, distanceLevel,b){

		var xmin = 350 + margin, xmax = 800 + margin, ymin = margin, ymax = 450 + margin,
			xrel = (checkLabel.positionX - xmin)/(xmax - xmin),
			yrel = (checkLabel.positionY - ymin)/(ymax - ymin);

		var a1 = 0,//countPointCoverByLabel(m, checkLabel) * 100,
			a2 = countPointCoverByLabel(n, checkLabel) * 100,
			a3 = distanceLevel * 10,//calcD({x: checkLabel.positionX, y: checkLabel.positionY},{x: checkLabel.x, y: checkLabel.y}),
			a4 = 0,//countPointOnLine(m, checkLabel),
			a5 = countPointOnLine(n, checkLabel) * 100;
			a6 = countOverlapLabels(labels, checkLabel) * 1000,
			a7 = undefined, a8 = undefined;
		if(xrel < 0.5 && checkLabel.x + checkLabel.offsetCornerX > checkLabel.positionX){
			a7 = 1;
		}else if(xrel > 0.5 && checkLabel.x + checkLabel.offsetCornerX < checkLabel.positionX){
			a7 = 1;
		}else{
			a7 = 0;
		}
		if(yrel < 0.5 && checkLabel.y + checkLabel.offsetCornerY > checkLabel.positionY){
			a8 = 1;
		}else if(yrel > 0.5 && checkLabel.y + checkLabel.offsetCornerY < checkLabel.positionY){
			a8 = 1;
		}else{
			a8 = 0;
		}
		a7 *= 10; a8 *= 10;
		var a9 = countLineCoverByLabel(labels, checkLabel) * 100;

		var l = getLabelLeftCorner(checkLabel);
		// var a10 = (l.x < xmin || l.y < ymin || (l.x + l.width) > xmax || (l.y + l.height) > ymax) ? 1000 : 0;
		var a10 = (l.y < ymin || (l.x + l.width) > xmax) ? 1000 : 0;


		// if(b)console.log(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)
		// if(checkLabel.note.label == "DeferredDocumentImpl")console.log(a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)
		return a1 + a2 + a3 + a4 + a5 + a6 + a7 + a8 + a9 + a10;

	}

	var countPointCoverByLabel = function(points,label){
		var theLabel = getLabelLeftCorner(label);
		var c = 0,
			labelEnd = {x: theLabel.x + theLabel.width, y:theLabel.y + theLabel.height};
		points.forEach((d, i) =>{
			var t = (d.x >= theLabel.x && d.y >= theLabel.y && d.x <= labelEnd.x && d.y <= labelEnd.y);
			// if(d.index !== label.data.pointIdx && t) c++;
			if(t) c++;
		});
		return c;
	}

	var calcD = function(p1,p2){
		return Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) +  (p1.y - p2.y)*(p1.y - p2.y))
	};

	var countPointOnLine = function(points, label){
		var line = {x: label.positionX, y: label.positionY, endx : label.x, endy: label.y}
		if(line.y < line.endy) line.endy = line.endy + label.height;
		var c = 0;
		points.forEach((d, i) => {
			if(d.index !== label.data.pointIdx && isOnLine(d, line))
				c++;
		});
		return c;
	};

	var isOnLine = function(p, l){
		if(p.x == l.x && p.y == l.y) return false;
		var a = (l.x == l.endx)? 0 : (l.y - l.endy)/(l.x - l.endx),
			b = l.y - a * l.x;

		return (p.x >= l.x && p.x <= l.endx || p.x <= l.x && p.x >= l.endx) && (p.y >= l.y && p.y <= l.endy || p.y <= l.y && p.y >= l.endy) && (a * p.x + b  - p.y) < 2;
	};

	var countOverlapLabels = function(labels, l){
		var c = 0;
		labels.forEach((d, i) =>{
			if(d.index !== undefined && i !== l.index && isOverlapTwoLabel(d, l)) c++;
		});
		return c;
	};

	var isOverlapTwoLabel = function(l1,l2,b){

		var label1 = getLabelLeftCorner(l1),
			label2 = getLabelLeftCorner(l2);

		// var x1 = label1.x - label1.width / 2, x2 = label1.x + label1.width / 2,
		var x1 = label1.x, x2 = label1.x + label1.width,
			x3 = x1, x4 = x2,
			y1 = label1.y, y2 = label1.y,
			y3 = label1.y + label1.height, y4 = y3;

		// var X1 = label2.x - label2.width / 2, X2 = label2.x + label2.width / 2,
		var X1 = label2.x, X2 = label2.x + label2.width,
			X3 = X1, X4 = X2,
			Y1 = label2.y, Y2 = label2.y,
			Y3 = label2.y + label2.height, Y4 = Y3;


		var xIntersect = false, yIntersect = false;
		if (!(Math.min(x1, x2, x3, x4) > Math.max(X1, X2, X3, X4) || Math.max(x1, x2, x3, x4) < Math.min(X1, X2, X3, X4))) xIntersect = true;
		if (!(Math.min(y1, y2, y3, y4) > Math.max(Y1, Y2, Y3, Y4) || Math.max(y1, y2, y3, y4) < Math.min(Y1, Y2, Y3, Y4))) yIntersect = true;

		return (xIntersect && yIntersect);
	};

	var getLabelLeftCorner = function(label){
		var padding = 2;
		var x = label.x + label.offsetCornerX - padding,
			// y = (label.y <= label.positionY) ? label.y - label.height : label.y;
			y = label.y - padding;
		return {x: x, y:y, width: label.width + padding, height: label.height + padding}
	};

	var countLineCoverByLabel = function(labels, label,b){

		var line = {x1: label.positionX, y1: label.positionY, x2 : label.x, y2: label.y};
		if(line.y1 < line.y2) line.y2 = line.y2 + label.height;
		var c = 0;
		labels.forEach((d, i)=>{
			if(d.index !== undefined && label.index !== d.index && lineRectIntersects(line, getLabelLeftCorner(d)))c++;
			// if(b && d.note.label == "XSchemaValidator")console.log(line, getLabelLeftCorner(d))
		});
		return c;
	}

	var lineRectIntersects = function(line, rect){

		// p=line startpoint, p2=line endpoint
		var p={x:line.x1,y:line.y1};
		var p2={x:line.x2,y:line.y2};

		// top rect line
		var q={x:rect.x,y:rect.y};
		var q2={x:rect.x+rect.width,y:rect.y};
		if(doLineSegmentsIntersect(p,p2,q,q2)){ return true; }

		// right rect line
		var q=q2;
		var q2={x:rect.x+rect.width,y:rect.y+rect.height};
		if(doLineSegmentsIntersect(p,p2,q,q2)){ return true; }

		// bottom rect line
		var q=q2;
		var q2={x:rect.x,y:rect.y+rect.height};
		if(doLineSegmentsIntersect(p,p2,q,q2)){ return true; }

		// left rect line
		var q=q2;
		var q2={x:rect.x,y:rect.y};
		if(doLineSegmentsIntersect(p,p2,q,q2)){ return true; }

		// If not intersecting with the 4 rect sides, then not intersecting
		return(false);
	}

	var doLineSegmentsIntersect = function(p, p2, q, q2) {
	  var r = subtractPoints(p2, p);
	  var s = subtractPoints(q2, q);


	  var uNumerator = crossProduct(subtractPoints(q, p), r);
	  var denominator = crossProduct(r, s);


	  if (uNumerator == 0 && denominator == 0) {
		// colinear, so do they overlap?
		return ((q.x - p.x < 0) != (q.x - p2.x < 0) != (q2.x - p.x < 0) != (q2.x - p2.x < 0)) ||
		  ((q.y - p.y < 0) != (q.y - p2.y < 0) != (q2.y - p.y < 0) != (q2.y - p2.y < 0));
	  }


	  if (denominator == 0) {
		// lines are paralell
		return false;
	  }


	  var u = uNumerator / denominator;
	  var t = crossProduct(subtractPoints(q, p), s) / denominator;


	  return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
	}

	var crossProduct = function(point1, point2) {
	  return point1.x * point2.y - point1.y * point2.x;
	}


	var subtractPoints = function(point1, point2) {
	  var result = {};
	  result.x = point1.x - point2.x;
	  result.y = point1.y - point2.y;
	  return result;
	}



    object.$el = function(value){
        if (!arguments.length) return $el;
        $el = value;
        return object;
    };

    object.size = function(value){
        if (!arguments.length) return size;
        size = value;
        return object;
    };

    object.threshold = function(value){
        if (!arguments.length) return threshold;
        threshold = value;
        return object;
    };

    object.colorAcessor = function(value){
        if (!arguments.length) return colorAcessor;
        colorAcessor = value;
        return object;
    };

    object.colorScale = function(value){
        if (!arguments.length) return colorScale;
        colorScale = value;
        return object;
    };

    object.margin = function(value){
        if (!arguments.length) return margin;
        margin = value;
        return object;
    };

    object.data = function(value){
        if (!arguments.length) return data;
        data = value;
        return object;
    };

    object.dimensions = function(value){
        if (!arguments.length) return dimensions;
        dimensions = value;
        return object;
    };

    object.dotRadius = function(value){
        if (!arguments.length) return dotRadius;
        dotRadius = value;
        return object;
    };

    object.colorScaleDimensions = function(value){
        if (!arguments.length) return colorScaleDimensions;
        colorScaleDimensions = value;
        return object;
    };

    object.dotOpacity = function(value){
        if (!arguments.length) return dotOpacity;
        dotOpacity = value;
        return object;
    }

    object.mouseout = function(value){
        if (!arguments.length) return mouseout;
        mouseout = value;
        return object;
    };

    object.mouseover = function(value){
        if (!arguments.length) return mouseover;
        mouseover = value;
        return object;
    };

    return object;
}
