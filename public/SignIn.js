const accountRef = firebase.database().ref("Account")

function signinAccount() {
    accountRef.once("value").then((snapshot) => {
        snapshot.forEach(function (data) {
            var id = data.key;
            var username = data.val().username;
            var password = data.val().password;

            let currentUsername = document.querySelector("#user_id").value
            let currentPassword = document.querySelector("#password_id").value

            if (currentUsername == username) {
                console.log("Username valid")
                if (password == currentPassword) {
                    console.log("Password valid")
                    document.location.href = "Home.html";
                }
            }
        });
    })
}

function signupAccount() {
    let username = document.querySelector("#register_id").value
    let password = document.querySelector("#register_password").value
    let confirmPassword = document.querySelector("#register_Cpassword").value

    if(password == confirmPassword){
        accountRef.push({
            username: username,
            password: password,
        })
        document.location.href = "SignIn.html"
    }
}