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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        idx :0,//
        prefabs:[cc.Prefab],
        
        wallNode:cc.Node,
        miaoZhun:cc.Node,
        GraphicPfb:cc.Prefab,
        JianTou:cc.Node,

        DangBan:cc.Node,

        scoreNode:cc.Node,

        
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        var Bits = cc.PhysicsManager.DrawBits; // 这个是我们要显示的类型
        cc.director.getPhysicsManager().debugDrawFlags  = 0;
        //Bits.e_aabbBit | Bits.e_pairBit | Bits.e_centerOfMassBit | Bits.e_jointBit | Bits.e_shapeBit;
        Bits.enabledDebugDraw = 0;

        tools.gball = cc.find('Canvas/Ball/ball');
        this.ballRoot = cc.find('Canvas/Ball');
        this.numText = cc.find("Canvas/numText");
        // this.ballRoot.children[0].tag = ballNum;
        for(let i = 0; i < this.ballRoot.childrenCount; i++){
            this.ballRoot.children[i].isSend = false;
        }

        tools.num = this.ballRoot.childrenCount;

        this.touch();
        this.arcs = [];
        this.addSprite();
        //生产砖块
        for(let i = 0; i < 3; i++){
            this.AddBrick();
        }
    },
    touch(){
        this.node.on(cc.Node.EventType.TOUCH_START,function (event) {
            if(tools.cantouch){
                this.miaoZhun.active = true;
                let wpos = event.getLocation();
                let src = this.node.convertToWorldSpaceAR(cc.v2(0,399));
                this.moveARC(src, wpos);
            }
        }.bind(this), this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (tools.cantouch) {
                let JianTouPos = this.JianTou.convertToWorldSpaceAR(cc.Vec2.ZERO);
                let wpos = event.getLocation();
                this.miaoZhun.active = true;
                let src = this.node.convertToWorldSpaceAR(cc.v2(0,399));
                this.moveARC(src, wpos);
            }
        }.bind(this),this);


        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.miaoZhun.active = false;
            if (tools.cantouch) {
                hldq = 0;
                this.JianTou.rotation = 0;
                //松开挡板
                this.MoveBall();
                tools.knif = 0;
                let w_pos = event.getLocation();
                let src = this.node.convertToWorldSpaceAR(cc.v2(0,399));
                // let dir = cc.pSub(w_pos, src);
                let dir = w_pos.sub(src);
                // let standard = cc.pNormalize(dir)
                let standard = dir.normalize();
                tools.power = cc.v2(standard.x * 800, standard.y * 800)
                //cc.find('Canvas/bg/frame').active = false;
                // for (let i = 0; i < ballarr.length; i++) {
                //     ballarr[i].color = cc.Color.WHITE;
                // }
                tools.cantouch = false;
                
                // this.addBrick();
            }
        }.bind(this), this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.JianTou.rotation = 0;
            this.miaoZhun.active = false;
        }.bind(this), this);
    },
    addSprite() {
        for (let i = 0; i < 20; i++) {
            var monster = cc.instantiate(this.GraphicPfb);

            this.arcs.push(monster);
            monster.parent = this.miaoZhun;
        }
    },
    moveARC(posa, posb) {
        if (posb.y > 780) {
            posb.y = 780
        } else if (posb.y < 100) {
            posb.y = 100
        }
        let JianTouPos = this.JianTou.convertToWorldSpaceAR(cc.Vec2.ZERO);

        let rotation = Math.atan((JianTouPos.x - posb.x) / (JianTouPos.y - posb.y)) * 57.29577951;

        if (rotation > 70) {
            rotation = 70
        } else if (rotation < -70) {
            rotation = 70
        }

        this.JianTou.rotation = rotation;

        // var dir = cc.pSub(posa, posb);
        var dir = posa.sub(posb);
        var len = cc.director.getPhysicsManager(dir);
        let _x = posb.x - posa.x;
        let _y = posb.y - posa.y;
        for (let i = 0; i < this.arcs.length; i++) {
            this.arcs[i].position = cc.v2(posa.x + _x / this.arcs.length * (i + .3), posa.y + _y / this.arcs.length * (i + 1));
            this.arcs[i].getComponent('Graphic').addArc(5 * (len / 300));
        }
    },
    //AddBrick
    AddBrick(){
        addnum++;
        let num = parseInt(cc.random0To1() * 3) + 1;
        let arr1 = this.random(num, 5);

        for (let i = 0; i < num; i++) {
            // let _num = rnd(0, this.prefabs.length - 1);
            let _num = parseInt(cc.random0To1()*(this.prefabs.length));
            if (_num === 4) { //爆炸球
                if(bigNum > 3 && this.ballRoot.childrenCount < 8){

                    while(true){
                        _num = parseInt(cc.random0To1()*6)+1;
                        if(_num != 4){
                            break;
                        }
                    }
                    
                }
                else{
                    bigNum++;
                }
                // _num = 3 - rnd(0, 1);
            }

            if (_num == 5){
                if (scaleNum > 2) {
                    _num = parseInt(cc.random0To1() * 5)+1;
                    while(true){
                        _num = parseInt(cc.random0To1()*6)+1;
                        if(_num != 4 && _num != 5){
                            break;
                        }
                    } 
                }else{
                    scaleNum++;
                }
            }

            if(_num == 6){
                if (add > 2) {
                    // _num = 4 - rnd(1, 3);
                    _num = parseInt(cc.random0To1() * 3)+1;
                }else{
                    add++;
                }
            }
            


            let newPfb = cc.instantiate(this.prefabs[_num]);
            newPfb.isDestroy = false;//isDestroy 设置是否可以被销毁
            // newPfb.tag = tools.MarkIdx + 1; //设置当前的标识ID
            let curpositionx = -180 + (80 * arr1[i] + 10);
            newPfb.position = cc.v2(curpositionx, -360);

            this.wallNode.addChild(newPfb);
            tools.MarkIdx++;

        }

        for(let j = 0; j < this.wallNode.children.length; j++){
            let random = parseInt(cc.random0To1() * 30) + 90;
            this.wallNode.children[j].setPosition(this.wallNode.children[j].x, this.wallNode.children[j].position.y + random);
        }

        for(let k = 0; k < this.ballRoot.childrenCount; k++){
            if(this.ballRoot.children[k].active == false){
                this.ballRoot.children[k].destroy();
            }
        }


        for(let k = 0; k < this.wallNode.childrenCount; k++){
                console.log("active",this.wallNode.children[k].active,);
                console.log(".y",this.wallNode.children[k].y);
                console.log("group",this.wallNode.children[k].group);
            if(this.wallNode.children[k].active && this.wallNode.children[k].y >= 300){


                if(this.wallNode.children[k].group == "Grapicl"){
                    console.log("gameOver");
                }else{
                    this.wallNode.children[k].destroy();
                }
                break;
            }

            if(this.wallNode.children[k].y >= 150){
                this.action(this.wallNode.children[k],0,this.wallNode.children[k].x,this.wallNode.children[k].y)
            }

            if(this.wallNode.children[k].active == false){
                this.wallNode.children[k].destroy();
            }
        }

        if(addbrick){
            this.DangBan.active = true;
            addbrick = false;
        }


    },

    action(nodeRoot,countIdx,posx,posy){
        var run = (nodeRoot,countIdx,posx,posy) => {
            nodeRoot.stopAction();
            nodeRoot.x = posx;
            nodeRoot.y = posy;
            if(countIdx >= 6){
                return;
            }
            var x = posx,y = posy;
            let px = x + 5 * Math.pow(-1,countIdx);//上下震动5像素
            let py = y + 5 * Math.pow(-1,countIdx);//上下震动5像素
            console.log("countIdx",px,py);
            var finished = cc.callFunc(() => {
                run(nodeRoot,countIdx + 1,posx,posy);
            }, this);
            let moveTo = cc.moveTo(0.05, cc.v2(px,py));
            var sequence = cc.sequence(moveTo,finished)
            nodeRoot.runAction(sequence);
        }
        run(nodeRoot,countIdx,posx,posy);
    },


    random(len, end) {
        var arr = [];
        for (var i = 0; i < len; i++) {
            //             采用四舍五入包含0和100                
            var n = Math.round(Math.random() * end);
            //                检测重复
            var off = false;//假设随机出来数字不重复                
            for (var j = 0; j < arr.length; j++) {
                if (n == arr[j]) {
                    //                    如果重复就更改off的状态
                    off = true;
                    //                    跳出当前代码块
                    break;
                }
            }
            //                判断off的状态
            if (off) {
                i--
            } else {
                arr.push(n);
            }
        }
        return arr;
    },
    start () {},




    MoveBall(){
        for(let i = 0;i < this.ballRoot.childrenCount;i++){
            this.ballRoot.children[i].isSend = false;
        }

        this.SendIdx = 0;
        if(this.DangBan.active) this.DangBan.active = false;
        this.ballRoot.children[this.SendIdx].isSend = true;
        this.ballRoot.children[this.SendIdx].position = cc.v2(-0.9,398.8);
        this.SendIdx++;
        shoujiqiuqiu = 0;
        
        this.Sendtype = 1;
        this.schedule(this.SendBall,.3);  
    },

    SendBall(){
        if(this.Sendtype == 1){
            if(this.ballRoot.children[this.SendIdx] == undefined){
                this.SendIdx=0;
                this.Sendtype = 2;
            }
            if(this.SendIdx == this.ballRoot.childrenCount){
                this.SendIdx=0;
                this.Sendtype = 2;
            }
            else if(this.ballRoot.children[this.SendIdx].scale != 0.5 
                && (this.ballRoot.children[this.SendIdx].isSend == false || this.ballRoot.children[this.SendIdx].isSend == undefined)){
                this.ballRoot.children[this.SendIdx].isSend = true;
                this.ballRoot.children[this.SendIdx].position = cc.v2(-0.9,398.8);

            }
            this.SendIdx++;
        }
        if(this.Sendtype == 2){
            if(this.ballRoot.children[this.SendIdx] == undefined){
                this.unschedule(this.SendBall);
                return;
            }
            if(this.SendIdx == this.ballRoot.childrenCount){
                this.unschedule(this.SendBall);
                return;
            }
            else if(this.ballRoot.children[this.SendIdx].scale == 0.5 
                && (this.ballRoot.children[this.SendIdx].isSend == false || this.ballRoot.children[this.SendIdx].isSend == undefined)){
                this.ballRoot.children[this.SendIdx].isSend = true;
                this.ballRoot.children[this.SendIdx].position = cc.v2(-0.9,398.8);
            }
            this.SendIdx++;
        }


        
    },
    update (dt) {
        this.scoreNode.getComponent(cc.Label).string = "积分:" + tools.score;
        if (addbrick) {
            this.AddBrick();
        }
    },
});
