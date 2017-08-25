jQuery.preloadCssImages = function(){
        var allImgs = [];//new array for all the image urls  
        var k = 0; //iterator for adding images
        var sheets = document.styleSheets;//array of stylesheets
        
        for(var i = 0; i<sheets .length; i++){//loop through each stylesheet
                var cssPile = '';//create large string of all css rules in sheet
                var csshref = (sheets[i].href) ? sheets[i].href : 'window.location.href';
                var baseURLarr = csshref.split('/');//split href at / to make array
                baseURLarr.pop();//remove file path from baseURL array
                var baseURL = baseURLarr.join('/');//create base url for the images in this sheet (css file's dir)
                if(baseURL!="") baseURL+='/'; //tack on a / if needed
                if(document.styleSheets[i].cssRules){//w3
                        var thisSheetRules = document.styleSheets[i].cssRules; //w3
                        for(var j = 0; j<thisSheetRules.length; j++){
                                cssPile+= thisSheetRules[j].cssText;
                        }
                }
                else {
                        cssPile+= document.styleSheets[i].cssText;
                }
                
                //parse cssPile for image urls and load them into the DOM
                var imgUrls = cssPile.match(/[^\(]+\.(gif|jpg|jpeg|png)/g);//reg ex to get a string of between a "(" and a ".filename"
                if(imgUrls != null && imgUrls.length>0 && imgUrls != ''){//loop array
                        var arr = jQuery.makeArray(imgUrls);//create array from regex obj        
                        jQuery(arr).each(function(){
                                allImgs[k] = new Image(); //new img obj
                                allImgs[k].src = (this[0] == '/' || this.match('http://')) ? this : baseURL + this;     //set src either absolute or rel to css dir
                                k++;
                        });
                }
        }//loop
        return allImgs;
	}
	
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "IE",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

var SpeedTest = function() {
  /* 
  From:  http://techallica.com/kilo-bytes-per-second-vs-kilo-bits-per-second-kbps-vs-kbps/
  256 kbps            31.3 KBps
  384 kbps            46.9 KBps
  512 kbps            62.5 KBps
  768 kbps            93.8 KBps
  1 mbps ~ 1000kbps   122.1 KBps
  */
};
SpeedTest.prototype = {
  runCount: 3                 // how many times we want to run the test for
  ,imgUrl: "speedtest.jpg"    // Where the image is located at
  ,size: 59917                // bytes
  ,run: function( options ) {
    this.results = []; // reset the results
    this.callback = ( options && options.onEnd ) ? options.onEnd : null;
    this.runTrial(0, options);
  }

  ,runTrial: function(i, options ) {
    var imgUrl = this.imgUrl + "?r=" + Math.random();
    var me = this;
    var testImage = new Image();
    testImage.onload = function() { 
      me.results[i].endTime = ( new Date() ).getTime();
      me.results[i].runTime = me.results[i].endTime - me.results[i].startTime;
      
      if ( i < me.runCount - 1 )
        me.runTrial( i + 1 ); // run the next trial 
      else
      {
        // Execute the callback
        if( me.callback )
          me.callback( me.getResults() );
      }
    };
    this.results[i] = { startTime: ( new Date() ).getTime() };
    testImage.src = imgUrl;
  }
  
  ,getResults: function() {
    var totalRunTime = 0;
    for( var i = 0; i < this.runCount; i++ )
    {
      if( !this.results || !this.results[i].endTime )
        return null; // exit if we found no endTime.  --> test's not done yet
      else
        totalRunTime += this.results[i].runTime;
    }
    
    var avgRunTime = totalRunTime / this.runCount;
    
    return { 
      avgRunTime: avgRunTime
      ,Kbps: ( this.size * 8 / 1024 / ( avgRunTime / 1000 ) )
      ,KBps: ( this.size / 1024 / ( avgRunTime / 1000 ) )
    };
  }
}

var st = new SpeedTest();

var arrDiv = new Array("tys","faq","contact");

function tabSelect(tabid){
	for (var i = 0; i < arrDiv.length; i++)
			{
			$("#div_"+arrDiv[i]).hide();
			$(".tab").removeClass("on");
			}
		$("#div_"+arrDiv[tabid]).show();
		$(".tab:eq("+tabid+")").addClass("on");
	}
	
function goTo(bar,question){
	tabSelect(1);
	$(".bar:eq("+bar+")").addClass("open");
	$(".bar:eq("+bar+")").next().slideDown("normal");
	$(".faq:eq("+question+")").addClass("expand");
	$(".faq:eq("+question+")").next().slideDown("normal");
	var p = $(".faq:eq("+question+")").position();
	var y = p.top
	setTimeout("window.scrollTo(0,"+y+");",500);
	}
function expandAll(){
	$(".bar").addClass("open");
	$(".bar").next().slideDown("normal");
	$(".faq").addClass("expand");
	$(".faq").next().slideDown();
	$("#expandAll").hide();
	$("#collapseAll").show();
	}
function collapseAll(){
	$(".bar").removeClass("open");
	$(".bar").next().slideUp("normal");
	$(".faq").removeClass("expand");
	$(".faq").next().slideUp();
	$("#collapseAll").hide();
	$("#expandAll").show();
	}
	
function tys(){
	//init
		var tys_error = false;
		$(".error").hide();
		$("#system_test tr:gt(0)").removeClass("warning pass");
		$("#system_test tr:gt(0) td:eq(2)").html("");
		$("#system_test tr:gt(0) td:eq(4)").html("");
		$(".status").attr("src","images/icon_working_grey.png");
	//browser detect
		var browser_error = false;
		var browser_error_string = "";
		$("#system_test tr:eq(1) td:eq(2)").html(BrowserDetect.OS +" with "+ BrowserDetect.browser +" "+ BrowserDetect.version);
		if (BrowserDetect.OS != "Windows" && BrowserDetect.OS != "Mac" && BrowserDetect.OS != "Linux") {
			browser_error = true;
			tys_error = true;
			browser_error_string = '<a href="javascript:goTo(0,0);">My Operating System is not compatible.</a>';
			}
		if (BrowserDetect.browser == "IE" && BrowserDetect.version < 6) {
			browser_error = true;
			tys_error = true;
			browser_error_string = '<a href="javascript:goTo(0,2);">IE - How do I upgrade my browser? </a>';
			}
		if (BrowserDetect.browser == "Firefox" && BrowserDetect.version < 3) {
			browser_error = true;
			tys_error = true;
			browser_error_string = '<a href="javascript:goTo(0,3);">Firefox - How do I upgrade my browser? </a>';
			}
		if (BrowserDetect.browser == "Safari" && BrowserDetect.version < 3.1) {
			browser_error = true;
			tys_error = true;
			browser_error_string = '<a href="javascript:goTo(0,4);">Safari - How do I upgrade my browser? </a>';
			}
		if (browser_error == true) {
			tys_error = true;
			$("#system_test tr:eq(1)").addClass("warning");
			$("#check1").attr("src","images/icon_warning_orange.png");
			$("#system_test tr:eq(1) td:eq(4)").html(browser_error_string);
			} else {
			$("#system_test tr:eq(1)").addClass("pass");
			$("#check1").attr("src","images/icon_check_green.png");
			$("#system_test tr:eq(1) td:eq(4)").html('');
			}
	//test cookies
		var cookie_test = $.cookies.test();
		if (cookie_test == false) {
			tys_error = true;
			$("#system_test tr:eq(2) td:eq(2)").html("Disabled");
			$("#system_test tr:eq(2)").addClass("warning");
			$("#check2").attr("src","images/icon_warning_orange.png");
			$("#system_test tr:eq(2) td:eq(4)").html('<a href="javascript:goTo(0,5);">How do I enable Cookies?</a>');
			} else {
			$("#system_test tr:eq(2) td:eq(2)").html("Enabled");
			$("#system_test tr:eq(2)").addClass("pass");
			$("#check2").attr("src","images/icon_check_green.png");
			$("#system_test tr:eq(2) td:eq(4)").html('');
			}
	//test javascript
		$("#system_test tr:eq(3) td:eq(2)").html("Enabled");
		$("#system_test tr:eq(3)").removeClass("warning");
		$("#system_test tr:eq(3)").addClass("pass");
		$("#check3").attr("src","images/icon_check_green.png");
		$("#system_test tr:eq(3) td:eq(4)").html('');
	//test flash
	$("#system_test tr:eq(4) td:eq(2)").html("Flash Player "+ FlashDetect.major +"."+ FlashDetect.minor +"."+ FlashDetect.revision);
	if (FlashDetect.versionAtLeast(9,0,115) == false) {
		tys_error = true;
		$("#system_test tr:eq(4)").addClass("warning");
		$("#check4").attr("src","images/icon_warning_orange.png");
		$("#system_test tr:eq(4) td:eq(4)").html('<a href="javascript:goTo(2,18);">Flash Player - How do I get a compatible version?</a>');
		} else {
		$("#system_test tr:eq(4)").addClass("pass");
		$("#check4").attr("src","images/icon_check_green.png");
		$("#system_test tr:eq(4) td:eq(4)").html('');
		}
	//test bandwidth
	st.run({
  		onStart: function() { }
		,onEnd: function(speed) {
			//alert( 'Speed test complete:  ' + speed.Kbps + ' Kbps');
			$("#system_test tr:eq(5) td:eq(2)").html(Math.round((speed.Kbps/1024)) +" Mbps");
			//$("#system_test tr:eq(5) td:eq(2)").html(Math.round(speed.Kbps) +" Kbps");
			$("#system_test tr:eq(5)").addClass("pass");
			$("#check5").attr("src","images/icon_check_green.png");
			$("#system_test tr:eq(5) td:eq(4)").html('');
			// put your logic here
			if( speed.Kbps < (56) ) {
				tys_error = true;
				$("#system_test tr:eq(5)").removeClass("pass");
				$("#system_test tr:eq(5)").addClass("warning");
				$("#check5").attr("src","images/icon_warning_orange.png");
				$("#system_test tr:eq(5) td:eq(4)").html('<a href="javascript:goTo(0,1);">My Bandwidth failed the speed test.</a>');
				}
			if (tys_error == true) $(".error").show();
			}
		});

	
		
	}
	
$(document).ready(function(){

	$.preloadCssImages();
	
	var hash = document.location.hash;
	if (hash.indexOf('tys') > 0 || hash == '' || hash == '#') {
		tabSelect(0);
		}
	if (hash.indexOf('faq') > 0) tabSelect(1);
	if (hash.indexOf('contact') > 0) tabSelect(2);
	
	$(".tab").click(function(){
		tabSelect($(".tab").index(this));
		});
		
	$(".bar").click(function(){
		$(this).toggleClass("open");
		$(this).next().slideToggle("normal");
		});
		
	$(".faq").click(function(){
		$(this).toggleClass("expand");
		$(this).next().slideToggle("normal");
		});
		
	tys();
		
	});