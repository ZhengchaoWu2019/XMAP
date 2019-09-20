var boxF = {boxId:0};
var isDBlClicked = false;
var whichBoxAddInto = {boxId:0};
var whichBoxGoOut = {boxId:0};
var addBoxInterval = NaN;
var outBoxInterval = NaN;
var clock = 3;
var outClock = 3;
var isAddedOuterSpreadClick = false;
var newLine = 0;
var layer = {layer:1};

function Box(boxId,draw,parentId,innerBoxesData,px,py,color,title,date,content,thisLayer,lines){
    this.boxId = boxId;
    var box = this;
    this.draw = draw;
    
    var isAddedDBClick = false;
    this.downRect = [];
    this.downTitle = [];
    date = date||((new Date).toDateString());
    
    this.layer = layer.layer;
    console.log(this.layer);
    this.scale = 1;
    
    //------------------------------------------------------------------titleData
    function titleData(title){
        var rectW = 0;
        var rectH = 0;
        var tempS = title;
        
        var n = title.length;
        var m = Math.ceil(n/10);
        if(m==1){
            rectW = (n%11)*25*box.scale;
        }else{
            rectW = 250*box.scale;
        }
        
        if(m>1){
            rectH = ((m-1)*27+32)*box.scale;
            var tempSS = '';
            for(var i=0;i<m;i++){
                var tempS1 = tempS.substring(i*10,10*(i+1));
                if(tempS.length>10*(i+1)){
                    tempS1 += '\n';
                }
                tempSS += tempS1;
            }
            var tempS2 = tempS.substring(10*i);
            tempSS = tempSS + tempS2;
            tempS = tempSS;
            console.log(tempS);
        }else{
            rectH = 32*box.scale;
        }
        return [tempS,rectW,rectH];
    }
    //------------------------------------------------------------------titleData
    
    title = title||("Box"+boxId);
    this.titleD = titleData(title);
    
    this.width = this.titleD[1];
    this.height = this.titleD[2];
    
    var w = window.innerWidth;
    var h = window.innerHeight;
    var randPx = Math.ceil(Math.random()*(w-this.width*2)+this.width);
    var randPy = Math.ceil(Math.random()*(h-this.height*2)+this.height);
    var randColor = 'rgb(' + Math.ceil(Math.random()*76+180) + ',' + Math.ceil(Math.random()*76+180) + ',' + Math.ceil(Math.random()*76+180) + ')';
    
    var rectPx = px||randPx;
    var rectPy = py||randPy;
    color = color||randColor;
    
    this.lines = lines||[];
    //-----------------------------------------------------------------------data
    this.lineDatas = [];
    if(this.lines.length>1){
        for(var i=0;i<lines.length;i++){
            this.lineDatas.push(lines[i].lineData);
        }
    }else if(this.lines.length){
        this.lineDatas.push(lines[0].lineData);
    }
    
    //(boxId,parentId,innerBoxesData,px,py,color,title,data,content,lineDatas)
    this.data = new Data(this.boxId,parentId,innerBoxesData,rectPx,rectPy,color,title,date,content,this.layer,this.lineDatas);
    //-----------------------------------------------------------------------data
    
    //-------------------------------------------------------------------drawRect
    function drawRect(draw,width,height,scale){
        box.width = width;
        box.height = height;
        box.rect.remove();
        box.rect = draw.rect(box.width,box.height).move(box.data.px,box.data.py).fill(box.data.color).radius(15*scale);

        box.title.remove();
        box.title = drawTitle(draw,box,box.titleD,box.data.px,box.data.py,box.scale);
    }
    //-------------------------------------------------------------------drawRect
    
    this.rect = this.draw.rect(this.width,this.height).move(rectPx,rectPy).fill(color).radius(15);
    
    this.title = drawTitle(this.draw,box,this.titleD,rectPx,rectPy,box.scale);
    
    //-----------------------------------------------------------------drawCircle
    this.circle = 0;
    this.drawCircle = function(theBox,d,c){
        var pointX = theBox.data.px - d;
        var pointY = theBox.data.py + theBox.height/2;
        
        var dAC = c.split(',');
        var dAR = Number(dAC[0].substring(4));
        var dAG = Number(dAC[1]);
        var dAB = Number(dAC[2].substring(0,3));
        var dAColor = 'rgb(' + Math.floor((dAR+50)%128+127) + ',' + Math.floor((dAG+50)%128+127) + ',' + Math.floor((dAB+50)%128+127) + ')';
        
        return theBox.draw.circle(d*2).center(pointX,pointY).fill(dAColor);
    }
    //-----------------------------------------------------------------drawCircle
    
    this.circle = this.drawCircle(this,12.5,color);
    this.circle.on('click',addLineClick);
    
    //---------------------------------------------------------------addLineClick
    function addLineClick(e){
        console.log('addLine');
        if(newLine!=0){
            e.stopPropagation();
            addLineTo(e);
        }
    }
    //---------------------------------------------------------------addLineClick
    
    //------------------------------------------------------------------startLine
    function startLine(e){
        var d = box.circle.attr('r');
        
        var fPx = box.data.px - d;
        var fPy = box.data.py + box.height/2;
        
        var offsetX = boxFSet.length ? boxFSet[boxFSet.length - 1].data.px : 0;
        var offsetY = boxFSet.length ? boxFSet[boxFSet.length - 1].data.py : 0;
        
        console.log(offsetX,offsetY);
        
        var tPx = e.pageX - offsetX;
        var tPy = e.pageY - offsetY;

        var newLineData = new LineData(box.boxId,fPx,fPy,0,tPx,tPy,[],[]);

        newLine = new Line(newLineData,box.draw);
        
        box.lines.push(newLine);
        box.data.lineDatas.push(newLine.lineData);

        newLine.initialDrawLine();
        
        box.circle.off();
        box.circle.remove();
        box.circle = box.drawCircle(box,25,color);
        box.circle.on('click',addLineClick);

        document.addEventListener('mousemove',newLine.lineMouseMove);
    }
    //------------------------------------------------------------------startLine
    
    //--------------------------------------------------------------drawDownArrow
    this.downArrow = 0;
    this.drawDownArrow = function(theBox,d,c){
        var dA1x = theBox.data.px + theBox.width/2 - d;
        var dA2x = theBox.data.px + theBox.width/2 + d;
        var dA3x = theBox.data.px + theBox.width/2;

        var dA1y = theBox.data.py + theBox.height;
        var dA2y = theBox.data.py + theBox.height;
        var dA3y = theBox.data.py + theBox.height + d+2;

        var dAPoints = '' + dA1x + ',' + dA1y + ' ' + dA2x + ',' + dA2y + ' '+ dA3x + ',' + dA3y;

        var dAC = c.split(',');
        var dAR = Number(dAC[0].substring(4));
        var dAG = Number(dAC[1]);
        var dAB = Number(dAC[2].substring(0,3));

        var dAColor = 'rgb(' + Math.floor((dAR+50)%128) + ',' + Math.floor((dAG+50)%128) + ',' + Math.floor((dAB+50)%128) + ')';

        return theBox.draw.polygon(dAPoints).fill(dAColor);
    }
    //--------------------------------------------------------------drawDownArrow
    
    //------------------------------------------------------------drawspreadArrow
    this.spreadArrow = 0;
    this.drawSpreadArrow = function(theBox,d,c){
        var dA1x = theBox.data.px + theBox.width;
        var dA2x = theBox.data.px + theBox.width;
        var dA3x = theBox.data.px + theBox.width + d + 5;

        var dA1y = theBox.data.py + theBox.height/2 - d;
        var dA2y = theBox.data.py + theBox.height/2 + d;
        var dA3y = theBox.data.py + theBox.height/2;
        
        var dAPoints = '' + dA1x + ',' + dA1y + ' ' + dA2x + ',' + dA2y + ' '+ dA3x + ',' + dA3y;
        
        var dAC = c.split(',');
        var dAR = Number(dAC[0].substring(4));
        var dAG = Number(dAC[1]);
        var dAB = Number(dAC[2].substring(0,3));
        
        var dAColor = 'rgb(' + Math.floor((dAR+50)%128+80) + ',' + Math.floor((dAG+50)%128+80) + ',' + Math.floor((dAB+50)%128+80) + ')';
        
        return theBox.draw.polygon(dAPoints).fill(dAColor);
    }
    //------------------------------------------------------------drawspreadArrow
    
    this.bigRect = 0;
    this.bigRectDraw = 0;
    this.innerBoxes = [];
    
    //------------------------------------------------------------------drawTitle
    function drawTitle(draw,theBox,titleD,rectPx,rectPy,scale){
        var title = draw.text(titleD[0]).font({size:(20*box.scale),anchor:"middle"});
        var tPx = theBox.width/2 + rectPx;
        var tPy = rectPy + 5*box.scale;
        title.move(tPx,tPy);
        return title;
    }
    //------------------------------------------------------------------drawTitle
    
    //----------------------------------------------------------------------scale
    function scale2(box){
        if(box.scale==1){
            var px = box.data.px;
            var py = box.data.py;
            var w = box.width;
            var h = box.height;

            box.scale = 2;

            box.data.px = px-w/2;
            box.data.py = py-h/2;
            box.width = w*2;
            box.height = h*2;

            box.rect.remove();
            box.rect = box.draw.rect(box.width,box.height).move(box.data.px,box.data.py).fill(box.data.color).radius(30);

            box.title.remove();
            box.title = drawTitle(box.draw,box,box.titleD,box.data.px,box.data.py,box.scale);
        } 
    }
    
    this.scaleBack = function(){
        scale1(box)
    }
    
    function scale1(box){
        if(box.scale==2){
            var px = box.data.px;
            var py = box.data.py;
            var w = box.width;
            var h = box.height;

            box.scale = 1;

            box.data.px = px+w/4;
            box.data.py = py+h/4;
            box.width = w/2;
            box.height = h/2;
            
            box.rect.remove();
            box.rect = box.draw.rect(box.width,box.height).move(box.data.px,box.data.py).fill(box.data.color).radius(15);
            
            box.title.remove();
            box.title = drawTitle(box.draw,box,box.titleD,box.data.px,box.data.py,box.scale);
        } 
    }
    //----------------------------------------------------------------------scale
    
    //--------------------------------------------------------------outFocusClick
    this.outFocusClick = function(){
        if(newLine!=0){
            document.removeEventListener('mousemove',newLine.lineMouseMove);
            newLine.removeLine();
            box.lines.pop();
            box.data.lineDatas.pop();
            newLine = 0;
        }else{
            if(isDBlClicked){
                isDBlClicked = false;
                var thisDiv = document.getElementById((box.boxId+'Div'));
                if(box.data.parentId!=0){
                    var parentDiv = document.getElementById(box.data.parentId+"Div");
                }else{
                    var parentDiv = document.getElementById('mainDiv');
                }
                parentDiv.removeChild(thisDiv);
                delete thisDiv;
            }else{
                if(box.downRect.length){
                     if(box.lines.length){
                        box.reDrawLine();
                     }
                    for(var i=0;i<box.downRect.length;i++){
                        box.downRect[i].remove();
                        box.downTitle[i].remove();
                    }
                    box.downRect = [];
                    box.downTitle = [];
                }else{
                    boxF = {boxId:0};
                    box.rect.off();
                    box.title.off();
                    scale1(box);
                    box.rect.on('mouseover',boxMOver);
                    box.title.on('mouseover',boxMOver);

                    if(box.downArrow!=0){
                        box.downArrow.off();
                        box.downArrow.remove();
                        box.downArrow = 0;
                    }
                    if(box.spreadArrow!=0){
                        box.spreadArrow.off();
                        box.spreadArrow.remove();
                        box.spreadArrow = 0;
                    }
                    box.circle.radius(12.5);
                    box.reDrawLine();

                    box.circle.off();
                    box.circle.remove();
                    box.circle = box.drawCircle(box,12.5,color);
                    box.circle.on('click',addLineClick);

                   

                    document.removeEventListener('click',box.outFocusClick);
                    isAddedDBClick = false;
                       
                }
            }
        }
        
    }
    //--------------------------------------------------------------outFocusClick
    
    //----------------------------------------------------------------------click
    this.boxClickP = function(e){
        e.stopPropagation();
    }
    
    function boxClick(){
        boxF = box;
        console.log(boxF);
        box.rect.off('mouseup',boxMUp);
        box.title.off('mouseup',boxMUp);
        if(box.downArrow == 0){
            box.downArrow = box.drawDownArrow(box,10,color);
            box.downArrow.on('click',box.downArrowClick);
        }
        if(box.spreadArrow == 0){
            box.spreadArrow = box.drawSpreadArrow(box,10,color);
            box.spreadArrow.on('click',box.spreadArrowClick);
        }
        if(!isAddedDBClick){
            isAddedDBClick = true;
            box.rect.on('dblclick',editorDBClick);
            box.title.on('dblclick',editorDBClick);
        }
        box.circle.on('click',focusCircleClick);
        document.addEventListener('click',box.outFocusClick);
    }
    //----------------------------------------------------------------------click
    
    //-----------------------------------------------------------focusCircleClick
    function focusCircleClick(e){
        e.stopPropagation();
        if(newLine==0){
            startLine(e);
        }
    }
    //-----------------------------------------------------------focusCircleClick
    
    //------------------------------------------------------------------addLineTo
    function addLineTo(e){
        document.removeEventListener('mousemove',newLine.lineMouseMove);
        
        var newLineD = newLine.lineData;
        newLineD.toBoxId = box.boxId;
        
        var d = box.circle.attr('r');
        
        var offsetX = boxFSet.length ? boxFSet[boxFSet.length - 1].data.px : 0;
        var offsetY = boxFSet.length ? boxFSet[boxFSet.length - 1].data.py : 0;
        
        console.log(offsetX,offsetY);
        
        var tPx = box.data.px - d;
        var tPy = box.data.py + box.height/2;
        var fPx = newLineD.fromBoxPx;
        var fPy = newLineD.fromBoxPy;
        
        var i = 0;
        while(boxes[i].boxId != newLineD.fromBoxId){
            i++;
        }
        
        newLine.lineData = newLineD;
        
        newLine.drawLine(fPx,fPy,tPx,tPy);
        
        box.lines.push(newLine);
        box.data.lineDatas.push(newLine.lineData);
        
        newLine = 0;
    }
    //------------------------------------------------------------------addLineTo
    
    //-----------------------------------------------------------spreadArrowclick
    this.spreadArrowClick = function(e){
        e.stopPropagation();
        
        document.removeEventListener('click',box.outFocusClick);
        
        if(box.downRect.length!=0){
            for(var i=0;i<box.downRect.length;i++){
                box.downRect[i].remove();
                box.downTitle[i].remove();
            }
        }
        
        if(boxF.data.parentId!=0){
            var parentDiv = document.getElementById(boxF.data.parentId+'Div');
        }else{
            var parentDiv = document.getElementById('mainDiv');
        }
        
        var divX = boxF.data.px;
        var divY = boxF.data.py;
        
        var thisDiv = document.createElement('div');
        thisDiv.setAttribute('id',boxF.boxId+'Div');
        
        thisDiv.style.position = 'absolute';
        thisDiv.style.left = divX + 'px';
        thisDiv.style.top = divY + 'px';
        thisDiv.style.margin = '0px';
        thisDiv.style.width = '800px';
        thisDiv.style.height = '800px';
        thisDiv.style.overflow = 'visible';
        
        parentDiv.appendChild(thisDiv);
        
        boxF.bigRectDraw = SVG(thisDiv);
        
        globalDraw = boxF.bigRectDraw;
        
        boxF.bigRect = boxF.bigRectDraw.rect(boxF.data.width,boxF.data.height).fill(boxF.data.color).radius(30);
        boxF.bigRect.animate(300).size(800,800);
        
        boxF.bigRect.on('click',bigRectClick);
        
        layer.layer = boxF.layer + 1;
        
        for(var i=0;i<boxF.data.innerBoxesData.length;i++){
            var thisData = boxF.data.innerBoxesData[i];
            //(boxId,draw,parentId,innerBoxesData,px,py,color,title,date,content,layer)
            var thisBox = new Box(thisData.boxId,boxF.bigRectDraw,boxF.boxId,thisData.innerBoxesData,thisData.px,thisData.py,thisData.color,thisData.title,thisData.date,thisData.content,thisData.layer);
            
            boxF.innerBoxes.push(thisBox);
        }
        boxesSet.push(boxes);
        boxes = [];
        boxes = boxF.innerBoxes;
        console.log(boxesSet);
        
        boxFSet.push(boxF);
        boxF = {boxId:0};
        
        if(!isAddedOuterSpreadClick){
            isAddedOuterSpreadClick = true;
            document.addEventListener('click',outerSpreadClick);
        }
        
    }
    //-----------------------------------------------------------spreadArrowclick
    
    //-------------------------------------------------------------outSpreadClick
    function outerSpreadClick(){
        if(boxF.boxId!=0){
            boxF.outFocusClick();
        }else if(boxFSet.length>1&&boxF.boxId==0){
            var boxSpread = boxFSet[boxFSet.length-1];
            var parentDiv = document.getElementById(boxSpread.data.parentId+'Div');
            boxSpread.outSpreadArrowClick(parentDiv);
        }else if(boxFSet.length==1&&boxF.boxId==0){
            var boxSpread = boxFSet[0];
            var parentDiv = document.getElementById('mainDiv');
            boxSpread.outSpreadArrowClick(parentDiv);
            isAddedOuterSpreadClick = false;
            document.removeEventListener('click',outerSpreadClick);
            document.addEventListener('click',boxSpread.outFocusClick);
        }
    }
    //-------------------------------------------------------------outSpreadClick
    
    //---------------------------------------------------------------bigRectClick
    function bigRectClick(e){
        e.stopPropagation();
        if((boxF.boxId==0)&&box.layer<(layer-1)){
            var parentDiv = document.getElementById(boxFSet[boxFSet.length-1].data.parentId+'Div');
            box.outSpreadArrowClick(parentDiv);
        }else if(boxF.boxId!=0){
            boxF.outFocusClick();
        } 
        console.log(box.layer,layer);
    }
    //---------------------------------------------------------------bigRectClick
    
    //--------------------------------------------------------outSpreadArrowClick
    this.outSpreadArrowClick = function(parentDiv){
        var boxR = boxFSet.pop();
        if(boxR.innerBoxes.length){
            var innerB = boxR.innerBoxes;
            boxR.data.innerBoxesData = [];
            for(var i=0;i<innerB.length;i++){
                boxR.data.innerBoxesData[i] = boxR.innerBoxes[i].data;
                //boxR.data
                innerB[i].rect.off();
                innerB[i].title.off();
                innerB[i].rect.remove();
                innerB[i].title.remove();
                if(innerB[i].downArrow!=0){
                    innerB[i].downArrow.off();
                    innerB[i].downArrow.remove();
                }
                if(innerB[i].spreadArrow!=0){
                    innerB[i].spreadArrow.off();
                    innerB[i].spreadArrow.remove();
                }
            }
            boxR.innerBoxes = [];
            innerB = [];
        }

        boxR.bigRect.off();
        var tempTitleD = titleData(boxR.data.title);
        var boxA = boxR.bigRect.animate(200).size(tempTitleD[1],tempTitleD[2]).afterAll(function()
        {
            boxA.target().remove();
            var thisDiv = document.getElementById(boxR.boxId+'Div');
            parentDiv.removeChild(thisDiv);
            delete thisDiv;

            boxF = boxR;
            globalDraw = boxF.draw;
            boxes = boxesSet.pop();
            layer.layer--;
        }
        );
        
        
    }
    //--------------------------------------------------------outSpreadArrowClick
    
    //---------------------------------------------------------mouseover mouseout
    this.rect.on('mouseover',boxMOver);
    this.title.on('mouseover',boxMOver);
    
    function boxMOver(e){
        e.stopPropagation();
        console.log(box.layer);
        console.log(layer.layer);
        if(boxF.boxId==0&&box.layer==layer.layer){
            box.rect.off('mouseover',boxMOver);
            box.title.off('mouseover',boxMOver);
            
            scale2(box);
            
            box.rect.on('click',box.boxClickP);
            box.title.on('click',box.boxClickP);
            
            box.rect.on('mouseout',boxMOut);
            box.title.on('mouseout',boxMOut);
            
            box.rect.on('mousedown',box.boxMDown);
            box.title.on('mousedown',box.boxMDown);
            
            box.circle.radius(25);
            box.reDrawLine();
            
            box.circle.off();
            box.circle.remove();
            box.circle = box.drawCircle(box,25,color);
            box.circle.on('click',addLineClick);
        }
    }
    
    function boxMOut(){
        box.rect.off('mouseout',boxMOut);
        box.title.off('mouseout',boxMOut);
        
        box.rect.off('mousedown',box.boxMDown);
        box.title.off('mousedown',box.boxMDown);
        
        scale1(box);
        
        box.rect.on('click',box.boxClickP);
        box.title.on('click',box.boxClickP);
        
        box.rect.on('mouseover',boxMOver);
        box.title.on('mouseover',boxMOver);
        
        box.circle.radius(12.5);
        box.reDrawLine();
        
        box.circle.off();
        box.circle.remove();
        box.circle = box.drawCircle(box,12.5,color);
        box.circle.on('click',addLineClick);
        
    }
    //---------------------------------------------------------mouseover mouseout
    
    //-----------------------------------------------------------------redrawLine
    this.reDrawLine = function(){
        if(box.lines.length){
            for(var i=0;i<box.lines.length;i++){
                var thisLine = box.lines[i];
                var d = box.circle.attr('r');
                var lineD = thisLine.lineData;
                
                if(lineD.fromParentId[lineD.fromParentId.length-1]==box.boxId){
                    var fPx = box.data.px - d;
                    var fPy = box.data.py + box.height/2;
                    var tPx = lineD.toBoxPx;
                    var tPy = lineD.toBoxPy;
                }else if(lineD.toParentId[lineD.toParentId.length-1]==box.boxId){
                    var fPx = lineD.fromBoxPx;
                    var fPy = lineD.fromBoxPy;
                    var tPx = box.data.px - d;
                    var tPy = box.data.py + box.height/2;
                }else if(lineD.fromBoxId==box.boxId){
                    var fPx = box.data.px - d;
                    var fPy = box.data.py + box.height/2;
                    var tPx = lineD.toBoxPx;
                    var tPy = lineD.toBoxPy;
                }else if(lineD.toBoxId==box.boxId){
                        var fPx = lineD.fromBoxPx;
                        var fPy = lineD.fromBoxPy;
                        var tPx = box.data.px - d;
                        var tPy = box.data.py + box.height/2;
                }

                thisLine.removeLine();
                thisLine.reDrawLine(fPx,fPy,tPx,tPy);
            }
        }
    }
    //-----------------------------------------------------------------redrawLine
    
    //------------------------------------------------------------------mousedown
    var mouseDx = NaN;
    var mouseDy = NaN;
    this.boxMDown = function(e){
        e.stopPropagation();
        //if(boxF.boxId==0){
            box.rect.off('mouseout',boxMOut);
            box.title.off('mouseout',boxMOut);

            mouseDx = e.pageX - box.data.px;
            mouseDy = e.pageY - box.data.py;

            box.rect.on('mousemove',boxMM);
            box.title.on('mousemove',boxMM)
            box.rect.on('mouseup',boxMUp);
            box.title.on('mouseup',boxMUp);
        //}
    }
    //------------------------------------------------------------------mousedown
    
    //-----------------------------------------------------------------addBoxInto
    function addBoxInto(whichBox){
        box.rect.off();
        box.title.off();
        document.removeEventListener('click',box.outFocusClick);
        
        if(box.downArrow!=0){
            box.downArrow.off();
            box.downArrow.remove();
        }
        
        if(box.spreadArrow!=0){
            box.spreadArrow.off();
            box.spreadArrow.remove();
        }
        
        box.circle.remove();
        box.rect.remove();
        box.title.remove();
        
        var i=0;
        while(boxes[i].boxId!=box.boxId){
            i++;
        }
        
        boxF = whichBox;
        whichBox.rect.off();
        whichBox.title.off();
        whichBox.circle.off();
        whichBox.circle.remove();
        scale2(whichBox);
        whichBox.downArrow = whichBox.drawDownArrow(whichBox,10,whichBox.data.color);
        whichBox.downArrow.on('click',whichBox.downArrowClick);
        
        whichBox.spreadArrow = whichBox.drawSpreadArrow(whichBox,10,whichBox.data.color);
        
        whichBox.circle = whichBox.drawCircle(whichBox,25,whichBox.data.color);
        
        whichBox.rect.on('click',whichBox.boxClickP);
        whichBox.title.on('click',whichBox.boxClickP);
        whichBox.rect.on('mousedown',whichBox.boxMDown);
        whichBox.title.on('mousedown',whichBox.boxMDown);
        whichBox.circle.on('click',startLine);
        document.addEventListener('click',whichBox.outFocusClick);
        whichBoxAddInto = {boxId:0};
        
        if(whichBox.lines.length){
            for(var j=0;j<whichBox.lines.length;j++){
                var thisLine = whichBox.lines[j];
                if(thisLine.lineData.fromBoxId==whichBox.boxId&&thisLine.lineData.toBoxId==box.boxId){
                    console.log(thisLine);
                    thisLine.removeLine();
                    
                    whichBox.lines.splice(j,1);
                    j--;
                    var k=0;
                    while(whichBox.lineDatas[k].fromBoxId!=thisLine.lineData.fromBoxId){
                        k++;
                    }
                    whichBox.lineDatas.splice(k,1);
                    
                    k=0;
                    while(box.lines[k].lineData.toBoxId!=thisLine.lineData.toBoxId){
                        k++;
                    }
                    box.lines.splice(k,1);
                    k=0;
                    while(box.lineDatas[k].toBoxId!=thisLine.lineData.toBoxId){
                        k++;
                    }
                    box.lineDatas.splice(k,1);
                }else if(thisLine.lineData.toBoxId==whichBox.boxId&&thisLine.lineData.fromBoxId==box.boxId){
                    thisLine.removeLine();
                    
                    whichBox.lines.splice(j,1);
                    j--;
                    var k=0;
                    while(whichBox.lineDatas[k].toBoxId!=thisLine.lineData.toBoxId){
                        k++;
                    }
                    whichBox.lineDatas.splice(k,1);
                    
                    k=0;
                    while(box.lines[k].lineData.fromBoxId!=thisLine.lineData.fromBoxId){
                        k++;
                    }
                    box.lines.splice(k,1);
                    k=0;
                    while(box.lineDatas[k].fromBoxId!=thisLine.lineData.fromBoxId){
                        k++;
                    }
                    box.lineDatas.splice(k,1);
                }else{
                   if(thisLine.lineData.fromBoxId==whichBox.boxId){
                    thisLine.lineData.fromBoxPx = whichBox.data.px;
                    thisLine.lineData.fromBoxPy = whichBox.data.py;
                    
                    var d = whichBox.circle.attr('r');
                    var fPx = whichBox.data.px - d;
                    var fPy = whichBox.data.py + whichBox.height/2;
                    thisLine.drawLine(fPx,fPy,thisLine.lineData.toBoxPx,thisLine.lineData.toBoxPy);
                    }else if(thisLine.lineData.toBoxId==whichBox.boxId){
                        thisLine.lineData.toBoxPx = whichBox.data.px;
                        thisLine.lineData.toBoxPy = whichBox.data.py;

                        var d = whichBox.circle.attr('r');
                        var tPx = whichBox.data.px - d;
                        var tPy = whichBox.data.py + whichBox.height/2;
                        thisLine.drawLine(thisLine.lineData.fromBoxPx,thisLine.lineData.fromBoxPy,tPx,tPy);
                    }else if(thisLine.lineData.fromParentId[thisLine.lineData.fromParentId.length-1]==whichBox.boxId){
                        thisLine.lineData.fromBoxPx = whichBox.data.px;
                        thisLine.lineData.fromBoxPy = whichBox.data.py;

                        var d = whichBox.circle.attr('r');
                        var fPx = whichBox.data.px - d;
                        var fPy = whichBox.data.py + whichBox.height/2;
                        thisLine.drawLine(fPx,fPy,thisLine.lineData.toBoxPx,thisLine.lineData.toBoxPy);
                    }else if(thisLine.lineData.toParentId[thisLine.lineData.toParentId.length-1]==whichBox.boxId){
                        thisLine.lineData.toBoxPx = whichBox.data.px;
                        thisLine.lineData.toBoxPy = whichBox.data.py;

                        var d = whichBox.circle.attr('r');
                        var tPx = whichBox.data.px - d;
                        var tPy = whichBox.data.py + whichBox.height/2;
                        thisLine.drawLine(thisLine.lineData.fromBoxPx,thisLine.lineData.fromBoxPy,tPx,tPy);
                    } 
                }
            }
        }
        
        if(box.lines.length){
            for(var j=0;j<box.lines.length;j++){
                var thisLine = box.lines[j];
                if(thisLine.lineData.fromBoxId==box.boxId){
                    thisLine.lineData.fromParentId.push(whichBox.boxId);
                    
                    thisLine.lineData.fromBoxPx = whichBox.data.px;
                    thisLine.lineData.fromBoxPy = whichBox.data.py;
                    
                    var d = whichBox.circle.attr('r');
                    var fPx = whichBox.data.px - d;
                    var fPy = whichBox.data.py + whichBox.height/2;
                    thisLine.drawLine(fPx,fPy,thisLine.lineData.toBoxPx,thisLine.lineData.toBoxPy);
                }else if(thisLine.lineData.toBoxId==box.boxId){
                    thisLine.lineData.toParentId.push(whichBox.boxId);
                    
                    thisLine.lineData.toBoxPx = whichBox.data.px;
                    thisLine.lineData.toBoxPy = whichBox.data.py;
                    
                    var d = whichBox.circle.attr('r');
                    var tPx = whichBox.data.px - d;
                    var tPy = whichBox.data.py + whichBox.height/2;
                    thisLine.drawLine(thisLine.lineData.fromBoxPx,thisLine.lineData.fromBoxPy,tPx,tPy);
                }else if(thisLine.lineData.fromParentId[thisLine.lineData.fromParentId.length-1]==box.boxId){
                    thisLine.lineData.fromParentId.push(whichBox.boxId);
                    
                    thisLine.lineData.fromBoxPx = whichBox.data.px;
                    thisLine.lineData.fromBoxPy = whichBox.data.py;
                    
                    var d = whichBox.circle.attr('r');
                    var fPx = whichBox.data.px - d;
                    var fPy = whichBox.data.py + whichBox.height/2;
                    thisLine.drawLine(fPx,fPy,thisLine.lineData.toBoxPx,thisLine.lineData.toBoxPy);
                }else if(thisLine.lineData.toParentId[thisLine.lineData.toParentId.length-1]==box.boxId){
                     thisLine.lineData.toParentId.push(whichBox.boxId);
                    
                    thisLine.lineData.toBoxPx = whichBox.data.px;
                    thisLine.lineData.toBoxPy = whichBox.data.py;
                    
                    var d = whichBox.circle.attr('r');
                    var tPx = whichBox.data.px - d;
                    var tPy = whichBox.data.py + whichBox.height/2;
                    thisLine.drawLine(thisLine.lineData.fromBoxPx,thisLine.lineData.fromBoxPy,tPx,tPy);
                }
                whichBox.lineDatas.push(thisLine.lineData);
                whichBox.lines.push(thisLine);
            }
            box.lines = [];
        }
        
        boxes.splice(i,1);
        
        box.data.layer = layer.layer+1;
        box.layer = box.data.layer;
        console.log(box.data);
        box.data.parentId = whichBox.data.boxId;
        if(boxFSet.length){
            var parentBox = boxFSet[boxFSet.length-1];
            parentBox.data.innerBoxesData = [];
            for(var i;i<boxes.length;i++){
                parentBox.data.innerBoxesData[i] = boxes[i].data;
            }
        }
        
        whichBox.data.innerBoxesData.push(box.data);
    }
    //-----------------------------------------------------------------addBoxInto
    
    //-----------------------------------------------------------------outBoxInto
    function outBoxInto(){
        box.rect.off();
        box.title.off();
        box.circle.off();
        box.rect.remove();
        box.title.remove();
        box.circle.remove();
        
        document.removeEventListener('click',box.outFocusClick);
        
        if(box.downArrow!=0){
            box.downArrow.off();
            box.downArrow.remove();
        }
        
        if(box.spreadArrow!=0){
            box.spreadArrow.off();
            box.spreadArrow.remove();
        }
        
        var i=0;
        while(boxes[i].boxId!=box.boxId){
            i++;
        }
        boxes.splice(i,1);
        
        box.data.layer = layer.layer - 1;
        box.data.parentId = boxFSet[boxFSet.length-1].data.parentId;
        
        boxFSet[boxFSet.length-1].innerBoxes = boxes;
        boxFSet[boxFSet.length-1].data.innerBoxesData = [];
        for(var i=1;i<boxes.length;i++){
            boxFSet[boxFSet.length-1].data.innerBoxesData.push(boxes[i].data);
        }
        
        
        console.log(boxFSet[boxFSet.length-1]);
        console.log(boxes);
        
        box.data.px = randPx;
        box.data.py = randPy;
        
        box.draw = boxFSet[boxFSet.length-1].draw;
        box.scale = 1;
        box.layer = layer.layer - 1;
        
        box.titleD = titleData(box.data.title);
        
        drawRect(box.draw,box.titleD[1],box.titleD[2],box.scale);
        
        box.circle = box.drawCircle(box,12.5,box.data.color);
        
        box.rect.on('mouseover',boxMOver);
        box.title.on('mouseover',boxMOver);
        
        boxesSet[boxesSet.length-1].push(box);
        
        var pBox = boxFSet[boxFSet.length-1];
        console.log(pBox);
        for(var j=0;j<pBox.lines.length;j++){
            var thisLine = pBox.lines[j];
            if(thisLine.lineData.fromParentId[thisLine.lineData.fromParentId.length-2]==box.boxId){
                console.log(thisLine);
                var d = box.circle.attr('r');
                var fPx = box.data.px - d;
                var fPy = box.data.py + d;
                thisLine.drawLine(fPx,fPy,thisLine.lineData.toBoxPx,thisLine.lineData.toBoxPy);
                box.lines.push(thisLine);
                box.lineDatas.push(thisLine.lineData);
                pBox.lines.splice(j,1);
                pBox.lineDatas.splice(j,1);
                j--;
            }else if(thisLine.lineData.toParentId[thisLine.lineData.toParentId.length-2]==box.boxId){
                console.log(thisLine);
                var d = box.circle.attr('r');
                var tPx = box.data.px - d;
                var tPy = box.data.py + d;
                thisLine.drawLine(thisLine.lineData.fromBoxPx,thisLine.lineData.fromBoxPy,tPx,tPy);
                box.lines.push(thisLine);
                box.lineDatas.push(thisLine.lineData);
                pBox.lines.splice(j,1);
                pBox.lineDatas.splice(j,1);
                j--;
            }else if(thisLine.lineData.fromBoxId==box.boxId){
                console.log(thisLine);
                var d = box.circle.attr('r');
                var fPx = box.data.px - d;
                var fPy = box.data.py + d;
                thisLine.drawLine(fPx,fPy,thisLine.lineData.toBoxPx,thisLine.lineData.toBoxPy);
                box.lines.push(thisLine);
                box.lineDatas.push(thisLine.lineData);
                pBox.lines.splice(j,1);
                pBox.lineDatas.splice(j,1);
                j--;
            }else if(thisLine.lineData.toBoxId==box.boxId){
                console.log(thisLine);
                var d = box.circle.attr('r');
                var tPx = box.data.px - d;
                var tPy = box.data.py + d;
                thisLine.drawLine(thisLine.lineData.fromBoxPx,thisLine.lineData.fromBoxPy,tPx,tPy);
                box.lines.push(thisLine);
                box.lineDatas.push(thisLine.lineData);
                pBox.lines.splice(j,1);
                pBox.lineDatas.splice(j,1);
                j--;
            }
        }
        
        console.log(box);
        console.log(boxesSet);
        
    }
    //-----------------------------------------------------------------outBoxInto
    
    //------------------------------------------------------------------downClock
    function downClock(){
        console.log(clock);
        clock--;
        if(clock==0&&whichBoxAddInto.boxId!=0){
            clearInterval(addBoxInterval);
            addBoxInterval = NaN;
            clock = 3;
            addBoxInto(whichBoxAddInto);
        }
    }
    //------------------------------------------------------------------downClock
    
    //---------------------------------------------------------------outDownClock
    function outDownClock(){
        console.log(outClock);
        outClock--;
        if(outClock==0&&whichBoxGoOut.boxId!=0){
            clearInterval(outBoxInterval);
            outBoxInterval = NaN;
            outClock = 3;
            outBoxInto();
        }
    }
    //---------------------------------------------------------------outDownClock
    
    //---------------------------------------------------------------checkOverlap
    function checkOverlap(){
        var top = box.data.py;
        var left = box.data.px;
        var bottom = box.data.py + box.height;
        var right = box.data.px + box.width;
        
        if(whichBoxAddInto.boxId!=0){
            var boxData = whichBoxAddInto.data;
            var bTop = boxData.py;
            var bLeft = boxData.px;
            var bBottom = boxData.py + whichBoxAddInto.height;
            var bRight = boxData.px + whichBoxAddInto.width;
            if(!(bTop<=bottom&&bBottom>=top&&bLeft<=right&&bRight>=left)){
                whichBoxAddInto = {boxId:0};
                clearInterval(addBoxInterval);
                addBoxInterval = NaN;
                clock = 3;
            }
        }else{
            for(var i=0;i<boxes.length;i++){
                if(boxes[i].boxId!=box.boxId&&boxes[i].layer==box.layer){
                    var boxData = boxes[i].data;
                    var bTop = boxData.py;
                    var bLeft = boxData.px;
                    var bBottom = boxData.py + boxes[i].height;
                    var bRight = boxData.px + boxes[i].width;
                    if(bTop<=bottom&&bBottom>=top&&bLeft<=right&&bRight>=left){
                        whichBoxAddInto = boxes[i];
                        if(!addBoxInterval){
                            addBoxInterval = setInterval(downClock,1000);
                        }
                        return;
                    }
                }
            }
        }
    }
    //---------------------------------------------------------------checkOverlap
    
    //------------------------------------------------------------------mousemove
    function boxMM(e){
        var dx = e.pageX-mouseDx;
        var dy = e.pageY-mouseDy;
        
        box.rect.move(dx,dy);
        
        var tPx = dx + box.width/2;
        var tPy = dy + 10;
        
        box.title.move(tPx,tPy);
        
        box.data.px = e.pageX-mouseDx;
        box.data.py = e.pageY-mouseDy;
        
        if(box.downArrow!=0){
            var dAPx = dx + box.width/2 - 10;
            var dAPy = dy + box.height;
            
            box.downArrow.move(dAPx,dAPy);
        }
        
        if(box.downRect.length>0){
            var thisWidth = box.width - 50;
            var thisHeight = 32;
            var thisx = box.data.px + box.width/2 - thisWidth/2;
            var thisy = box.data.py + box.height;
            for(var i=0;i<box.downRect.length;i++){
                box.downRect[i].move(thisx,thisy+i*thisHeight);
                box.downTitle[i].move(thisx+thisWidth/2-15,thisy+thisHeight*i+thisHeight/4);
            }
        }
        
        
        if(box.spreadArrow!=0){
            var sAPx = dx + box.width;
            var sAPy = dy + box.height/2 - 10;
            
            box.spreadArrow.move(sAPx,sAPy);
        }
        
        
        if(box.circle!=0){
            var d = box.circle.attr('r');
            var cPx = dx - d;
            var cPy = dy + box.height/2;
            
            box.circle.center(cPx,cPy);
        }
        
        if(box.lines.length){
            for(var i=0;i<box.lines.length;i++){
                var thisLine = box.lines[i];
                var d = box.circle.attr('r');
                var lineD = thisLine.lineData;
                
                if(lineD.fromParentId[lineD.fromParentId.length-1]==box.boxId){
                    if(box.downRect.length){
                        if(lineD.fromParentId.length>=2){
                            var j = 0;
                            while(lineD.fromParentId[lineD.fromParentId.length-2]!=(box.data.innerBoxesData[j]).boxId){
                                j++
                            }
                            var fPx = box.downRect[j].attr('x');
                            var fPy = box.downRect[j].attr('y') + 16;
                            var tPx = lineD.toBoxPx;
                            var tPy = lineD.toBoxPy;
                        }else{
                           var j = 0;
                            //console.log(box.data.innerBoxesData);
                            while(lineD.fromBoxId!=(box.data.innerBoxesData[j]).boxId){
                                j++
                            }
                            //console.log(box.downRect);
                            var fPx = box.downRect[j].attr('x');
                            var fPy = box.downRect[j].attr('y') + 16;
                            var tPx = lineD.toBoxPx;
                            var tPy = lineD.toBoxPy;
                        }
                    }else{
                        var fPx = box.data.px - d;
                        var fPy = box.data.py + box.height/2;
                        var tPx = lineD.toBoxPx;
                        var tPy = lineD.toBoxPy;
                    }
                }else if(lineD.toParentId[lineD.toParentId.length-1]==box.boxId){
                    if(box.downRect.length){
                        if(lineD.toParentId.length>=2){
                            var j = 0;
                            while(lineD.toParentId[lineD.toParentId.length-2]!=(box.data.innerBoxesData[j]).boxId){
                                j++
                            }
                            var fPx = lineD.fromBoxPx;
                            var fPy = lineD.fromBoxPy;
                            var tPx = box.downRect[j].attr('x');
                            var tPy = box.downRect[j].attr('y') + 16;
                        }else{
                           var j = 0;
                            while(lineD.toBoxId!=(box.data.innerBoxesData[j]).boxId){
                                j++
                            }
                            var fPx = lineD.fromBoxPx;
                            var fPy = lineD.fromBoxPy;
                            var tPx = box.downRect[j].attr('x');
                            var tPy = box.downRect[j].attr('y') + 16;
                        }
                    }else{
                        var fPx = lineD.fromBoxPx;
                        var fPy = lineD.fromBoxPy;
                        var tPx = box.data.px - d;
                        var tPy = box.data.py + box.height/2;
                    }
                }else{
                    if(lineD.fromBoxId==box.boxId){
                        var fPx = box.data.px - d;
                        var fPy = box.data.py + box.height/2;
                        var tPx = lineD.toBoxPx;
                        var tPy = lineD.toBoxPy;
                    }else{
                        var fPx = lineD.fromBoxPx;
                        var fPy = lineD.fromBoxPy;
                        var tPx = box.data.px - d;
                        var tPy = box.data.py + box.height/2;
                    }
                }

                thisLine.removeLine();
                thisLine.reDrawLine(fPx,fPy,tPx,tPy);
            }
        }
        
        checkOverlap();
        
        if(boxFSet.length){
            checkGoOut();
        }
    }
    //------------------------------------------------------------------mousemove
    
    //-----------------------------------------------------------------checkGoOut
    function checkGoOut(){
        var top = box.data.py;
        var left = box.data.px;
        var bottom = box.data.py + box.height;
        var right = box.data.px + box.width;
        var parentBox = boxFSet[boxFSet.length-1];
        if(whichBoxGoOut.boxId!=0){
            if(!(top<0||left<0||bottom>parentBox.bigRect.height()||right>parentBox.bigRect.width())){
                whichBoxGoOut = {boxId:0};
                clearInterval(outBoxInterval);
                outBoxInterval = NaN;
                outClock = 3;
            }
            
        }else if(top<0||left<0||bottom>parentBox.bigRect.height()||right>parentBox.bigRect.width()){
            whichBoxGoOut = box;
            if(!outBoxInterval){
                outBoxInterval = setInterval(outDownClock,1000);
            }
        }
    }
    //-----------------------------------------------------------------checkGoOut
    
    //--------------------------------------------------------------------mouseup
    function boxMUp(){
        box.rect.off('mousemove',boxMM);
        box.title.off('mousemove',boxMM);
        boxClick();
    }
    //--------------------------------------------------------------------mouseup
    
    //----------------------------------------------------------------doubleClick
    function editorDBClick(){
        isDBlClicked = true;
        if(boxF.boxId!=0){
            var thisDiv = document.createElement('div');
            thisDiv.setAttribute('id',(box.boxId+'Div'));
            thisDiv.style.position = 'absolute';
            thisDiv.style.width = 500;
            thisDiv.style.height = 500;
            thisDiv.style.margin = 0;
            thisDiv.style.background = 'rgba(159,216,237,1)';
            thisDiv.style.overflow = 'auto';
            thisDiv.textAlign = 'center';
            thisDiv.style.left = box.data.px;
            thisDiv.style.top = box.data.py;
            
            thisDiv.addEventListener('click',editorClickP);
            
            //---------------title
            var thisTitleDiv = document.createElement('div');
            thisTitleDiv.style.width = '500px';
            thisTitleDiv.style.textAlign = 'center';
            
            var thisTitleLabel = document.createElement('label');
            thisTitleLabel.style.right = 'auto';
            thisTitleLabel.style.left = 'auto';
            thisTitleLabel.setAttribute('for','title');
            
            var thisTitleLabelB = document.createElement('b');
            thisTitleLabelB.style.fontSize = '1.2rem';
            
            var thisTitleLabelText = document.createTextNode('TITLE');
            thisTitleLabelB.appendChild(thisTitleLabelText);
            thisTitleLabel.appendChild(thisTitleLabelB);
            
            var thisTitleInput = document.createElement('input');
            thisTitleInput.setAttribute('type','text');
            thisTitleInput.setAttribute('name','title');
            thisTitleInput.setAttribute('id','titleInput');
            thisTitleInput.style.display = 'block';
            thisTitleInput.style.margin = 'auto';
            thisTitleInput.style.width = '250px';
            
            thisTitleInput.value = box.data.title;
            
            thisTitleDiv.appendChild(thisTitleLabel);
            thisTitleDiv.appendChild(thisTitleInput);
            
            //---------------title
            
            //----------------date
            var thisDateDiv = document.createElement('div');
            thisDateDiv.style.width = '500px';
            thisDateDiv.style.textAlign = 'center';
            
            var thisDateLabel = document.createElement('label');
            thisDateLabel.style.right = 'auto';
            thisDateLabel.style.left = 'auto';
            thisDateLabel.setAttribute('for','date');
            
            var thisDateLabelText = document.createTextNode('DATE');
            
            var thisDateLabelB = document.createElement('b');
            thisDateLabelB.style.fontSize = '1.2rem';
            
            thisDateLabel.appendChild(thisDateLabelB);
            thisDateLabelB.appendChild(thisDateLabelText);
            
            var thisDateInput = document.createElement('input');
            thisDateInput.setAttribute('type','text');
            thisDateInput.setAttribute('name','date');
            thisDateInput.setAttribute('id','dateInput');
            thisDateInput.style.display = 'block';
            thisDateInput.style.margin = 'auto';
            thisDateInput.style.width = '250px';
            
            thisDateInput.value = box.data.date;
            
            thisDateDiv.appendChild(thisDateLabel);
            thisDateDiv.appendChild(thisDateInput);
            
            //----------------date
            
            //-------------content
            var thisContentDiv = document.createElement('div');
            thisContentDiv.style.width = '500px';
            thisContentDiv.style.textAlign = 'center';
            
            var thisContentLabel = document.createElement('label');
            thisContentLabel.setAttribute('for','content');
            thisContentLabel.style.right = 'auto';
            thisContentLabel.style.left = 'auto';
            
            var thisContentLabelText = document.createTextNode('CONTENT');
            
            var thisContentLabelB = document.createElement('b');
            thisContentLabelB.style.fontSize = '1.2rem';
            
            thisContentDiv.appendChild(thisContentLabelB);
            thisContentLabelB.appendChild(thisContentLabelText);
            
            var thisContentMainText = document.createElement('textarea');
            thisContentMainText.setAttribute('name','content');
            thisContentMainText.setAttribute('id','mainText');
            thisContentMainText.style.display = 'block';
            thisContentMainText.style.display = 'block';
            thisContentMainText.style.margin = 'auto';
            thisContentMainText.style.width = '250px';
            thisContentMainText.style.minHeight = '19rem';
            thisContentMainText.style.resize = 'none';
            
            thisContentMainText.value = box.data.content;
            
            thisContentDiv.appendChild(thisContentLabel);
            thisContentDiv.appendChild(thisContentMainText);
            //-------------content

            //----------------save
            var thisSave = document.createElement('input');
            thisSave.setAttribute('type','image');
            thisSave.setAttribute('src','image/SaveButton.png');
            thisSave.setAttribute('id','saveButton');
            thisSave.style.margin = 'auto';
            thisSave.style.display = 'block';
            thisSave.style.width = '250px';
            //----------------save
            
            thisSave.addEventListener('click',editorSaveClick);
            
            thisDiv.appendChild(thisTitleDiv);
            thisDiv.appendChild(thisDateDiv);
            thisDiv.appendChild(thisContentDiv);
            thisDiv.appendChild(thisSave);
            
            if(box.data.parentId!=0){
                var parentDiv = document.getElementById(box.data.parentId+'Div');
                parentDiv.appendChild(thisDiv);
            }else{
                var parentDiv = document.getElementById('mainDiv');
                parentDiv.appendChild(thisDiv);
            }
        }
    }
    //----------------------------------------------------------------doubleClick
    
    //----------------------------------------------------------------editorClick
    function editorClickP(e){
        e.stopPropagation();
    }
    //----------------------------------------------------------------editorClick
    
    //------------------------------------------------------------editorSaveClick
    function editorSaveClick(){
        var title = $('#titleInput').val();
        var date = $('#dateInput').val();
        var content = $('#mainText').val();
        
        box.data.title = title;
        box.data.date = date;
        box.data.content = content;
        
        box.titleD = titleData(title);
        box.rect.off();
        box.title.off();
        drawRect(box.draw,box.titleD[1],box.titleD[2],box.scale);
        
        box.rect.on('mousedown',box.boxMDown);
        box.title.on('mousedown',box.boxMDown);
        
        box.rect.on('click',box.boxClickP);
        box.title.on('click',box.boxClickP);
        
        box.downArrow.off();
        box.spreadArrow.off();
        box.downArrow.remove();
        box.spreadArrow.remove();
        
        box.downArrow = box.drawDownArrow(box,10,box.data.color);
        box.spreadArrow = box.drawSpreadArrow(box,10,box.data.color);
    }
    //------------------------------------------------------------editorSaveClick
    
    //-------------------------------------------------------------downArrowClick
    this.downArrowClick = function(e){
        e.stopPropagation();
        var downArrowData = JSON.stringify(box.data.innerBoxesData);
        downArrowData = JSON.parse(downArrowData);
        if(downArrowData.length==0){
            box.downArrow.animate(200).opacity(0);
            box.downArrow.animate(200).opacity(1);
            
            box.downArrow.animate(200).opacity(0);
            box.downArrow.animate(200).opacity(1);
        }else{
            var thisWidth = box.width - 50;
            var thisHeight = 32;
            var thisx = box.data.px + box.width/2 - thisWidth/2;
            var thisy = box.data.py + box.height;
            for(var i=0;i<downArrowData.length;i++){
               var thisData = downArrowData[i];
               if(thisData.title.length>7){
                   thisData.title  = thisData.title.substring(0,6);
                   thisData.title += '...';
               } box.downRect.push(box.draw.rect(thisWidth,thisHeight).move(thisx,thisHeight*i+thisy).fill(color).radius(5));
                box.downTitle.push(box.draw.text(thisData.title).move(thisx+thisWidth/2-15,thisHeight*i+thisy+thisHeight/4));
           }
        }
        
        if(box.lines.length){
            for(var i=0;i<box.lines.length;i++){
                var thisLineD = box.lines[i].lineData;
                if(thisLineD.fromParentId.length){
                    for(var j=0;j<downArrowData.length;j++){
                        if(thisLineD.fromParentId.length>=2){
                            if(downArrowData[j].boxId==thisLineD.fromParentId[thisLineD.fromParentId.length-2]){
                                var fPx = box.data.px + box.width/2 - (box.width - 50)/2 ;
                                var fPy = 32*j + box.data.py + box.height + 16;
                                box.lines[i].removeLine();
                                box.lines[i].reDrawLine(fPx,fPy,thisLineD.toBoxPx,thisLineD.toBoxPy);
                            }
                        }else{
                            if(thisLineD.fromBoxId==downArrowData[j].boxId){
                                var fPx = box.data.px + box.width/2 - (box.width - 50)/2;
                                var fPy = 32*j + box.data.py + box.height + 16;
                                box.lines[i].removeLine();
                                box.lines[i].reDrawLine(fPx,fPy,thisLineD.toBoxPx,thisLineD.toBoxPy);
                            }
                        }
                    }
                }
                if(thisLineD.toParentId.length){
                    console.log(thisLineD.toParentId.length);
                    for(var j=0;j<downArrowData.length;j++){
                        if(thisLineD.toParentId.length>=2){
                            if(downArrowData[j].boxId==thisLineD.toParentId[thisLineD.toParentId.length-2]){
                                var tPx = box.data.px + box.width/2 - (box.width - 50)/2;
                                var tPy = 32*j + box.data.py + box.height + 16;
                                box.lines[i].removeLine();
                                box.lines[i].reDrawLine(thisLineD.fromBoxPx,thisLineD.fromBoxPy,tPx,tPy);
                            }
                        }else{
                            console.log(j);
                            if(thisLineD.toBoxId==downArrowData[j].boxId){
                                var tPx = box.data.px + box.width/2 - (box.width - 50)/2;
                                var tPy = 32*j + box.data.py + box.height + 16;
                                box.lines[i].removeLine();
                                box.lines[i].reDrawLine(thisLineD.fromBoxPx,thisLineD.fromBoxPy,tPx,tPy);
                            }
                        }
                    }
                }
            }
        }
        
    }
    //-------------------------------------------------------------downArrowClick
    
}