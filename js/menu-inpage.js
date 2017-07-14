+ function($) {
    $(function() {

        (function () {
            var video = $('#videobox video')[0],
                playBtn = $('#videobox .play');
            playBtn.on('click', function() {
                $(this).hide();
                //$("#videobox").height("4.2rem");
                $("#videobox").animate({height: "4.2rem",}, 1000 );
                $('#videobox video').css("position: absolute;left: 0;");
                video.play();
                video.controls=true;
            });

            video.addEventListener('ended',function(){
                playBtn.show();
                video.controls=false;
            },false);
            video.addEventListener('pause',function(){
                playBtn.show();
                video.controls=false;
            },false);
        })();
    });
}(jQuery);
