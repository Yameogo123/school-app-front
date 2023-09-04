


export function adaptSelect(array, i=0){
    const arr= array.map((el)=>{
        if(i===0){
            el["value"]= el["_id"] || el["libelle"]
            el["label"]= el["libelle"]
        }else{
            el["value"]= el["_id"]
            el["label"]= el["nom"]+" "+ el["prenom"]
        }
        return el
    });
    return arr
}

export function retirerAccent(str){
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}