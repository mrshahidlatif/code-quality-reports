function generateText(data) {
    //Generate report text
    $("#textAPanel").html(badSmellsText());
    $("#subtitle").html(introText());
    html += generalQualityText();
    html += bugText();
    
  
    function introText(){
      var text = "";
      if(projectName.includes("xerces")) {
      projInfo = "A collection of software libraries for parsing, validating, serializing, and manipulating XML";
      }
  
      if(projectName.includes("log4j")) {
      projInfo =  "An open source project that allows the developer to control which log statements are output with arbitrary granularity.";
      }
      text += ' This document presents the code quality aspects of '+ projectName +'<span class="projInfo infoIcon"title=""> &#9432;</span> (Java version)&mdash;it has '+ numberOfPackages + ' packages and '+classCt+' classes.';
      return text;
    }
  
    function generalQualityText(){
      var text = '';
      // TODO: expand details (bar chart) when clicking on the metrics
      // TODO: Make the first sentence adaptive (should summarize the analysis somehow.)
      // TODO: Add a fifth group that summarizes the size-related metrics
      text+='<h3>Software Metrics</h3><p>The code quality analysis works with four groups of software metrics.</p>'
        
      text += generateComplexityText();
      text += generateCouplingText();
      text += generateCohesionText();
      text += generateInheritanceText();
   
      return text;
    }
  
    function generateCouplingText(){
      var text = '<p>';
      var coup = '<h4><span class="couplingMetric clickable">Coupling</span>:</h4>';
      // coupling quality
      var couplingArr = [goodCouplingPercent, regularCouplingPercent, badCouplingPercent];
      var m = Math.max(...couplingArr);
      var i  = couplingArr.indexOf(m);
  
      if(i == 0){
        text+= coup + ' The quality in terms of coupling is high because GOODCOUPLINGCT classes <span id="bar_5" class="barSpan"></span> have coupling metrics in a good range';
      }
  
      else if(i == 1){
        text+= coup + ' The quality in terms of coupling is moderate because REGULARCOUPLINGCT classes <span id="bar_6" class="barSpan">have coupling metrics in an acceptable range'
      }
  
      else if(i == 2){
        text+= coup + ' The quality in terms of coupling is low because BADCOUPLINGCT classes <span id="bar_7" class="barSpan"></span> have coupling metrics in an undersired range'
      }
      text += '<span class="couplingInfo infoIcon"title=""> &#9432;</span>. <button class="collapsible"></button><div class="content"><div id="samplsl1"></div></div></p>';
      return text;
  
    }
    function generateComplexityText(){
      var comp = '<h4><span class="complexityMetric clickable">Complexity</span>:</h4>';
      // complextiy quality
      var complexityArr = [goodComplexityPercent, regularComplexityPercent, badComplexityPercent];
      m = Math.max(...complexityArr);
      i  = complexityArr.indexOf(m);
      var text = '<p>';
      if(i == 0){
        text+= comp + ' The quality from complexity perspective is high because GOODCOMPLEXITYCT classes <span id="bar_14" class="barSpan"></span> have low complexity'
      }
      else if(i == 1){
        text+= comp + ' The quality from complexity perspective is medium because REGULARCOMPLEXITYCT classes <span id="bar_15" class="barSpan"></span> have regular complexity'
      }
      else if(i == 2){
        text+= comp + ' The quality from complexity perspective is low because BADCOMPLEXITYCT classes <span id="bar_16" class="barSpan"></span> have  high complexity'
      }
      return text += '<span class="complexityInfo infoIcon"title=""> &#9432;</span>. <button class="collapsible"></button><div class="content"><div id="samplsl2"></div></div></p>';
  
    }
    function generateCohesionText(){
      var coh = '<h4><span class="cohesionMetric clickable">Cohesion</span>:</h4>';
  
      var cohesionArr = [goodCohesionPercent, regularCohesionPercent, badCohesionPercent];
      m = Math.max(...cohesionArr);
      i  = cohesionArr.indexOf(m);
      var text = '<p>';
      if(i == 0){
        text+= coh + ' High values of cohesion metrics in GOODCOHESIONCT classes <span id="bar_11" class="barSpan"></span> reflect good project quality';
      }
      else if(i == 1){
        text+= coh + ' Moderate values of cohesion metrics in REGULARCOHESIONCT classes <span id="bar_12" class="barSpan"></span> reflect regular quality';
      }
      else if(i == 2){
        text+= coh + ' Low values of cohesion metrics in BADCOHESIONCT classes <span id="bar_13" class="barSpan"></span> reflect bad proejct quality';
      }
      return  text += '<span class="cohesionInfo infoIcon"title=""> &#9432;</span>. <button class="collapsible"></button><div class="content"><div id="samplsl3"></div></div><p>';
  
    }
    function generateInheritanceText(){
  
      var inher = '<h4><span class="inheritanceMetric clickable">Inheritance</span>:</h4>';
       // inheritance quality
      var inheritanceArr = [goodInheritancePercent, regularInheritancePercent, badInheritancePercent];
      m = Math.max(...inheritanceArr);
      i  = inheritanceArr.indexOf(m);
      var text='<p>';
      if(i == 0){
        text += inher + ' Inheritance metrics indicate high quality in GOODINHERITANCECT classes <span id="bar_8" class="barSpan"></span>';
      }
      else if(i == 1){
        text += inher + ' Inheritance metrics indicate acceptable quality in REGULARINHERITANCECT classes <span id="bar_9" class="barSpan"></span>';
      }
      else if(i == 2){
        text += inher + ' Inheritance metrics indicate low quality in BADINHERITANCECT classes <span id="bar_10" class="barSpan"></span>';
      }
  
      return text += '<span class="inheritanceInfo infoIcon"title=""> &#9432;</span>. <button class="collapsible"></button><div class="content"><div id="samplsl4"></div></div></p>';
  
    }
  
    function noOfBadSmells(list){
      for(var i=0;i<list.length;i++){
        if(list[i].badSmells.length == 4)
          return list[i];
      else if (list[i].badSmells.length == 3)
        return list[i];
      else if (list[i].badSmells.length == 2)
        return list[i];
      }
    }
  
    // TODO: eliminate interfaces from analysis (throw them out entirely)
    // TODO: info icon after "analysis of software metrics"
    // TODO: reorder list of bad smells based on their frequency
    // TODO: mention the number of classes affected by smells, not just the number of smells
    function badSmellsText(){
      var text = "";
      text += '<h3>Code Smells</h3><div class="p">Based on an analysis of software metrics, we have ';
      if(badCt == 0){
        text+= 'not detected any class-level code smells <span class="codeSmellsInfo infoIcon"title=""> &#9432;</span> in the project&mdash;congratulations, the quality is high.'
      } else if(badCt == 1){	
        text += 'detected one class-level code smell <span class="codeSmellsInfo infoIcon"title=""> &#9432;</span>: ';
      } else if(badCt > 1){	
        text += 'detected '+ num2word(badCt) + ' class-level code smells <span class="codeSmellsInfo infoIcon"title=""> &#9432;</span>, among them ';
      }
      var listOfBadSmellTypes=[];
      if(blobCt > 0){
        listOfBadSmellTypes.push(((blobCt===1)?'one':num2word(blobCt)) +' <span class="smellBlob clickable">Large Class'+((blobCt===1)?'':'es')+'</span> <span class="barSpan" id="barBlob"></span> '+createCollapsibleClassList(blobArr));
      }
      if(decomCt > 0){
        listOfBadSmellTypes.push(((decomCt===1)?'one case':num2word(decomCt)+' cases') +' of <span class="smellFc clickable">Functional Decomposition</span> <span class="barSpan" id="barFc"></span> '+createCollapsibleClassList(decomArr));
      }
      if(spaCt > 0){
        listOfBadSmellTypes.push(((spaCt===1)?'one case':num2word(spaCt)+' cases') +' of <span class="smellSpa clickable">Spaghetti Code</span> <span class="barSpan" id="barSpa"></span> '+createCollapsibleClassList(spaArr));
      }
      if(lazyCt > 0){
        listOfBadSmellTypes.push(((lazyCt===1)?'one':num2word(lazyCt)) +' <span class="smellLazy clickable">Lazy Class'+((lazyCt===1)?'':'es')+'</span> <span class="barSpan" id="barLazy"></span> '+createCollapsibleClassList(lazyArr));
      }
      text += ' ' + printList(listOfBadSmellTypes) + '.';
      if(superSmellsCt > 0){
        text+= ' Some classes <button class="collapsible"></button><div class="content">' + printList(superSmellsArr) + '</div> carry multiple smells.'
      }
      var c = noOfBadSmells(classesWithBadSmells);
      if (c != undefined){ 
        text += ' For instance, '+createClassSpan(c.name)+' has ' + num2word(c.badSmells.length) + ' smells: ' + printList(c.badSmells) + '.'; 
      }
      if(highblobArr.length == 1){
        text += ' Comparatively high metric value of lines of code (loc) indicates bad quality in '+ highblobArr[0] + 
        '.';
      }
      if(highblobArr.length > 1){
        text += ' Comparatively high metric value of lines of code (loc) indicates bad quality in '+ printList(highblobArr)+ '.';
      }
      text += '</div>';
      return text;
    }
  
  //bugs report
  function NoOfBugSmells(list){
      for(var i=0; i<list.length; i++){
        if(list[i].badSmells.length == 4 && list[i].bug != "0")
          return list[i];
      else if (list[i].badSmells.length == 3 && list[i].bug != "0")
        return list[i];
      else if (list[i].badSmells.length == 2 && list[i].bug != "0")
        return list[i];
      }
    }
  
    function classesWithBugSmells(list){
      var c = [];
      for(var i=0; i<list.length; i++){
        if(list[i].badSmells.length == 4 && list[i].bug != "0")
          c.push(list[i].name);
      else if (list[i].badSmells.length == 3 && list[i].bug != "0")
        c.push(list[i].name);
      else if (list[i].badSmells.length == 2 && list[i].bug != "0")
        c.push(list[i].name);
      }
      return c;
    }
  
  
    function bugText(){
      var text = "";
      text += '<h3>Bug History</h3>'
      if(bugCt/classCt == 0){
        text =+ 'None of the classes was associated with recorded bugs.'
      }
      else{
        var c = NoOfBugSmells(classesWithBadSmells);
        var d = classesWithBugSmells(classesWithBadSmells);
        // FIXME: 16.1 is not "almost sixteen"
        // TODO: Write a sentence about the most bug-prone classes
        // FIXME: Make sentences less repetitive regarding phrasing
        text+= 'Almost ' + num2word(Math.round((bugCt/classCt)*100)) + ' percent <span id="bar_17" class="barSpan"></span> of the classes were associated with recorded bugs.';
        if(d.length > 3){
          text += ' The classes <button class="collapsible"></button><div class="content"><p>' + printItalicsList(d) + '</p></div> were associated with bugs and have identified bad smells';
        }
        else if (d.length > 0){
          text += (d.length == 1) ? ' The class ' + printItalicList(d) + ' was ' : ' The classes ' + printItalicList(d) + ' were ' ;
          text += 'associated with recorded bugs and '+((d.length == 1)?'has':'have')+' identified bad smells.';
        }
  
      }
      return text;
    }
  
      html = html.replace(/PROJECTNAME/g, ""+projectName).replace(/ClASSCT/g, ""+classCt).replace(/BADCT/g, ""+badCt).replace(/BUGCT/g, ""+bugCt).replace(/BLOBCT/g, ""+blobCt).replace(/DECOMCT/g, ""+decomCt).replace(/SPACT/g, ""+spaCt).replace(/BLOBLIST/g, ""+blobList).replace(/LAZYCT/g, ""+lazyCt);
    html = html.replace(/DECOMLIST/g, ""+decomList).replace(/SPALIST/g, ""+spaList).replace(/HIGHBLOB/g, ""+highblobList).replace(/LAZYLIST/g, ""+lazyList).replace(/BUGLIST/g, ""+bugList);
    html = html.replace(/GOODCOUPLINGLIST/g, ""+goodCouplingList).replace(/GOODCOUPLINGCT/g, ""+goodCouplingCt).replace(/GOODCOUPLINGPT/g, ""+goodCouplingPercent).replace(/REGULARCOUPLINGLIST/g, ""+regularCouplingList).replace(/REGULARCOUPLINGCT/g, ""+regularCouplingCt).replace(/REGULARCOUPLINGPT/g, ""+regularCouplingPercent).replace(/BADCOUPLINGLIST/g, ""+badCouplingList).replace(/BADCOUPLINGCT/g, ""+badCouplingCt).replace(/BADCOUPLINGPT/g, ""+badCouplingPercent);
    html = html.replace(/GOODINHERITANCELIST/g, ""+goodInheritanceList).replace(/GOODINHERITANCECT/g, ""+goodInheritanceCt).replace(/REGULARINHERITANCELIST/g, ""+regularInheritanceList).replace(/REGULARINHERITANCECT/g, ""+regularInheritanceCt).replace(/BADINHERITANCELIST/g, ""+badInheritanceList).replace(/BADINHERITANCECT/g, ""+badInheritanceCt);
    html = html.replace(/BADCOHESIONLIST/g, ""+badCohesionList).replace(/BADCOHESIONCT/g, ""+badCohesionCt).replace(/REGULARCOHESIONLIST/g, ""+regularCohesionList).replace(/REGULARCOHESIONCT/g, ""+regularCohesionCt).replace(/GOODCOHESIONLIST/g, ""+goodCohesionList).replace(/GOODCOHESIONCT/g, ""+goodCohesionCt);
    html = html.replace(/GOODCOMPLEXITYLIST/g, ""+goodComplexityList).replace(/GOODCOMPLEXITYCT/g, ""+goodComplexityCt).replace(/REGULARCOMPLEXITYLIST/g, ""+regularComplexityList).replace(/REGULARCOMPLEXITYCT/g, ""+regularComplexityCt).replace(/BADCOMPLEXITYLIST/g, ""+badComplexityList).replace(/BADCOMPLEXITYCT/g, ""+badComplexityCt);
    html = html.replace(/BBLIST/g, ""+bugBlobArr[0]).replace(/BDLIST/g, ""+bugDecomList).replace(/BLOBDECOMSMELLSLIST/g, ""+blobDecomArr[0]).replace(/BLOBSPASMELLSLIST/g, ""+blobSpaArr[0]).replace(/BLOBLAZYSMELLSLIST/g, ""+blobLazyArr[0]);
    html = html.replace(/SUPERSMELLSLIST/g, ""+superSmellsList)
     html = html.replace(/PROJINFO/g,""+projInfo).replace(/NUMBEROFPACKAGES/g, ""+numberOfPackages);
  
    $("#textBPanel").html(html);
  
    var sparklineOptions = {
      type:'bar',
      width: '30px',
      height: '30px',
      highlightLighten: 1.1,
      highlightColor: 'black',
    }
  
  
    //bad smells charts
      drawBarChart("#barBlob", Math.round((blobCt/badCt)*1000)/10);
      drawBarChart("#barFc", Math.round((decomCt/badCt)*1000)/10);
      drawBarChart("#barSpa", Math.round((spaCt/badCt)*1000)/10);
    drawBarChart("#barLazy", Math.round((lazyCt/badCt)*1000)/10);
    // coupling charts
    drawBarChart("#bar_5", Math.round((goodCouplingCt/classCt)*1000)/10);
    drawBarChart("#bar_6", Math.round((regularCouplingCt/classCt)*1000)/10);
    drawBarChart("#bar_7", Math.round((badCouplingCt/classCt)*1000)/10);
    //Inheritance charts
    drawBarChart("#bar_8", Math.round((goodInheritanceCt/classCt)*1000)/10);
    drawBarChart("#bar_9", Math.round((regularInheritanceCt/classCt)*1000)/10);
    drawBarChart("#bar_10", Math.round((badInheritanceCt/classCt)*1000)/10);
    // Cohesion charts
    drawBarChart("#bar_11", Math.round((goodCohesionCt/classCt)*1000)/10);
    drawBarChart("#bar_12", Math.round((regularCohesionCt/classCt)*1000)/10);
    drawBarChart("#bar_13", Math.round((badCohesionCt/classCt)*1000)/10);
    // Complexity charts
    drawBarChart("#bar_14", Math.round((goodComplexityCt/classCt)*1000)/10);
    drawBarChart("#bar_15", Math.round((regularComplexityCt/classCt)*1000)/10);
    drawBarChart("#bar_16", Math.round((badComplexityCt/classCt)*1000)/10);
  
    //bug chart
    drawBarChart("#bar_17", Math.round((bugCt/classCt)*1000)/10);
  
  
    //columns
    // console.log(data);
    // var columns = data.columns; 
    
    
  
    if(linkedSLopts != null) $(document).linkedSparklines(linkedSLopts);  //added
  
  /* ------------------------------------------------------------------------*/
  /* Methodological Explainations - Tooltips */ 
  /* ------------------------------------------------------------------------*/
    var couplingMethod = "We use thresholds values of cbo, ce, and ca for categorizing coupling as good, regular, or bad.<br><br> Good: cbo, ce 	&#8804; 6; ca<=7,  <br> Regular: cbo, ca &isin; [7,39]; <br> Bad: cbo, ca > 39; ce > 16";
  
    var complexityMethod = "We use thresholds values of wmc and max_cc for categorizing coupling as good, regular, or bad.<br><br> Good: max_cc &#8804; 2; wmc 	&#8804; 11,  <br> Regular: max_cc &isin; (2,4]; wmc &isin; (11,34) <br> Bad: max_cc > 4; wmc > 34";
  
    var cohesionMethod = "We use thresholds values of lcom3 for categorizing coupling as good, regular, or bad.<br><br> Good: lcom3 &#8804; 0.167; <br> Regular: lcom3 &isin; (0.167,0.725]; <br> Bad: lcom3 > 0.725";
  
    var inheritanceMethod = "We use thresholds values of dit and noc for categorizing coupling as good, regular, or bad.<br><br> Good: dit 	&#8804; 2; noc <= 1 <br> Regular: dit &isin; (2,4]; noc &isin; (1,3]  <br> Bad: dit > 4; noc > 3";
  
    // TODO: add the full names of metrics here
    var codeSmellsMethod = 'The detection of code smells is based on four metrics: lines of code (loc), (amc), (npm), and (wmc). We categorize each class as having code smells according to the threshold vlaues: <br><br> Large Class: loc 	&#8805; 1500; amc 	&#8805; 129 <br> Functional Decomposition: npm &#8804; 8 ; wmc	&#8805 16; <br> Spaghetti Class: amc &#8805; 151 <br> Lazy Class: wmc = 0 '
  
    
    $( ".projInfo" ).tooltip({
        content: projInfo
    });
    $( ".couplingInfo" ).tooltip({
        content: couplingMethod
    });
    $( ".complexityInfo" ).tooltip({
        content: complexityMethod
    });
    $( ".cohesionInfo" ).tooltip({
        content: cohesionMethod
    });
    $( ".inheritanceInfo" ).tooltip({
        content: inheritanceMethod
    });
  
    $( ".codeSmellsInfo" ).tooltip({
        content: codeSmellsMethod
    });
  
    // displaying the captions to screen.
    $("#captionPP").html(generatePPCaption());
    $("#captionSP").html(generateSPCaption());
  
  }
  
  function countClassesHavingBadSmells (data){
    var count = 0;
    for (var i=0;i<data.length;i++){
      if (data[i].badSmells.length != 0){
          count++;
      }
    }
    return count;
  }
  
  function generatePPCaption(){
    // TODO: color metric names
    var caption = 'The overview of the software quality in terms of <span class="complexityMetric clickable">complexity</span> (<span class="wmc">wmc</span>, <span class="max_cc">max_cc</span>), <span class="couplingMetric clickable">coupling</span> (<span class="cbo">cbo</span>, <span class="ca">ca</span>, <span class="ce">ce</span>), <span class="cohesionMetric clickable">cohesion</span> (<span class="lcom">lcom</span>, <span class="lcom3">lcom3</span>), and <span class="inheritanceMetric clickable">inheritance</span> (<span class="noc">noc</span>, <span class="dit">dit</span>).';
    caption += ' The ' + num2word(countClassesHavingBadSmells(classesWithBadSmells)) +' <span class="BSLegend">Classes</span> contain bad smells';
  
    caption += '. ';
  
    return caption;
  }
  function generateSPCaption(){
    if (xVal == undefined || yVal == undefined){
      xVal = $("#xSelect :selected").val();
      yVal = $("#ySelect :selected").val();
      return 'Correlation between ' + xVal + ' and ' + yVal + '.';
    }
    else{
      return 'Correlation between ' + xVal + ' and ' + yVal + '.';
    }
  }
  
  
  function drawBarChart(tagNmae, val){
      $(tagNmae).html('<svg width="50" height="14" style="background: #ccc;"><g transform="translate(0,0)" style="text-anchor: middle;"><rect class="bar" width="'+(val/2)+'" height="14"></rect><text x="25" y="11" style="font-size:12px">'+val+'%</text></g></svg>');
  }
  
  /* ------------------------------------------------------------------------*/
  /* Click and hover events */
  /* ------------------------------------------------------------------------*/
  
  // TODO: also show the metric description in the details panel
  $(document).on("click","button.collapsible", function () {
     $(this)[0].classList.toggle("active");
     var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
  });
  
  //Highlighting corresponding element of vis on hovering class name in text
  $(document).on("mouseover", ".className", function() {
      var className = $(this).text();
      $("span.slcls."+className+"",window.parent.document).css('background','#ffe68e');
      $("#scatterplot").contents().find("circle#"+className).attr("r","6").attr("stroke", "#ffe68e").attr("stroke-width","4px");
      
      //Highlighting edge of parallel coordinates when hovering over dot in scatter plot
      var d = window.parent.fullData;
      highlightEdge(d[classShortNameToIndex[className]]);
      highlightCodeSmell(className);
      showClassCaption(className);
  
   }).on('mouseout', '.className', function() {
      $("span.slcls",window.parent.document).css('background',''); 
      $("#scatterplot").contents().find("circle").attr("r","3").attr("stroke", "").attr("stroke-width","0px");
      unHighlight();
      
      $('.clickable').css('background','none');
      //reset to original caption
      $('#dynamicCaption').remove();
   });
  
  $(document).on("click", ".className", function() {
    var idx = Number($(this).attr("data-index"));
    var str = fullData[idx].cname;
    var url = "sourcecode/src/" + str.replace(/[.]/g, "/") + ".java";
    updateDetailPanel("File "+str.split(".").pop()+ ".java", $('<pre id="sourcecodeContainer"><code id="sourcecode" class="language-java"></code></pre>'));
    // TODO: replace by asynchronous load
    var src = $.ajax({
      url: url,
      async: false
    }).responseText;
    src = src.substring(src.indexOf("package "));   // cut out license text
    $("#sourcecode").text(src);
    Prism.highlightElement($("#sourcecode")[0]);
  });
  
  
  // TODO: give for each pattern an example (maybe one for high, medium and low).
  // TODO: integrate links to the respective metrics
  $(document).on("click", ".smellBlob", function() {
    updateDetailPanel("Background: The 'Large Class' Smell", '<p>The Large Class smell identifies those classes that contain too much functionality. Most likely, it is recommendable to split these classes into multiple ones. Exceptions might be generated code.</p>');
    if(blobCt > 0){
      var newdata = [];
      fullData.forEach(function(d, i){
        newdata.push(!!d.smells.blob);
      });
      scatterfilter(newdata);
  
      var dims = {};
      dims['loc'] = [1500, null];
      dims['amc'] = [129, null];
  
      parallelfilter(dims);
    }
  });
  
  $(document).on("click", ".smellFc", function() {
    updateDetailPanel("Background: The 'Functional Decomposition' Smell", '<p>This smell refers to classes created in a way that rather fit procedural not object-oriented programming. This means, the affected classes are mostly used a group of methods, not as a part of an object-oriented design leveraging inheritance, instantiation, and other concepts.</p>');
    if(decomCt > 0){
      var newdata = [];
      fullData.forEach(function(d, i){
        newdata.push(!!d.smells.decomposition);
      });
      scatterfilter(newdata);
  
      var dims = {};
      dims['npm'] = [null, 8];
      dims['wmc'] = [16, null];
      parallelfilter(dims);
    }
  });
  
  $(document).on("click", ".smellSpa", function() {
    updateDetailPanel("Background: The 'Spaghetti Code' Smell", '<p>The metaphor of spaghetti refers to methods that are overly long. Similar to <span class="smellFc clickable">Functional Decomposition</span>, classes that are affected by this are not designed in an object-oriented, but a procedural way.</p>');
    if(spaCt > 0){
      var newdata = [];
      fullData.forEach(function(d, i){
        newdata.push(!!d.smells.spaghetti);
      });
      scatterfilter(newdata);
  
      var dims = {};
      dims['amc'] = [151, null];
      parallelfilter(dims);
    }
  });
  
  $(document).on("click", ".smellLazy", function() {
    updateDetailPanel("Background: The 'Lazy Class' Bad Smell", '<p>A Lazy Class is the opposite of a <span class="smellBlob clickable">Large Class</span>: a class that contains almost no functionality. Often, it should be integrated with another class.</p>');
    if(lazyCt > 0){
      var newdata = [];
      fullData.forEach(function(d, i){
        newdata.push(!!d.smells.lazy);
      });
      scatterfilter(newdata);
  
      var dims = {};
      dims['wmc'] = [0, 0.1];
      parallelfilter(dims);
    }
  });
  
  $(document).on("click", ".couplingMetric", function() {
    showCouplingMetricDescription();
  });
  
  $(document).on("click", ".complexityMetric", function() {
    showComplexityMetricDescription();
  });
  
  $(document).on("click", ".cohesionMetric", function() {
    showCohesionMetricDescription();
  });
  
  $(document).on("click", ".inheritanceMetric", function() {
    showInheritanceMetricDescription();
  });
  
  function showClassCaption(className) {
    var bs = findBadSmellsInClass(className);
    $('#captionPP').append('<span id="dynamicCaption"></span>');
    $('#dynamicCaption').append(createClassSpan(className) + ' carries '+ (bs.length === 1?'a ':'') + (bs.length > 0?printList(bs):'no') + ' code smell'+(bs.length === 1?'':'s')+'.');
  }
  
  function highlightCodeSmell(className){
    var cSmells = fullData[classShortNameToIndex[className]].smells;
    if (cSmells.blob == true){
      $(".smellBlob").css('background','#ffe68e');
    }
    if (cSmells.decomposition == true){
      $(".smellFc").css('background','#ffe68e');
    }
    if (cSmells.spaghetti == true){
      $(".smellSpa").css('background','#ffe68e');
    }
    if (cSmells.lazy == true){
      $(".smellLazy").css('background','#ffe68e');
    }
    
  }
  
  
  /* ------------------------------------------------------------------------*/
  /* Metric descriptions */
  /* ------------------------------------------------------------------------*/
  
  function showCouplingMetricDescription() {
    var content = '<p>The metrics coupling between objects (<span class="cbo">cbo</span>), afferent coupling (<span class="ca">ca</span>), and efferent coupling (<span class="ce">ce</span>) are used to assess quality in terms of coupling. We use thresholds of the metrics to classify the individual classes as having good, regular, or bad coupling.</p>';
  
    content += '</p>For instance, ' + createClassSpan(findClassWithMaxValueOfMetricX('cbo')) + ' has high coupling. </p>';
  
    updateDetailPanel("Coupling", content);
  }
  
  // TODO: which metric is used as a basis for wmc? Also cyclomatic complexity? -> Explain cyclomatic complexity
  function showComplexityMetricDescription() {
    var content = '<p>Complexity metrics estimate how difficult it is to understand the respective code (not to be confused with "computational complexity", which refers to the runtime resources an algorithm consumes). Based on a complexity computation on method level, we consider two perspectives: First, <span class="wmc">weighted methods per class (wmc)</span> sum all method complexity values for a class. Second, to also hightlight classes that contain few high-complexity methods but many low-complexity ones, the <span class="max_cc">maximal cyclomatic complexity (max_cc)</span> takes into consideration the maximum of all the method-level complexity values of class.</p>';
    var maxClassWmc = findClassWithMaxValueOfMetricX('wmc');
    var maxClassMaxCc = findClassWithMaxValueOfMetricX('max_cc');
    if (maxClassWmc === maxClassMaxCc) {
      content+= '<p>Within the analyzed classes, '+createClassSpan(maxClassWmc)+' has the highest values with respect to both metrics.</p>';
    } else {
      content+= '<p>Within the analyzed classes, '+createClassSpan(maxClassWmc)+' has the highest value with respect to <span class="wmc">wmc</span> and '+createClassSpan(maxClassMaxCc)+' the highest value with respect to <span class="max_cc">max_cc</span>.</p>';
    }
    updateDetailPanel("Background: Complexity Metrics", content);
  }
  
  function showCohesionMetricDescription() {
    var content = '<p>Two versions of lack of cohesion metric, i.e., <span class="lcom">ce</span> and <span class="lcom3">lcom3</span> show the quality in terms of cohesion.</p>';
  
    content += '</p>For instance, ' + createClassSpan(findClassWithMaxValueOfMetricX('lcom')) + ' has maximum cohesion. </p>';
  
    updateDetailPanel("Background: Cohesion Metrics", content);
  }
  
  function showInheritanceMetricDescription() {
    var content = '<p>The metrics depth of inheritance (<span class="dit">dit</span>) and number of children (<span class="noc">noc</span>) are used to assess the quality in terms of inheritance.</p>';
  
    content += '</p>For instance, ' + createClassSpan(findClassWithMaxValueOfMetricX('noc')) + ' has high inheritance. </p>';
  
    updateDetailPanel("Background: Inheritance Metrics", content);
  }