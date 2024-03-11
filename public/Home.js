let joinPopup = `<div class="absolute flex justify-center items-center z-10"
style="width:100%; height:100%; background-color: rgba(1,0,0,0.5);">
<div class="p-14 flex justify-center items-center btn-color" style="width: 800px; height: 275px;">
    <div class="relative w-auto h-auto text-center">

        <button id="exit_btn"
            class="absolute exit-btn flex justify-center items-center text-center pb-3" onclick="closeJoinRoom()"> x
        </button>

        <div class="textstroke">Join Room</div>
        <div id="roomcode" style="font-size: 50px; width: auto; height: 120px;"
            class="flex inp-color mt-4 pl-4 pr-4 text-left items-center">
            <label class="pr-3">Code :</label><input
                style="margin-right: 50px; width: 180px; border: none; outline: none;" maxlength="6"
                id="roomcodeinput" type="text" placeholder="######">
            <button class="ent-color pl-2 pr-2" style="font-size: 35px;" onclick="joinRoom()">Enter</button>
        </div>
    </div>
</div>
</div>`

const gameRef = firebase.database().ref("Game")
const ratingRef = firebase.database().ref("Rating")

if (document.location.href == "file:///d%3A/Web-Design/public/Home.html" || document.location.href == "https://pemdas-project.web.app/Home.html" || document.location.href == "Home.html") {
    gameRef.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            let currentUser = firebase.auth().currentUser.displayName;
            let gameid = data.key;
            let user1 = data.val().user1
            let user2 = data.val().user2
            if (user1 == currentUser || user2 == currentUser) {
                user1 == currentUser ? gameRef.child(gameid).child("user1").remove().then(function () {
                    accountRef.once("value").then((snapshot) => {
                        snapshot.forEach((data) => {
                            let username = data.val().username
                            let accountid = data.key
                            if (currentUser == username) {
                                accountRef.child(accountid).child("roomCode").remove()
                            }
                        })
                    })
                    if (user2 == undefined) {
                        gameRef.child(gameid).remove()
                    }
                }) : gameRef.child(gameid).child("user2").remove().then(function () {
                    accountRef.once("value").then((snapshot) => {
                        snapshot.forEach((data) => {
                            let username = data.val().username
                            let accountid = data.key
                            if (currentUser == username) {
                                accountRef.child(accountid).child("roomCode").remove()
                            }
                        })
                    })
                    if (user1 == undefined) {
                        gameRef.child(gameid).remove()
                    }
                })
            }
        })
    })
}

function joinRoomPopup() {
    document.querySelector("#join-room").style = "width:100%; height:100%;"
    document.querySelector("#join-room").innerHTML = joinPopup
}

function joinRoom() {
    let currentUser = firebase.auth().currentUser;
    let currentCode = document.querySelector("#roomcodeinput").value
    gameRef.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            let gameData = data.key
            gameRef.child(gameData).update({
                table: [
                    "0", "1", "2", "3", "4",
                    "5", "6", "7", "8", "9",
                    "10", "11", "12", "13", "14",
                    "15", "16", "17", "18", "19",
                    "20", "21", "22", "23", "24",
                ],
                userWin: "",
                gameTurn: 1,
            })
            let roomCode = data.val().roomCode
            if (roomCode == currentCode) {
                accountRef.once("value").then((snapshot) => {
                    snapshot.forEach((data) => {
                        let id = data.key
                        let username = data.val().username
                        if (username == currentUser.displayName) {
                            accountRef.child(id).update({
                                roomCode: roomCode
                            }).then(function () {
                                gameRef.child(gameData).update({
                                    user2: currentUser.displayName
                                }).then(function () {
                                    document.location.href = "Game.html"
                                })
                            })
                        }
                    })
                })
            }
        })
    })
}

function closeJoinRoom() {
    document.querySelector("#join-room").style = ""
    document.querySelector("#join-room").innerHTML = ""
}

let isInGame = false;

