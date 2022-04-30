

async function getJson2(myemail, mypassword){
    const response = await fetch('/app/login-user',{
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({

            email: myemail,
            password: mypassword
        })})
    
    const my_json = await response.json();
    
    if (response.ok){

        const token = my_json.loginToken;

        document.cookie = "token=" + token + "; path=/";

        window.location = "/html/surveyPage.html"
    }
    else{

        alert("Incorrect Login. Please check your email and password are correct.")
    }
    
}
document.getElementById("login").onclick = function () {

    const myemail= document.getElementById("email").value;
    const mypassword = document.getElementById("password").value;   
    getJson2(myemail, mypassword);
    
}