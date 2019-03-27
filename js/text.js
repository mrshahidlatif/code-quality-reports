function generateText(data) {
    $("#subtitle").html(introText());
    $("#textAPanel").html(badSmellsText() + bugText());
    $("#textBPanel").html(qualityAttributeText());

    // displaying the captions to screen.
    $("#captionPP").html(generatePPCaption());
    $("#captionSP").html(generateSPCaption());

    drawBarChart("#barBlob", Math.round((blobCt / badCt) * 1000) / 10);
    drawBarChart("#barFc", Math.round((decomCt / badCt) * 1000) / 10);
    drawBarChart("#barSpa", Math.round((spaCt / badCt) * 1000) / 10);
    drawBarChart("#barLazy", Math.round((lazyCt / badCt) * 1000) / 10);
    drawBarChart("#barComplexity", Math.round((badComplexityArr.length / classCt) * 1000) / 10);
    drawBarChart("#barCoupling", Math.round((badCouplingArr.length / classCt) * 1000) / 10);
    drawBarChart("#barCohesion", Math.round((badCohesionArr.length / classCt) * 1000) / 10);
    drawBarChart("#barInheritance", Math.round((badInheritanceArr.length / classCt) * 1000) / 10);

    //bug chart
    drawBarChart("#barBug", Math.round((bugCt / classCt) * 1000) / 10);

    if (linkedSLopts != null) $(document).linkedSparklines(linkedSLopts);

    generateTooltipTexts();
}

function introText() {
    var text = "";
    if (projectName.includes("xerces")) {
        projInfo = "A collection of software libraries for parsing, validating, serializing, and manipulating XML";
    }

    if (projectName.includes("log4j")) {
        projInfo = "An open source project that allows the developer to control which log statements are output with arbitrary granularity.";
    }
    text += ' This document presents the code quality aspects of ' + projectName + '<span class="projInfo infoIcon"title=""> &#9432;</span>&mdash;it has ' + numberOfPackages + ' packages and ' + classCt + ' classes.';
    return text;
}

// TODO: eliminate interfaces from analysis (throw them out entirely)
// TODO: info icon after "analysis of software metrics"
// TODO: reorder list of bad smells based on their frequency
// TODO: mention the number of classes affected by smells, not just the number of smells
function badSmellsText() {
    var text = "";
    text += '<h3>Code Smells</h3><div class="p">Based on an analysis of software metrics, we have ';
    if (badCt == 0) {
        text += 'not detected any class-level code smells <span class="codeSmellsInfo infoIcon"title=""> &#9432;</span> in the project&mdash;congratulations, the quality is high.'
    } else if (badCt == 1) {
        text += 'detected one class-level code smell <span class="codeSmellsInfo infoIcon"title=""> &#9432;</span>: ';
    } else if (badCt > 1) {
        text += 'detected ' + num2word(badCt) + ' class-level code smells <span class="codeSmellsInfo infoIcon"title=""> &#9432;</span>, among them ';
    }
    var listOfBadSmellTypes = [];
    if (blobCt > 0) {
        listOfBadSmellTypes.push(((blobCt === 1) ? 'one' : num2word(blobCt)) + ' <span class="smellBlob clickable">Large Class' + ((blobCt === 1) ? '' : 'es') + '</span> <span class="barSpan" id="barBlob"></span> ' + createCollapsibleClassList(blobArr));
    }
    if (decomCt > 0) {
        listOfBadSmellTypes.push(((decomCt === 1) ? 'one case' : num2word(decomCt) + ' cases') + ' of <span class="smellFc clickable">Functional Decomposition</span> <span class="barSpan" id="barFc"></span> ' + createCollapsibleClassList(decomArr));
    }
    if (spaCt > 0) {
        listOfBadSmellTypes.push(((spaCt === 1) ? 'one case' : num2word(spaCt) + ' cases') + ' of <span class="smellSpa clickable">Spaghetti Code</span> <span class="barSpan" id="barSpa"></span> ' + createCollapsibleClassList(spaArr));
    }
    if (lazyCt > 0) {
        listOfBadSmellTypes.push(((lazyCt === 1) ? 'one' : num2word(lazyCt)) + ' <span class="smellLazy clickable">Lazy Class' + ((lazyCt === 1) ? '' : 'es') + '</span> <span class="barSpan" id="barLazy"></span> ' + createCollapsibleClassList(lazyArr));
    }
    text += ' ' + printList(listOfBadSmellTypes) + '.';
    if (superSmellsCt > 0) {
        text += ' Some classes <button class="collapsible"></button><div class="content">' + printList(superSmellsArr) + '</div> carry multiple smells.'
    }
    var c = noOfBadSmells(classesWithBadSmells);
    if (c != undefined) {
        text += ' For instance, ' + createClassSpan(c.name) + ' has ' + num2word(c.badSmells.length) + ' smells: ' + printList(c.badSmells) + '.';
    }
    if (highblobArr.length == 1) {
        text += ' Comparatively high metric value of lines of code (loc) indicates bad quality in ' + highblobArr[0] +
            '.';
    }
    if (highblobArr.length > 1) {
        text += ' Comparatively high metric value of lines of code (loc) indicates bad quality in ' + printList(highblobArr) + '.';
    }
    text += '</div>';
    return text;
}

