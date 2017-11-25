<template>
  <div id="create">
    <transition name="slide-fade">
      <toolBar :curNode="curNode" :active="active" v-show="ToolbarShow" @drag="drag" @modifyData="modifyData" @replaceData="replaceData"></toolBar>
    </transition>
    <div class="Toolbar-close" id="diagramBox">
      <div class="sider" v-if="editable">
        <ul>
          <li>
            <el-button type="primary" @click="save" disabled="">保存</el-button>
          </li>
          <li>
            <el-button @click="ToolbarShow = !ToolbarShow" v-text="ToolbarShow?'收起':'工具'"></el-button>
          </li>
        </ul>
      </div>
      <div id="main" v-for="(div,index) in divs">
        <div :id="div" class="dropzone"></div>
        <div :id="div+'-overview'" style="background-color:whitesmoke;border: 1px grey solid;width: 20%; height: 20%;position: absolute;bottom:0px;right: 0;
   z-index: 100;"></div>
      </div>
      <!--<hotBox :hotBoxShow="hotBoxShow" :selectedLoc="selectedLoc" @cmdHandler="cmdHandler"></hotBox>-->
    </div>
  </div>
</template>

<script>
  import go from 'gojs'
  import Toolbar from './Toolbar'
  import HotBox from './HotBox'
  import axios from 'axios'
  export default{
    components: {
      'toolBar': Toolbar,
      'hotBox': HotBox
    },
    props: {
      list: Array,
      visible: Boolean,
      editable: Boolean
    },
    data(){
      return {
        myDiagram: {},
        myOverviewDiv: {},
        divs: [],
        ToolbarShow: false,
        hotBoxShow: false,
        nodeDataArray: [],
        linkDataArray: [],
        curNode: {},
        draggedObj: {
          key: '',
          text: '',
          params: {}
        },
        active: {
          activeName: '0',
          activeTabName: '0',
        },
        newChain: [],
        selectedLoc: {},
        selectedNodes: [],
        baseInstance: null,
        tagInstance: null
      }
    },
    mounted(){
      this.baseInstance = axios.create({
        timeout: 100000,
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
      this.tagInstance = axios.create({
        timeout: 100000,
        baseURL: this.$store.state.TagUrl + '/api/',
        params: {
          access_token: localStorage.access_token
        },
      });
      this.tagInstance.interceptors.response.use((res) => {
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
      this.initListData();
      this.init();
    },
    methods: {
      initListData(){
        if (this.list) {
          this.nodeDataArray.length = 0;

          this.linkDataArray.length = 0;
          this.newChain.length = 0;
          this.list.forEach((item, index) => {
            this.newChain.push(item);
            console.log(11, item.params.category)

            if ((item.params.category == 'entity') || (item.params.category == 'tag')) {
              this.nodeDataArray.push(item);
            } else {
              this.linkDataArray.push(item);
            }
          });
          console.log(11, this.linkDataArray, this.nodeDataArray)
        }
      },
      // highlight stationary nodes during an external drag-and-drop into a Diagram
      highlight(node) {  // may be null
        var oldskips = this.myDiagram.skipsUndoManager;
        this.myDiagram.skipsUndoManager = true;
        this.myDiagram.startTransaction("highlight");
        if (node !== null) {
          this.myDiagram.highlight(node);
        } else {
          this.myDiagram.clearHighlighteds();
        }
        this.myDiagram.commitTransaction("highlight");
        this.myDiagram.skipsUndoManager = oldskips;
      },

      randomKey() {
        var timestamp = Date.parse(new Date());
        return timestamp.toString();
      },

      drag(data){
        this.draggedObj = data;
      },

      modifyData(curNode){
        var node = {};
        var link = {};
        if (curNode.create_time) {
          for (var i = 0; i < this.nodeDataArray.length; i++) {
            var n = this.nodeDataArray[i];
            if (n.key == curNode._id) {
              node = n;
              this.myDiagram.startTransaction("modify node data");
              this.myDiagram.model.setDataProperty(node, "text", curNode.name);
              this.myDiagram.model.setDataProperty(node, "params", curNode);
              this.myDiagram.commitTransaction("modify node data");
            }
          }
        }
        else {
          for (var i = 0; i < this.linkDataArray.length; i++) {
            var l = this.linkDataArray[i];
            if (l.key == curNode._id) {
              link = l;
              this.myDiagram.startTransaction("modify link data");
              this.myDiagram.model.setDataProperty(link, "text", curNode.name);
              this.myDiagram.model.setDataProperty(link, "params", curNode);
              this.myDiagram.commitTransaction("modify link data");
            }
          }
        }
      },

      replaceData(replace){
        var node = {};
        var link = {};
        if (replace.create_time) {
          for (var i = 0; i < this.nodeDataArray.length; i++) {
            var n = this.nodeDataArray[i];
            if (n.key == this.curNode._id) {
              node = n;
              this.myDiagram.startTransaction("replace node data");
              this.myDiagram.model.setDataProperty(node, "text", replace.name);
              this.myDiagram.model.setDataProperty(node, "params", replace);
              this.myDiagram.commitTransaction("replace node data");
            }
          }
        }
        else {
          for (var i = 0; i < this.linkDataArray.length; i++) {
            var l = this.linkDataArray[i];
            if (l.key == this.curNode._id) {
              link = l;
              this.myDiagram.startTransaction("modify link data");
              this.myDiagram.model.setDataProperty(link, "text", replace.name);
              this.myDiagram.model.setDataProperty(link, "params", replace);
              this.myDiagram.commitTransaction("modify link data");
            }
          }
        }
      },
      //多选新建知识链
      cmdHandler(operation){
        if (operation == "新建知识链") {
          var selections = this.myDiagram.selection.pd;
          for (var item in selections) {
            this.selectedNodes.push(selections[item].value.data.params);
          }
          console.log(this.selectedNodes);
        }
      },


      getClosestNode(point){
        if (this.newChain.length > 0) {
          var target = {
            data: '',
            position: ''
          };
//          var head = this.newChain[0];
//          var tail = this.newChain[this.newChain.length - 1];
//          var headNode = this.myDiagram.findNodeForData(head).data;
//          var tailNode = this.myDiagram.findNodeForData(tail).data;
//          var headLoc = this.myDiagram.findNodeForData(head).location;
//          var tailLoc = this.myDiagram.findNodeForData(tail).location;
//          var headDistance = Math.pow((headLoc.x - point.x), 2) + Math.pow((headLoc.y - point.y), 2);
//          var tailDistance = Math.pow((tailLoc.x - point.x), 2) + Math.pow((tailLoc.y - point.y), 2);
//          if (tailDistance < headDistance) {
//            target.data = tailNode;
//            target.position = "tail";
//          } else {
//            target.data = headNode;
//            target.position = "head";
//          }
          var minDistance = Number.MAX_SAFE_INTEGER;
          this.newChain.forEach((n) => {
            if (n.params.category == 'entity' || n.params.category == 'tag') {
              var location = this.myDiagram.findNodeForData(n).location;
              var distance = Math.pow((location.x - point.x), 2) + Math.pow((location.y - point.y), 2);
              if (distance < minDistance) {
                minDistance = distance;
                target.data = this.myDiagram.findNodeForData(n).data;
              }
            }
          });
          return target;
        } else {
          return null;
        }
      },

      getNewLinkData(fromNode, toNode){
        return {
          from: fromNode.key,
          to: toNode.key,
          text: '',
          key: this.randomKey(),
          params: {
            name: "",
            colloquial: '',
            property: "",
            case_cause: "",
            category: 'relation',
            _id: this.randomKey(),
            synonyms: '',
            type: ""
          }
        };
      },

      newChainPush(link, node){
        this.newChain.push(link);
        this.newChain.push(node);
      },

      newChainSplice(link, node){
        this.newChain.splice(0, 0, link);
        this.newChain.splice(0, 0, node);
      },

      save(){
        this.curNode.synonyms = this.curNode.synonyms.split(",");
        this.curNode.colloquial = this.curNode.colloquial.split(",");
      },

      ToolbarToggle(){
        this.ToolbarShow = !this.ToolbarShow;
        /*if(this.ToolbarShow){
         $("#diagramBox").removeClass('Toolbar-close');
         $("#diagramBox").addClass('Toolbar-open');
         }
         if(!this.ToolbarShow){
         $("#diagramBox").removeClass('Toolbar-open');
         $("#diagramBox").addClass('Toolbar-close');
         }    */
      },
      shotCut () {
        var e = this.myDiagram.lastInput;
        var cmd = this.myDiagram.commandHandler;
        switch (e.key.charCodeAt()) {
          case 68:
          case 66:
            //删除
            this.newChain.forEach((n, i) => {
              if (n.key == this.curNode._id) {
                this.newChain.splice(i, 1);
              }
            });
            go.CommandHandler.prototype.doKeyDown.call(cmd);
            break;
          case 13:
            //回车
            break;
          default:
            go.CommandHandler.prototype.doKeyDown.call(cmd);
            break;
        }
      },
      init(){
        var div = "list-div" + this.divs.length.toString();
        this.divs.push(div);
        this.$nextTick(() => {
          var $ = go.GraphObject.make;  // for conciseness in defining templates
          this.myDiagram =
            $(go.Diagram, div,  // must name or refer to the DIV HTML element
              {
                // an initial automatic zoom-to-fit
                initialAutoScale: go.Diagram.Uniform,
                // start everything in the middle of the viewport
                initialContentAlignment: go.Spot.Center,
                // have mouse wheel events zoom in and out instead of scroll up and down
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                allowDelete: true,
                // support double-click in background creating a new node
//                "clickCreatingTool.archetypeNodeData": {text: "new node"},
                // enable undo & redo
                "undoManager.isEnabled": true,
//                maxSelectionCount: 1,
                layout: $(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
                  {defaultSpringLength: 30, defaultElectricalCharge: 100}),
                "toolManager.hoverDelay": 200,
                // do an extra layout at the end of a move
                "SelectionMoved": function (e) {
                  e.diagram.layout.invalidateLayout();
                }
              });

          var $this = this;
          // define the Node template
//          this.myDiagram.toolManager.dragSelectingTool.isEnabled = false;
          this.myDiagram.addDiagramListener("ObjectSingleClicked", function (e) {
            var data = {};
            if (e.subject.from) {
              data = {startId: e.subject.from, endId: e.subject.to};
            }
            $this.curNode = Object.assign(data, e.subject.params);
          });
          this.myDiagram.addDiagramListener("BackgroundSingleClicked", function (e) {
            $this.nodeDataArray.forEach(({key}) => {
              var node = $this.myDiagram.findNodeForKey(key);
              node.opacity = 1;
            });

            $this.linkDataArray.forEach((data) => {
              var link = $this.myDiagram.findLinkForData(data);
              link.opacity = 1;
            });
          });
          //close the mouse right click menu
          this.myDiagram.addDiagramListener("ChangedSelection", function () {
            // console.log($this.myDiagram.selection);
            $this.selections = [];
            $this.myDiagram.nodes.each((node) => {
              node.opacity = 0.1;
            });
            $this.myDiagram.links.each((link) => {
              link.opacity = 0.1;
            });
            $this.myDiagram.selection.each((s) => {
              $this.selections.push(s.data);
              var part = $this.myDiagram.findNodeForKey(s.data.key);
              if (part != null) {
                var nodes = part.findNodesConnected();
                while (nodes.next()) {
                  var child = nodes.value;
                  child.opacity = 1;
                }
                var links = part.findLinksConnected();
                while (links.next()) {
                  var child = links.value;
                  child.opacity = 1;
                }
                part.opacity = 1;
              }
            });
          });
          this.myDiagram.commandHandler.doKeyDown = this.shotCut;
          // define the Node template
          var temColor = '';
          // define the Node template
          this.myDiagram.nodeTemplate =
            $(go.Node, "Auto", {zOrder: 200},
//              {resizable: true},
              {
                mouseEnter: function (e, node) {
                  node.elt(0).strokeWidth = 0;
                  temColor = node.elt(0).fill;
                  node.elt(0).fill = "rgb(109,206,158)";
                },
                mouseLeave: function (e, node) {
                  node.elt(0).strokeWidth = 2
                  node.elt(0).fill = temColor;
                }
              },
              // define the node's outer shape, which will surround the TextBlock
              $(go.Shape, new go.Binding("figure", "params", function (params) {
                  if (params.category == 'tag') {
                    return 'RoundedRectangle';
                  } else {
                    return 'Circle';
                  }
                }),
                new go.Binding("fill", "color"),
                {
                  parameter1: 20,  // the corner has a large radius
                  stretch: go.GraphObject.Fill,
                  minSize: new go.Size(85, 85),
                  maxSize: new go.Size(85, 85),
                  fill: $(go.Brush, "Radial", {0: "rgb(104,189,246)", 1: "rgb(104,189,246)"}),
                  stroke: "rgb(92,168,219)",
                  strokeWidth: 2,
                  portId: "",  // this Shape is the Node's port, not the whole Node
//                  fromLinkable: false, fromLinkableSelfNode: false,
//                  toLinkable: false, toLinkableSelfNode: false,
                  fromLinkable: $this.editable, fromLinkableSelfNode: $this.editable,
                  toLinkable: $this.editable, toLinkableSelfNode: $this.editable,
                  cursor: "pointer"
                },
                new go.Binding("text").makeTwoWay(),
                new go.Binding("params").makeTwoWay(),
              ),
              $(go.TextBlock,
                {
                  font: "9pt helvetica, arial, sans-serif",
                  editable: false,  // editing the text automatically updates the model data
                  stroke: "rgb(255,255,255)",
                },
                new go.Binding("text", "text", function (text) {
                  return text.length > 4 ? (text.substring(0, 4) + '...') : text;
                }).makeTwoWay(),
                new go.Binding("params").makeTwoWay())
            );

          // unlike the normal selection Adornment, this one includes a Button
//          this.myDiagram.nodeTemplate.selectionAdornmentTemplate =
//            $(go.Adornment, "Spot",
//              $(go.Panel, "Auto",
//                $(go.Shape, {fill: null, stroke: "rgb(92,168,219)", strokeWidth: 2}),
//                $(go.Placeholder)  // a Placeholder sizes itself to the selected Node
//              ),
//              // the button to create a "next" node, at the top-right corner
//              $("Button",
//                {
//                  alignment: go.Spot.TopRight,
//                  click: addNode
//                },
//                $(go.Shape, "PlusLine", {width: 6, height: 6})
//              ), // end button
//            ); // end Adornment

          this.myDiagram.nodeTemplate.toolTip =
            $(go.Adornment, "Auto",
              $(go.Shape, {fill: "#f5f5f5"}),
              $(go.TextBlock, {
                  margin: 4,
                  font: "11pt helvetica, arial, sans-serif"
                },
                new go.Binding("text", "params", nodeInfo))
            );
          // replace the default Link template in the linkTemplateMap
          this.myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
//              {contextMenu: myContextMenu},
              {zOrder: 0},
              {
                mouseEnter: function (e, node) {
                  node.elt(0).strokeWidth = 3;
                  node.elt(0).stroke = "rgb(109,206,158)";
                  node.elt(1).stroke = "rgb(109,206,158)";
                  node.elt(1).fill = "rgb(109,206,158)";
                  node.elt(2).elt(1).stroke = "rgb(109,206,158)";
                },
                mouseLeave: function (e, node) {
                  node.elt(0).strokeWidth = 1.5;
                  node.elt(0).stroke = "rgb(165,171,182)";
                  node.elt(1).stroke = "rgb(165,171,182)";
                  node.elt(1).fill = "rgb(165,171,182)";
                  node.elt(2).elt(1).stroke = "rgb(165,171,182)";
                }
              },
              {
                curve: go.Link.Bezier, adjusting: go.Link.Stretch,
//                reshapable: true, relinkableFrom: false, relinkableTo: false,
                toShortLength: 3
              },
//              new go.Binding("points").makeTwoWay(),
              new go.Binding("curviness"),
              $(go.Shape,  // the link shape
                new go.Binding("params").makeTwoWay(),
                new go.Binding("from").makeTwoWay(),
                new go.Binding("to").makeTwoWay(),
                {
                  strokeWidth: 1.5,
                  stroke: "rgb(165,171,182)"
                }),
              $(go.Shape,  // the arrowhead
                {
                  toArrow: "standard",
                  stroke: "rgb(165,171,182)", fill: "rgb(165,171,182)"
                }),
              $(go.Panel, "Auto",
                $(go.Shape,  // the label background, which becomes transparent around the edges
                  {
                    fill: $(go.Brush, "Radial",
                      {0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)"}),
                    stroke: null
                  }),
                $(go.TextBlock, "",  // the label text
                  {
                    textAlign: "center",
                    font: "9pt helvetica, arial, sans-serif",
                    margin: 4,
                    stroke: "rgb(165,171,182)",
                    editable: false  // enable in-place editing
                  },
                  // editing the text automatically updates the model data
                  new go.Binding("params").makeTwoWay(),
                  new go.Binding("from").makeTwoWay(),
                  new go.Binding("to").makeTwoWay(),
                  new go.Binding("text").makeTwoWay())
              )
            );

          function nodeInfo(params) {
            var info = "名称:" + params.name;
            if (params.type_name) {
              info += "\n" + "类型:" + params.type_name;
            }
            if (params.case_cause_name) {
              info += "\n" + "案由:" + params.case_cause_name;
            }
            if (params.property_name) {
              info += "\n" + "属性:" + params.property_name;
            }
            return info;
          }

          function addNode(e, obj) {
            var adornment = obj.part;
            $this.fromNode = adornment.adornedPart.data.params;
            $this.nodeDataArray.forEach((node) => {
              if (node.text === $this.fromNode.name) {
                $this.nodeIndex = $this.nodeDataArray.indexOf(node);
              }
            });
            var position = $this.getPosition($this.fromNode._id);
            $this.shouldAddShow = (position.isHead || position.isTail) && $this.editable;
            if ($this.shouldAddShow === false) {
              if ($this.editable) {
                $this.$message({
                  type: 'warning',
                  message: '只能操作紫色节点'
                });
              } else {
                $this.$message({
                  type: 'warning',
                  message: '请进入编辑模式进行修改'
                });
              }
            }
            $this.newRelation.case_cause = $this.fromNode.case_cause;
            $this.nodeChainList = $this.getChainListContainsTarget($this.fromNode._id, true)
          }

          this.myDiagram.addDiagramListener("ObjectDoubleClicked", function (e) {
            if (e.subject.params.category == 'relation') {
              return;
            }
            var params = {};
            var url = '';
            var instance = null;
            switch (e.subject.params.category) {
              case 'entity':
                url = "label/three_tuple"
                params = {ent_id: e.subject.params._id};
                instance = $this.baseInstance;
                break;
              case 'tag':
                url = "tag/three_tuple"
                params = {tag_id: e.subject.params._id}
                instance = $this.tagInstance;
                break;
              default:
                break;
            }
            instance.get(url, {params: params}).then((res) => {
              var triples = res.data.data;
              $this.myDiagram.startTransaction("add State");
              triples.forEach((triple) => {
                if (triple.length === 3) {
                  var model = $this.myDiagram.model;
                  var obj = triple[0];
                  if (triple[0]._id === e.subject.params._id) {
                    obj = triple[2];
                  }
                  var linkdata = {
                    from: triple[0]._id,  // or just: fromData.id
                    to: triple[2]._id,
                    key: triple[1]._id,
                    text: triple[1].name,
                    params: triple[1]
                  };
                  if (obj.colloquial) {
                    obj.colloquial = obj.colloquial.join(',');
                  }
                  if (obj.synonyms) {
                    obj.synonyms = obj.synonyms.join(',');
                  }
                  obj.category = e.subject.params.category;
                  var hasExist = false;
                  for (var i = 0; i < $this.nodeDataArray.length; i++) {
                    if ($this.nodeDataArray[i].key === obj._id) {
                      hasExist = true;
                      $this.myDiagram.findNodeForKey(obj._id).opacity = 1;
                    }
                  }
                  if (!hasExist) {
                    // and add the link data to the model
                    model.addNodeData({
                      key: obj._id,
                      text: obj.name,
                      params: obj,
                    })
                    console.log('addNode')
                  }

                  hasExist = false;
                  for (var i = 0; i < $this.linkDataArray.length; i++) {
                    if ($this.linkDataArray[i].from === linkdata.from && $this.linkDataArray[i].to === linkdata.to && $this.linkDataArray[i].text === linkdata.text) {
                      hasExist = true;
                      $this.myDiagram.findLinkForData($this.linkDataArray[i]).opacity = 1;
                    }
                  }
                  if (!hasExist) {
                    model.addLinkData(linkdata);
                    console.log("addLink")
                  }
                }
              });
              $this.myDiagram.commitTransaction("add State");
            })
          });

          if ($this.editable) {
            this.myDiagram.addDiagramListener("BackgroundDoubleClicked", function (e) {
              var mx = event.clientX;
              var my = event.clientY;
              var point = $this.myDiagram.transformViewToDoc(new go.Point(mx, my));
              var newNodeData = {
                key: $this.randomKey(),
                text: "new",
                params: {
                  create_time: $this.randomKey(),
                  name: "new",
                  colloquial: '',
                  property: "",
                  category: 'entity',
                  version: 1.1,
                  case_cause: "",
                  _id: $this.randomKey(),
                  synonyms: '',
                  type: "",
                }
              };
              newNodeData.location = point;
              var target = $this.getClosestNode(point);
              var newLinkData = {};
              if (target) {
                var targetNode = target.data;
                newLinkData = $this.getNewLinkData(newNodeData, targetNode);
                $this.newChainSplice(newLinkData, newNodeData);
                $this.myDiagram.startTransaction('new node');
                $this.myDiagram.model.addNodeData(newNodeData);
                $this.myDiagram.model.addLinkData(newLinkData);
              } else {
                $this.myDiagram.startTransaction('first node');
                $this.myDiagram.model.addNodeData(newNodeData);
                $this.newChain.push(newNodeData);
                console.log("first node");
              }
              // select the new Node
              var newnode = $this.myDiagram.findNodeForData(newNodeData);
              $this.myDiagram.select(newnode);
              $this.active = {
                activeName: '0',
                activeTabName: '0'
              };
              $this.myDiagram.model.setDataProperty(newNodeData, 'color', 'rgb(222,155,249)');
              $this.myDiagram.commitTransaction('new node');
            });
            this.myDiagram.commandHandler.doKeyDown = this.shotCut;
          }

          this.myDiagram.model = new go.GraphLinksModel(this.nodeDataArray, this.linkDataArray);
          // Overview
          this.myOverview =
            $(go.Overview, div + '-overview',  // the HTML DIV element for the Overview
              {observed: this.myDiagram, contentAlignment: go.Spot.Center});   // tell it which Diagram to show and pan


          if ($this.editable) {
            var canvas = document.getElementById(div);

            // This event resets styles after a drag has completed (successfully or not)
            document.addEventListener("dragend", function (event) {
              // reset the border of the dragged element
              $this.highlight(null);
              console.log("dragend");
            }, false);

            canvas.addEventListener("dragenter", function (event) {
              // Here you could also set effects on the Diagram,
              // such as changing the background color to indicate an acceptable drop zone

              // Requirement in some browsers, such as Internet Explorer
              event.preventDefault();
              console.log("dragenter");
            }, false);

            canvas.addEventListener("dragover", function (event) {
              // We call preventDefault to allow a drop
              // But on divs that already contain an element,
              // we want to disallow dropping
              if (this === $this.myDiagram.div) {
                var can = event.target;
                var pixelratio = window.devicePixelRatio;

                // if the target is not the canvas, we may have trouble, so just quit:
                if (!(can instanceof HTMLCanvasElement)) return;

                var bbox = can.getBoundingClientRect();
                var bbw = bbox.width;
                if (bbw === 0) bbw = 0.001;
                var bbh = bbox.height;
                if (bbh === 0) bbh = 0.001;
                var mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw);
                var my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh);
                var point = $this.myDiagram.transformViewToDoc(new go.Point(mx, my));
                var curnode = $this.myDiagram.findPartAt(point, true);
                if (curnode instanceof go.Node) {
                  $this.highlight(curnode);
                } else {
                  $this.highlight(null);
                }
              }

              if (event.target.className === "dropzone") {
                // Disallow a drop by returning before a call to preventDefault:
                return;
              }

              // Allow a drop on everything else
              event.preventDefault();
              console.log("dragover");
            }, false);

            canvas.addEventListener("dragleave", function (event) {
              // reset background of potential drop target
              if (event.target.className == "dropzone") {
                event.target.style.background = "";
              }
              $this.highlight(null);
              console.log("dragleave");
            }, false);

            canvas.addEventListener("drop", function (event) {
              // prevent default action
              // (open as link for some elements in some browsers)
              event.preventDefault();

              // Dragging onto a Diagram
              if (this === $this.myDiagram.div) {
                var can = event.target;
                var pixelratio = window.devicePixelRatio;

                // if the target is not the canvas, we may have trouble, so just quit:
                if (!(can instanceof HTMLCanvasElement)) return;

                var bbox = can.getBoundingClientRect();
                var bbw = bbox.width;
                if (bbw === 0) bbw = 0.001;
                var bbh = bbox.height;
                if (bbh === 0) bbh = 0.001;
                var mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw);
                var my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh);
                var point = $this.myDiagram.transformViewToDoc(new go.Point(mx, my));
                var newNodeData = $this.draggedObj;
                newNodeData.location = point;

                var target = $this.getClosestNode(point);
                var newLinkData = {};
                if (target) {
                  var targetNode = target.data;
                  newLinkData = $this.getNewLinkData(newNodeData, targetNode);
                  $this.newChainSplice(newLinkData, newNodeData);
                  $this.myDiagram.startTransaction('new node');
                  $this.myDiagram.model.addNodeData(newNodeData);
                  $this.myDiagram.model.addLinkData(newLinkData);
                  //select the new link
                  var newLink = $this.myDiagram.findLinkForData(newLinkData);
                  $this.myDiagram.select(newLink);
                  $this.active = {
                    activeName: '0',
                    activeTabName: '1'
                  };
                } else {
                  $this.myDiagram.startTransaction('first node');
                  $this.myDiagram.model.addNodeData(newNodeData);
                  //select the new node
                  var newNode = $this.myDiagram.findNodeForData(newNodeData);
                  console.log("first node");
                  $this.myDiagram.select(newNode);
                  $this.active = {
                    activeName: '0',
                    activeTabName: '0'
                  };
                  $this.newChain.push(newNodeData);
                }
                $this.myDiagram.model.setDataProperty(newNodeData, 'color', 'rgb(222,155,249)');
                $this.myDiagram.commitTransaction('new node');
              }

              // If we were using drag data, we could get it here, ie:
              // var data = event.dataTransfer.getData('text');
              console.log("drop");
            }, false);
          }

        });
        // This variation on ForceDirectedLayout does not move any selected Nodes
        // but does move all other nodes (vertexes).
        function ContinuousForceDirectedLayout() {
          go.ForceDirectedLayout.call(this);
          this._isObserving = false;
        }

        go.Diagram.inherit(ContinuousForceDirectedLayout, go.ForceDirectedLayout);

        /** @override */
        ContinuousForceDirectedLayout.prototype.isFixed = function (v) {
          return v.node.isSelected;
        };

        // optimization: reuse the ForceDirectedNetwork rather than re-create it each time
        /** @override */
        ContinuousForceDirectedLayout.prototype.doLayout = function (coll) {
          if (!this._isObserving) {
            this._isObserving = true;
            // cacheing the network means we need to recreate it if nodes or links have been added or removed or relinked,
            // so we need to track structural model changes to discard the saved network.
            var lay = this;
            this.diagram.addModelChangedListener(function (e) {
              // modelChanges include a few cases that we don't actually care about, such as
              // "nodeCategory" or "linkToPortId", but we'll go ahead and recreate the network anyway.
              // Also clear the network when replacing the model.
              if (e.modelChange !== "" || (e.change === go.ChangedEvent.Transaction && e.propertyName === "StartingFirstTransaction")) {
                lay.network = null;
              }
            });
          }
          var net = this.network;
          if (net === null) {  // the first time, just create the network as normal
            this.network = net = this.makeNetwork(coll);
          } else {  // but on reuse we need to update the LayoutVertex.bounds for selected nodes
            this.diagram.nodes.each(function (n) {
              var v = net.findVertex(n);
              if (v !== null) v.bounds = n.actualBounds;
            });
          }
          // now perform the normal layout
          go.ForceDirectedLayout.prototype.doLayout.call(this, coll);
          // doLayout normally discards the LayoutNetwork by setting Layout.network to null;
          // here we remember it for next time
          this.network = net;
        }
        // end ContinuousForceDirectedLayout

      }
    },
    watch: {
      'visible'(val){
        if (val && this.list) {
          this.divs = [];
          this.$nextTick(() => {
            this.initListData();
            this.init();
          });
        }
      },
    }
  }
</script>

<style lang="less">
  #create {
    position: absolute;
    top: 5%;
    left: 0;
    right: 0;
    width: 100%;
    height: 90%;
    #diagramBox {
      position: relative;
      height: 100%;
      margin-top: 20px;
      .sider {
        position: absolute;
        z-index: 100;
        top: 0;
        right: 0;
        height: 60px;
        ul {
          list-style: none;
          font-size: 14px;
          li {
            margin-bottom: 5px;
            display: list-item;
          }
        }
      }
      .dropzone {
        position: relative;
        z-index: 5;
        height: 100%;
        width: 100%;
        top: 0;
        border: 1px solid #34A8FF;
        background-color: #F5F5F5;
      }
    }
    .Toolbar-close {
      width: 98%;
      margin-right: auto;
      margin-left: auto;
    }
    .slide-fade-enter-active {
      transition: all .3s ease;
    }
    .slide-fade-leave-active {
      transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
      transform: translateX(10px);
      opacity: 0;
    }
    /* .Toolbar-open{
      width:70%;
      margin-left:1%;
    } */
  }
</style>
