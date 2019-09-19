function Line(lineData,lineDraw){
    this.lineData = lineData;
    this.lineDraw = lineDraw;
    
    var line = this;
    var lineShape;
    var c1,c2;
    var c3;
    
    this.initialDrawLine = function(){
        var lineD = line.lineData;
        
        lineShape = line.lineDraw.line(lineD.fromBoxPx,lineD.fromBoxPy,lineD.toBoxPx,lineD.toBoxPy).stroke({width:'5px'});
        
        var midX = (lineD.toBoxPx - lineD.fromBoxPx)/2;
        var midY = (lineD.toBoxPy - lineD.fromBoxPy)/2;
        
        var sqr = Math.sqrt(Math.pow(midX,2)+Math.pow(midY,2));
        
        var px = midX * (1-10/sqr) + lineD.fromBoxPx;
        var py = midY * (1-10/sqr) + lineD.fromBoxPy;
        
        var dx = lineD.toBoxPx - lineD.fromBoxPx;
        var dy = lineD.toBoxPy - lineD.fromBoxPy;
        c3 = line.lineDraw.polygon('50,0 0,20 0,-20');
        var angle = 180*(Math.atan2(dy,dx)/Math.PI);
        c3.move(px,py-20).rotate(angle,px,py);
        c3.on('dblclick',lineDBlClick);
    }
    
    this.lineMouseMove = function(e){
        
        var lineD = line.lineData;
        
        var cx = lineD.fromBoxPx;
        var cy = lineD.fromBoxPy;
        
        var offsetX = boxFSet.length ? boxFSet[boxFSet.length - 1].data.px : 0;
        var offsetY = boxFSet.length ? boxFSet[boxFSet.length - 1].data.py : 0;
        
        var dx = e.pageX - cx - offsetX;
        var dy = e.pageY - cy - offsetY;
        
        var ndx = dx * (1 - 5/(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))));
        var ndy = dy * (1 - 5/(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))));
        
        var x = cx + ndx;
        var y = cy + ndy;
        
        line.drawLine(lineD.fromBoxPx,lineD.fromBoxPy,x,y);
        
        var midX = (x - lineD.fromBoxPx)/2;
        var midY = (y - lineD.fromBoxPy)/2;
        
        var sqr = Math.sqrt(Math.pow(midX,2)+Math.pow(midY,2));
        
        var px = midX * (1-10/sqr) + lineD.fromBoxPx;
        var py = midY * (1-10/sqr) + lineD.fromBoxPy;
        
        if(c3){
            c3.remove();
        }
        
        c3 = line.lineDraw.polygon('50,0 0,20 0,-20');
        var angle = 180*(Math.atan2(dy,dx)/Math.PI);
        c3.move(px,py-20).rotate(angle,px,py);
    }
    
    this.drawLine = function(fPx,fPy,tPx,tPy){
        var lineD = line.lineData;
        
        lineD.fromBoxPx = fPx;
        lineD.fromBoxPy = fPy;
        
        lineD.toBoxPx = tPx;
        lineD.toBoxPy = tPy;
        
        lineShape.plot(fPx,fPy,tPx,tPy);
        line.lineData = lineD;
        
        var midX = (lineD.toBoxPx - lineD.fromBoxPx)/2;
        var midY = (lineD.toBoxPy - lineD.fromBoxPy)/2;
        
        var sqr = Math.sqrt(Math.pow(midX,2)+Math.pow(midY,2));
        
        var px = midX * (1-10/sqr) + lineD.fromBoxPx;
        var py = midY * (1-10/sqr) + lineD.fromBoxPy;
        
        if(c3){
            c3.remove();
        }
        var dx = lineD.toBoxPx - lineD.fromBoxPx;
        var dy = lineD.toBoxPy - lineD.fromBoxPy;
        
        c3 = line.lineDraw.polygon('50,0 0,20 0,-20');
        var angle = 180*(Math.atan2(dy,dx)/Math.PI);
        c3.move(px,py-20).rotate(angle,px,py);
    }
    
    this.reDrawLine = function(fPx,fPy,tPx,tPy){
        var lineD = line.lineData;
        
        lineD.fromBoxPx = fPx;
        lineD.fromBoxPy = fPy;
        
        lineD.toBoxPx = tPx;
        lineD.toBoxPy = tPy;
        
        lineShape = line.lineDraw.line(fPx,fPy,tPx,tPy).stroke({width:'5px'});
        
        line.lineData = lineD;
        
        var midX = (lineD.toBoxPx - lineD.fromBoxPx)/2;
        var midY = (lineD.toBoxPy - lineD.fromBoxPy)/2;
        
        var sqr = Math.sqrt(Math.pow(midX,2)+Math.pow(midY,2));
        
        var px = midX * (1-10/sqr) + lineD.fromBoxPx;
        var py = midY * (1-10/sqr) + lineD.fromBoxPy;
        
        if(c3){
            c3.remove();
        }
        var dx = lineD.toBoxPx - lineD.fromBoxPx;
        var dy = lineD.toBoxPy - lineD.fromBoxPy;
        
        c3 = line.lineDraw.polygon('50,0 0,20 0,-20');
        var angle = 180*(Math.atan2(dy,dx)/Math.PI);
        c3.move(px,py-20).rotate(angle,px,py);
        c3.on('dblclick',lineDBlClick);
    }
    
    //---------------------------------------------------------------lineDBlClick
    function lineDBlClick(e){
        line.removeLine();
        var boxI = [];
        var boxJ = [];
        for(var i=0;i<boxes.length;i++){
            var thisBox = boxes[i];
            for(var j=0;j<thisBox.lines.length;j++){
                var thisLine = thisBox.lines[j];
                if(thisLine==line){
                    boxI.push(i);
                    boxJ.push(j);
                }
            }
        }
        console.log(boxI,boxJ);
        for(var i=0;i<boxI.length;i++){
            var k=0;
            console.log(boxes[boxI[i]].data.lineDatas[boxJ[i]])// == line.lineData);
            while(!(boxes[boxI[i]].data.lineDatas[boxJ[i]].fromBoxId==line.lineData.fromBoxId
                    &&boxes[boxI[i]].data.lineDatas[boxJ[i]].toBoxId==line.lineData.toBoxId)){
                k++;
            }
            boxes[boxI[i]].data.lineDatas.splice(k,1);
            boxes[boxI[i]].lines.splice(boxJ[i],1);
        }
        
        
        console.log(boxes);
    }
    //---------------------------------------------------------------lineDBlClick
    
    this.removeLine = function(){
        lineShape.remove();
        if(c3){
            c3.off();
            c3.remove();
        }
    }
}