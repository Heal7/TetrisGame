(function(window){
	'use strict';
	//布局，块的形态
	//T形方块，有block的地方为1，其他为0
	var shapeLayouts = [
		[[0, 1, 0], [1, 1, 1]],
    	[[1, 1, 1, 1]],
    	[[1, 1], [1, 1]],
    	[[0, 1], [1, 1], [1, 0]],
    	[[1, 0], [1, 1], [0, 1]],
    	[[1, 0, 1], [1, 1, 1]],
    	[[0, 1], [1, 1]],
    	[[1, 1]],
    	[[1, 1], [1, 0], [1, 0]],
    	[[1, 1], [0, 1], [0, 1]]
	];

	var random = function(minValue,maxValue){
		return minValue + Math.floor(Math.random()*maxValue);//参数随机数，0-1(不包括1)
	};

	var styleCount = 7;//方块有7种颜色

	function Shape(){	
		//左上角位置
		this.x = 0;
		this.y = 0;
		//随机获取1,7之间的整数
		this.blockType = random(1,styleCount);
		////取blocks图片的第blockTye种颜色小方块
		this.block = new Block(this.blockType);

		this.layout = shapeLayouts[random(0, shapeLayouts.length)];
	}

	Shape.prototype = {
		constructor:Shape,
		//
		draw: function(context,size){
			for(var i = 0; i<this.layout.length; i++){
				for(var j=0; j<this.layout[i].length; j++){
					if(this.layout[i][j]){
						this.block.draw(context, j+this.x, i+this.y, undefined, size);
					}
				}
			}
		},
		

		//方块翻转
		rotate:function(){
			var newLayout = [];
			for(var y=0; y<this.layout[0].length; y++){//列
				newLayout[y] = [];
				for(var x=0; x<this.layout.length; x++){//行
					newLayout[y][x] = this.layout[this.layout.length-1-x][y];//行列反转
				}
			}
			this.layout = newLayout;

			this._setLayout();
		},
		//方块不越界
		_setLayout:function(){
			if(this.x<0){
				this.x = 0;
			}
			if(this.y<0){
				this.y = 0;
			}
			if(this.x+this.layout[0].length>TetrisConfig.cols){//列
				this.x = TetrisConfig.cols- this.layout[0].length;
			}
			if(this.y+this.layout.length>TetrisConfig.rows){//行
				this.y = TetrisConfig.rows - this.layout.length;
			}
		},
		_getMaxCols:function(){
			var max = 0;
			for(var y = 0; y<this.layout.length; y++){
				max = Math.max(max, this.layout[y].length);
			}
			return max;
		},
		_getMaxRows:function(){
			return this.layout.length;
		},
		//方块的位置
		setPosition:function(cols,rows,ignoreRows){
			this.x = Math.floor((cols-this._getMaxCols())/2);
			if(!ignoreRows){
				this.y = Math.floor((rows-this._getMaxRows())/2);
			}
		}
	};

	window.Shape = Shape;
})(window);