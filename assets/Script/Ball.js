cc.Class({
    extends: cc.Component,

    properties: {
        ElevatorPfb:cc.Prefab,//电梯的预制体
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //装载升降机节点
        this.ElevatorRoot = cc.find("Canvas/DianTi");
        this.body = this.getComponent(cc.RigidBody);
        this.collider = this.getComponent(cc.PhysicsCircleCollider);
        this.numText = cc.find("Canvas/numText");
        this.bullRoot = cc.find("Canvas/Ball");
        
    },
    onBeginContact(contact, selfCollider, otherCollider){
        if (otherCollider.node.group === 'Bspeed') {
            this.node.color = cc.Color.YELLOW;
            this.body.gravityScale = 20;
            this.body.friction = 1;
            this.body.linearDamping = 14;

            this.collider.restitution = .1;
            this.collider.linearVelocity = cc.v2(0, 0);
            this.collider.angularVelocity = cc.v2(0, 0);

            if (this.node.x >= 0) {
                this.body.applyLinearImpulse(cc.v2(250, 0), this.node.convertToWorldSpaceAR(cc.v2(0, 0)), false);
            } else {
                this.body.applyLinearImpulse(cc.v2(-250, 0), this.node.convertToWorldSpaceAR(cc.v2(0, 0)), false);
            }
            this.collider.apply();
        }
        else if (otherCollider.node.group == 'ShouJi') {
        //     this.node.color = cc.Color.RED;
            this.body.gravityScale = 20;
            this.body.linearDamping = 6;
        //     this.collider.restitution = .5;
            this.collider.linearVelocity = cc.v2(0, 0);
        //     //selfCollider.linearDamping = 10;
            this.body.applyLinearImpulse(cc.v2(0,0), this.node.convertToWorldSpaceAR(cc.v2(0, 0)), true);
            this.collider.apply();
        }
        else if(otherCollider.node.group == "Through"){
            //contact.disabled = true;
            this.body.gravityScale = 2;//恢复重力
            this.body.linearDamping = 0;
            this.body.linearVelocity = cc.v2(12, 12);
            this.collider.restitution = 0.8;//恢复弹动系数
            this.body.applyLinearImpulse(tools.power, this.node.convertToWorldSpaceAR(cc.v2(0, 0)), true);
            this.collider.apply();

        }
        else if(otherCollider.node.group == "Ballspeed"){
            let ElevatorP = cc.v2(301,-439);
            if(selfCollider.node.x < 0){
                ElevatorP = cc.v2(-308,-439);
            }
            let pfb = cc.instantiate(this.ElevatorPfb);
            pfb.setPosition(ElevatorP);
            let anim = pfb.getComponent(cc.Animation);
            anim.play("Elevator");
            anim.on('stop', this.onStop, pfb);
            this.ElevatorRoot.addChild(pfb);
        }
        else if (otherCollider.node.group == 'add') {
            otherCollider.node.active = false;
            //otherCollider.node.isDestroy = true;
            //cc.audioEngine.play(this.audio1, false, 1);
            var newNode = cc.instantiate(this.node);
            newNode.scale = 0.45;
            newNode.getComponent(cc.RigidBody).linearVelocity = this.body.linearVelocity;
            newNode.isSend == true;
            newNode.tag = ballNum;
            this.node.parent.addChild(newNode);
            ballNum++;
            add--;// 删除屏幕小球的个数
        }
        else if(otherCollider.node.group === 'ScaleX'){
            //cc.audioEngine.play(this.audio2, false, 1);
            if (this.node.scale === 0.45) {
                this.node.scale = .5;
            }
            otherCollider.node.active = false;
            otherCollider.node.isDestroy = true;
            scaleNum--;
        }
        else if (otherCollider.node.group == 'big') {
            //cc.audioEngine.play(this.audio2, false, 1);
            otherCollider.node.active = false;
            let idx = this.node.ballIdx;
            if(this.bullRoot.childrenCount > 1){
                this.node.destroy();
            }
            bigNum--;
        } 
    },

    onEndContact: function (contact, selfCollider, otherCollider) {
        if(otherCollider.node.group == "Num"){
            console.log(selfCollider.node.isSend)
            if(selfCollider.node.isSend || selfCollider.node.isSend == undefined){
                shoujiqiuqiu++;
            }
            console.log(shoujiqiuqiu);
            selfCollider.node.isSend = false;
            if(shoujiqiuqiu == this.bullRoot.childrenCount){
                tools.cantouch = true;
                addbrick = true;
            }
        }
    },

    onStop() {  
        setTimeout(function(){
            this.destroy();
        }.bind(this),2);    
    },
    // update (dt) {},
});
