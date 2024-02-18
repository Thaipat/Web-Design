const accountRef = firebase.database().ref("Account")

const signinUsernameFeedback = `<img style="scale: 0.8;" src="https://media.discordapp.net/attachments/986985862631915541/1208838842958876672/icon-alert.png?ex=65e4bde7&is=65d248e7&hm=f16af1f41fe2458140aa58e2b0f68f18d262ecf316ef28919a6aef09ae9c00df&=&format=webp&quality=lossless&width=51&height=60">
<span class="feedback-text-color">Couldn't find your username</span>`

const signinPasswordFeedback = `<img style="scale: 0.8;" src="https://media.discordapp.net/attachments/986985862631915541/1208838842958876672/icon-alert.png?ex=65e4bde7&is=65d248e7&hm=f16af1f41fe2458140aa58e2b0f68f18d262ecf316ef28919a6aef09ae9c00df&=&format=webp&quality=lossless&width=51&height=60">
<span class="feedback-text-color">Password is incorrect</span>`

const signupUsernameFeedback = `<img style="scale: 0.8;" src="https://media.discordapp.net/attachments/986985862631915541/1208838842958876672/icon-alert.png?ex=65e4bde7&is=65d248e7&hm=f16af1f41fe2458140aa58e2b0f68f18d262ecf316ef28919a6aef09ae9c00df&=&format=webp&quality=lossless&width=51&height=60">
<span class="feedback-text-color">Username is already use</span>`

const signupPasswordFeedback = `<img style="scale: 0.8;" src="https://media.discordapp.net/attachments/986985862631915541/1208838842958876672/icon-alert.png?ex=65e4bde7&is=65d248e7&hm=f16af1f41fe2458140aa58e2b0f68f18d262ecf316ef28919a6aef09ae9c00df&=&format=webp&quality=lossless&width=51&height=60">
<span class="feedback-text-color">Confirm password is not match</span>`

function signinAccount() {
    accountRef.once("value").then((snapshot) => {
        let checkUsername = false
        snapshot.forEach(function (data) {
            var id = data.key;
            var username = data.val().username;
            var password = data.val().password;

            let currentUsername = document.querySelector("#user_id").value
            let currentPassword = document.querySelector("#password_id").value

            if (currentUsername == username) {
                console.log("Username valid")
                checkUsername = true;
                document.querySelector("#username-feedback").innerHTML = ""
                if (password == currentPassword) {
                    console.log("Password valid")
                    document.querySelector("#password-feedback").innerHTML = ""
                    document.querySelector("#username-feedback").innerHTML = ""
                    document.location.href = "Home.html";
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
                document.querySelector("#signup-username-feedback").innerHTML = `<img style="scale: 0.8;" src="https://media.discordapp.net/attachments/986985862631915541/1208838842958876672/icon-alert.png?ex=65e4bde7&is=65d248e7&hm=f16af1f41fe2458140aa58e2b0f68f18d262ecf316ef28919a6aef09ae9c00df&=&format=webp&quality=lossless&width=51&height=60">
                <span class="feedback-text-color">Username cannot be empty</span>`
                usernameValid = false
            } else if (username == currentUsername) {
                document.querySelector("#register_id").value = ""
                document.querySelector("#signup-username-feedback").innerHTML = signupUsernameFeedback
                usernameValid = false
            }
        })
        if (usernameValid) {
            document.querySelector("#signup-username-feedback").innerHTML = ""
            if(currentPassword == ""){
                document.querySelector("#confirmpassword-feedback").innerHTML = `<img style="scale: 0.8;" src="https://media.discordapp.net/attachments/986985862631915541/1208838842958876672/icon-alert.png?ex=65e4bde7&is=65d248e7&hm=f16af1f41fe2458140aa58e2b0f68f18d262ecf316ef28919a6aef09ae9c00df&=&format=webp&quality=lossless&width=51&height=60">
                <span class="feedback-text-color">Password cannot be empty</span>`
            }else if (currentPassword == confirmPassword) {
                accountRef.push({
                    username: currentUsername,
                    password: currentPassword,
                })
                document.location.href = "SignIn.html"
            }else {
                document.querySelector("#register_Cpassword").value = ""
                document.querySelector("#confirmpassword-feedback").innerHTML = signupPasswordFeedback
            }
        }
    })
}