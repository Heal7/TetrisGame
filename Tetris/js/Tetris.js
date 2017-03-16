(function(window){
	'use strict';

	function Tetris(){
		this.board = new Board(this);
		this.score = new Score();
		this.timer = new Timer();
		this.level = new Level();
		this.nextshape = new NextShape();//nextshape在board的下方生成
		this.highscore = new HighScore();

		this._sound;
		this._state = 'playing';//游戏状态
		(new Keyboard()).init(this.board);
	}

    Tetris.prototype = {
	    constructor: Tetris,
	    _initAudio:function(){
	    	this._sound = new Howl({
	    		src: ['audio/bg.wav'],
	    		loop: true, //自动播放
	    		volume: 0.01  //音量
	    	});
	    	this._playSound();
	    },
	    _playSound:function(){
	    	if(window.TetrisConfig.config.enableSound){
	    		this._sound.play();
	    	}
	    },
	    _startTick(){
	    	var self = this;
		    window.TetrisConfig.intervalId = window.setInterval(function(){
		      	self.board.tick();
		    }, TetrisConfig.speed);
	    },
	    _stopTick(){
	    	window.clearInterval(window.TetrisConfig.intervalId);
	    },

	    startGame: function(){
	      this._startTick();
	      this._initAudio();
	    },
	    endGame: function(){
	    	//停止声音播放
	    	this._sound.stop();
	    	//停止tick
	    	this._stopTick();
	    	//停止计时器
	    	this.timer.stop();
	    },
	    pause:function(){
	    	if(this._state === 'over'){//避免再次生效
	    		return;
	    	}
	    	//暂停播放音乐
	    	this._sound.pause();
	    	//暂停事件响应
	    	this._state = 'pause';
	    	//取消tick
	    	this._stopTick();
	    	//取消计时器
	    	this.timer.pause();
	    },
	    resume:function(){
	    	if(this._state === 'over'){
	    		return;
	    	}
	    	this._playSound();
	    	this._state = 'playing';
	    	this._startTick();
	    	this.timer.resume();
	    }
	 };

	window.Tetris = Tetris;

})(window);