// Canves操作类
// @param canvesId Canves元素的ID属性
// @param width canves宽度
// @param height canves高度
(function(window){
	'use strict';

	function Canvas(canvasId,width,height){
		this.canvasId = canvasId;
		this.el = document.getElementById(canvasId);
		if(!this.el){
			throw new Error('Must provider a right vanvas id.');
		}
		this.context = this.el.getContext('2d');//获取当前页面的上下文
		this.width = width || window.innerWidth;
		this.height = height || window.innerHeight;

		this._init();
	}

	//封装类，操作原型
	Canvas.prototype = {
		constructor:Canvas,//constructor指向canvas函数
		//私有方法
		_init:function(){
			this.el.width = this.width;//把设置的width赋给元素本身的width，避免大小不一致时出现拉伸或压缩的情况
			this.el.height = this.height;
		},
		clear: function (fromX, fromY, toX, toY) {
	      	fromX = fromX || 0;
	      	fromY = fromY || 0;
	      	toX = toX || this.width;
	      	toY = toY || this.height;
	      	//以矩形方式清空
	      	this.context.clearRect(fromX, fromY, toX, toY);
		},
		//绘制文本
		drawText:function(text,x,y){
			this.clear(0,0);
			this.context.font = '22px Arial';
			this.context.fillStyle = '#FFB90F';
			this.context.textAlign = 'center';
			//x坐标，y坐标
			this.context.fillText(text, x===undefined?(this.width/2):x, y===undefined?45:y);
		}
	};
window.Canvas = Canvas;
})(window);