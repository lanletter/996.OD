// 图片预加载
// https://github.com/okaychen/preload
(function($) {

  function PreLoad(imgs, options) {
      this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
      this.opts = $.extend({}, PreLoad.DEFAULTS, options);
      this._unoredered();
  };
  PreLoad.DEFAULTS = {
      each: null, // 每一张图片加载完成之后执行
      all: null // 所有图片加载完毕后执行
  };

  PreLoad.prototype._unoredered = function() { // 无序加载
      var imgs = this.imgs,
          opts = this.opts,
          count = 0,
          len = imgs.length;

      $.each(imgs, function(i, src) {
          if (typeof src != 'string') return; // src不是string,返回
          var imgObj = new Image();

          $(imgObj).on('load error', function() {

              opts.each && opts.each(count); // 要考虑没有传递参数opts.each === null 的情况

              if (count >= len - 1) {
                  opts.all && opts.all();
              }
              count++;
          });
          imgObj.src = src;
      })
  };

  $.extend({
      preload: function(imgs, opts) {
          new PreLoad(imgs, opts);
      }
  });


})(jQuery);


;(function() {

  document.addEventListener( _liuLiang.yz.wx ?'WeixinJSBridgeReady' :'DOMContentLoaded', function() {
    var get = function(c) { 
      return document.querySelector(c)
    }

    // Dom
    var fullVideo = document.getElementById('fullVideo'),
        shortVideo = document.getElementById('shortVideo'),
        subVideo1 = document.getElementById('swiper-slide-3-video-1'),
        subVideo2 = document.getElementById('swiper-slide-3-video-2');

    // 
    // story swiper init
    new Swiper('.story-swiper-container', {
      direction: 'vertical',
      initialSlide: 0,
      touchRatio : 1.5,
      onInit: function() {
        console.log('story swiper 初始化了')
        $('.swiper-slide-1-letter').addClass('animated fadeInUp')
        setTimeout(function(){
          $('.open-letter-text').addClass('animated fadeInDown')
        },1000)
        
        subSwiperInit()
      },
      onSlideChangeStart: function(swiper) {
        //
      },
      onSlideChangeEnd: function(swiper) {
        var currentIndex = swiper.activeIndex
        console.log('current swiper index', currentIndex)

        if (currentIndex == 0) {
          // 动态改变video src 后，需要重新 load
          //shortVideo.load()
          shortVideo.play()

          $('.swiper-slide-1-letter').addClass('animated fadeInUp')
          setTimeout(function(){
            $('.open-letter-text').addClass('animated fadeInDown')
          },1000)

        } else {
          shortVideo.pause()

          $('.swiper-slide-1-letter').removeClass('animated fadeInUp')
          $('.open-letter-text').removeClass('animated fadeInDown')
        }

        //
        if (currentIndex == 1) {
          fullVideo.play()
        } else {
          fullVideo.pause()
        }

        if( currentIndex == 2 ) {
          subVideo1.play()
        } else {
          subVideo1.pause()
        }
        
        // 最后一个slide隐藏guide arrow
        if (currentIndex == swiper.slides.length-1) {
          $('#guideArrow').hide()
        } else {
          $('#guideArrow').show()
        }
      },
    });

    
    //
    // sub swiper
    //
    function subSwiperInit() {
      new Swiper('.sub-swiper-container', {
        initialSlide: 0,
        autoplay: false,
        pagination: '.sub-swiper-pagination',
        onInit: function() {
          console.log('sub swiper 初始化了')
        },
        onSlideChangeEnd: function(swiper) {
          var currentIndex = swiper.activeIndex
          console.log('sub swiper currentIndex', currentIndex)

          if (currentIndex == 0) {
            subVideo1.play()
          } else {
            subVideo1.pause()
          }
          if (currentIndex == 1) {
            subVideo2.play()
          } else {
            subVideo2.pause()
          }
        },
      })
    };

    function handTouch () {
      fullVideo.load()
      document.removeEventListener('touchstart',handTouch ,false)
    }
    document.addEventListener('touchstart',handTouch ,false)
    
    var canplay = false
    fullVideo.addEventListener('canplay',function () {
      $('.swiper-slide-2 .full-video-loading').hide()
    },false);
    fullVideo.addEventListener('play',function () {
      canplay = true
      $('.swiper-slide-2 .full-video-loading').hide()
    },false);
    
    shortVideo.addEventListener('loadedmetadata',function () {
      setTimeout (function () {
        shortVideo.setAttribute('controls','controls');
      },10000);
    },false);

    //console.log(_liuLiang.yz.ad)
    if ( !_liuLiang.yz.ad ) {
      
      fullVideo.play();
      fullVideo.pause();

      subVideo1.play();
      subVideo1.pause();

      subVideo2.play();
      subVideo2.pause();
      
      shortVideo.play();
      shortVideo.setAttribute('autoplay','autoplay');
    }else {
      shortVideo.setAttribute('autoplay','autoplay');
      shortVideo.setAttribute('controls','controls');
    }
    
    $('.full-video-loading').on('click', function(){
      fullVideo.play();
    });

  },false);

})();