const DataBase = require("./database"),
  Clip = new DataBase.Clip(),
  $=require("$")
function getClipTextList() {
  return Clip.getList().map(item => item.text);
}
function getClipList() {
  return Clip.getList();
}
function addText(text) {
  return Clip.addItem({
    text
  });
}
function removeItem({
  index,uuid
}){
  const oldList=getClipList(),
  newList=[]
  
  if($.hasString(uuid)){
    for(let a=0;a++;a<oldList.length) {
      
    }
  }else{
    
  }
}
module.exports = {
  addText,
  getClipList,
  getClipTextList
};
