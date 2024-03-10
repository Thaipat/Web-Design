const accountRef = firebase.database().ref("Account")

const signinUsernameFeedback = `<img style="scale: 0.8; max-height: 2rem" src="https://cdn.discordapp.com/attachments/986985862631915541/1216332297213837363/image.png?ex=660000ba&is=65ed8bba&hm=b265c9493aa2c9238ba0b02945cd1b50b2c8ccdcfa27f6556bc7cd3ff776c92e&">
<span class="feedback-text-color">Couldn't find your username</span>`

const signinPasswordFeedback = `<img style="scale: 0.8; max-height: 2rem" src="https://cdn.discordapp.com/attachments/986985862631915541/1216332297213837363/image.png?ex=660000ba&is=65ed8bba&hm=b265c9493aa2c9238ba0b02945cd1b50b2c8ccdcfa27f6556bc7cd3ff776c92e&">
<span class="feedback-text-color">Password is incorrect</span>`

const signupUsernameFeedback = `<img style="scale: 0.8; max-height: 2rem" src="https://cdn.discordapp.com/attachments/986985862631915541/1216332297213837363/image.png?ex=660000ba&is=65ed8bba&hm=b265c9493aa2c9238ba0b02945cd1b50b2c8ccdcfa27f6556bc7cd3ff776c92e&">
<span class="feedback-text-color">Username is already use</span>`

const signupPasswordFeedback = `<img style="scale: 0.8; max-height: 2rem" src="https://cdn.discordapp.com/attachments/986985862631915541/1216332297213837363/image.png?ex=660000ba&is=65ed8bba&hm=b265c9493aa2c9238ba0b02945cd1b50b2c8ccdcfa27f6556bc7cd3ff776c92e&">
<span class="feedback-text-color">Confirm password is not match</span>`

function signOutAccount() {
    console.log("Logout!")
    firebase.auth().signOut().then(function () {
        location.href = 'index.html'
    })
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("User :", user)
    }
})

function signinAccount() {
    accountRef.once("value").then((snapshot) => {
        let checkUsername = false
        snapshot.forEach(function (data) {
            var username = data.val().username;
            var password = data.val().password;

            let currentUsername = document.querySelector("#user_id").value
            let currentPassword = document.querySelector("#password_id").value



            if (currentUsername == username) {
                checkUsername = true;
                document.querySelector("#username-feedback").innerHTML = ""
                if (password == currentPassword) {
                    document.querySelector("#password-feedback").innerHTML = ""
                    document.querySelector("#username-feedback").innerHTML = ""
                    let email = currentUsername + "@it.kmitl.ac.th"
                    firebase.auth().signInWithEmailAndPassword(email, currentPassword)
                        .then(function (result) {
                            result.user.updateProfile({
                                displayName: username
                            }).then(function () {
                                document.location.href = "Home.html";
                            })
                        })
                } else {
                    document.querySelector("#password_id").value = ""
                    document.querySelector("#password-feedback").innerHTML = signinPasswordFeedback
                }
            }
        });
        if (!checkUsername) {
            document.querySelector("#user_id").value = ""
            document.querySelector("#password_id").value = ""
            document.querySelector("#password-feedback").innerHTML = ""
            document.querySelector("#username-feedback").innerHTML = signinUsernameFeedback
        }
    })
}

function signupAccount() {
    let currentUsername = document.querySelector("#register_id").value
    let currentPassword = document.querySelector("#register_password").value
    let confirmPassword = document.querySelector("#register_Cpassword").value
    let usernameValid = true

    accountRef.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            var username = data.val().username;

            if (currentUsername == "") {
                document.querySelector("#register_password").value = ""
                document.querySelector("#register_Cpassword").value = ""
                document.querySelector("#signup-username-feedback").innerHTML = `<img style="scale: 0.8; max-height: 2rem" src="https://cdn.discordapp.com/attachments/986985862631915541/1216332297213837363/image.png?ex=660000ba&is=65ed8bba&hm=b265c9493aa2c9238ba0b02945cd1b50b2c8ccdcfa27f6556bc7cd3ff776c92e&">
                <span class="feedback-text-color">Username cannot be empty</span>`
                usernameValid = false
            } else if (username == currentUsername) {
                document.querySelector("#register_id").value = ""
                document.querySelector("#register_password").value = ""
                document.querySelector("#register_Cpassword").value = ""
                document.querySelector("#signup-username-feedback").innerHTML = signupUsernameFeedback
                usernameValid = false
            }
        })
        if (usernameValid) {
            document.querySelector("#signup-username-feedback").innerHTML = ""
            if (currentPassword == "") {
                document.querySelector("#register_Cpassword").value = ""
                document.querySelector("#confirmpassword-feedback").innerHTML = `<img style="scale: 0.8; max-height: 2rem" src="https://cdn.discordapp.com/attachments/986985862631915541/1216332297213837363/image.png?ex=660000ba&is=65ed8bba&hm=b265c9493aa2c9238ba0b02945cd1b50b2c8ccdcfa27f6556bc7cd3ff776c92e&">
                <span class="feedback-text-color">Password cannot be empty</span>`
            } else if (currentPassword.length < 6) {
                document.querySelector("#register_password").value = ""
                document.querySelector("#register_Cpassword").value = ""
                document.querySelector("#confirmpassword-feedback").innerHTML = `<img style="scale: 0.8; max-height: 2rem" src="https://cdn.discordapp.com/attachments/986985862631915541/1216332297213837363/image.png?ex=660000ba&is=65ed8bba&hm=b265c9493aa2c9238ba0b02945cd1b50b2c8ccdcfa27f6556bc7cd3ff776c92e&">
                <span class="feedback-text-color">Password must be at least 6</span>`
            } else if (currentPassword == confirmPassword) {
                let email = currentUsername + "@it.kmitl.ac.th"
                console.log(email)
                firebase.auth().createUserWithEmailAndPassword(email, currentPassword).then(function () {
                    accountRef.push({
                        username: currentUsername,
                        password: currentPassword,
                        winScore: 0,
                        orderScore: 1000000,
                    })
                    firebase.auth().signOut().then(function(){
                        document.location.href = "index.html"
                    })
                })
            } else {
                document.querySelector("#register_Cpassword").value = ""
                document.querySelector("#confirmpassword-feedback").innerHTML = signupPasswordFeedback
            }
        }
    })
}
