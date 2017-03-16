(function (window){
	'use strict';//严格模式
	function Block(blockType){//传7种类型中的某一种
		this.blockType = blockType;
		this.size = 30;//块的大小
		this.originalSize = 32;//原始的是32*224
		this.sprite = window.ResourceManager.getResource('blocks');//从ResourceManager.getResource方法中拿到图片
	}

	Block.prototype = {
		constructor:Block,
		draw:function(context,x,y,blockType,size){//在context的(x,y)坐标开始
			size = size || this.size;//若size参数有值则使用参数size，否则使用this.size(==30)
			// x轴，y轴，宽度，高度，行，列，宽，高
			context.drawImage(this.sprite, ((blockType||this.blockType) - 1) * this.originalSize, 0, this.originalSize, this.originalSize, x * size, y * size, size, size);
		}
	};

	window.Block = Block;

})(window);