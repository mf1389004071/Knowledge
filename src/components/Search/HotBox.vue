<template>
    <div id="hotBox">
      <div class="state">
        <div class="ring-shape">
          <div class="ring">
             <template v-for="button in buttons">
               <div class="button" :id="button.ID" :class="{selected: button.isSelected,enabled:button.isEnabled}" @mouseover="mouse_over(button)" @mouseleave="mouse_leave(button)" @click="operate(button)">
                 <span class="label">{{button.label}}</span>
               </div>
             </template>
          </div>
        </div>
        <div class="bottom">
          <div class="button" :class="{selected: chainButton.isSelected,enabled:chainButton.isEnabled}" @mouseover="mouse_over(chainButton)" @mouseleave="mouse_leave(chainButton)" @click="operate(chainButton)">
            <span class="label">{{chainButton.label}}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default{
    props:['curNodePosition'],
    data(){
      return{
        buttons:[
          {label:'新增',ID:'top', isSelected:false, isEnabled:false},
          {label:'编辑',ID:'right', isSelected:false, isEnabled:true},
          {label:'替换',ID:'bottom', isSelected:false,isEnabled:true},
          {label:'删除',ID:'left', isSelected:false, isEnabled:true},
        ],
        chainButton:{label:"新建知识链", isSelected:false, isEnabled:true},
        operation:'',
      }
    },
    mounted(){
    },
    watch:{
      'curNodePosition'(val){
        if(this.curNodePosition.isHead || this.curNodePosition.isTail){
          this.buttons[0].isEnabled = true;
        }else{
          this.buttons[0].isEnabled = false;
        }
      }
    },
    methods:{
      mouse_over(btn){
        if(btn.isEnabled == true){
          btn.isSelected = true;
        }
      },
      mouse_leave(btn){
        btn.isSelected = false;
      },
      operate(btn){
        this.operation = btn.label;
        this.$emit('cmdHandler',this.operation);
      },
    }
  }
</script>

<style lang="less">
  #hotBox{
    position:fixed;
    /* top:300px;
    right:600px; */
    overflow:visible;
    z-index:10;
    .state{
      .ring-shape{
        position: absolute;
        left: -25px;
        top: -25px;
        margin-top:-90px;
        margin-left:-90px;
        height:180px;
        width:180px;
        border: 25px solid rgba(0,0,0,.3);
        border-radius: 100%;
        box-sizing: content-box;
        .ring{
          .button {
            position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 100%;
            background:#F9F9F9;
            box-shadow: 0 0 30px rgba(0,0,0,.3);
            overflow:hidden;
            cursor:default;
          }
          .enabled{
            background:#fff;
            .label{
              color: #000;
              opacity:1;
            }
          }
          .selected {
            -webkit-animation: selected .1s ease;
            background: #e87372;
          }
          .label{
            position:absolute;
            opacity: .3;
            font-size: 16px;
            padding: .2em .6em .3em .8em;
            top:20px;
            line-height: 1em;
          }
          .key{
            display: block;
            position:absolute;
            top:37px;
            right:15px;
            font-size: 12px;
            color: #535353;
          }
          #top{
            right:55px;
            top:-40px;
          }
          #right{
            right:-40px;
            top:60px;
          }
          #left{
            right:160px;
            top:60px;
          }
          #bottom{
            right:55px;
            top:160px;
          }
        }
      }
      .bottom{
        position: absolute;
        margin-top:150px;
        margin-left:-70px;
        .button{
          display: inline-block;
          padding: 10px 15px;
          margin: 0 10px;
          border-radius: 15px;
          box-shadow: 0 0 30px rgba(0,0,0,.3);
          position: relative;
          .label{
            font-size: 16px;
            white-space: nowrap;
            text-align: center;
            line-height: 1em;
            display: inline;
            padding: .2em .6em .3em;
          }
        }
        .enabled{
          background:#fff;
          .label{
            color:#000;
            opacity:1;
          }
        }
        .selected {
            -webkit-animation: selected .1s ease;
            background: #e87372;
        }
      }
    }
  }
</style>
