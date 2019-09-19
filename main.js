var boxId = 1;
var boxes = [];
var boxesSet = [];

var globalDraw = SVG('mainDiv');
var boxFSet = [];

var body = document.getElementById('body');
body.style.margin = '0px';
body.style.width = '100%';
body.style.height = '100%';

body.addEventListener('selectStart',selectP);

function selectP(){
    return false;
}

var mainDiv = document.getElementById('mainDiv');
mainDiv.style.width = '100%';
mainDiv.style.height = '100%';

mainAddButton = new AddButton(globalDraw);
mainRemoveButton = new RemoveButton(globalDraw);
mainSaveButton = new SaveButton(globalDraw,boxes);

open();

function open(){
    if(localStorage["userName"]){
        var data = localStorage['userName'];
        var scene = JSON.parse(data);
        var objData = scene.saveBox;
        
        var alreadyLineSet = [];
        for(var i=0;i<objData.length;i++){
            var boxData = objData[i];
            var tempLineDatas = boxData.lineDatas;
            
            var lines = [];
            
            for(var j=0;j<tempLineDatas.length;j++){
                var tempD = tempLineDatas[j];
                
                var fromBoxId = tempD.fromBoxId;
                var toBoxId = tempD.toBoxId;
                var tempLine = 0
                for(var k=0;k<alreadyLineSet.length;k++){
                    if((alreadyLineSet[k].fromBoxId==fromBoxId&&alreadyLineSet[k].toBoxId==toBoxId)&&alreadyLineSet[k].line!=0){
                        tempLine = (alreadyLineSet[k]).line;
                        alreadyLineSet[k].line = 0;
                    }
                }
                if(tempLine==0){
                    var tempLine = new Line(tempLineDatas[j],globalDraw);
                    tempLine.initialDrawLine();
                    alreadyLineSet.push({fromBoxId:fromBoxId,toBoxId:toBoxId,line:tempLine});
                }
                lines.push(tempLine);
            }
            //(boxId,draw,parentId,innerBoxesData,px,py,color,title,date,contnet,layer,lines)
            var tempBox = new Box(boxData.boxId,globalDraw,boxData.parentId,boxData.innerBoxesData,boxData.px,boxData.py,boxData.color,boxData.title,boxData.date,boxData.content,layer,lines);
            boxes.push(tempBox);
            
        }
        boxId = scene.saveBoxId;
    }
}
