(function(window){
	'use strict';

	var cacheMap = new Map();//用于存储资源Map对象
	var resourceTotalCount = 1;//资源总数量
	var currentLoaded = 0;//当前加载的资源数量

	//回调，判断是否所有都是加载成功的 
	var isAddLoaded = function(){
		currentLoaded += 1;
		if(currentLoaded === resourceTotalCount && typeof window.ResourceManager.onResourceLoaded ==='function'){
			window.ResourceManager.onResourceLoaded();
		}
	};

	var init = function(){
		var image = new Image();
		image.onload = function(){//image加载之后,该对象以‘blocks’名字存在Map中
			cacheMap.set('blocks',image);
			isAddLoaded();//
		};
		image.src = 'images/blocks.png';//image加载src里的内容
	};

	var getResource = function(key){//根据key获取资源
		return cacheMap.get(key);
	};

	window.ResourceManager = {
		getResource:getResource,
		init:init,
		onResourceLoaded:null //资源加载完成回调
	};
})(window);