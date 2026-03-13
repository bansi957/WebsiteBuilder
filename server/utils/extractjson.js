const extractjson=async (text)=>{
    if(!text){
        return null
    }
    const cleaned =text.replace(/```json/gi, "")
    .replace(/```/gi, "")
    .trim();
    const firtBracketIndex=cleaned.indexOf("{")
    const lastBracketIndex=cleaned.lastIndexOf("}")
    if(firtBracketIndex===-1 || lastBracketIndex===-1){
       return null
    }
    return JSON.parse(cleaned.slice(firtBracketIndex, lastBracketIndex + 1))

}

module.exports=extractjson