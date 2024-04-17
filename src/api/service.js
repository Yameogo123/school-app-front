export const API= "http://localhost:3000" //   



export async function Send(link, data, stringify=true, tok=""){
    let head={
        //'Content-Type': 'multipart/form-data',
        authorization:"Bearer "+tok,
    }
    if(stringify){
        head={
            'Content-Type' : 'application/json',
            "authorization"  : "Bearer "+tok,
        }
    }
    const options = {
        method: 'post',
        headers: head,
        body: stringify ? JSON.stringify(data) : data
    };
    const response = await fetch(API+link, options);
    return response.json();
}

export async function SendMessage(data){
    let head={
        'Content-Type' : 'application/json',
        //authorization:"Bearer "+tok,
    }
    const options = {
        method: 'post',
        headers: head,
        body: JSON.stringify(data),
        redirect: 'follow'
    };
    const response = await fetch("https://gateway.intechsms.sn/api/send-sms", options);
    return response.json();
}

// export async function SendMail(data, userID="tryntry23@gmail.com"){
//     let head={
//         'Content-Type' : 'application/json',
//         //authorization:"Bearer "+tok,
//     }
//     const options = {
//         method: 'post',
//         headers: head,
//         body: JSON.stringify(data),
//         redirect: 'follow'
//     };
//     const response = await fetch("https://gmail.googleapis.com//gmail/v1/users/"+userID+"/messages/send", options);
//     return response.json();
// }

export async function Get(link, tok=""){
    const options = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            authorization:"Bearer "+tok,
        }
    };
    const response = await fetch(API+link, options);
    //if(response.statusText=== "Unauthorized") window.location.reload()
    return response.json();
}

export async function Update(link, data, stringify=true, tok=""){
    let head={
        //'Content-Type': 'application/json',
        authorization:"Bearer "+tok,
    }
    if(stringify){
        head={
            'Content-Type':  'application/json',
            authorization:"Bearer "+tok,
            'Accept': 'application/json',
        }
    }
    const options = {
        method: 'put',
        headers: head,
        body: stringify ? JSON.stringify(data) : data
    }; 
    const response = await fetch(API+link, options);
    return response.json();
}

export async function Remove(link, tok=""){ 
    const options = {
        method: 'delete',
        headers: {
            //'Content-Type': 'application/json',
            authorization:"Bearer "+tok,
        },
        Authorization:"Bearer "+tok,
    };
    const response = await fetch(API+link, options);
    return response.json();
}

