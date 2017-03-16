(function (window){
	'use strict';

	function Board(gameInst){
		this.gameInst = gameInst;
		this.blockSize = 30;//每个方块的大小
		this.rows = TetrisConfig.rows;//  600/30
		this.cols = TetrisConfig.cols;//  390/30
		this.canvas = new Canvas('c_game_main',this.cols*this.blockSize,this.rows*this.blockSize);//宽高
		this.context = this.canvas.context;
		this.boardList = [];//画布二维数组的数据

		this.shape = new window.Shape();

		this._init();
	}

	Board.prototype = {
		constructor:Board,
		_init:function(){
			this._buildGridData();
			this._initGrid();

			this.shape.draw(this.context);
			var self = this;
			setTimeout(function(){//因为nextshape在board下方生成，渲染传参是nextshape为空，所以将渲染nextshape画布延时
				self._buildNextShape();
			});
		},
		_buildNextShape:function(){
			this.nextShape = new window.Shape();
			this.nextShape.setPosition(this.gameInst.nextshape.cols,this.gameInst.nextshape.rows);
			this.gameInst.nextshape.render(this.nextShape);
		},
		_buildGridData:function(){
			var i,j;
			for(i=0; i<this.rows; i++){
				this.boardList[i] = [];
				for(j=0; j<this.cols; j++){
					this.boardList[i][j] = 0;
				}
			}
			// console.log(this.boardList);
		},
		_initGrid(){
			var i;
			this.context.strokeStyle = 'green';//画笔
			this.context.lineWidth = 0.5;//笔画宽度
			//绘制线条的笔迹
			for(i=0; i<=this.rows; i++){
				this.context.moveTo(0,i*this.blockSize,0);//寻找起始点
				this.context.lineTo(this.canvas.width,i*this.blockSize);//画横线，终点是canvas的宽度
			}
			for(i=0; i<=this.cols; i++){
				this.context.moveTo(i*this.blockSize,0);
				this.context.lineTo(i*this.blockSize,this.canvas.height);//画竖线，终点是canvas的高度
			}
			//绘制线条
			this.context.stroke();

			//缓存数据，因为背景图是始终不变的
			this.gridImageData = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
		},
		//方块下落事件
		tick: function(){
			if(this.validMove(0,1)){
				this.shape.y += 1;//每往下跳动一块，y+1
			}else{
				this.addShapeToBoardList();//将方块添加到BoardList数组
				if(this.gameInst._state === 'over'){
					this.gameInst.endGame();
					return;
				}
				this.clearFullRows();//方块填满某行时移除该行
				this.shape = this.nextShape;//获取新的方块
				this.shape.setPosition(this.cols, this.rows, true);//下落出现时的位置
				this._buildNextShape();
			}
			this.refresh();
			this.shape.draw(this.context);
		},
		//刷新画布，重新加载方块
		refresh: function(){
			this.canvas.clear();//将canvas清空
			this.context.putImageData(this.gridImageData,0,0);//保留背景方格
			this.drawBlocks();//将到底部的方块留住
		},
		validMove: function(moveX,moveY){
			//下一步
			var nextX = moveX + this.shape.x;
			var nextY = moveY + this.shape.y;
			for(var y=0; y<this.shape.layout.length; y++){
				for(var x =0; x<this.shape.layout[y].length; x++){
					if(this.shape.layout[y][x]){
						if(typeof this.boardList[nextY+y] === 'undefined'//找不到行
							|| typeof this.boardList[nextY+y][nextX+x] === 'undefined'//找不到列
							|| this.boardList[nextY+y][nextX+x] //当前位置已有方块
							|| nextX + x <0 //超出左边界
							|| nextX + x >= this.cols //超出右边界
							|| nextY + y >= this.rows //超出下边界
						){
							return false;
						}
					}
				}
			}
			return true;
		},
		//添加方块
		addShapeToBoardList:function(){
			for(var y=0; y<this.shape.layout.length; y++){
				for(var x =0; x<this.shape.layout[y].length; x++){
					if(this.shape.layout[y][x]){
						var boardX = this.shape.x + x;
						var boardY = this.shape.y + y;
						if(this.boardList[boardY][boardX]){//碰上了
							//todo GAME OVER
							this.gameInst._state = 'over';
							return;
						}else{
							this.boardList[boardY][boardX] = this.shape.blockType;
						}
					}
				}
			}
		},
		//将到底部的方块留住
		drawBlocks:function(){
			for(var y=0; y<this.rows; y++){
				for(var x=0; x<this.cols; x++){
					if(this.boardList[y][x]){//若该数组有值，则把该方块画出
						this.shape.block.draw(this.context,x,y,this.boardList[y][x]);
					}
				}
			}
		},
		//填充空行
		createEmptyRow:function(){
			var emptyArr = [];
			for(var i=0; i<this.cols; i++){
				emptyArr.push(0);
			}
			return emptyArr;
		},

		//方块填满某行时消除该行
		clearFullRows:function(){
			var lines = 0;
			for(var y=this.rows-1; y>=0; y--){
				//完全填充
				var filled = this.boardList[y].filter(function(item){return item >0;}).length === this.cols;
				if(filled && y){//全部填充且y>0
					this.boardList.splice(y,1);//清除第y行,刚落下来的那一行没有判断到，所以需要i++
					this.boardList.unshift(this.createEmptyRow());//移除之后在BoardList数组第一行添加空行，其余的方块被往下挤一行
					lines++;
					y++;
				}
			}
			//计算得分
			var score = lines * 100 *lines;//当前得分=清除的行数*单行得分*倍数
			var totalScore = this.gameInst.score.addScore(score);//总得分
			this.gameInst.highscore.checkScore(totalScore);
			var currentLevel = this.gameInst.level.checkLevel(totalScore);//当前级别
			if(currentLevel){
				//level1 speed1000 level2 spped900 level3 speed800 ...... 
				window.TetrisConfig.speed = Math.floor(window.TetrisConfig.constSpeed*(1-(currentLevel-1)/10));
				this.gameInst.pause();//暂停弹出升级提示窗口
				setTimeout(function(){
					window.alert('恭喜你升级了！');
					self.gameInst.resume();//恢复
				})
			}
		}

	};

	window.Board = Board;

})(window);