const accountRef = firebase.database().ref("Account")

let signinForm = document.querySelector("#login_btn")
signinForm.addEventListener("click", signinAccount)

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
                if(password == currentPassword){
                    console.log("Password valid")
                    document.location.href = "Home.html";
                }
            }
        });
    })
}

let getList = (user) => {
    if (user) {
        userListRef.child(user.uid).on("value", (snapshot) => {
            signinAccount(snapshot);
        })
    }
}