(function(window){
	'use strict';

	var keys = {
		38:'top',
		39:'right',
		40:'down',
		37:'left'
	};

	function Keyboard(){
		this.board;
	}

	Keyboard.prototype = {
		constructor:Keyboard,
		init:function(board){
			var self = this;
			self.board = board;
			document.addEventListener('keydown',function(evt){
				self.processKeyDown(evt);
			});
		},
		//按键处理，判断，如果是上下左右键，则执行事件
		processKeyDown:function(evt){
			if(this.board.gameInst._state !== 'playing'){
				return ;
			}
			if(keys[evt.keyCode]){
				this.press(keys[evt.keyCode]);
			}
		},
		//按钮执行事件
		press:function(key){
			var refresh = false;//按键平滑
			switch(key){
				case 'top':
					this.board.shape.rotate();
					if(this.board.validMove(0,0)){
						refresh = true;
					}
					
					break;
				case 'right':
					if(this.board.validMove(1,0)){
						this.board.shape.x += 1;
						refresh = true;
					}
					break;
				case 'down':
					if(this.board.validMove(0,1)){
						this.board.shape.y += 1;
						refresh = true;
					}
					break;
				case 'left':
					if(this.board.validMove(-1,0)){
						this.board.shape.x -= 1;
						refresh = true;
					}
					break;
			}
			//按向下箭头时实现平滑效果
			if(refresh){
				this.board.refresh();
				this.board.shape.draw(this.board.context);//重绘
				if(key === 'down'){
					var self = this;
					window.clearInterval(window.TetrisConfig.intervalId);//清理interval
					window.TetrisConfig.intervalId = window.setInterval(function(){//重新设置interval
						self.board.tick();
					},TetrisConfig.speed);
				}
			}
		}
	};

	window.Keyboard = Keyboard;
})(window);