/* ------------------------------------------------------------------------*/
/* Quality attributes */
/* ------------------------------------------------------------------------*/

function qualityAttributeText() {
    var attributes = [
        { "name": "complexity", "longname": 'code complexity', "good": goodComplexityArr.length, "regular": regularComplexityArr.length, "bad": badComplexityArr.length },
        { "name": "coupling", "longname": 'coupling between classes', "good": goodCouplingArr.length, "regular": regularCouplingArr.length, "bad": badCouplingArr.length },
        { "name": "cohesion", "longname": 'cohesion within classes', "good": goodCohesionArr.length, "regular": regularCohesionArr.length, "bad": badCohesionArr.length },
        { "name": "inheritance", "longname": 'usage of class inheritance', "good": goodInheritanceArr.length, "regular": regularInheritanceArr.length, "bad": badInheritanceArr.length }
    ];
    attributes.forEach(function (attribute) {
        attribute.score = computeQualityScore(attribute.good, attribute.regular, attribute.bad);
    });
    var text = '';
    text += '<h3>Quality Attributes</h3>';
    text += attributeIntroText(attributes);
    attributes.forEach(function (attribute) {
        text += attributeText(attribute);
    });
    return text;
}

// TODO: Highlight classes that are consistently rated as low in the intro
function attributeIntroText(attributes) {
    var minScore = 3;
    var avgScore = 0.0;
    attributes.forEach(function (attribute) {
        const score = attribute.score;
        minScore = Math.min(score, minScore);
        avgScore += score;
    });
    avgScore = avgScore / attributes.length;
    var text = '<p>An analysis of software metrics along four quality attributes shows generally ';
    if (avgScore >= 2.5) {
        text += '<i>very good</i> quality';
    } else if (avgScore >= 1.75) {
        text += '<i>good</i> quality';
    } else if (avgScore >= 1.0) {
        text += '<i>mixed</i> quality';
    } else {
        text += '<i>low</i> quality';
    }
    if (minScore === 0) {
        var minAttributes = attributes.filter(attribute => attribute.score === minScore);
        text += ', with issues'
        if (minAttributes.length === 1) {
            text += ' mainly regarding the <span class="' + minAttributes[0].name + 'Metric clickable">' + minAttributes[0].longname + '</span>';
        } else if (minAttributes.length === 2) {
            text += ' mainly regarding the <span class="' + minAttributes[0].name + 'Metric clickable">' + minAttributes[0].longname + '</span> and the <span class="' + minAttributes[1].name + 'Metric clickable">' + minAttributes[1].longname + '</span>';
        } else if (minAttributes.length === 3) {
            nonMinAttributes = attributes.filter(attribute => attribute.score > minScore);
            text += ' in all attributes but <span class="' + nonMinAttributes[0].name + 'Metric clickable">' + nonMinAttributes[0].longname + '</span>';
        } else {
            text += ' regarding all attributes';
        }
    }
    return text + '.</p>';
}

