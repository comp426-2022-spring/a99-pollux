

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
        console.log(my_json.message)
        document.cookie = "token=" + token + "; path=/";
        console.log(document.cookie)
        window.location = "/html/surveyPage.html"
    }
    else{
        console.log(my_json.message);
        alert("Incorrect Login. Please check your email and password are correct.")
    }
    
}
document.getElementById("login").onclick = function () {

    const myemail= document.getElementById("email").value;
    const mypassword = document.getElementById("password").value;   
    getJson2(myemail, mypassword);
    
}