function createRoom() {
    gameRef.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            let currentUser = firebase.auth().currentUser.displayName
            let user1 = data.val().user1
            let user2 = data.val().user2
            if (user1 == currentUser || user2 == currentUser) {
                isInGame = true
            }
        })
    }).then(function () {
        if (!isInGame) {
            let roomCode = Math.random().toString(36).substring(2, 8);
            console.log("Room created! Code is " + roomCode)
            let currentUser = firebase.auth().currentUser;
            accountRef.once("value").then((snapshot) => {
                snapshot.forEach((data) => {
                    let id = data.key
                    let username = data.val().username
                    if (username == currentUser.displayName) {
                        accountRef.child(id).update({
                            roomCode: roomCode
                        }).then(function () {
                            gameRef.push({
                                roomCode: roomCode,
                                user1: currentUser.displayName
                            }).then(function () {
                                document.location.href = "Game.html"
                            })
                        })
                    }
                })
            })
        } else {
            accountRef.once("value").then((snapshot) => {
                snapshot.forEach((data) => {
                    let currentUser = firebase.auth().currentUser
                    let accountid = data.key
                    let username = data.val().username
                    if (username == currentUser.displayName) {
                        gameRef.once("value").then((snapshot) => {
                            snapshot.forEach((data) => {
                                let gameRoomCode = data.val().roomCode
                                let user1 = data.val().user1
                                let user2 = data.val().user2
                                if (user1 == currentUser.displayName || user2 == currentUser.displayName) {
                                    accountRef.child(accountid).update({
                                        roomCode: gameRoomCode
                                    }).then(function () {
                                        document.location.href = "Game.html"
                                    })
                                }
                            })
                        })
                    }
                })
            })
        }
    })

}

tutorialImg = [`https://media.discordapp.net/attachments/986985862631915541/1209050641763278869/image.png?ex=65f7f828&is=65e58328&hm=0d74d9885a57bd7293a010a079791a111f9857835d53c39676888635d32849f0&=&format=webp&quality=lossless&width=982&height=451`, `https://cdn.discordapp.com/attachments/986985862631915541/1209050876996751430/image.png?ex=65f7f860&is=65e58360&hm=08184d6fbce556026f9c89161f0ca4b6b8180e7c700228d79bd5b9b46efe5e4c&`, `https://cdn.discordapp.com/attachments/986985862631915541/1209050945049067560/image.png?ex=65f7f870&is=65e58370&hm=ce064b9626b35dc9606d1e5d002672faf7a59846bd62106aa9f2b558947260b7&`, `https://cdn.discordapp.com/attachments/986985862631915541/1209051011679912017/image.png?ex=65f7f880&is=65e58380&hm=061b75e3d25522f1ed959b622ab1276148254ed241e05a6cc78c8c02f1e3df31&`, `https://cdn.discordapp.com/attachments/986985862631915541/1209051065371336704/image.png?ex=65f7f88d&is=65e5838d&hm=3760ab0b801057741bf9be8c132175c07633982fdbc6dd907f842ce7d879c6a2&`, `https://cdn.discordapp.com/attachments/986985862631915541/1209051140205842502/image.png?ex=65f7f89e&is=65e5839e&hm=e7904e9931b851d4760f8c53f7e5ae017978d8ff2971eee0ffa7eae82d579c76&`]

let tutorialImgCount = 0

function tutorial() {
    document.querySelector("#tutorial").innerHTML = `<div class="relative flex justify-center items-center z-10"
    style="width:100vw; height:100vh; background-color: rgba(1,0,0,0.5);">
    <div class="relative flex justify-center items-center btn-color" style="width: 70vw; height: 90vh;">
        <div class="text-center">
                <div class="flex justify-center mt-4">
                    <img style="width: 70vw;" src="${tutorialImg[tutorialImgCount]}">
                </div>
            <div class="relative flex justify-center items-center m-4">
                <button class="tutorial-btn flex justify-center items-center btn-color" onclick="closeTutorial()">
                    <span class="textstroke" style="font-size: 35px;">Close</span>
                </button>
                <div class="tutorial-btn flex justify-center items-center btn-color"
                style="margin-left: 10vw; margin-right: 10vw;">
                    <span class="textstroke" style="font-size: 35px;">
                        <span id="tutorial-page">${tutorialImgCount + 1}</span>/6
                    </span>
                </div>
                <button class="tutorial-btn flex justify-center items-center btn-color" onclick="nextTutorial()">
                    <span class="textstroke relative" style="font-size: 35px;">Next</span>
                </button>
            </div>
        </div>
    </div>
    </div>`
}

