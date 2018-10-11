// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
       
    },

    start() {

    },
    addArc: function (num) {
        var graphics = this.getComponent(cc.Graphics);
        graphics.clear ();
        graphics.circle(0, 0, 5);  //画一个圆
        let fillColor = cc.Color.RED;//声明一个颜色变量  
        graphics.fillColor = fillColor;//声明填充的颜色
        graphics.fill();  //        填充当前绘图（路径） 
    }

    // update (dt) {},
});