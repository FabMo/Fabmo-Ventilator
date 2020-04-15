let running = false;
let jobOut = "";
let jobIn ="";
let jobOutRunning = false;
let jobInRunning = true;
let readyToRun = true;
let pauseOut = 0; 
let pauseIn = 0;
let pause = 0;
// let distance = $('#distance').val();
// let speedOut = $('#speed-out').val();
// let speedIn = $('#speed-in').val();
// let jerkOut = $('#jerk-out').val();
// let jerkIn = $('#jerk-in').val();
let repsCount = 0;
let nextJob;
let fabmo = new FabMoDashboard();

const init = () => {
    // setJobs();
    // setNextJob();
}

const rangeSlider = () =>{
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        input = $('input');
        value = $('.range-slider__value');
      
    slider.each(function(){
  
      value.each(function(){
        var value = $(this).prev().attr('value');
        $(this).html(value);
      });
  
      input.on('input', function(){
        $(this).next(value).html(this.value);
      });
    });
};

// ============================================== ted fussing on getting variables ...

function updateFromConfig() {
    let totaldist = 0;
    fabmo.getConfig(function(err, data) {
      $('#reps').val(data.opensbp.variables.vRepCount).trigger('input');
      $('#distance').val(data.opensbp.variables.vCompDist).trigger('input');
      $('#distance-tail').val(data.opensbp.variables.vCompTailDist).trigger('input');
      // //totaldist = (data.opensbp.variables.vCompDist) + (data.opensbp.variables.vCompDist);
      $('#speed-out').val(data.opensbp.variables.vCompSpeed).trigger('input');
      $('#speed-tail').val(data.opensbp.variables.vCompTailSpeed).trigger('input');
      $('#speed-in').val(data.opensbp.variables.vRetractSpeed).trigger('input');
      $('#jerk-out').val(data.opensbp.variables.vCompRamp).trigger('input');
      $('#jerk-in').val(data.opensbp.variables.vRetractRamp).trigger('input');
    });
}  

/**
 * id is of the form opensbp-configitem_name such as opensbp-movexy_speed, etc.
 * This will only work for configuration items on the first branch of the tree - 
 * deeper items need more consideration. (???)
 **/
function setConfig(id, value) {
	var parts = id.split("-");
	var o = {};
	var co = o;
	var i=0;

	do {
	  co[parts[i]] = {};
	  if(i < parts.length-1) {
	    co = co[parts[i]];            
	  }
	} while(i++ < parts.length-1 );

	co[parts[parts.length-1]] = value;
	  console.log(o);
    fabmo.setConfig(o, function(err, data) {
	});
}

// ===============================================


fabmo.on('status', function(status) {
    let posx = status.posx;
    let inp5 = status.in5;
    let inp6 = status.in6;
    let progress = "";
  // Compression Bar Display
        if (posx <= .5) {
            progress = "0%";
        } else {
            progress = "85%";
        }
        //    let progress = ((posx/6)*100).toString() + "%";    //'distance'
        $('.progress-bar').css('width', progress);
  // Zero and Mid Extension Prox Switch Display
        if (inp5 === 1) {
            $('#home-sig').show();
        } else {
            $('#home-sig').hide();
        }
        if (inp6 === 1) {
            $('#mid-sig').show();
        } else {
            $('#mid-sig').hide();
        }
    updateFromConfig();
});

fabmo.requestStatus();

rangeSlider();
init();

