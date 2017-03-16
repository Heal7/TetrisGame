(function(window){
	'use strict';
	function HighScore(){
		this.canvas = new Canvas('highscore',100,70);
		this.highscore = 0;
		this._init();
	}
	HighScore.prototype = {
		constructor:HighScore,
		_init:function(){
			this.highscore = this._getScore();
			this._render();
		},
		_render:function(){//将score渲染到canvas上
			this.canvas.drawText(this.highscore);
		},
		_getScore:function(){
			return window.localStorage.getItem('highscore') || 0;
		},
		_setScore:function(value){
			window.localStorage.setItem('highscore',value);
		},
		checkScore:function(score){
			if(score>this.highscore){
				this.highscore = score;
				this._setScore(score);
				this._render();
			}
		}
	};

	window.HighScore = HighScore;
})(window);