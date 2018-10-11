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
        num: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (addnum <= 3) {
            // this.touchnum = rnd(1, 3)
            this.touchnum = parseInt(cc.random0To1() * 3) + 1;
        } else if (addnum > 3 && addnum <= 10) {
            // this.touchnum = rnd(3, 10)
            this.touchnum = parseInt(cc.random0To1() * 8) + 3;
        } else if (addnum > 10 && addnum <= 20) {
            // this.touchnum = rnd(10, 50)
            this.touchnum = parseInt(cc.random0To1() * 41) + 10;
        } else {
            // this.touchnum = rnd(10, 150)
            this.touchnum = parseInt(cc.random0To1() * 141) + 10;
        }
        this.Discoloration(this.touchnum);
        // let _rotation = rnd(0, 360)
        let _rotation = parseInt(cc.random0To1() * 361);
        this.node.rotation = _rotation
        this.num.getComponent(cc.Label).string = this.touchnum;
        this.num.rotation = -_rotation;
        this.curNodeX = this.node.x;
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        
        if (otherCollider.node.group === 'Ball') {
            if (otherCollider.node.scale === .5) {
                this.touchnum -= 2
                tools.score += 2
            } else {
                this.touchnum--
                tools.score++;
            }

            if (this.touchnum < 1) {
                this.node.group = 'Group';
                var anim = this.getComponent(cc.Animation);
                anim.play("Posui");
                anim.on('stop', this.onStop, this);
            } else {
                this.action(this.node,0)
            }


            this.Discoloration(this.touchnum);
            this.num.getComponent(cc.Label).string = this.touchnum;
        }
    },

    onEndContact: function (contact, selfCollider, otherCollider) {
        
    },

    action(nodeRoot,countIdx){
        var run = (nodeRoot,countIdx) => {
            nodeRoot.stopAction();
            nodeRoot.x = this.curNodeX;
            if(countIdx >= 6){
                return;
            }
            var x = nodeRoot.x,y = nodeRoot.y;
            let px = x + 2 * Math.pow(-1,countIdx);//上下震动5像素
            let py = y + 2 * Math.pow(-1,countIdx);//上下震动5像素
            
            var finished = cc.callFunc(() => {
                run(nodeRoot,countIdx + 1);
            }, this);
            let moveTo = cc.moveTo(0.05, cc.v2(px,py));
            var sequence = cc.sequence(moveTo,finished)
            nodeRoot.runAction(sequence);
        }
        run(nodeRoot,countIdx);
    },

    
    start () {

    },
    onStop() {
        this.node.active = false;
        this.node.isDestroy = true;
    },

    Discoloration(num) {
        if (num < 10) {
            this.node.color = cc.Color.ORANGE;
        } else if (num >= 10 && num < 50) {
            this.node.color = cc.Color.CYAN;
        } else if (num >= 50 && num < 100) {
            this.node.color = cc.Color.GREEN;
        } else {
            this.node.color = cc.Color.MAGENTA;
        }
    }

    // update (dt) {},
});