function nextTutorial() {
    tutorialImgCount += 1
    tutorialImgCount == 5 ? document.querySelector("#tutorial").innerHTML = `<div class="relative flex justify-center items-center z-10"
    style="width:100vw; height:100vh; background-color: rgba(1,0,0,0.5);">
    <div class="relative flex justify-center items-center btn-color" style="width: 70vw; height: 90vh;">
        <div class="text-center">
                <div class="flex justify-center mt-4">
                    <img style="width: 70vw;" src="${tutorialImg[tutorialImgCount]}">
                </div>
            <div class="relative flex justify-center items-center m-4">
                <button class="tutorial-btn flex justify-center items-center btn-color" onclick="backTutorial()">
                    <span class="textstroke" style="font-size: 35px;">Back</span>
                </button>
                <div class="tutorial-btn flex justify-center items-center btn-color"
                style="margin-left: 10vw; margin-right: 10vw;">
                    <span class="textstroke" style="font-size: 35px;">
                        <span id="tutorial-page">${tutorialImgCount + 1}</span>/6
                    </span>
                </div>
                <button class="tutorial-btn flex justify-center items-center btn-color" onclick="closeTutorial()">
                    <span class="textstroke relative" style="font-size: 35px;">Close</span>
                </button>
            </div>
        </div>
    </div>
    </div>` : document.querySelector("#tutorial").innerHTML = `<div class="relative flex justify-center items-center z-10"
    style="width:100vw; height:100vh; background-color: rgba(1,0,0,0.5);">
    <div class="relative flex justify-center items-center btn-color" style="width: 70vw; height: 90vh;">
        <div class="text-center">
                <div class="flex justify-center mt-4">
                    <img style="width: 70vw;" src="${tutorialImg[tutorialImgCount]}">
                </div>
            <div class="relative flex justify-center items-center m-4">
                <button class="tutorial-btn flex justify-center items-center btn-color" onclick="backTutorial()">
                    <span class="textstroke" style="font-size: 35px;">Back</span>
                </button>
                <div class="tutorial-btn flex justify-center items-center btn-color"
                style="margin-left: 10vw; margin-right: 10vw;">
                    <span class="textstroke" style="font-size: 35px;">
                        <span id="tutorial-page">${tutorialImgCount + 1}</span>/6
                    </span>
                </div>
                <button class="tutorial-btn flex justify-center items-center btn-color" onclick="nextTutorial()">
                    <span class="textstroke relative" style="font-size: 35px;">Next</span>
                </button>
            </div>
        </div>
    </div>
    </div>`
}

function backTutorial() {
    tutorialImgCount -= 1
    tutorialImgCount == 0 ? document.querySelector("#tutorial").innerHTML = `<div class="relative flex justify-center items-center z-10"
    style="width:100vw; height:100vh; background-color: rgba(1,0,0,0.5);">
    <div class="relative flex justify-center items-center btn-color" style="width: 70vw; height: 90vh;">
        <div class="text-center">
                <div class="flex justify-center mt-4">
                    <img style="width: 70vw;" src="${tutorialImg[tutorialImgCount]}">
                </div>
            <div class="relative flex justify-center items-center m-4">
                <button class="tutorial-btn flex justify-center items-center btn-color" onclick="closeTutorial()">
                    <span class="textstroke" style="font-size: 35px;">close</span>
                </button>
                <div class="tutorial-btn flex justify-center items-center btn-color"
                style="margin-left: 10vw; margin-right: 10vw;">
                    <span class="textstroke" style="font-size: 35px;">
                        <span id="tutorial-page">${tutorialImgCount + 1}</span>/6
                    </span>
                </div>
                <button class="tutorial-btn flex justify-center items-center btn-color" onclick="nextTutorial()">
                    <span class="textstroke relative" style="font-size: 35px;">Next</span>
                </button>
            </div>
        </div>
    </div>
    </div>` : document.querySelector("#tutorial").innerHTML = `<div class="relative flex justify-center items-center z-10"
    style="width:100vw; height:100vh; background-color: rgba(1,0,0,0.5);">
    <div class="relative flex justify-center items-center btn-color" style="width: 70vw; height: 90vh;">
        <div class="text-center">
                <div class="flex justify-center mt-4">
                    <img style="width: 70vw;" src="${tutorialImg[tutorialImgCount]}">
                </div>
            <div class="relative flex justify-center items-center m-4">
                <button class="tutorial-btn flex justify-center items-center btn-color" onclick="backTutorial()">
                    <span class="textstroke" style="font-size: 35px;">Back</span>
                </button>
                <div class="tutorial-btn flex justify-center items-center btn-color"
                style="margin-left: 10vw; margin-right: 10vw;">
                    <span class="textstroke" style="font-size: 35px;">
                        <span id="tutorial-page">${tutorialImgCount + 1}</span>/6
                    </span>
                </div>
                <button class="tutorial-btn flex justify-center items-center btn-color" onclick="nextTutorial()">
                    <span class="textstroke relative" style="font-size: 35px;">Next</span>
                </button>
            </div>
        </div>
    </div>
    </div>`
}

