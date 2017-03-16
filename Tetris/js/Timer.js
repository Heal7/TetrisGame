(function(window){
	'use strict';
	function Timer(){
		this.canvas = new Canvas('timer',100,70);//宽高
		this.time = 0;//毫秒数
		this.timeId;//因为时间会变化，存储时间的interval
		this._init();
	}

	Timer.prototype = {
		constructor:Timer,
		_init:function(){
			this._render();
			this.resume();
		},
		//时间格式化
		_format:function(seconds){
			var hours = Math.floor(seconds/(60*60));
			seconds = seconds - hours * 3600;
			var minutes = Math.floor(seconds/60);
			seconds = seconds - minutes * 60;
			if(hours < 10){
				hours = '0' + hours;
			}
			if(minutes < 10){
				minutes = '0' + minutes;
			}
			if(seconds < 10){
				seconds = '0' + seconds;
			}
			return hours + ':' + minutes + ':' + seconds;
		},
		_render:function(){//把canvas渲染到
			this.canvas.drawText(this._format(this.time));
		},
		//暂停
		pause:function(){
			window.clearInterval(this.timeId);
		},
		//恢复
		resume:function(){
			var self = this;
			this.timeId = window.setInterval(function(){
				self.time += 1;
				self._render();
			},1000);
		},
		//停止
		stop:function(){
			this.pause();
		}
	};

	window.Timer = Timer;
})(window)