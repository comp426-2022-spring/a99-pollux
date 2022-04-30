

async function getJson(myname, mypassword, myemail){
    const response = await fetch('/app/register-user',{
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            name : myname,
            email: myemail,
            password: mypassword
        })})
    
    const my_json = await response.json();
    
    if (response.ok){
        window.location = "/html/loginPage.html";
    }
    else{

        alert("Could not register. Please check that all fields are filled out correctly.")
    }

}
document.getElementById("submit").onclick = function () {

    const myname = document.getElementById("name").value;
    const myemail= document.getElementById("email").value;
    const mypassword = document.getElementById("password").value;   
    getJson(myname,mypassword,myemail);
    
}