// TODO: expand details (bar chart) when clicking on the metrics
// TODO: make sets of classes highlighted with bar chartts clickable/selectable
// TODO: hand cursor for clickable bars
// TODO: normalization of bar charts
function attributeText(attribute) {
    console.log(attribute.name, attribute.good, attribute.regular, attribute.bad);
    var bar = '<span id="bar' + captitalize(attribute.name) + '" class="barSpan"></span>';
    var badClasses = num2word(attribute.bad) + ' class' + (attribute.bad === 0 ? '' : 'es') + ' ' + bar;
    var badClassesAre = badClasses + ' ' + (attribute.bad === 0 ? 'is' : 'are');
    var text = '<p><h4 class="' + attribute.name + 'Metric clickable">' + captitalize(attribute.name) + ':</h4> '
    var quality = '', reason = '';
    switch (attribute.score) {
        case 3:
            quality = '<i>very good</i> &#9733;&#9733;&#9733;';
            if (attribute.bad === 0) {
                reason = 'no class ' + bar + ' is rated as having <i>low</i> quality';
            } else if (attribute.bad === 1) {
                reason = 'only a single class ' + bar + ' is rated as having <i>low</i> quality';
            } else {
                reason = 'only the very small number of ' + badClasses + ' is rated as having <i>low</i> quality';
            }
            break;
        case 2:
            quality = '<i>good</i> &#9733;&#9733;';
            reason = 'only ' + badClassesAre + ' rated as having <i>low</i> quality';
            break;
        case 1:
            quality = '<i>okay</i> &#9733;';
            reason = badClassesAre + ' rated as having <i>low</i> quality, which are still fewer than the ones rated as <i>regular</i> (' + attribute.regular + ')';
            break;
        default:
            quality = '<i>low</i> &#9888;';
            reason = 'the high number of ' + badClasses + ' is rated as having <i>low</i> quality';
    }
    text += 'The ' + attribute.longname + ' is ' + quality + ' as ' + reason;
    text += '<span class="' + attribute.name + 'Info infoIcon"title=""> &#9432;</span>. <button class="collapsible"></button><div class="content"><div id="sl' + captitalize(attribute.name) + '"></div></div></p>';
    return text;
}

function computeQualityScore(good, regular, bad) {
    if (good > bad && regular > bad) {
        if (good > bad * 10) {
            return 3; // very good
        } else {
            return 2; // good
        }
    } else {
        if (regular > bad) {
            return 1; // okay
        } else {
            return 0; // low
        }
    }
}

function bugText() {
    var text = "";
    text += '<h3>Bug History</h3>'
    if (bugCt / classCt == 0) {
        text = + 'None of the classes was associated with recorded bugs.'
    }
    else {
        var c = NoOfBugSmells(classesWithBadSmells);
        var d = classesWithBugSmells(classesWithBadSmells);
        // TODO: Write a sentence about the most bug-prone classes
        // FIXME: Make sentences less repetitive regarding phrasing
        text += 'With respect to past and present bugs, ' + num2word(bugCt) + ' of the classes <span id="barBug" class="barSpan"></span> have been associated with bugs.';
        if (d.length > 3) {
            text += ' The classes <button class="collapsible"></button><div class="content"><p>' + printItalicsList(d) + '</p></div> habe both associated bugs and identified code smells';
        }
        else if (d.length > 0) {
            text += (d.length == 1) ? ' The class ' + printItalicList(d) + ' has ' : ' The classes ' + printItalicList(d) + ' have ';
            text += 'both associated bugs and identified code smells.';
        }

    }
    return text;
}

function generatePPCaption() {
    // TODO: color metric names
    var caption = 'The overview of the software quality in terms of <span class="complexityMetric clickable">complexity</span> (<span class="wmc">wmc</span>, <span class="max_cc">max_cc</span>), <span class="couplingMetric clickable">coupling</span> (<span class="cbo">cbo</span>, <span class="ca">ca</span>, <span class="ce">ce</span>), <span class="cohesionMetric clickable">cohesion</span> (<span class="lcom3">lcom3</span>), and <span class="inheritanceMetric clickable">inheritance</span> (<span class="noc">noc</span>, <span class="dit">dit</span>)';
    // caption += ' The ' + num2word(countClassesHavingBadSmells(classesWithBadSmells)) + ' <span class="BSLegend">Classes</span> contain bad smells';

    caption += '. ';

    return caption;
}
function generateSPCaption() {
    if (xVal == undefined || yVal == undefined) {
        xVal = $("#xSelect :selected").val();
        yVal = $("#ySelect :selected").val();
        return 'Correlation between ' + xVal + ' and ' + yVal + '.';
    }
    else {
        return 'Correlation between ' + xVal + ' and ' + yVal + '.';
    }
}


