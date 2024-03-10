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
                        gameRef.once("value").then((snapshot)=>{
                            snapshot.forEach((data)=>{
                                let gameRoomCode = data.val().roomCode
                                let user1 = data.val().user1
                                let user2 = data.val().user2
                                if(user1 == currentUser.displayName || user2 == currentUser.displayName){
                                    accountRef.child(accountid).update({
                                        roomCode : gameRoomCode
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

tutorialImg = [`https://firebasestorage.googleapis.com/v0/b/pemdas-project.appspot.com/o/tutorial-1.png?alt=media&token=24d49beb-ed02-4a66-8a2d-4f00a07fdd4f`, `https://firebasestorage.googleapis.com/v0/b/pemdas-project.appspot.com/o/tutorial-2.png?alt=media&token=48cd2ea7-ae47-486a-ac96-6b36dd6b6d7f`, `https://firebasestorage.googleapis.com/v0/b/pemdas-project.appspot.com/o/tutorial-3.png?alt=media&token=0822160e-0c07-4e8a-9013-22cdca65d4f8`, `https://firebasestorage.googleapis.com/v0/b/pemdas-project.appspot.com/o/tutorial-4.png?alt=media&token=c5f74fbc-0627-4464-95b3-bdf1be9d617e`, `https://firebasestorage.googleapis.com/v0/b/pemdas-project.appspot.com/o/tutorial-5.png?alt=media&token=d06e0d9e-0ed1-4f83-b031-0784e7a37c74`, `https://firebasestorage.googleapis.com/v0/b/pemdas-project.appspot.com/o/tutorial-6.png?alt=media&token=46c78730-c3b8-40f1-9179-38f762334ca8`]

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
    document.querySelector("#leaderboard").innerHTML = `<div class="relative flex justify-center items-center z-10"
    style="width:100vw; height:100vh; background-color: rgba(1,0,0,0.5);">
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
                    <div class="overflow-scroll" style="height:55vh; scrollbar-width: none; scrollbar-height: none;">
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>
                        <div class="flex justify-start" style="font-size: calc(1.5vw + 1.5vh); height:fit-content; width:100%;">
                            <div id="Urank" style="width: 150px; text-align:left;">1</div>
                            <div id="Uname">Karn</div>
                            <div class="container flex justify-end"><span id="Uwin">999</span></div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>
</div>`
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
                <span class="fa fa-star uncheck"></span>
                <span class="fa fa-star uncheck"></span>
                <span class="fa fa-star uncheck"></span>
                <span class="fa fa-star uncheck"></span>
                <span class="fa fa-star uncheck"></span>
            </div>

        </div>
    </div>
</div>`
}

function closeRating() {
    document.querySelector("#rating").innerHTML = ""
}