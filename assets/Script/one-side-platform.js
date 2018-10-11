// http://www.iforce2d.net/b2dtut/one-way-walls

cc.Class({
    extends: cc.Component,

    properties: {    },

    onLoad: function () {
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        
    },
    onEndContact: function (contact, selfCollider, otherCollider) {
        if(otherCollider.node.group == "Ball"){
        }
    },



    Dou(){
        let ballNum = cc.find("Canvas/Ball");
        //ballNum.children[0].position = cc.v2(-0.9,398.8);
        addbrick = false;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