function drawBarChart(tagNmae, val) {
    $(tagNmae).html('<svg width="50" height="14" style="background: #ccc;"><g transform="translate(0,0)" style="text-anchor: middle;"><rect class="bar" width="' + (val / 2) + '" height="14"></rect><text x="25" y="11" style="font-size:12px">' + val + '%</text></g></svg>');
}


/* ------------------------------------------------------------------------*/
/* Metric descriptions */
/* ------------------------------------------------------------------------*/

// TODO: update remaining metric descriptions (comparble to the complexity description)

// TODO: which metric is used as a basis for wmc? Also cyclomatic complexity? -> Explain cyclomatic complexity
function showComplexityMetricDescription() {
    var content = '<p>Complexity metrics estimate how difficult it is to understand the respective code (not to be confused with "computational complexity", which refers to the runtime resources an algorithm consumes). Based on a complexity computation on method level, we consider two perspectives: First, <span class="wmc">weighted methods per class (wmc)</span> sum all method complexity values for a class. Second, to also hightlight classes that contain few high-complexity methods but many low-complexity ones, the <span class="max_cc">maximal cyclomatic complexity (max_cc)</span> takes into consideration the maximum of all the method-level complexity values of class.</p>';
    var maxClassWmc = findClassWithMaxValueOfMetricX('wmc');
    var maxClassMaxCc = findClassWithMaxValueOfMetricX('max_cc');
    if (maxClassWmc === maxClassMaxCc) {
        content += '<p>Within the analyzed classes, ' + createClassSpan(maxClassWmc) + ' has the highest values with respect to both metrics.</p>';
    } else {
        content += '<p>Within the analyzed classes, ' + createClassSpan(maxClassWmc) + ' has the highest value with respect to <span class="wmc">wmc</span> and ' + createClassSpan(maxClassMaxCc) + ' the highest value with respect to <span class="max_cc">max_cc</span>.</p>';
    }
    updateDetailPanel("Background: Complexity Metrics", content);
}

function showCouplingMetricDescription() {
    var content = '<p>The metrics coupling between objects (<span class="cbo">cbo</span>), afferent coupling (<span class="ca">ca</span>), and efferent coupling (<span class="ce">ce</span>) are used to assess quality in terms of coupling. We use thresholds of the metrics to classify the individual classes as having good, regular, or bad coupling.</p>';

    content += '</p>For instance, ' + createClassSpan(findClassWithMaxValueOfMetricX('cbo')) + ' has high coupling. </p>';

    updateDetailPanel("Coupling", content);
}

function showCohesionMetricDescription() {
    var content = '<p>Two versions of lack of cohesion metric, i.e., <span class="lcom">ce</span> and <span class="lcom3">lcom3</span> show the quality in terms of cohesion.</p>';

    content += '</p>For instance, ' + createClassSpan(findClassWithMaxValueOfMetricX('lcom3')) + ' has maximum cohesion. </p>';

    updateDetailPanel("Background: Cohesion Metrics", content);
}

function showInheritanceMetricDescription() {
    var content = '<p>The metrics depth of inheritance (<span class="dit">dit</span>) and number of children (<span class="noc">noc</span>) are used to assess the quality in terms of inheritance.</p>';

    content += '</p>For instance, ' + createClassSpan(findClassWithMaxValueOfMetricX('noc')) + ' has high inheritance. </p>';

    updateDetailPanel("Background: Inheritance Metrics", content);
}

