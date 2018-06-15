// JavaScript Document
;
(function(factory) {
	if (typeof define === 'function' && define.amd) { // AMD
		// you may need to change `define([------>'jquery'<------], factory)`
		// if you use zepto, change it rely name, such as `define(['zepto'], factory)`
		define(factory)
			// define(['zepto'], factory)
	} else { // Global
		factory()
	}
})
(function() {
	var dpr, rem, scale;
	var docEl = document.documentElement;
	var fontEl = document.createElement('style');
	var metaEl = document.querySelector('meta[name="viewport"]');
	var docElWidth = docEl.clientWidth > 750 ? 750 : docEl.clientWidth;
	document.body.style.width ="10rem";
	dpr = window.devicePixelRatio || 1;
	rem = docElWidth  / 10;
	scale = 1 / dpr;
	scale = scale.toFixed(3);

	// if (docElWidth * dpr === 750 && docElWidth === 375) {
	// 	scale = scale - 0.001;
	// }

	// 设置viewport，进行缩放，达到高清效果
	//metaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

	// 设置data-dpr属性，留作的css hack之用
	docEl.setAttribute('data-dpr', dpr);

	// 动态写入样式
	docEl.firstElementChild.appendChild(fontEl);
	fontEl.innerHTML = 'html{font-size:' + rem + 'px !important;}';

	// 给js调用的，某一dpr下rem和px之间的转换函数
	window.rem2px = function(v) {
		v = parseFloat(v);
		return v * rem;
	};
	window.px2rem = function(v) {
		v = parseFloat(v);
		return v / rem;
	};
	window.dpr = dpr;
	window.rem = rem;
})