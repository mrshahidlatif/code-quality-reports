function generateText(data) {
    $("#subtitle").html(introText());
    $("#textAPanel").html(badSmellsText() + bugText());
    $("#textBPanel").html(qualityAttributeText());

    // displaying the captions to screen.
    $("#caption").html(generatePPCaption());

    drawBarChart("#barComplexity", Math.round((badComplexityArr.length / classCt) * 1000) / 10);
    drawBarChart("#barCoupling", Math.round((badCouplingArr.length / classCt) * 1000) / 10);
    drawBarChart("#barCohesion", Math.round((badCohesionArr.length / classCt) * 1000) / 10);
    drawBarChart("#barInheritance", Math.round((badInheritanceArr.length / classCt) * 1000) / 10);

    //bug chart
    drawBarChart("#barBug", Math.round((bugCt / classCt) * 1000) / 10);

    $(document).linkedSparklines();

    generateAndSetTooltipTexts();
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
    text += '<h3>Code Smells</h3><div class="p">';
    if (badCt == 0) {
        text += 'We have not detected any class-level code smells <span class="codeSmellsInfo infoIcon"title=""> &#9432;</span> in the project&mdash;congratulations.'
    } else if (badCt == 1) {
        text += 'We have only detected one class-level code smell <span class="codeSmellsInfo infoIcon"title=""> &#9432;</span>: ';
    } else if (badCt > 1) {
        text += 'We have detected ' + num2word(badCt) + ' class-level code smells <span class="codeSmellsInfo infoIcon"title=""> &#9432;</span>, among them ';
    }
    var listOfBadSmellTypes = [];
    if (blobCt > 0) {
        listOfBadSmellTypes.push(((blobCt === 1) ? 'one' : num2word(blobCt)) + ' <span class="smellBlob clickable">Large Class' + ((blobCt === 1) ? '' : 'es') + '</span> ' + createCollapsibleClassList(blobArr));
    }
    if (decomCt > 0) {
        listOfBadSmellTypes.push(((decomCt === 1) ? 'one case' : num2word(decomCt) + ' cases') + ' of <span class="smellFc clickable">Functional Decomposition</span> ' + createCollapsibleClassList(decomArr));
    }
    if (spaCt > 0) {
        listOfBadSmellTypes.push(((spaCt === 1) ? 'one case' : num2word(spaCt) + ' cases') + ' of <span class="smellSpa clickable">Spaghetti Code</span> ' + createCollapsibleClassList(spaArr));
    }
    if (lazyCt > 0) {
        listOfBadSmellTypes.push(((lazyCt === 1) ? 'one' : num2word(lazyCt)) + ' <span class="smellLazy clickable">Lazy Class' + ((lazyCt === 1) ? '' : 'es') + '</span> ' + createCollapsibleClassList(lazyArr));
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
// TODO: info icon to explain the methodology, reference the papers
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
// TODO: make sets of classes highlighted with bar charts clickable/selectable
// TODO: normalization of bar charts
function attributeText(attribute) {
    //console.log(attribute.name, attribute.good, attribute.regular, attribute.bad);
    var bar = '<span id="bar' + captitalize(attribute.name) + '" class="barSpan"></span>';
    var badClasses = num2word(attribute.bad) + ' class' + (attribute.bad === 0 ? '' : 'es') + ' ' + bar;
    var badClassesAre = badClasses + ' ' + (attribute.bad === 0 ? 'is' : 'are');
    var text = '<p><h4 class="' + attribute.name + 'Metric clickable">' + captitalize(attribute.name) + ':</h4> '
    var quality = '', reason = '';
    switch (attribute.score) {
        case 3:
            quality = '<i>very good</i> &#9733;&#9733;&#9733;';
            if (attribute.bad === 0) {
                reason = ' because no class ' + bar + ' is rated as having <i>low</i> quality';
            } else if (attribute.bad === 1) {
                reason = ' because only a single class ' + bar + ' is rated as having <i>low</i> quality';
            } else {
                reason = ' because only the small number of ' + badClasses + ' is rated as having <i>low</i> quality';
            }
            reason += ', but many as <i>good</i> (' + attribute.good + ')'
            break;
        case 2:
            quality = '<i>good</i> &#9733;&#9733;';
            reason = ' as only ' + badClassesAre + ' rated as having <i>low</i> quality';
            if (attribute.good <= attribute.regular) {
                reason += ', but not more as <i>good</i> (' + attribute.good + ') than as <i>regular</i> (' + attribute.regular + ')';
            } else {
                reason += ', but many as <i>good</i> (' + attribute.good + ')'
            }
            break;
        case 1:
            quality = '<i>okay</i> &#9733;';
            if (attribute.good + attribute.regular > attribute.bad * 3 && attribute.good <= attribute.regular + attribute.bad) {
                reason = '. Although not a high number of classes (' + attribute.bad + ') ' + bar + ' is rated as having <i>low</i> quality, many are just classified as <i>regular</i> (' + attribute.regular + ') and fewer as <i>good</i> (' + attribute.good + ')';
            } else {
                reason = ' as ' + badClassesAre + ' rated as having <i>low</i> quality, still fewer than the ones rated as <i>good</i> (' + attribute.good + ') or <i>regular</i> (' + attribute.regular + ')';
            }
            break;
        default:
            quality = '<i>low</i> &#9888;';
            reason = ' because the high number of ' + badClasses + ' is rated as having <i>low</i> quality';
    }
    text += 'The ' + attribute.longname + ' is ' + quality + reason;
    text += '<span class="' + attribute.name + 'Info infoIcon"title=""> &#9432;</span>. <button class="collapsible"></button><div class="content"><div id="sl' + captitalize(attribute.name) + '"></div></div></p>';
    return text;
}

/* Warning: keep in sync with explanations */
function computeQualityScore(good, regular, bad) {
    if (good + regular > bad * 3 && good > regular + bad) {
        if (good > bad * 15 && good > regular) {
            return 3; // very good
        } else {
            return 2; // good
        }
    } else {
        if (good + regular > bad) {
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
            text += ' The classes <button class="collapsible"></button><div class="content"><p>' + printItalicsList(d) + '</p></div> have both associated bugs and identified code smells';
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
    var caption = 'An overview of software quality in terms of <span class="complexityMetric clickable">complexity</span> (<span class="wmc">wmc</span>, <span class="max_cc">max_cc</span>), <span class="couplingMetric clickable">coupling</span> (<span class="cbo">cbo</span>, <span class="ca">ca</span>, <span class="ce">ce</span>), <span class="cohesionMetric clickable">cohesion</span> (<span class="lcom3">lcom3</span>), <span class="inheritanceMetric clickable">inheritance</span> (<span class="noc">noc</span>, <span class="dit">dit</span>) and <span class="otherMetric clickable">other metrics</span> (<span class="loc">loc</span>, <span class="amc">amc</span>, <span class="npm">npm</span>, <span class="bug">bug</span>). ';

    caption += 'Gray <span class="box"/> lines (left<span class="pcpInfo infoIcon"title=""> &#9432;</span>) and dots (right<span class="spInfo infoIcon"title=""> &#9432;</span>) represent classes.';

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

function generateAndSetTooltipTexts() {
    $(".projInfo").tooltip({
        content: projInfo
    });
    $(".complexityInfo").tooltip({
        content: generateAttributeTooltip(['wmc', 'max_cc',], 'wmc > 34 or max_cc > 4', 'wmc > 11 or max_cc > 2')
    });
    $(".couplingInfo").tooltip({
        content: generateAttributeTooltip(['cbo', 'ca', 'ce'], 'cbo >= 9, ca > 39, or ce > 16', 'cbo >= 7, ca > 7, or ce > 6')
    });
    $(".cohesionInfo").tooltip({
        content: generateAttributeTooltip(['lcom3'], 'lcom3 > 0.725', 'lcom3 > 0.167')
    });
    $(".inheritanceInfo").tooltip({
        content: generateAttributeTooltip(['noc', 'dit'], 'noc > 3 or dit > 4', 'noc > 1 or dit > 2')
    });
    // TODO: update
    $(".codeSmellsInfo").tooltip({
        content: 'The detection of code smells is based on four metrics: lines of code (loc), (amc), (npm), and (wmc). We categorize each class as having code smells according to the threshold vlaues: <br><br> Large Class: loc 	&#8805; 1500; amc 	&#8805; 129 <br> Functional Decomposition: npm &#8804; 8 ; wmc	&#8805 16; <br> Spaghetti Class: amc &#8805; 151 <br> Lazy Class: wmc = 0 '
    });
    $(".pcpInfo").tooltip({
        content: 'A <i>parallel coordinates plot</i> visualizes all software metrics that we use in the analysis. Each of the vertical dimensions represents a metric. A class is then drawn as a line connecting the different dimesions according to metrics values of the class.'
    });
    $(".spInfo").tooltip({
        content: 'A <i>scatterplot</i> corresponds to any two selected metrics. A class is drawn as a dot, with x- and y-coordinate mapping to the values of the currently selected metrics.'
    });
}

function generateAttributeTooltip(metricList, condBad, condRegular) {
    metricList = metricList.map(metric => generateMetricSpan(metric));
    return '<p>We use thresholds values of ' + printList(metricList) + ' for categorizing coupling as <i>low</i>, <i>regular</i>, or <i>good</i>.</p><p><i>Low</i>: ' + condBad + '<br><i>Regular</i>: not <i>low</i> and ' + condRegular + '<br><i>Good</i>: all other cases</p>';
}


function generateClassDescription(className) {
    let loc = fullData.map(d => d.loc);
    let npm = fullData.map(d => d.npm);
    var cObj = fullData[classNameToIndex[className]];

    getOutliers(loc);

    var maxLOC = ss.max(loc);
    var maxNPM = ss.max(npm);


    var badQualityWith = [];

    if (badCouplingArr.indexOf(createClassSpan(className)) != -1) {
        badQualityWith.push('<span class="complexityMetric clickable">Complexity</span>');
    }
    if (badCouplingArr.indexOf(createClassSpan(className)) != -1) {
        badQualityWith.push('<span class="couplingMetric clickable">Coupling</span>');
    }
    if (badCohesionArr.indexOf(createClassSpan(className)) != -1) {
        badQualityWith.push('<span class="cohesionMetric clickable">Cohesion</span>');
    }
    if (badInheritanceArr.indexOf(createClassSpan(className)) != -1) {
        badQualityWith.push('<span class="inheritanceMetric clickable">Inheritance</span>');
    }

    var text = '';
    var bs = findBadSmellsInClass(className);
    text += createClassSpan(className) + ' carries ' + (bs.length === 1 ? 'a ' : '') + (bs.length > 0 ? printList(bs) : 'no') + ' code smell' + (bs.length === 1 ? '' : 's') + '.';

    if (badQualityWith.length != 0)
        text += ' It has low quality with respect to the attribute' + (badQualityWith.length === 1 ? ' ' : 's ') + printList(badQualityWith) + ".";
    var factor = (ss.max(npm) / ss.max(loc)) / (ss.mean(npm) / ss.mean(loc));
    if (cObj.npm / cObj.loc < factor * (ss.mean(npm) / ss.mean(loc)) && cObj.loc > ss.mean(loc)) {
        text += ' Compared with the average metric values of the classes, it has large size (<span class="loc">loc</span>) but less number of public methods (<span class="npm">npm</span>).';
    }
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

function getOutliers(data) {
    // Creating data arrays 
    var ols = [];

    var q1 = ss.quantile(data, 0.25);
    var q3 = ss.quantile(data, 0.75);
    var iqr = ss.interquartileRange(data);
    ols = data.filter(d => d > q3 + 1.5 * iqr);

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

function generateMetricSpan(metric) {
    var metricNames = {
        "amc": "average method complexity",
        "bug": "number of historic bugs",
        "ca": "afferent coupling",
        "cbo": "coupling between objects",
        "ce": "efferent coupling",
        "dit": "depth of inheritance tree",
        "lcom3": "lack of cohesion of methods",
        "loc": "lines of code",
        "max_cc": "maximum cyclomatic complexity",
        "noc": "number of children of a class",
        "npm": "number of public methods",
        "wmc": "weighted methods per class"
    }
    return '<span class="' + metric + '">' + metricNames[metric] + ' (' + metric + ')</span>';
}