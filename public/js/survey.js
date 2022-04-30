

function getCookie(cookieName){
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
    let [key,value] = el.split('=');
    cookie[key.trim()] = value;
  })
  return cookie[cookieName];
}

async function logout(mytoken){

    


    const response = await fetch('/app/logout-user',{
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            
            token: mytoken

        })})
    
    const my_json = await response.json();
    
    if (response.ok){

       console.log('we good'); 
       console.log(my_json.message)
       document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
       window.location = "/html/loginPage.html";
    }
    else{
        console.log(my_json.message);
    }
    
}

async function getJson3(mytoken, mymood){

    const d = new Date();
    const myyear = d.getFullYear();
    const mymonth = d.getMonth() + 1;
    const myday = d.getDate();


    const response = await fetch('/app/insert-wellness',{
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            
            token: mytoken,
            wellness : mymood,
            day : myday,
            month : mymonth,
            year : myyear

        })})
    
    const my_json = await response.json();
    
    if (response.ok){

       console.log('we good'); 
       console.log(my_json.message)
       window.location = "/html/graph.html"
    }
    else{
        console.log(my_json.message);
    }
    
}

document.getElementById("logout").onclick = function() {
    //document.cookie = "token=; Max-Age=-99999999;"
    const mytoken = getCookie("token");
    logout(parseInt(mytoken));
    
}

document.getElementById("surveysubmit").onclick = function () {
    const mytoken = getCookie("token");
    const mymood = document.getElementById("mood_1").value; 
    getJson3(parseInt(mytoken), mymood);


    
}