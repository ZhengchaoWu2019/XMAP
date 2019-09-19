function RemoveButton(draw){
    h = window.innerHeight/4*3;
    var removeButton = globalDraw.image("image/removeButton.png").move(-25,h);
    
    document.addEventListener('mousemove',removeButtonMM);
    
    var isSlideOut = false;
    
    function removeButtonMM(e){
        if(e.pageX<=150&&((e.pageY<=h+100+50)&&e.pageY>=(h-100))){
            if(!isSlideOut){
                isSlideOut = true;
                removeButton.animate(80).move(10,h);
                removeButton.on('click',removeButtonClick);
            }   
        }else{
            if(isSlideOut){
                isSlideOut = false;
                removeButton.animate(40).move(-25,h);
                removeButton.off('click',removeButtonClick);
            }
        }
    }
    
    function removeButtonClick(e){
        e.stopPropagation();
        if(boxF.boxId != 0){
            
            boxF.rect.off();
            boxF.title.off();
            boxF.circle.off();
            boxF.downArrow.off();
            boxF.spreadArrow.off();
            
            if(boxF.lines.length){
                for(var j=0;j<boxF.lines.length;j++){
                    var thisLine = boxF.lines[j];
                    if(thisLine.lineData.fromParentId.length){
                        for(var k=0;k<boxes.length;k++){
                            if((thisLine.lineData.fromParentId==boxes[k].boxId)&&boxes[k].boxId!=boxF.boxId){
                                var theBox = boxes[k];
                               
                               for(var l=0;l<theBox.lines.length;l++){
                                    if(theBox.lines[l].lineData.fromBoxId==thisLine.lineData.fromBoxId&&theBox.lines[l].lineData.toBoxId==thisLine.lineData.toBoxId){
                                        var theLine = theBox.lines[l];
                                        theLine.removeLine();
                                        theBox.lines.splice(l,1);
                                    }
                                    if(theBox.lineDatas[l].fromBoxId==thisLine.lineData.fromBoxId&&theBox.lineDatas[l].toBoxId==thisLine.lineData.toBoxId){
                                        theBox.lineDatas.splice(l,1);
                                        l--;
                                    }
                                } /*while(theBox.lines[l].lineData.fromBoxId!=thisLine.lineData.fromBoxId&&theBox.lines[l].lineData.toBoxId!=thisLine.lineData.toBoxId){
                                    l++;
                                }
                                var theLine = theBox.lines[l];
                                theLine.removeLine();
                                theBox.lines.splice(l,1);
                                l = 0;
                                while(theBox.lineDatas[l].fromBoxId!=thisLine.lineData.fromBoxId&&theBox.lineDatas[l].toBoxId!=thisLine.lineData.toBoxId){
                                    l++;
                                }
                                theBox.lineDatas.splice(l,1);*/
                            }
                        }
                    }else if(thisLine.lineData.toParentId.length){
                       for(var k=0;k<boxes.length;k++){
                            if((thisLine.lineData.toParentId==boxes[k].boxId)&&boxes[k].boxId!=boxF.boxId){
                                var theBox = boxes[k];
                               
                               for(var l=0;l<theBox.lines.length;l++){
                                    if(theBox.lines[l].lineData.fromBoxId==thisLine.lineData.fromBoxId&&theBox.lines[l].lineData.toBoxId==thisLine.lineData.toBoxId){
                                        var theLine = theBox.lines[l];
                                        theLine.removeLine();
                                        theBox.lines.splice(l,1);
                                    }
                                    if(theBox.lineDatas[l].fromBoxId==thisLine.lineData.fromBoxId&&theBox.lineDatas[l].toBoxId==thisLine.lineData.toBoxId){
                                        theBox.lineDatas.splice(l,1);
                                        l--;
                                    }
                                }
                            }
                        }
                    }else{
                         for(var k=0;k<boxes.length;k++){
                            if((thisLine.lineData.toBoxId==boxes[k].boxId)&&boxes[k].boxId!=boxF.boxId){
                                var theBox = boxes[k];
                                console.log(theBox);
                                for(var l=0;l<theBox.lines.length;l++){
                                    if(theBox.lines[l].lineData.fromBoxId==thisLine.lineData.fromBoxId&&theBox.lines[l].lineData.toBoxId==thisLine.lineData.toBoxId){
                                        var theLine = theBox.lines[l];
                                        theLine.removeLine();
                                        theBox.lines.splice(l,1);
                                    }
                                    if(theBox.lineDatas[l].fromBoxId==thisLine.lineData.fromBoxId&&theBox.lineDatas[l].toBoxId==thisLine.lineData.toBoxId){
                                        theBox.lineDatas.splice(l,1);
                                        l--;
                                    }
                                }
                                console.log(theBox.lineDatas); 
                            }
                        }
                        for(var k=0;k<boxes.length;k++){
                            if((thisLine.lineData.fromBoxId==boxes[k].boxId)&&boxes[k].boxId!=boxF.boxId){
                                var theBox = boxes[k];
                               for(var l=0;l<theBox.lines.length;l++){
                                    if(theBox.lines[l].lineData.fromBoxId==thisLine.lineData.fromBoxId&&theBox.lines[l].lineData.toBoxId==thisLine.lineData.toBoxId){
                                        var theLine = theBox.lines[l];
                                        theLine.removeLine();
                                        theBox.lines.splice(l,1);
                                    }
                                    if(theBox.lineDatas[l].fromBoxId==thisLine.lineData.fromBoxId&&theBox.lineDatas[l].toBoxId==thisLine.lineData.toBoxId){
                                        theBox.lineDatas.splice(l,1);
                                        l--;
                                    }
                                }
                            }
                        }
                    }
                }
                thisLine.removeLine();
                boxF.lineDatas = [];
            }
            
            //console.log(boxFSet);
            if(boxFSet.length){
                var pBox = boxFSet[boxFSet.length-1];
                //console.log(pBox);
                for(var i=0;i<pBox.lines.length;i++){
                    if(boxF.boxId==pBox.lines[i].lineData.fromBoxId){
                        var theLine = pBox.lines[i];
                        theLine.removeLine();
                        pBox.lines.splice(i,1);
                        i--;
                    }else if(boxF.boxId==pBox.lines[i].lineData.toBoxId){
                        var theLine = pBox.lines[i];
                        theLine.removeLine();
                        pBox.lines.splice(i,1);
                        i--;
                    }
                }

            }
            
            var i = boxes.length - 1;
            while(boxF.boxId!=boxes[i].boxId){
                i--;
            }
            boxes.splice(i,1);
            
            document.removeEventListener('click',boxF.outFocusClick);
            
            boxF.rect.remove();
            boxF.title.remove();
            boxF.circle.remove();
            boxF.downArrow.remove();
            boxF.spreadArrow.remove();
            //delete boxF;
            boxF = {boxId:0};
            
            console.log(boxFSet);
            if(boxFSet.length){
                boxFSet[boxFSet.length-1].innerBoxesData = [];
                for(var i=0;i<boxes.length;i++){
                    boxFSet[boxFSet.length-1].innerBoxesData[i] = boxes[i].data;
                    boxFSet[boxFSet.length - 1].data.innerBoxesData[i] = boxFSet[boxFSet.length - 1].innerBoxesData[i];
                }
                console.log(boxFSet[boxFSet.length-1].innerBoxes);
            }
            
        }
    console.log('remvoeB',boxes);
    }
}
