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

function createRoom() {
    let roomCode = Math.random().toString(36).substring(2, 7);
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
}

tutorialImg = [`https://media.discordapp.net/attachments/986985862631915541/1209050641763278869/image.png?ex=65e58328&is=65d30e28&hm=f5d89357cdc0fbfbde061ed2534f4d5524b05ffd3876daa88259138a45cd06fe&=&format=webp&quality=lossless&width=982&height=451`, `https://media.discordapp.net/attachments/986985862631915541/1209050876996751430/image.png?ex=65e58360&is=65d30e60&hm=ff3228e9dd3a5303246a99fee2d976a2e3f0958f1aa05b790adea4fd87b0b77b&=&format=webp&quality=lossless&width=981&height=457`, `https://media.discordapp.net/attachments/986985862631915541/1209050945049067560/image.png?ex=65e58370&is=65d30e70&hm=7ca15c654a8b05f8c56ed0e445990d7c456258f2811965c0bffa36b7e75e2958&=&format=webp&quality=lossless&width=687&height=321`, `https://media.discordapp.net/attachments/986985862631915541/1209051011679912017/image.png?ex=65e58380&is=65d30e80&hm=657203c24c8a74a90014f05ad8337d09dbfdb94c358f2a94172d04b8d6f109b7&=&format=webp&quality=lossless&width=687&height=321`, `https://media.discordapp.net/attachments/986985862631915541/1209051065371336704/image.png?ex=65e5838d&is=65d30e8d&hm=bc4352646e90bcf79626e5e0eb2e3db22568e414e260e42aee8d45c74da88d58&=&format=webp&quality=lossless&width=687&height=323`, `https://media.discordapp.net/attachments/986985862631915541/1209051140205842502/image.png?ex=65e5839e&is=65d30e9e&hm=b8628417de89585daee84c9b302c0617b4ea51e336d41c758859eb81f43cf5af&=&format=webp&quality=lossless&width=687&height=322`]

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

function rating(){
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

function closeRating(){
    document.querySelector("#rating").innerHTML = ""
}