function generateTooltipTexts() {

    // TODO: avoid &isin; notation

    var couplingMethod = "We use thresholds values of cbo, ce, and ca for categorizing coupling as good, regular, or bad.<br><br> Good: cbo, ce &#8804; 6; ca<=7,  <br> Regular: cbo, ca &isin; [7,39]; <br> Bad: cbo, ca > 39; ce > 16";

    var complexityMethod = "We use thresholds values of wmc and max_cc for categorizing coupling as good, regular, or bad.<br><br> Good: max_cc &#8804; 2; wmc 	&#8804; 11,  <br> Regular: max_cc &isin; (2,4]; wmc &isin; (11,34) <br> Bad: max_cc > 4; wmc > 34";

    var cohesionMethod = "We use thresholds values of lcom3 for categorizing coupling as good, regular, or bad.<br><br> Good: lcom3 &#8804; 0.167; <br> Regular: lcom3 &isin; (0.167,0.725]; <br> Bad: lcom3 > 0.725";

    var inheritanceMethod = "We use thresholds values of dit and noc for categorizing coupling as good, regular, or bad.<br><br> Good: dit 	&#8804; 2; noc <= 1 <br> Regular: dit &isin; (2,4]; noc &isin; (1,3]  <br> Bad: dit > 4; noc > 3";

    // TODO: add the full names of metrics here
    var codeSmellsMethod = 'The detection of code smells is based on four metrics: lines of code (loc), (amc), (npm), and (wmc). We categorize each class as having code smells according to the threshold vlaues: <br><br> Large Class: loc 	&#8805; 1500; amc 	&#8805; 129 <br> Functional Decomposition: npm &#8804; 8 ; wmc	&#8805 16; <br> Spaghetti Class: amc &#8805; 151 <br> Lazy Class: wmc = 0 '


    $(".projInfo").tooltip({
        content: projInfo
    });
    $(".couplingInfo").tooltip({
        content: couplingMethod
    });
    $(".complexityInfo").tooltip({
        content: complexityMethod
    });
    $(".cohesionInfo").tooltip({
        content: cohesionMethod
    });
    $(".inheritanceInfo").tooltip({
        content: inheritanceMethod
    });

    $(".codeSmellsInfo").tooltip({
        content: codeSmellsMethod
    });

}
function generateClassDescription(className) {
    let loc = fullData.map(d => d.loc);
    getOutliers(loc);
    
    var meanLOC = ss.mean(loc);
    var badQualityWith = [];

    if(badCouplingArr.indexOf(createClassSpan(className))!=-1){
        badQualityWith.push('<span class="complexityMetric">Complexity</span>');
    }
    if(badCouplingArr.indexOf(createClassSpan(className))!=-1){
        badQualityWith.push('<span class="couplingMetric">Coupling</span>');
    }
    if(badCohesionArr.indexOf(createClassSpan(className))!=-1){
        badQualityWith.push('<span class="cohesionMetric">Cohesion</span>');
    }
    if(badInheritanceArr.indexOf(createClassSpan(className))!=-1){
        badQualityWith.push('<span class="inheritanceMetric">Inheritance</span>');
    }
    
    var text = '';
    var bs = findBadSmellsInClass(className);
    text += createClassSpan(className) + ' carries ' + (bs.length === 1 ? 'a ' : '') + (bs.length > 0 ? printList(bs) : 'no') + ' code smell' + (bs.length === 1 ? '' : 's') + '.';
    
    if (badQualityWith.length!=0) 
        text += ' It has low quality with respect to the attribute' + (badQualityWith.length === 1 ? ' ':'s ') + printList(badQualityWith) + ".";

    return text;
}

/* ------------------------------------------------------------------------*/
/* Text util functions */
/* ------------------------------------------------------------------------*/

function captitalize(str) {
    // https://stackoverflow.com/questions/5122402/uppercase-first-letter-of-variable
    str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    return str;
}
function getOutliers(data){
    // Creating data arrays 
    var ols =[]; 

    var q1 = ss.quantile(data, 0.25);
    var q3 = ss.quantile(data, 0.75);
    var iqr = ss.interquartileRange(data);
    ols = data.filter(d => d> q3+1.5*iqr);
    
    return ols; 
}
function num2word(n) {
    var numToWord = {
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        10: "ten",
        11: "eleven",
        12: "twelve",
        13: "thirteen",
        14: "fourteen",
        15: "fifteen",
        16: "sixteen",
        17: "seventeen",
        18: "eighteen",
        19: "nineteen",
        20: "twenty",
        30: "thirty",
        40: "forty",
        50: "fifty",
        60: "sixty",
        70: "seventy",
        80: "eighty",
        90: "ninety",
        100: "hundred",
    };
    if (numToWord[n] != undefined) {
        return numToWord[n];
    }
    else return n;
}