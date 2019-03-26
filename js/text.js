function generateText(data) {
    $("#subtitle").html(introText());
    $("#textAPanel").html(badSmellsText());

    var html = generalQualityText();
    html += bugText();
    html = html.replace(/GOODCOUPLINGLIST/g, "" + goodCouplingList).replace(/GOODCOUPLINGCT/g, "" + goodCouplingCt).replace(/GOODCOUPLINGPT/g, "" + goodCouplingPercent).replace(/REGULARCOUPLINGLIST/g, "" + regularCouplingList).replace(/REGULARCOUPLINGCT/g, "" + regularCouplingCt).replace(/REGULARCOUPLINGPT/g, "" + regularCouplingPercent).replace(/BADCOUPLINGLIST/g, "" + badCouplingList).replace(/BADCOUPLINGCT/g, "" + badCouplingCt).replace(/BADCOUPLINGPT/g, "" + badCouplingPercent);
    html = html.replace(/GOODINHERITANCELIST/g, "" + goodInheritanceList).replace(/GOODINHERITANCECT/g, "" + goodInheritanceCt).replace(/REGULARINHERITANCELIST/g, "" + regularInheritanceList).replace(/REGULARINHERITANCECT/g, "" + regularInheritanceCt).replace(/BADINHERITANCELIST/g, "" + badInheritanceList).replace(/BADINHERITANCECT/g, "" + badInheritanceCt);
    html = html.replace(/BADCOHESIONLIST/g, "" + badCohesionList).replace(/BADCOHESIONCT/g, "" + badCohesionCt).replace(/REGULARCOHESIONLIST/g, "" + regularCohesionList).replace(/REGULARCOHESIONCT/g, "" + regularCohesionCt).replace(/GOODCOHESIONLIST/g, "" + goodCohesionList).replace(/GOODCOHESIONCT/g, "" + goodCohesionCt);
    html = html.replace(/GOODCOMPLEXITYLIST/g, "" + goodComplexityList).replace(/GOODCOMPLEXITYCT/g, "" + goodComplexityCt).replace(/REGULARCOMPLEXITYLIST/g, "" + regularComplexityList).replace(/REGULARCOMPLEXITYCT/g, "" + regularComplexityCt).replace(/BADCOMPLEXITYLIST/g, "" + badComplexityList).replace(/BADCOMPLEXITYCT/g, "" + badComplexityCt);
    html = html.replace(/BBLIST/g, "" + bugBlobArr[0]).replace(/BDLIST/g, "" + bugDecomList).replace(/BLOBDECOMSMELLSLIST/g, "" + blobDecomArr[0]).replace(/BLOBSPASMELLSLIST/g, "" + blobSpaArr[0]).replace(/BLOBLAZYSMELLSLIST/g, "" + blobLazyArr[0]);
    $("#textBPanel").html(html);


    drawBarChart("#barBlob", Math.round((blobCt / badCt) * 1000) / 10);
    drawBarChart("#barFc", Math.round((decomCt / badCt) * 1000) / 10);
    drawBarChart("#barSpa", Math.round((spaCt / badCt) * 1000) / 10);
    drawBarChart("#barLazy", Math.round((lazyCt / badCt) * 1000) / 10);
    drawBarChart("#barComplexity", Math.round((badComplexityCt / classCt) * 1000) / 10);
    drawBarChart("#barCoupling", Math.round((badCouplingCt / classCt) * 1000) / 10);
    drawBarChart("#barCohesion", Math.round((badCohesionCt / classCt) * 1000) / 10);
    drawBarChart("#barInheritance", Math.round((badInheritanceCt / classCt) * 1000) / 10);

    //bug chart
    drawBarChart("#bar_17", Math.round((bugCt / classCt) * 1000) / 10);

    if (linkedSLopts != null) $(document).linkedSparklines(linkedSLopts);  //added

    // displaying the captions to screen.
    $("#captionPP").html(generatePPCaption());
    $("#captionSP").html(generateSPCaption());

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

function generalQualityText() {
    var text = '';
    // TODO: expand details (bar chart) when clicking on the metrics
    // TODO: Make the first sentence adaptive (should summarize the analysis somehow.)
    // TODO: Add a fifth group that summarizes the size-related metrics
    text += '<h3>Software Metrics</h3><p>The code quality analysis works with four groups of software metrics.</p>'

    text += attributeText("complexity", goodComplexityCt, regularComplexityCt, badComplexityCt);
    text += attributeText("coupling", goodCouplingCt, regularCouplingCt, badCouplingCt);
    text += attributeText("cohesion", goodCohesionCt, regularCohesionCt, badCohesionCt);
    text += attributeText("inheritance", goodInheritanceCt, regularInheritanceCt, badInheritanceCt);

    return text;
}

// FIXME: the values of good, regular and bad don't sum up to 100%
function attributeText(attribute, good, regular, bad) {
    //console.log(attribute, good, regular, bad);
    const attributeName = {
        'complexity': 'code complexity',
        'coupling': 'coupling between classes',
        'cohesion': 'cohesion within classes',
        'inheritance': 'usage of class inheritance'
    };
    var bar = '<span id="bar' + captitalize(attribute) + '" class="barSpan"></span>';
    var badClasses = num2word(bad) + ' class' + (bad === 0 ? '' : 'es') + ' ' + bar;
    var badClassesAre = badClasses + ' ' + (bad === 0 ? 'is' : 'are');
    var text = '<p><h4 class="' + attribute + 'Metric clickable">' + captitalize(attribute) + ':</h4> '
    var quality = '', reason = '';
    if (good > bad && regular > bad) {
        if (good > bad * 10) {
            quality = '<i>very good</i> &#9733;&#9733;&#9733;';
            if (bad === 0) {
                reason = 'no class ' + bar + ' is rated as having <i>low</i> quality';
            } else if (bad === 1) {
                reason = 'only a single class ' + bar + ' is rated as having <i>low</i> quality';
            } else {
                reason = 'only the very small number of ' + badClasses + ' is rated as having <i>low</i> quality';
            }
        } else {
            quality = '<i>good</i> &#9733;&#9733;';
            reason = 'only ' + badClassesAre + ' rated as having <i>low</i> quality';
        }
    } else {
        if (regular > bad) {
            quality = '<i>okay</i> &#9733;';
            reason = badClassesAre + ' rated as having <i>low</i> quality, which are still fewer than the ones rated as <i>regular</i> (' + regular + ')';
        } else {
            quality = '<i>low</i> &#9888;';
            reason = 'the high number of ' + badClasses + ' is rated as having <i>low</i> quality';
        }
    }
    text += 'The ' + attributeName[attribute] + ' is ' + quality + ' as ' + reason;
    text += '<span class="' + attribute + 'Info infoIcon"title=""> &#9432;</span>. <button class="collapsible"></button><div class="content"><div id="sl' + captitalize(attribute) + '"></div></div></p>';
    return text;
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
        // FIXME: 16.1 is not "almost sixteen"
        // TODO: Write a sentence about the most bug-prone classes
        // FIXME: Make sentences less repetitive regarding phrasing
        text += 'Almost ' + num2word(Math.round((bugCt / classCt) * 100)) + ' percent <span id="bar_17" class="barSpan"></span> of the classes were associated with recorded bugs.';
        if (d.length > 3) {
            text += ' The classes <button class="collapsible"></button><div class="content"><p>' + printItalicsList(d) + '</p></div> were associated with bugs and have identified bad smells';
        }
        else if (d.length > 0) {
            text += (d.length == 1) ? ' The class ' + printItalicList(d) + ' was ' : ' The classes ' + printItalicList(d) + ' were ';
            text += 'associated with recorded bugs and ' + ((d.length == 1) ? 'has' : 'have') + ' identified bad smells.';
        }

    }
    return text;
}

