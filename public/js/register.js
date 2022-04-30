

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
        console.log(my_json.message);
        alert("Could not register. Please check that all fields are filled out correctly.")
    }
    //console.log(my_json.message);
    //console.log(response.ok);
    //return my_json;
}
document.getElementById("submit").onclick = function () {

    const myname = document.getElementById("name").value;
    const myemail= document.getElementById("email").value;
    const mypassword = document.getElementById("password").value;   
    getJson(myname,mypassword,myemail);
    //console.log(getJson(myname,mypassword,myemail));


    // console.log(myname);
    // console.log(mypassword);
    // console.log(myemail);

    // const response = await fetch('/register-user',{
    //     method: 'post',
    //     headers: new Headers({'Content-Type': 'application/json'}),
    //     body: JSON.stringify({
    //         name : myname,
    //         email: myemail,
    //         password: mypassword
    //     })})
    
    // const my_json = await response.json();
    // console.log(my_json);
    /*
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
            console.log(response.json().message)
            window.location = "/html/loginPage.html";
        }
    })
    */
}