function closeTutorial() {
    tutorialImgCount = 0
    document.querySelector("#tutorial").innerHTML = ""
}

function leaderBoard() {
    document.querySelector("#leaderboard").innerHTML = `
    <div class="relative flex justify-center items-center z-10" style="width:100vw; height:100vh; background-color: rgba(1,0,0,0.5);">
        <div class="relative flex justify-center btn-color p-10" style="width: 40vw; height: 90vh;">
            <button id="exit_leaderboard"
                class="absolute exit-leaderboard flex justify-center items-center text-center pb-3" onclick="closeLeaderBoard()"> x
            </button>
            <div class="text-center textstroke">
                <div style="font-size: calc(1.5vw + 1.5vh); margin-bottom:10px;">Leaderboard</div>
                <div class="leaderboard-frame p-4 flex justify-center">
                    <div style="height:fit-content; width:100%;">
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh);">
                            <div class="space">Rank</div>
                            <div>Name</div>
                            <div class="container flex justify-end pr-3"><span>Win</span></div>
                        </div>
                        <div class="overflow-scroll" style="height:55vh; scrollbar-width: none; scrollbar-height: none;" id="leaderList">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    let countLeaderList = 1;
    accountRef.orderByChild("orderScore").limitToLast(50).once("value", function (snapshot) {
        snapshot.forEach((data) => {
            let username = data.val().username
            let winScore = data.val().winScore
            const newDiv = `
            <div class="flex justify-start ml-6" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                <div id="Urank" style="width: 150px; text-align:left;">${countLeaderList}</div>
                <div id="Uname">${username}</div>
                <div class="container flex justify-end mr-12"><span id="Uwin">${winScore}</span></div>
            </div>`
            const newElement = document.createRange().createContextualFragment(newDiv);
            document.querySelector("#leaderList").appendChild(newElement)
            countLeaderList += 1
        })
    })
}

function closeLeaderBoard() {
    document.querySelector("#leaderboard").innerHTML = ""
}

function rating() {
    document.querySelector("#rating").innerHTML = `<div class="relative flex justify-center items-center z-10"
    style="width:100vw; height:100vh; background-color: rgba(1,0,0,0.5);">
    <div class="relative flex justify-center btn-color p-10" style="width: 35vw; height: 40vh;">
        <button id="exit_leaderboard"
            class="absolute exit-leaderboard flex justify-center items-center text-center pb-3" onclick="closeRating()"> x
        </button>
        <div class="text-center textstroke">
            <div style="font-size: calc(2vw + 2vh); margin-bottom:20px;">Rating</div>
            <div style="font-size: 50px;" class="flex mt-4 pl-4 pr-4 text-left items-center">
                <span class="fa fa-star uncheck" id="star1" onmouseover="hoverStar(this)"></span>
                <span class="fa fa-star uncheck" id="star2" onmouseover="hoverStar(this)"></span>
                <span class="fa fa-star uncheck" id="star3" onmouseover="hoverStar(this)"></span>
                <span class="fa fa-star uncheck" id="star4" onmouseover="hoverStar(this)"></span>
                <span class="fa fa-star uncheck" id="star5" onmouseover="hoverStar(this)"></span>
            </div>

        </div>
    </div>
</div>`
    let allStars = document.querySelectorAll(".fa-star")
    allStars.forEach(function (star) {
        star.addEventListener("click", clickedStar)
    })
}

function hoverStar(event) {
    switch (event.id) {
        case "star1":
            document.querySelector("#star1").style.color = "#EA5455"
            document.querySelector("#star2").style.color = "#2D4059"
            document.querySelector("#star3").style.color = "#2D4059"
            document.querySelector("#star4").style.color = "#2D4059"
            document.querySelector("#star5").style.color = "#2D4059"
            break;
        case "star2":
            document.querySelector("#star1").style.color = "#EA5455"
            document.querySelector("#star2").style.color = "#EA5455"
            document.querySelector("#star3").style.color = "#2D4059"
            document.querySelector("#star4").style.color = "#2D4059"
            document.querySelector("#star5").style.color = "#2D4059"
            break;
        case "star3":
            document.querySelector("#star1").style.color = "#EA5455"
            document.querySelector("#star2").style.color = "#EA5455"
            document.querySelector("#star3").style.color = "#EA5455"
            document.querySelector("#star4").style.color = "#2D4059"
            document.querySelector("#star5").style.color = "#2D4059"
            break;
        case "star4":
            document.querySelector("#star1").style.color = "#EA5455"
            document.querySelector("#star2").style.color = "#EA5455"
            document.querySelector("#star3").style.color = "#EA5455"
            document.querySelector("#star4").style.color = "#EA5455"
            document.querySelector("#star5").style.color = "#2D4059"
            break;
        case "star5":
            document.querySelector("#star1").style.color = "#EA5455"
            document.querySelector("#star2").style.color = "#EA5455"
            document.querySelector("#star3").style.color = "#EA5455"
            document.querySelector("#star4").style.color = "#EA5455"
            document.querySelector("#star5").style.color = "#EA5455"
            break;
    }
}

function clickedStar(event) {
    document.querySelector("#rating").innerHTML = ""
    accountRef.once("value", (snapshot) => {
        snapshot.forEach((data) => {
            let currentUser = firebase.auth().currentUser.displayName
            let username = data.val().username
            let accountid = data.key
            if (currentUser == username) {
                switch (event.target.id) {
                    case "star1":
                        accountRef.child(accountid).update({
                            rate: 1
                        })
                        break;
                    case "star2":
                        accountRef.child(accountid).update({
                            rate: 2
                        })
                        break;
                    case "star3":
                        accountRef.child(accountid).update({
                            rate: 3
                        })
                        break;
                    case "star4":
                        accountRef.child(accountid).update({
                            rate: 4
                        })
                        break;
                    case "star5":
                        accountRef.child(accountid).update({
                            rate: 5
                        })
                        break;
                }
            }
        })
    }).then(function () {
        document.querySelector("#rating").innerHTML = `
        <div class="relative flex justify-center items-center z-10"
        style="width:100vw; height:100vh; background-color: rgba(1,0,0,0.5);">
            <div class="relative flex justify-center btn-color p-10" style="width: 35vw; height: 40vh;">
                <button id="exit_leaderboard"
                    class="absolute exit-leaderboard flex justify-center items-center text-center pb-3" onclick="closeRating()"> x
                </button>
                <div class="text-center textstroke" style="display: flex;align-items: center;">
                    <div style="font-size: calc(3vw + 3vh);">Thank you</div>
                </div>
            </div>
        </div>`
        let sumRate = 0;
        let rateCount = 0;
        accountRef.once("value", (snapshot) => {
            snapshot.forEach((data) => {
                let rate = data.val().rate
                if(rate != undefined){
                    sumRate += rate
                    rateCount += 1
                }
            })
        }).then(function(){
            ratingRef.update({
                gameRating: parseFloat(sumRate/rateCount).toFixed(1)
            })
        })
    })
}

function closeRating() {
    document.querySelector("#rating").innerHTML = ""
}
