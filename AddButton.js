function AddButton(draw){
    var h = window.innerHeight/4;
    var addButton = globalDraw.image(src = "image/addButton.png").move(-25,h);
    
    document.addEventListener('mousemove',addButtonMM);
    
    var isSlideOut = false;
    
    function addButtonMM(e){
        if(boxF.boxId==0){
             var topH = (h-100)>=0?h-100:0;
            if(e.pageX<=150&&((e.pageY<=h+100+50)&&(e.pageY>=topH))){
                if(!isSlideOut){
                    isSlideOut = true;
                    addButton.animate(80).move(10,h);
                    addButton.on('click',addButtonClick);
                }   
            }else{
                if(isSlideOut){
                    isSlideOut = false;
                    addButton.animate(40).move(-25,h);
                    addButton.off('click',addButtonClick);
                }
            }
        } 
    }
    
    function addButtonClick(e){
        e.stopPropagation();
        //(boxId,draw,parentId,innerBoxesData,px,py,width,height,color,title,data,content,layer,lines)
        console.log(layer);
        var tempB = new Box(boxId,globalDraw,0,[],0,0,0,0,"","","","",layer,[]);
        boxId++;
        
        boxes.push(tempB);
        
        if(boxFSet.length){
            boxFSet[boxFSet.length-1].innerBoxesData = [];
            for(var i=0;i<boxes.length;i++){
                boxFSet[boxFSet.length-1].innerBoxesData[i] = boxes[i].data;
            }
        }
    }
}//End
