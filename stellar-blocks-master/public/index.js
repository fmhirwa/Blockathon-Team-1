var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

var ul = document.getElementById("transactions");

var handleFetchTransactions = () => {
    server.transactions()
        .call()
        .then(function (page) {
            console.log('Page 1: ');
            console.log(page.records);
            page.records.forEach(record => {
                var li = document.createElement("li");
                li.innerHTML = record["id"];
                ul.appendChild(li);
            });
            return page.next();
        })
        .then(function (page) {
            console.log('Page 2: ');
            console.log(page.records);
        })
        .catch(function (err) {
            console.log(err);
        });
}


window.onload = () => {
    //check if the user is currently logged in.
    fetch('/user').then(response => response.json()).then(jsonResponse => {
        console.log(" is user logged in..")
        if (!jsonResponse.username) return; // handle non-logged in user case.
        console.log("user is logged in..")

        let userInfo = document.createElement('div');
        userInfo.id = "user-info" //for styling
        userInfo.innerText = `Logged in as ${jsonResponse.username}`
        let logoutButton = document.createElement('button');
        logoutButton.id = "logout" // for styling
        logoutButton.innerText = "Logout"
        logoutButton.onclick = () => {
            postData('/logout', {}).then((sth) => {
                alert("Logout successful.")
                window.location.href = "/" // reload page.

            });
        }
        let accessDiv = document.getElementById('access-container');
        accessDiv.innerHTML = "" // remove existing forms :(

        accessDiv.appendChild(userInfo);
        accessDiv.appendChild(logoutButton);

    })
}


function postData(url, data) {
    return fetch(url,
        {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
}



function signMeUp() {
    const username = document.getElementById("signup-user").value;
    const password = document.getElementById("signup-pass").value;
    // send this to the server.

    postData('/signup', { username, password })
        .then(response => response.json()).then(response => {
            if (response.message)
                alert(response.message);
            else{
                alert("Sign up successful. Please log in.")
                window.location.href = "/" // reload page.
            }
        })

}


function signMeIn() {
    const username = document.getElementById("signin-user").value;
    const password = document.getElementById("signin-pass").value;
    // send this to the server.
    postData('/signin', { username, password })
        .then(response => response.json()).then(response => {
            if (response.message)
                alert(response.message);
            else{
                window.location.href = "/" // reload page.
            }
        })
}

