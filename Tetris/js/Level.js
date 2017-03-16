(function(window){
	'use strict';
	//10000level1 20000level2 ......
	var levelArr = (function(){
		var arr = [0];
		for(var i = 0; i<10; i++){
			arr.push(Math.pow(2,i)*10000);
		}
		return arr;
	})();

	function Level(){
		this.canvas = new Canvas('level',100,70);
		this.level = 1;
		this._init();
	}
	Level.prototype = {
		constructor:level,
		_init:function(){
			this._render();
		},
		_render:function(){//将level渲染到canvas上
			this.canvas.drawText('level' + this.level);
		},
		//检查当前级别
		checkLevel:function(score){
			if(score >= levelArr[this.level]){
				this.level ++;
				this._render();
				return this.level;
			}
			return 0;
		}
	};

	window.Level = Level;
})(window);