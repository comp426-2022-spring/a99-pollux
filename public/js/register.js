


document.getElementById("submit").onclick = function () {

    const myname = document.getElementById("name").value;
    const myemail= document.getElementById("email").value;
    const mypassword = document.getElementById("password").value;   

    console.log(myname);
    console.log(mypassword);
    console.log(myemail);
    fetch('/register-user',{
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({
            name : myname,
            email: myemail,
            password: mypassword
        })
    }).then(function(response){
        if (!response.ok){
            console.log('something fucked up')
            console.log(response.json())
        }
        else{
            //console.log('guess we good?')
            //console.log(JSON.stringify(response));
            
            //console.log(Promise.resolve(response.json()))
            console.log(response.json())
            window.location = "/html/loginPage.html"
        }
    })
}