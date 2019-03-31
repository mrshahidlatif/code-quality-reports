(function ($) {

  var settings, pckgs, sldata = [];     //global variables to hold data

  $.fn.linkedSparklines = function () {
    var slopts = {};  //Sparklines options common to all graphs

    var options = {
      slids: ['slComplexity', 'slCoupling', 'slCohesion', 'slInheritance'],     //pass ids for containers of first and second graph
      sldef: ['wmc,max_cc', 'ca,ce', 'lcom3', 'dit,noc'], //pass fields for graphs
      slopts: [
        { height: 25 }, //pass Sparklines options, dafaults to {type: 'bar', disableHiddenCheck: true, height: 200, barWidth: 4}
        //pass options specfic to each sl if required, in order
        { stackedBarColor: ['#2b8cbe', '#56baec'] },
        { stackedBarColor: ['#238b45', '#3dc56b', '#65e48f'] },
        { stackedBarColor: ['#c51b8a', '#fa9fb5'] },
        { stackedBarColor: ['#8b5400', '#cf891f'] },
      ],
      //HLclass: 'hl',                       //pass class used to high  //function to run on success, null by defaultlight linked bar, defaults to 'hl'
      fn_wrapup: function () {   //function to run on success, null by default
        $(".content").hide();
      }
    }

    settings = { //default options:
      csvurl: '',
      slids: ['sl1', 'sl2'],              //ids for containers 1 and 2
      sldef: ['wmc,max_cc', 'ca,ce'], //fields for graphs 1 and 2
      slopts: [                           //default Sparklines options
        {                         //options for all sls
          type: 'bar',
          disableHiddenCheck: true,
          height: 25,
          barWidth: 3.5,
          tooltipFormatter: function (sl, opts, flds) { return slToolTip(sl.$el, flds); },
        },
        //additional options objects here will apply to each sl
      ],
      HLclass: 'hl',                      //class used to highlight linked bar
      fn_wrapup: null                     //function to run at the end
    };
    pckgs = {};
    sldata = [];

    //replace default Sparklines options with custom ones, if any, and assign to slopts
    $.extend(slopts, settings.slopts[0], options.slopts[0]);
    //bigger than 15 messes up the display
    slopts.barWidth = Math.min(slopts.barWidth, 15);
    //replace settings with custom ones, if any
    $.extend(settings, options);
    settings.slopts[0] = slopts;

    data = csvData[projectName];
    var csvrows = data.split(/\r\n|\n/);;
    if (csvrows.length < 2) alert('No data found');
    else {  //create graphs if data is found

      var cols = csvrows[0].split(',');
      sldata.cnidx = cols.indexOf('cname');

      for (var s = 0; s < settings.sldef.length; s++) {
        sldata[s] = { minmax: [0, 0] };
        sldata[s].cols = getcols(settings.sldef[s], cols);
        //initialise with common options
        sldata[s].slopts = $.extend({}, slopts);
        //add graph specific options
        if (options.slopts[s + 1]) $.extend(sldata[s].slopts, options.slopts[s + 1]);
        //all graphs will use the same barWidth, reinitialise in case it was overwritten
        sldata[s].slopts.barWidth = slopts.barWidth;
        $("#" + settings.slids[s]).html('');
        $("#" + settings.slids[s]).addClass('sl sl' + s);
      }

      getpckgs(csvrows, cols.length, ',');

      createsls();

    }
    if (settings.fn_wrapup != null) settings.fn_wrapup();
  }

  function addLinking() {
    $(".sl span.slcls").on('mouseover', function () {
      var clsName = $(".sl span[data-bar=" + $(this).attr('data-bar') + "]").attr('data-slcls');
      showHoverHighlighting(clsName);
    }).on('mouseout', function () {
      var clsName = $(".sl span[data-bar=" + $(this).attr('data-bar') + "]").attr('data-slcls');
      if (haveClassToPersist) {
        removeHoverHighlighting(clsName);
      }
      else {
        removePersistentHighlighting(clsName);
        removeHoverHighlighting(clsName);
      }
    });
  }
  function addHLeffects() {  //add and remove highlight on corresponding bars
    $(".sl span").on('mouseover', function () {
      $(".sl span[data-bar=" + $(this).attr('data-bar') + "]").addClass(settings.HLclass);
    })
      .on('mouseout', function () { $(".sl span[data-bar=" + $(this).attr('data-bar') + "]").removeClass(settings.HLclass); });
  }
  function slToolTip(slel, flds) {  //create and store tooltip for bar if not set already and return it
    var tt = slel.data('sltooltip');
    if (tt == '') {  //if tooltip has not been set
      var s = $(".sl").index(slel.parents(".sl")),
        slcols = settings.sldef[s].split(',').reverse();
      tt = '<span class="sltt">' + slel.data('slcls').split('.').pop() + '</span>';
      for (var i = 0; i < flds.length; i++) {
        tt += '<span class="slttval">' +
          '<span style="color:' + flds[i].color + '">&#9679;</span>' +
          '<span class="slttcol">' + slcols[i] + '</span>' +
          flds[i].value +
          '</span>';
      }
      slel.data('sltooltip', tt);
    }
    return tt;
  }
  function showClassCodeOnClick() {
    $(".sl span").on('click', function () {
      var clsName = $(".sl span[data-bar=" + $(this).attr('data-bar') + "]").attr('data-slcls');
      loadSourcecode(clsName);
    });

  }
  function createsls() { //create all graphs
    var maxbars_row = 0,                  //will contain max number of bars in a line
      barwd = 0,                        //will contain the width of a bar
      slmaxwd = $(".sl0").width() - 22, //max width of first graph, same for all graphs
      b = 0,                            //bar index counter
      numbars_pckg_row = 0,             //counter for bars in a pckg in current row
      newlbls;                          //last pckg labels added for all graphs
    for (var pckg in pckgs) if (pckgs.hasOwnProperty(pckg)) { //for each package
      var p = -1;  //div index counter for each pckg
      //draw a bar for each class along with a dummy bar in their own span
      for (var i = 0; i < pckgs[pckg].length; i++ , b++) {
        if (!i || b % maxbars_row == 0) {  //if it's the first bar in a pckg or max number of bars per row have been added
          p++;
          numbars_pckg_row = 0;
          $(".sl").append('<div class="pckg ' + pckg + ' ' + pckg + '_' + p + '"/>');  //add new div for pckg
        }
        numbars_pckg_row++;
        var className = pckgs[pckg][i];
        var classIndex = classNameToIndex[className];
        $(".sl>div." + pckg + "_" + p).append('<span data-bar="bar' + b +
          '" data-slcls="' + className +
          '" data-index="' + classIndex +
          '" data-sltooltip=""' +
          ' class="slcls class' + classIndex + '" />');
        for (var s = 0; s < settings.sldef.length; s++) {  //for each graph
          var newbar = $(".sl" + s + " span.class" + classIndex);
          newbar.sparkline([sldata[s][pckg][i], sldata[s].minmax], sldata[s].slopts);
        }
        if (!maxbars_row) {
          var slbar = $(".slcls").eq(0);
          barwd = settings.slopts[0].barWidth + slbar.outerWidth(true) - slbar.innerWidth();
          maxbars_row = Math.round(slmaxwd / barwd);
        }
        if (i + 1 == pckgs[pckg].length || (b + 1) % maxbars_row == 0) {  //if max number of bars per row have been added or it's the last bar
          //add label to last added divs
          $(".sl>div.pckg:last-child").append('<div class="lbl"><span class="pkgLbl">' + pckg + '</span></div>');
          newlbls = $(".sl>div.pckg:last-child>div.lbl>span");
          var newlbl = newlbls.eq(0);
          if ((b + 1) % maxbars_row > 0 && newlbl.outerWidth(true) > barwd * numbars_pckg_row) newlbls.css('visibility', 'hidden');
        }
      }
    }
    newlbls.css('visibility', 'visible');
    $("span.slcls").css("width", settings.slopts[0].barWidth + "px"); //span containing bar for a class cannot exceed bar width
    addHLeffects();
    addLinking();
    showClassCodeOnClick();

  }
  function updateminmax(slidx, a) {  //update the relevant minmax array
    min = max = 0;
    for (i in a) if (a[i] < 0) min += a[i]; else max += a[i];
    sldata[slidx].minmax[0] = Math.min(sldata[slidx].minmax[0], min);
    sldata[slidx].minmax[1] = Math.max(sldata[slidx].minmax[1], max);
  }
  function getcols(sl, cols) {  //get the numeric column indexes corresponding to the column headers
    var ret = [];
    sl = sl.split(',');
    for (var i = 0; i < sl.length; i++) ret.push(cols.indexOf(sl[i]));
    return ret;
  }
  function pckgclsname(pckglist) {  //get package and class name
    var res = /[^\.]+\.[^\.]+$/.exec(pckglist);
    return res[0].split('.');
  }
  function getclsdata(slidx, row) {  //get the column values for the row and update the minmax array
    var tmp = [];
    for (var i = 0; i < sldata[slidx].cols.length; i++) tmp.push(parseFloat(row[sldata[slidx].cols[i]], 10));
    updateminmax(slidx, tmp);
    return tmp;
  }
  function getpckgs(rows, numcols, delim) { //get the packages with their classes and corresponding values for each graph
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i].split(delim);
      var cname = row[sldata.cnidx];
      if (row.length == numcols) {
        var pckgcls = pckgclsname(cname);
        var pckg = pckgcls[0];
        var cls = pckgcls[1];
        if (!pckgs[pckg]) pckgs[pckg] = [];  //array to hold class names
        pckgs[pckg].push(cname);
        for (var s = 0; s < settings.sldef.length; s++) {
          if (!sldata[s][pckg]) sldata[s][pckg] = [];  //array to hold class data for this pckg for sl number s
          sldata[s][pckg].push(getclsdata(s, row));
        }
      }
    }
  }

}(jQuery));
