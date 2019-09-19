function SaveButton(draw,b){
    var w = window.innerWidth/2;
    var h = window.innerHeight;
    
    var saveButton = draw.image("image/saveButton.png").move(w,h-21);
    
    var boxes = b;
    
    this.setBoxes = function(newBoxes){
        boxes = newBoxes;
    }
    
    document.addEventListener('mousemove',saveButtonMM);
    
    var isSlideOut = false;
    
    function saveButtonMM(e){
        var leftW = ((w-100)>=0)?(w-100):0;
        if( ( e.pageY>=(h-100) ) && ( ( e.pageX<=(w+100+151) ) && (e.pageX>=leftW) ) ){
            if(!isSlideOut){
                isSlideOut = true;
                saveButton.animate(80).move(w,h-52);
                saveButton.on('click',saveButtonClick);
            }   
        }else{
            if(isSlideOut){
                isSlideOut = false;
                saveButton.animate(40).move(w,h-21);
                saveButton.off('click',saveButtonClick);
            }
        }
    }
    
    function saveButtonClick(e){
        //e.stopPropagation();
        var data = [];
        for(var i=0;i<boxes.length;i++){
            if(boxes[i].scale==2){
                boxes[i].scaleBack();
                boxes[i].circle.radius(12.5);
                if(boxF.boxId != 0){
                    boxF = {boxId:0};
                }
                boxes[i].reDrawLine();
            }
            
            data.push(boxes[i].data); 
        }
        saveData(data);
    }
    
    function saveData(data){
        //data.lineDatas = JSON.stringify(data.lineDatas);
        var scene = JSON.stringify({saveBox:data,saveBoxId:boxId});
        localStorage["userName"] = scene;
    }
}