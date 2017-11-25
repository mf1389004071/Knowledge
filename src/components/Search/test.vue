<template>
  <div>
    <div class="search_box">
      <el-select v-model="keywords" :loading="loading.search" remote multiple filterable :remote-method="remoteOptions" placeholder="请输入关键词"
                 :multiple-limit="3"
                 @change="search">
        <el-option-group
          v-for="group in searchOptions"
          :key="group.label"
          :label="group.label">
          <el-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-option-group>
      </el-select>
      <i @click="search"></i>
    </div>
    <div id="myDiagram"
         style="border: 1px solid silver; top:50px;left: 50px; border: solid 1px gray; width:1500px; height:900px; min-width: 200px;background: url('../../../static/bj.jpg') no-repeat center"
         ref="wordCloud"></div>
    <input type='button' id='btn' value='Click' @click="click"/>
  </div>
</template>
<script type="text/babel">
  import go from 'gojs'
  import axios from 'axios'

  export default{
    data(){
      return {
        myDiagram: null,
        nodeDataArray: [],
        linkDataArray: [],
        searchOptions: [],
        options: [],
        value: '',
        keywords: '',
        loading: {
          card: false,
          search: false,
          relation: false,
          entity: false
        },
        addNodeActiveName: '0',
        addMode: 0,
        options_r: [],
        options_e: [],
        type_r: [],
        type_e: [],
        properties: [],
        caseCauses: [],
        baseInstance: null,
        radius: {
          x: 400,
          y: 400,
          z: 400
        },//3D 球的半径
        dtr: Math.PI / 180,
        d: 600,
        mcList: [],
        active: false,
        lasta: 1,
        lastb: 1,
        distr: true,
        tspeed: 20,//文字移动速度
        size: 250,
        mouseX: 0,
        mouseY: 0,
        howElliptical: 1,
        aA: null,
        oDiv: null,
        sa: null,
        ca: null,
        sb: null,
        cb: null,
        sc: null,
        cc: null,
        intervalId: null
      }
    },
    mounted(){
      this.baseInstance = axios.create({
        timeout: 1000000,
        baseURL: this.$store.state.url1 + '/api/nlp/',
        params: {
          access_token: localStorage.access_token
        },
      });
      this.baseInstance.interceptors.response.use((res) => {
        // Do something with response data
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
          return Promise.reject(res);
        } else {
          if (res.config.method != 'get') {
            this.$message({
              message: '操作已保存',
              type: 'success'
            });
          }
          return res;
        }
      }, function (error) {
        // Do something with response error
        return Promise.reject(error);
      });
      this.loadTypes();
      this.loadProperties();
      this.loadCaseCause();

    },
    methods: {
      click(){
//        var a = this.animator(1, {left: 140, top: 90, width: 20, height: 10, duration: 500})
//        var a = this.animator(2, {left: 40, top: 10, width: 20, height: 10, duration: 500})
//        var a = this.animator(3, {left: 270, top: 250, duration: 500})
        /*
         a = new animator(4, { left: 160, top: 250, duration: 500}	)
         a = new animator(5, { width: 10, height: 10, duration: 500}	)
         a = new animator(6, { left: 40, top: 300, duration: 500}	)

         a = new animator(7, { left: 270, top: 50, duration: 500}	)
         a = new animator(8, { left: 160, top: 50, duration: 500}	)
         a = new animator(9, { left: 50, top: 250, duration: 500}	)
         */
        this.start();
      },
      loadProperties(){
        this.baseInstance.get('/label/property')
          .then((res) => {
            this.properties = res.data.data;
          });
      },
      loadCaseCause(){
        this.baseInstance.get('/knowledge/cause/type')
          .then((res) => {
            this.caseCauses = res.data.data;
          });
      },
      loadTypes(){
        this.baseInstance.get('/knowledge/relation/type')
          .then((res) => {
            this.type_r = res.data.data;
          });
        this.baseInstance.get('/knowledge/entity/type')
          .then((res) => {
            this.type_e = res.data.data;
          });
      },
      init(){
        var $this = this;
        this.$nextTick(() => {
          var $ = go.GraphObject.make;
          this.myDiagram =
            $(go.Diagram, 'myDiagram',  // must name or refer to the DIV HTML element
              {
                // an initial automatic zoom-to-fit
                initialAutoScale: go.Diagram.Uniform,
                // start everything in the middle of the viewport
                initialContentAlignment: go.Spot.Center,
                // have mouse wheel events zoom in and out instead of scroll up and down
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                allowDelete: false,
                "animationManager.isEnabled": false,
                // support double-click in background creating a new node
//                "clickCreatingTool.archetypeNodeData": {text: "new node"},
                // enable undo & redo
                "undoManager.isEnabled": false,
//                maxSelectionCount: 1,
//                layout: $(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
//                  {defaultSpringLength: 30, defaultElectricalCharge: 100}),
                "toolManager.hoverDelay": 200,
                // do an extra layout at the end of a move
//                "SelectionMoved": function (e) {
//                  if (!$this.editable) {
//                    e.diagram.layout.invalidateLayout();
//                  }
//                }
              });


          this.myDiagram.nodeTemplate =
            $(go.Node, "Auto", {width: 50, height: 50},
              new go.Binding("location", "loc"),
              $(go.Picture, "/static/3d.png", {
                desiredSize: new go.Size(50, 50)
              }),
              {
                mouseEnter: function (e, node) {
                  if ($this.intervalId != null) {
                    clearInterval($this.intervalId);
                  }
                },
                mouseLeave: function (e, node) {
                  if ($this.intervalId != null) {
                    $this.intervalId = setInterval($this.update, 2)
                  }
                }
              },
              // define the node's outer shape, which will surround the TextBlock
              $(go.Shape, "Circle",
                {
                  parameter1: 20,  // the corner has a large radius
                  stretch: go.GraphObject.Fill,
                  fill: 'transparent',
                  stroke: "rgb(92,168,219)",
                  strokeWidth: 2,
                  portId: "",  // this Shape is the Node's port, not the whole Node
                  fromLinkable: false, fromLinkableSelfNode: false,
                  toLinkable: false, toLinkableSelfNode: false,
                  cursor: "pointer"
                },
              ),
              $(go.TextBlock,
                {
                  font: "9pt helvetica, arial, sans-serif",
                  editable: false,  // editing the text automatically updates the model data
                  stroke: "rgb(255,255,255)",
                },
                new go.Binding("text", "text", function (text) {
                  return text.length > 4 ? (text.substring(0, 4) + '...') : text;
                }).makeTwoWay())
            );
          this.myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
              {
                curve: go.Link.Bezier, adjusting: go.Link.Stretch,
                reshapable: true, relinkableFrom: false, relinkableTo: false,
                toShortLength: 3
              },
              $(go.Shape,  // the link shape
                {
                  strokeWidth: 1.5,
                  stroke: "rgb(165,171,182)"
                }),
              $(go.Shape,  // the arrowhead
                new go.Binding("to").makeTwoWay(),
                {
                  toArrow: "standard",
                  stroke: "rgb(165,171,182)", fill: "rgb(165,171,182)"
                }),
              $(go.Panel, "Auto",
                $(go.TextBlock, "",  // the label text
                  {
                    textAlign: "center",
                    font: "9pt helvetica, arial, sans-serif",
                    margin: 4,
                    stroke: "rgb(165,171,182)",
                    editable: false  // enable in-place editing
                  },
                  // editing the text automatically updates the model data
                  new go.Binding("text").makeTwoWay())
              )
            );

          this.myDiagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);


          // Function to provide animation for gojs nodes.
        })
      },
      search(){
        var _this = this;
        this.nodeDataArray.length = 0;
        this.linkDataArray.length = 0;
        this.divs = [];


        this.baseInstance.get('/label/chain/list?case_cause&page=1&page_size=300&pager_flag=true&key_word=' + JSON.stringify(this.keywords))
          .then((res) => {
              for (var key in res.data.data) {
                var elem = res.data.data[key].knowledge_linked;
                for (var index = 0; index < elem.length; index++) {
                  var obj = elem[index];
                  if (obj.colloquial) {
                    obj.colloquial = obj.colloquial.join(',');
                  }
                  if (obj.synonyms) {
                    obj.synonyms = obj.synonyms.join(',');
                  }
                  if (index % 2 === 0) {
                    obj.category = 'entity';
                    var hasExist = false;
                    for (var i = 0; i < this.nodeDataArray.length; i++) {
                      if (this.nodeDataArray[i].key === obj._id) {
                        if (index === 0 || index === elem.length - 1) {
                          //头尾节点换个色
                          this.nodeDataArray.splice(i, 1, Object.assign({color: 'rgb(222,155,249)'}, this.nodeDataArray[i]));
                        }
                        hasExist = true;
                      }
                    }
                    if (!hasExist) {
                      if (index === 0 || index === elem.length - 1) {
                        //头尾节点换个色
                        this.nodeDataArray.push({
                          key: obj._id,
                          text: obj.name,
                          params: obj,
                          color: 'rgb(222,155,249)'
                        });
                      } else {
                        this.nodeDataArray.push({
                          key: obj._id,
                          text: obj.name,
                          params: obj,
                        });
                      }
                    }
                  } else {
                    obj.category = 'relation';
                    var hasExist = false;
                    for (var i in this.linkDataArray) {
                      var link = this.linkDataArray[i];
                      if (link.text === obj.name && link.from == elem[index - 1]._id && link.to == elem[index + 1]._id) {
                        hasExist = true;
                      }
                    }
                    if (!hasExist) {
                      this.linkDataArray.push({
                        from: elem[index - 1]._id,
                        to: elem[index + 1]._id,
                        text: obj.name,
                        key: obj._id,
                        params: obj,
                      });
                    }
                  }
                }

              }
              this.linkDataArray = []
              this.init();
            }
          );
      },
      remoteOptions(query){
        if (query !== '') {
          this.loading.search = true;
          let options = [];
          const params = {
            name: query,
            case_cause: '',
          };
          Promise.all([this.baseInstance.get('/label/entity/list', {params: params}), this.baseInstance.get('/label/relation/list', {params: params})])
            .then((res) => {
              this.loading.search = false;
              this.searchOptions = [];
              res.filter((row, index) => {
                let label = index == 0 ? '实体名称' : '关系名称';
                if (row.data.data.length) {
                  options = row.data.data.map(item => item.name);
                  this.searchOptions.push({
                    label: label,
                    options: $.unique(options).map(option => {
                      return {value: option, label: option}
                    })
                  })
                }
              })
            });
        } else {
          this.searchOptions = [];
        }
      },
      animator (part, a) {
        this.animateItem = function (part, a) {


          if (part) { // if we have a part to animate...
            var b = {}

            // Pre-process the given list of changes - allows simple left/top/width/height params to be parsed into lcoation and size.
            // Example { left: 10, top: 20, width: 40, height: 99}

            if (a.left || a.top) { // only if we have location params
              b.location = {}
              if (a.left) {
                b.location.x = a.left
              }
              if (a.top) {
                b.location.y = a.top
              }
            }

            if (a.width || a.height) { // only if we have size params
              b.size = {}
              if (a.width) {
                b.size.width = a.width
              }
              if (a.height) {
                b.size.height = a.height
              }
            }

            if (a.opacity) {
              b.opacity = a.opacity
            }

            b.duration = a.duration
            a = b

            if (a.location) {
              if (a.location.x) {
                this.animCalc(a, a.location, part.location.x, a.location.x, 'x', a.duration)
              }
              if (a.location.y) {
                this.animCalc(a, a.location, part.location.y, a.location.y, 'y', a.duration)
              }
            }

            if (a.size) {
              if (a.size.width) {
                this.animCalc(a, a.size, part.desiredSize.width, a.size.width, 'width', a.duration)
              }
              if (a.size.height) {
                this.animCalc(a, a.size, part.desiredSize.height, a.size.height, 'height', a.duration)
              }
            }


            // Set off the animation, collecting a handle to the function so that we can kill it later.
//            var t = setInterval(
//              function () {

            part.diagram.startTransaction("Animate"); // wrap this in a transaciton
            if (a.location && a.location.go) {
              var pos = part.location.copy();
              if (a.location.x) {
                a.location.xCur = a.location.xCur + a.location.xStep
                a.location.xCur = (a.location.xCur < 0 ? 0 : a.location.xCur)
                pos.x = parseInt(a.location.xCur)
              }
              if (a.location.y) {
                a.location.yCur = a.location.yCur + a.location.yStep
                a.location.yCur = (a.location.yCur < 0 ? 0 : a.location.yCur)
                pos.y = parseInt(a.location.yCur)
              }

              part.location = pos;
            }

            if (a.size && a.size.go) {
              var sz = part.desiredSize.copy();
              if (a.size.width) {
                a.size.widthCur = a.size.widthCur + a.size.widthStep
                a.size.widthCur = (a.size.widthCur < 0 ? 0 : a.size.widthCur)
                sz.width = parseInt(a.size.widthCur)
              }
              if (a.size.height) {
                a.size.heightCur = a.size.heightCur + a.size.heightStep
                a.size.heightCur = (a.size.heightCur < 0 ? 0 : a.size.heightCur)
                sz.height = parseInt(a.size.heightCur)
              }

              part.desiredSize = sz;
            }
            if (a.opacity) {
              if (a.opacity > 1) {
                a.opacity = 1;
              }
              if (a.opacity < 0) {
                a.opacity = 0;
              }

              if (a.opacity < 0.1) {
                part.visible = false;
              } else {
                part.visible = true;
              }
//              if (a.opacity < 0.9) {
//                var it = part.findLinksConnected();
//                while (it.next()) {
//                  var child = it.value;
//                  console.log(child)
//                  child.visible = false;
//                }
//              }
              part.opacity = a.opacity;
            }
//                part.diagram.commitTransaction("Animate");

//            a.cnt = a.cnt + 1

//                checkStop(a.steps, a.cnt)	// check if it's time to stop.

//              },
//              2000 // using 20 milliseconds seems to keep things smooth
//            )

            //  function to check if it is time to stop the loop
//            var checkStop = function (max, cnt) {
//
////              if (cnt >= max) {
////                clearInterval(t)
////              }
//              if (cnt >= 1) {
//                clearInterval(t)
//              }
//            }

          }
        }

// calculate the animation steps. This algorithm could be extended to set up an array of step values and so allow for
// use of easing functions.
        this.animCalc = function (ctrl, a, from, to, tag, dur) {
          a.go = false // used as a catch-all go-no-go control.
          dur = (dur === undefined ? 0 : dur) // make sure we have a duration
          if (dur >= 0) {
            a[tag + 'Cur'] = from
            a.dist = to - from
            ctrl.steps = parseInt(dur / 20)
            a[tag + 'Step'] = a.dist / ctrl.steps
            ctrl.cnt = 0
            a.go = true
          }
        }

        this.animateItem(part, a)
      },

      start(){
        var i = 0
        var oTag = null

        this.oDiv = this.$refs.wordCloud;
        this.aA = [];
        this.nodeDataArray.forEach((data) => {

          var part = this.myDiagram.findNodeForKey(data.key);
          this.aA.push(part);
        });
        var $this = this;

        for (i = 0; i < this.aA.length; i++) {
          oTag = {}
          console.log(this.aA[i])
          oTag.offsetWidth = this.aA[i].desiredSize.width
          oTag.offsetHeight = this.aA[i].desiredSize.height
          this.mcList.push(oTag)
        }

        this.sineCosine(0, 0, 0)

        this.positionAll()

        this.oDiv.onmouseover = function () {
          $this.active = true
        }

        this.oDiv.onmouseout = function () {
//          $this.active = false
        }

        this.oDiv.onmousemove = function (ev) {
          var oEvent = window.event || ev
          $this.mouseX = oEvent.clientX - ($this.oDiv.offsetLeft + $this.oDiv.offsetWidth / 2)
          $this.mouseY = oEvent.clientY - ($this.oDiv.offsetTop + $this.oDiv.offsetHeight / 2)

          $this.mouseX /= 5
          $this.mouseY /= 5
        }

        this.intervalId = setInterval(this.update, 2)
      },
      update () {
        var a
        var b

        if (this.active) {
          a = (-Math.min(Math.max(-this.mouseY, -this.size), this.size) / this.radius.x ) * this.tspeed
          b = (Math.min(Math.max(-this.mouseX, -this.size), this.size) / this.radius.y ) * this.tspeed
        }
        else {
          a = this.lasta * 0.98
          b = this.lastb * 0.98
        }

        this.lasta = a
        this.lastb = b

        if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
          return
        }

        var c = 0
        this.sineCosine(a, b, c)
        for (var j = 0; j < this.mcList.length; j++) {
          var rx1 = this.mcList[j].cx
          var ry1 = this.mcList[j].cy * this.ca + this.mcList[j].cz * (-this.sa)
          var rz1 = this.mcList[j].cy * this.sa + this.mcList[j].cz * this.ca

          var rx2 = rx1 * this.cb + rz1 * this.sb
          var ry2 = ry1
          var rz2 = rx1 * (-this.sb) + rz1 * this.cb

          var rx3 = rx2 * this.cc + ry2 * (-this.sc)
          var ry3 = rx2 * this.sc + ry2 * this.cc
          var rz3 = rz2

          this.mcList[j].cx = rx3
          this.mcList[j].cy = ry3
          this.mcList[j].cz = rz3

          var per = this.d / (this.d + rz3)

          this.mcList[j].x = (this.howElliptical * rx3 * per) - (this.howElliptical * 2)
          this.mcList[j].y = ry3 * per
          this.mcList[j].scale = per
          this.mcList[j].alpha = per

          this.mcList[j].alpha = (this.mcList[j].alpha - 0.6) * (10 / 6)
        }

        this.doPosition()
        this.depthSort()
      },
      depthSort () {
        var i = 0
        var aTmp = []

        for (i = 0; i < this.aA.length; i++) {
          aTmp.push(this.aA[i])
        }

        aTmp.sort
        (
          function (vItem1, vItem2) {
            if (vItem1.cz > vItem2.cz) {
              return -1
            }
            else if (vItem1.cz < vItem2.cz) {
              return 1
            }
            else {
              return 0
            }
          }
        )

        for (i = 0; i < aTmp.length; i++) {
          aTmp[i].zOrder = i
        }
      },
      positionAll () {
        var phi = 0
        var theta = 0
        var max = this.mcList.length
        var i = 0

        for (var i = 1; i < max + 1; i++) {
          if (this.distr) {
            phi = Math.acos(-1 + (2 * i - 1) / max)
            theta = Math.sqrt(max * Math.PI) * phi
          }
          else {
            phi = Math.random() * (Math.PI)
            theta = Math.random() * (2 * Math.PI)
          }
          this.mcList[i - 1].cx = this.radius.x * Math.cos(theta) * Math.sin(phi)
          this.mcList[i - 1].cy = this.radius.y * Math.sin(theta) * Math.sin(phi)
          this.mcList[i - 1].cz = this.radius.z * Math.cos(phi)

          this.animator(this.aA[i - 1], {
            left: this.mcList[i - 1].cx + this.oDiv.offsetWidth / 2 - this.mcList[i - 1].offsetWidth / 2,
            top: this.mcList[i - 1].cy + this.oDiv.offsetHeight / 2 - this.mcList[i - 1].offsetHeight / 2, duration: 50
          })

//          this.aA[i - 1].location.x = this.mcList[i - 1].cx + this.oDiv.offsetWidth / 2 - this.mcList[i - 1].offsetWidth / 2 + 'px'
//          this.aA[i - 1].location.y = this.mcList[i - 1].cy + this.oDiv.offsetHeight / 2 - this.mcList[i - 1].offsetHeight / 2 + 'px'
        }
      },
      doPosition () {
        var l = this.oDiv.offsetWidth / 2
        var t = this.oDiv.offsetHeight / 2
        for (var i = 0; i < this.mcList.length; i++) {
          this.animator(this.aA[i], {
            left: this.mcList[i].cx + l - this.mcList[i].offsetWidth / 2,
            top: this.mcList[i].cy + t - this.mcList[i].offsetHeight / 2, duration: 50, opacity: this.mcList[i].alpha
          })
        }
      },
      sineCosine (a, b, c) {
        this.sa = Math.sin(a * this.dtr)
        this.ca = Math.cos(a * this.dtr)
        this.sb = Math.sin(b * this.dtr)
        this.cb = Math.cos(b * this.dtr)
        this.sc = Math.sin(c * this.dtr)
        this.cc = Math.cos(c * this.dtr)
      }
    }
  }

