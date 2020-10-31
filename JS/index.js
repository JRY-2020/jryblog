//--------------------Tools----------------------
(function(window,undefined){
    var Tools = {
        getRandom:function(min,max){
            return Math.floor(Math.random()*(max-min+1))+min;
        }
    }
    window.Tools=Tools;
})(window,undefined)
//--------------------Parent------------------------
// ;(function(window){
//   function Parent(options){
//     this.width = options.width || 20;

//   }
// })(window,undefined)
//--------------------Food------------------------
//所有的js文件中书写代码都是全局作用域
//可以使用匿名函数  
//自调用函数  开启一个新的作用域 避免命名冲突
;(function(window,undefined){
    //局部作用域 外部无法访问
    var position = 'absolute';
    //定义一个变量 存储之前的食物
    var elements=[];
    function Food(options) {
        options = options || {};
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 20;
        this.height = options.height || 20;
        this.color = options.color || 'green';
    }

    Food.prototype.render = function(map){
        //删除之前创建的食物
        remove();
        //随机设置x,y
        this.x = Tools.getRandom(0, map.offsetWidth/this.width - 1) * this.width;
        this.y = Tools.getRandom(0, map.offsetHeight/this.height - 1) * this.height;
        //动态创建div 页面上显示的食物
        var div = document.createElement('div');
        map.appendChild(div);
        elements.push(div);
        div.style.position = 'absolute';
        div.style.left = this.x + 'px';
        div.style.top = this.y + 'px';
        div.style.width = this.width + 'px';
        div.style.height = this.height + 'px';
        div.style.backgroundColor = this.color;
    }
    function remove(){
        //先删除数组中的元素 再删除页面中的元素
        for(var i=elements.length-1;i>=0;i--){
            //删除div
            elements[i].parentNode.removeChild(elements[i]);
            //删除数组元素
            elements.splice(i,1);
        }
    }
    window.Food = Food;
})(window,undefined)

//--------------------Snake----------------------
// 自调用函数，开启一个新的局部作用域，防止命名冲突

;(function (window,undefined) {
    var position = 'absolute';
    // 记录之前创建的蛇
    var elements = [];
    function Snake(options) {
      options = options || {};
      // 蛇节 的大小
      this.width = options.width || 20;
      this.height = options.height || 20;
      // 蛇移动的方向
      this.direction = options.direction || 'right';
      // 蛇的身体(蛇节)  第一个元素是蛇头
      this.body = [
        {x: 3, y: 2, color: 'red'},
        {x: 2, y: 2, color: 'blue'},
        {x: 1, y: 2, color: 'blue'}
      ];
    }
  
    Snake.prototype.render = function (map) {
      // 删除之前创建的蛇
      remove();
      // 把每一个蛇节渲染到地图上
      for (var i = 0, len = this.body.length; i < len; i++) {
        // 蛇节
        var object = this.body[i];
        // 
        var div = document.createElement('div');
        map.appendChild(div);
  
        // 记录当前蛇
        elements.push(div);
  
        // 设置样式
        div.style.position = position;
        div.style.width = this.width + 'px';
        div.style.height = this.height + 'px';
        div.style.left = object.x * this.width + 'px';
        div.style.top = object.y * this.height + 'px';
        div.style.backgroundColor = object.color;
      }
    }
    // 私有的成员
    function remove() {
      for (var i = elements.length - 1; i >= 0; i--) {
        // 删除div
        elements[i].parentNode.removeChild(elements[i]);
        // 删除数组中的元素
        elements.splice(i, 1);
      }
    }
  
    // 控制蛇移动的方法
    Snake.prototype.move = function (food,map) {
      // 控制蛇的身体移动（当前蛇节 到 上一个蛇节的位置）
      for (var i = this.body.length - 1; i > 0; i--) {
        this.body[i].x = this.body[i - 1].x;
        this.body[i].y = this.body[i - 1].y;
      }
      // 控制蛇头的移动
      // 判断蛇移动的方向
      var head = this.body[0];
      switch(this.direction) {
        case 'right': 
          head.x += 1;
          break;
        case 'left': 
          head.x -= 1;
          break;
        case 'top':
          head.y -= 1;
          break;
        case 'bottom':
          head.y += 1;
          break;
      }
  
      // 2.4 判断蛇头是否和食物的坐标重合
      var headX = head.x * this.width;
      var headY = head.y * this.height;
      if (headX === food.x && headY === food.y) {
        // 让蛇增加一节
        // 获取蛇的最后一节
        var last = this.body[this.body.length - 1];
        this.body.push({
          x: last.x,
          y: last.y,
          color: last.color
        });
  
        // 随机在地图上重新生成食物
        food.render(map);
      }
  
    }
  
    // 暴露构造函数给外部
    window.Snake = Snake;
  })(window,undefined)

//--------------------game----------------------
  //使用自调用函数 防止命名冲突
;(function(window,undefined){
    var that;//记录游戏对象
    function Game(map){
        this.food = new Food();
        this.snake = new Snake();
        this.map = map;
        that = this;
    }
    Game.prototype.start = function (){
        //把蛇和食物对象渲染到地图，开始游戏逻辑
        this.food.render(this.map);
        this.snake.render(this.map);
        //开始游戏逻辑
        //1.蛇移动
        runSnake();

        //2.当蛇碰到墙壁 游戏结束
            //获取蛇头的坐标
        //3.通过键盘控制蛇移动的方向
        binkKey();
        //4.当蛇遇到食物 做相应的处理

    }
    //注册键盘事件
    function binkKey(){
        document.addEventListener('keydown',function(e){
            //37-left 38-top 39-right 40-bottom
            switch(e.keyCode){
                case 37:
                    this.snake.direction = 'left';
                    break;
                case 38:
                    this.snake.direction = 'top';
                    break;
                case 39:
                    this.snake.direction = 'right';
                    break;
                case 40:
                    this.snake.direction = 'bottom';
                    break;
            }
        }.bind(that),false);
    }
    //私有函数  蛇移动
    function runSnake(){
        var timerID = setInterval(function(){
            //让蛇走一格
            //在定时器的function中 this是指向定时器的
            this.snake.move(this.food, this.map);
            this.snake.render(this.map);
            this.snake.render(this.map);
            var maxX = this.map.offsetWidth/this.snake.width;
            var maxY = this.map.offsetHeight/this.snake.height;
            var headX = this.snake.body[0].x;
            var headY = this.snake.body[0].y;
            if(headX<0||headX>=maxX){
                alert('Game Over!');
                clearInterval(timerID);
            }
            if(headY<0||headY>=maxY){
                alert('Game Over!');
                clearInterval(timerID);
            }
        }.bind(that),150);
    }
    window.Game = Game;
})(window,undefined)

//--------------------main----------------------
;(function (window,undefined) {
    var map = document.getElementById('map');
    var game = new Game(map);
    game.start();
  })(window,undefined)