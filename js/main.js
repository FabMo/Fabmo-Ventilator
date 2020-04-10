let running = false;
let jobOut = "";
let jobIn ="";
let jobOutRunning = false;
let jobInRunning = true;
let readyToRun = true;
let pauseOut = 0; 
let pauseIn = 0;
let pause = 0;
let distance = $('#distance').val();
let speedOut = $('#speed-out').val();
let speedIn = $('#speed-in').val();
let jerkOut = $('#jerk-out').val();
let jerkIn = $('#jerk-in').val();
let repsCount = 0;
let nextJob;
let fabmo = new FabMoDashboard();

const init = () => {
    setJobs();
    setNextJob();
}

const setJobs = () => {
    distance = $('#distance').val();
    speedOut = $('#speed-out').val()*60;
    speedIn = $('#speed-in').val()*60;
    jerkOut = $('#jerk-out').val();
    jerkIn = $('#jerk-in').val();
    pauseOut = parseInt($('#pause-out').val())*1000;
    pauseIn = parseInt($('#pause-in').val())*1000;
    pause;
    jobOut = 'M100.1 ({xjm:'+jerkOut+'})\n'+
    'G90\n' +
    'G1X'+distance+'f'+speedOut;
    jobIn = 'M100.1 ({xjm:'+jerkIn+'})\n'+
    'G90\n' +
    'G1X0f' + speedIn;
}

const setNextJob = () => {
    if(jobOutRunning){
        nextJob = jobIn;
        jobOutRunning = false;
        jobInRunning = true;
        pause = pauseIn;

        repsCount = repsCount + 1;
        console.log("count= ",repsCount);
        $("#reps").val(repsCount)
    
        
    } else if(jobInRunning){
        nextJob = jobOut;
        jobOutRunning = true;
        jobInRunning = false;
        pause = pauseOut;
    } 
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
        setJobs();
      });
    });
};



const run = () => {
    if(!running){
        $('#run').removeClass('btn-success').addClass('btn-danger').html('Stop')
        fabmo.runGCode(nextJob, function(){
            running = true;
        });
    } else {
        $('#run').removeClass('btn-danger').addClass('btn-success').html('Run')
        running = false;
    }

}



fabmo.on('status', function(status) {
    let posx = status.posx;
    let progress = ((posx/distance)*100).toString() + "%";
    $('.progress-bar').css('width', progress);
    if(running) {
        if (status.state ==="idle" && readyToRun) {
            readyToRun = false;
            setTimeout(function(){
                fabmo.runGCode(nextJob, function(){
                    setNextJob();
                });
            }, pause);
        } else if (status.state ==="running") {
            readyToRun = true;
        }
    }
});
fabmo.requestStatus();



  
rangeSlider();
init();

$('#run').click(()=>run());