function generatePPCaption() {
    // TODO: color metric names
    var caption = 'The overview of the software quality in terms of <span class="complexityMetric clickable">complexity</span> (<span class="wmc">wmc</span>, <span class="max_cc">max_cc</span>), <span class="couplingMetric clickable">coupling</span> (<span class="cbo">cbo</span>, <span class="ca">ca</span>, <span class="ce">ce</span>), <span class="cohesionMetric clickable">cohesion</span> (<span class="lcom">lcom</span>, <span class="lcom3">lcom3</span>), and <span class="inheritanceMetric clickable">inheritance</span> (<span class="noc">noc</span>, <span class="dit">dit</span>)';
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
        content += '<p>Within the analyzed classes, ' + createClassSpan(maxClassWmc) + ' has the highest values with respect to both metrics.</p>';
    } else {
        content += '<p>Within the analyzed classes, ' + createClassSpan(maxClassWmc) + ' has the highest value with respect to <span class="wmc">wmc</span> and ' + createClassSpan(maxClassMaxCc) + ' the highest value with respect to <span class="max_cc">max_cc</span>.</p>';
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

function generateTooltipTexts() {

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
    var text = '';
    var bs = findBadSmellsInClass(className);
    text += createClassSpan(className) + ' carries ' + (bs.length === 1 ? 'a ' : '') + (bs.length > 0 ? printList(bs) : 'no') + ' code smell' + (bs.length === 1 ? '' : 's') + '.';

    return text;
}

function captitalize(str) {
    // https://stackoverflow.com/questions/5122402/uppercase-first-letter-of-variable
    str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    return str;
}