</script>
<style lang="less" scoped>

  .search_box {
    margin-left: 550px;
    height: 55px;
    line-height: 55px;
    width: 824px;
    border: 2px solid #3F93EC;
    position: relative;
    background: #fff;
    display: flex;
    justify-content: space-between;
    .el-select {
      width: 824px;
      .el-select__input {
        font-size: 20px;
        padding-top: 10px;
      }
      > .el-input {
        .el-input__icon {
          display: none;
        }
        .el-input__inner {
          height: 100% !important;
        }
      }
      .el-select__tags {
        height: 45px;
        span {
          border: none;
          padding: 0 5px;
          span {
            height: 36px;
            font-size: 20px;
            padding-top: 7px;
          }
        }
      }
    }
    > i {
      display: inline-block;
      position: absolute;
      right: 0;
      width: 60px;
      height: 41px;
      margin: 7px 0;
      border-left: 1px solid #3f93ec;
      background: url('../../assets/search/search.png') no-repeat center;
      cursor: pointer;
    }
    .el-input {
      display: inline-block;
      height: 41px;
      line-height: 41px;
      width: 763px;
      margin: 7px 0;
      position: absolute;
      .el-input__inner {
        height: 41px;
        border: none;
        padding: 13px 16px;
        font-size: 16px;
        color: #AFAFAF;
      }
    }
  }
</style>
