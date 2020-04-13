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

const setJobs = () => {
    // distance = $('#distance').val();
    // speedOut = $('#speed-out').val()*60;
    // speedIn = $('#speed-in').val()*60;
    // jerkOut = $('#jerk-out').val();
    // jerkIn = $('#jerk-in').val();
    // pauseOut = parseInt($('#pause-out').val())*1000;
    // pauseIn = parseInt($('#pause-in').val())*1000;
    // pause;
    // jobOut = 'M100.1 ({xjm:'+jerkOut+'})\n'+
    // 'G90\n' +
    // 'G1X'+distance+'f'+speedOut;
    // jobIn = 'M100.1 ({xjm:'+jerkIn+'})\n'+
    // 'G90\n' +
    // 'G1X0f' + speedIn;
}

const setNextJob = () => {
    // if(jobOutRunning){
    //     nextJob = jobIn;
    //     jobOutRunning = false;
    //     jobInRunning = true;
    //     pause = pauseIn;

    //     repsCount = repsCount + 1;
    //     console.log("count= ",repsCount);
    //     $("#reps").val(repsCount);
    
        
    // } else if(jobInRunning){
    //     nextJob = jobOut;
    //     jobOutRunning = true;
    //     jobInRunning = false;
    //     pause = pauseOut;
    // } 
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

// ==============================================


function updateFromConfig() {
    let totaldist = 0;
    fabmo.getConfig(function(err, data) {
      $('#reps').val(data.opensbp.variables.vRepCount);
      //totaldist = (data.opensbp.variables.vCompDist) + (data.opensbp.variables.vCompDist);
      //$('#distance').val(totaldist);
      $('#distance-tail').val(data.opensbp.variables.vCompTailDist);
      $('#speed-out').val(data.opensbp.variables.vCompSpeed);
      $('#speed-tail').val(data.opensbp.variables.vCompTailSpeed);
      $('#speed-in').val(data.opensbp.variables.vRetractSpeed);
      $('#jerk-out').val(data.opensbp.variables.vCompRamp);
      $('#jerk-in').val(data.opensbp.variables.vRetractRamp);
      $('input').val(value).trigger('input');
    });
}  


$('.opensbp_input').change(function() {  // Handle and Bind generic UI textboxes
    setConfig(this.id, this.value); 
});
  
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

const run = () => {
    // if(!running){
    //     $('#run').removeClass('btn-success').addClass('btn-danger').html('Stop')
    //     fabmo.runGCode(nextJob, function(){
    //         running = true;
    //     });
    // } else {
    //     $('#run').removeClass('btn-danger').addClass('btn-success').html('Run')
    //     running = false;
    // }

}



fabmo.on('status', function(status) {
    let posx = status.posx;
    let progress = "";
    if (posx <= .5) {
        progress = "20%";
    } else {
        progress = "75%";
    }
//    let progress = ((posx/6)*100).toString() + "%";    //'distance'
    $('.progress-bar').css('width', progress);

    updateFromConfig();





    //     if(running) {
//         if (status.state ==="idle" && readyToRun) {
//             readyToRun = false;
//             setTimeout(function(){
//                 fabmo.runGCode(nextJob, function(){
//                     setNextJob();
//                 });
//             }, pause);
//         } else if (status.state ==="running") {
//             readyToRun = true;
//         }
//     }
});

fabmo.requestStatus();

rangeSlider();
init();

//$('#run').click(()=>run());
