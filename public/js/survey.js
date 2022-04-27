
//this function is from w3schools
function getCookie(cookieName){
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
    let [key,value] = el.split('=');
    cookie[key.trim()] = value;
  })
  return cookie[cookieName];
}
async function getJson3(mytoken, mymood){

    const d = new Date();
    const myyear = d.getFullYear();
    const mymonth = d.getMonth() + 1;
    const myday = d.getDate();


    const response = await fetch('/insert-wellness',{
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
    }
    else{
        console.log(my_json.message);
    }
    
}
document.getElementById("surveysubmit").onclick = function () {
    const mytoken = getCookie("token");
    const mymood = document.getElementById("mood_1").value; 
    getJson3(parseInt(mytoken), mymood);
    
}