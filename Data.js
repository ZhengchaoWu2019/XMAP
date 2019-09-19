function Data(boxId,parentId,innerBoxesData,px,py,color,title,date,content,thisLayer,lineDatas){
    this.boxId = boxId;
    this.px = px;
    this.py = py;
    this.color = color;
    this.title = title;
    this.date = date;
    this.content = content;
    this.parentId = parentId;
    this.innerBoxesData = innerBoxesData;
    this.layer = thisLayer;
    this.lineDatas = lineDatas;
}