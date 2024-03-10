let boxes = document.querySelectorAll(".box")
let countBox = 0
boxes.forEach(function (box) {
    box.id = "boxid-" + countBox
    box.dataset.boxid = countBox
    box.addEventListener("click", clickedBox)
    countBox++
})

const countDownText = `<span>PEMDAS</span><br>
<span>is coming in</span><br>
<div style="font-size: 80px;">
    <span id="game-timer">5</span><span> secs</span>
</div>`

const waitingText = `<span>Wait for</span><br>
<span>another</span><br>
<span>player</span>`

const pemdasPopup = `<div class="absolute flex justify-center items-center z-10"
style="width:100vw; height:100%; background-color: rgba(1,0,0,0.5);">
<div class="p-14 flex justify-center items-center btn-color" style="width: 70vw; height: 90vh;">
    <div class="text-center">
        <span class="textstroke">Finish the PEMDAS !</span>
        <div class="flex justify-center items-center" style="margin-top: 10vh;">
            <div class="pemdas-question-frame p-4 flex justify-center items-center text-center">
                <span id="pemdas-question" class="test-text">here is the question</span>
            </div>
        </div>
        <div class="container mx-auto flex justify-center">
            <div id="answer" style="font-size: 50px; width: 650px; height: 120px; margin-top: 10vh;"
                class="flex pemdas-question-frame mt-4 pl-4 pr-4 text-left items-center">
                <label class="pr-3">Ans :</label><input
                    style="margin-right: 50px; width: 300px; border: none; outline: none;"
                    id="pemdas-ans" type="number" placeholder="_______________">
                <button class="ent-color pl-2" style="font-size: 35px;" onclick="submitAns()">Enter</button>
            </div>
        </div>
    </div>
</div>
</div>`

let quizText = ""
let quizAns = 0
let isClicked = false
let playerTurn = ""
let isGameEnd = false

function randomQuiz(gameid) {
    let numPlus = Math.floor(Math.random() * 20)
    let numMinus = Math.floor(Math.random() * 10)
    let numDivide = Math.floor(Math.random() * 3 + 1)
    let numMultiply = Math.floor(Math.random() * 9 + 2)
    let order = Math.floor(Math.random() * 5)
    console.log("Random order:", order)
    if (order == 0) {
        if (!Number.isInteger(numPlus - numMinus / numDivide * numMultiply) || numPlus - numMinus / numDivide * numMultiply > 99 || numPlus - numMinus / numDivide * numMultiply < -99) {
            randomQuiz(gameid)
        } else {
            quizText = numPlus + "-" + numMinus + "/" + numDivide + "*" + numMultiply
            quizAns = numPlus - numMinus / numDivide * numMultiply
            gameRef.child(gameid).update({
                quizText: quizText,
                quizAns: quizAns
            })
        }
    } else if (order == 1) {
        if (!Number.isInteger(numPlus / numDivide - numMinus * numMultiply) || numPlus / numDivide - numMinus * numMultiply > 99 || numPlus / numDivide - numMinus * numMultiply < -99) {
            randomQuiz(gameid)
        } else {
            quizText = numPlus + "/" + numDivide + "-" + numMinus + "*" + numMultiply
            quizAns = numPlus / numDivide - numMinus * numMultiply
            gameRef.child(gameid).update({
                quizText: quizText,
                quizAns: quizAns
            })
        }
    } else if (order == 2) {
        if (!Number.isInteger(numPlus / numDivide * numMultiply - numMinus) || numPlus / numDivide * numMultiply - numMinus > 99 || numPlus / numDivide * numMultiply - numMinus < -99) {
            randomQuiz(gameid)
        } else {
            quizText = numPlus + "/" + numDivide + "*" + numMultiply + "-" + numMinus
            quizAns = numPlus / numDivide * numMultiply - numMinus
            gameRef.child(gameid).update({
                quizText: quizText,
                quizAns: quizAns
            })
        }
    } else if (order == 3) {
        if (!Number.isInteger(numPlus * numMultiply / numDivide - numMinus) || numPlus * numMultiply / numDivide - numMinus > 99 || numPlus * numMultiply / numDivide - numMinus < -99) {
            randomQuiz(gameid)
        } else {
            quizText = numPlus + "*" + numMultiply + "/" + numDivide + "-" + numMinus
            quizAns = numPlus * numMultiply / numDivide - numMinus
            gameRef.child(gameid).update({
                quizText: quizText,
                quizAns: quizAns
            })
        }
    } else if (order == 4) {
        if (!Number.isInteger(numPlus * numMultiply - numMinus / numDivide) || numPlus * numMultiply - numMinus / numDivide > 99 || numPlus * numMultiply - numMinus / numDivide < -99) {
            randomQuiz(gameid)
        } else {
            quizText = numPlus + "*" + numMultiply + "-" + numMinus + "/" + numDivide
            quizAns = numPlus * numMultiply - numMinus / numDivide
            gameRef.child(gameid).update({
                quizText: quizText,
                quizAns: quizAns
            })
        }
    }
}

gameRef.on("value", (snapshot) => {
    getGameInfo(snapshot);
})

let counDownNum = 5
let isCount = false
let isPemdas = false
let gameTurnNum = 1;

function getGameInfo(gameSnapshot) {
    accountRef.once("value").then((snapshot) => {
        let currentUser = firebase.auth().currentUser;
        snapshot.forEach((data) => {
            let accountid = data.key
            let username = data.val().username
            let userRoomCode = data.val().roomCode
            let winScore = data.val().winScore
            let orderScore = data.val().orderScore
            if (username == currentUser.displayName) {
                document.querySelector("#Roomcode-number") == null ? document.querySelector("#Roomcode-number") : document.querySelector("#Roomcode-number").innerText = userRoomCode
                gameSnapshot.forEach((data) => {
                    let gameid = data.key
                    let gameRoomCode = data.val().roomCode
                    let user1 = data.val().user1
                    let user2 = data.val().user2
                    let gameQuizText = data.val().quizText
                    let gameQuizAns = data.val().quizAns
                    let timer = data.val().timer
                    let user1Ans = data.val().user1Ans
                    let user2Ans = data.val().user2Ans
                    let table = data.val().table
                    let userWin = data.val().userWin
                    let gameTurn = data.val().gameTurn
                    if (user2 == undefined) {
                        document.querySelector("#PlayerName1-sign").innerText = user1
                        document.querySelector("#PlayerName2-sign").innerText = "..."
                        document.querySelector("#countdownText").innerHTML = waitingText
                        document.querySelector("#game-back").style.display = "flex"
                    } else if (userRoomCode == gameRoomCode) {
                        document.querySelector("#PlayerName1-sign").innerText = user1
                        document.querySelector("#PlayerName2-sign").innerText = user2
                        document.querySelector("#countdownText").innerHTML = countDownText
                        document.querySelector("#game-back").style.display = "none"
                        document.querySelector("#game-timer").innerText = timer
                        if (!isCount) {
                            isCount = true
                            gameCountDown(gameid)
                        }
                        if (timer == 0 && isPemdas == false) {
                            document.querySelector("#pemdasgame-page").innerHTML = pemdasPopup
                            document.querySelector("#pemdas-question").innerText = gameQuizText
                            console.log(gameQuizText)
                            console.log("Ans : ", gameQuizAns)
                        } else if (timer == 0 && isPemdas == true) {
                            document.querySelector("#player-turn").innerHTML = `<div class="absolute flex justify-center items-center z-10"
                            style="width:100vw; height:100%; background-color: rgba(1,0,0,0.5);">
                            <div class="p-14 flex justify-center items-center btn-color" style="width: 60vw; height: 80vh;">
                                <div class="relative w-auto h-auto text-center">
                                    <div class="textstroke text-size" id="player-name-turn">
                                        No one's answer is correct!
                                    </div>
                                </div>
                            </div>
                        </div>`
                            document.querySelector("#pemdasgame-page").innerHTML = ""
                        } else if (timer == 5 && isPemdas == false) {
                            document.querySelector("#player-turn").innerHTML = ""
                        } else if ((user1Ans == gameQuizAns || user2Ans == gameQuizAns) && isPemdas == true) {
                            counDownNum = 6
                            isPemdas = false
                            document.querySelector("#pemdasgame-page").innerHTML = ""
                            user1Ans == gameQuizAns ? playerTurn = user1 : playerTurn = user2
                            document.querySelector("#player-turn").innerHTML = `<div class="absolute flex justify-center items-center z-10"
                            style="width:100vw; height:100%; background-color: rgba(1,0,0,0.5);">
                            <div class="p-14 flex justify-center items-center btn-color" style="width: 60vw; height: 80vh;">
                                <div class="relative w-auto h-auto text-center">
                                    <div class="textstroke text-size" id="player-name-turn">
                                        Player ${playerTurn}'s answer is correct!
                                    </div>
                                </div>
                            </div>
                            </div>`
                        } else if (user1Ans != quizAns && user1Ans != 1000 && user2Ans != quizAns && user2Ans != 1000 && isPemdas == true) {
                            counDownNum = 6
                            isPemdas = false
                            document.querySelector("#player-turn").innerHTML = `<div class="absolute flex justify-center items-center z-10"
                            style="width:100vw; height:100%; background-color: rgba(1,0,0,0.5);">
                                <div class="p-14 flex justify-center items-center btn-color" style="width: 60vw; height: 80vh;">
                                    <div class="relative w-auto h-auto text-center">
                                        <div class="textstroke text-size" id="player-name-turn">
                                            No one's answer is correct!
                                        </div>
                                    </div>
                                </div>
                            </div>`
                        }
                        table.forEach((value, index) => {
                            if (value == "o") {
                                document.querySelector(`#boxid-${index}`).innerText = "O"
                            } else if (value == "x") {
                                document.querySelector(`#boxid-${index}`).innerText = "X"
                            }
                        })
                        if (userWin != "") {
                            isGameEnd = true
                        }
                        if (isGameEnd == true && currentUser.displayName != userWin) {
                            document.querySelector("#pemdasgame-page").innerHTML = ""
                            document.querySelector("#player-turn").innerHTML = ""
                            document.querySelector("#winlose").innerHTML = `<div class="absolute flex justify-center items-center z-10"
                            style="width:100vw; height:100%; background-color: rgba(1,0,0,0.5);">
                            <div class="p-14 flex justify-center items-center btn-color" style="width: 60vw; height: 80vh;">
                                <div class="relative w-auto h-auto text-center">
                                    <div class="textstroke text-size">
                                        You<br>
                                        <span id="player-winlose">Lose</span>
                                    </div>
                                    <div class="flex justify-center">
                                        <button class="btn-height flex justify-center items-center btn-color" style="width: 25vw;" onclick="goBackToMenu()">
                                            <span class="textstroke test-text">BACK TO MENU</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>`
                        }else if(isGameEnd == true && currentUser.displayName == userWin){
                            accountRef.child(accountid).update({
                                winScore: winScore+1,
                                orderScore: orderScore-1,
                            })
                        }
                        document.querySelector("#turn-number").innerText = gameTurn
                    }
                })
            }
        })
    })
}

function gameCountDown(gameid) {
    setInterval(function () {
        if (isGameEnd == false) {
            if (counDownNum >= 0) {
                gameRef.child(gameid).update({
                    timer: counDownNum
                }).then(function () {
                    counDownNum -= 1
                })
            } else if (counDownNum == -1 && isPemdas == true) {
                isPemdas = false
                counDownNum = 6
            } else if (counDownNum == -1 && isPemdas == false) {
                isPemdas = true
                counDownNum = 15
            }
            if (counDownNum == 1 && isPemdas == false) {
                randomQuiz(gameid)
                gameTurnNum += 1
                gameRef.child(gameid).update({
                    timer: counDownNum,
                    user1Ans: 1000,
                    user2Ans: 1000,
                    gameTurn: gameTurnNum
                })
                playerTurn = ""
            }
        }
    }, 1000)
}

function goBackToMenu() {
    let currentUser = firebase.auth().currentUser.displayName
    accountRef.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            let accountid = data.key
            let username = data.val().username
            let accountRoomCode = data.val().roomCode
            if (username == currentUser) {
                gameRef.once("value").then((snapshot) => {
                    snapshot.forEach((data) => {
                        let gameid = data.key
                        let gameRoomCode = data.val().roomCode
                        if (gameRoomCode == accountRoomCode) {
                            gameRef.child(gameid).remove()
                        }
                    })
                }).then(function () {
                    accountRef.child(accountid).child("roomCode").remove()
                }).then(function () {
                    document.location.href = "Home.html"
                })
            }
        })
    })
}

function submitAns() {
    let currentUser = firebase.auth().currentUser.displayName
    isClicked = false
    gameRef.once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            let gameid = data.key
            let user1 = data.val().user1
            let quizAns = data.val().quizAns
            let user1Ans = data.val().user1Ans
            let user2Ans = data.val().user2Ans
            if (currentUser == user1) {
                gameRef.child(gameid).update({
                    user1Ans: document.querySelector("#pemdas-ans").value
                }).then(function () {
                    if (user1Ans != quizAns) {
                        document.querySelector("#player-turn").innerHTML = `<div class="absolute flex justify-center items-center z-10"
                            style="width:100vw; height:100%; background-color: rgba(1,0,0,0.5);">
                            <div class="p-14 flex justify-center items-center btn-color" style="width: 60vw; height: 80vh;">
                                <div class="relative w-auto h-auto text-center">
                                    <div class="textstroke text-size" id="player-name-turn">
                                    Your answer is not correct!
                                    </div>
                                </div>
                            </div>
                        </div>`
                        document.querySelector("#pemdasgame-page").innerHTML = ""
                    }
                })
            } else {
                gameRef.child(gameid).update({
                    user2Ans: document.querySelector("#pemdas-ans").value
                }).then(function () {
                    if (user2Ans != quizAns) {
                        document.querySelector("#player-turn").innerHTML = `<div class="absolute flex justify-center items-center z-10"
                            style="width:100vw; height:100%; background-color: rgba(1,0,0,0.5);">
                            <div class="p-14 flex justify-center items-center btn-color" style="width: 60vw; height: 80vh;">
                                <div class="relative w-auto h-auto text-center">
                                    <div class="textstroke text-size" id="player-name-turn">
                                    Your answer is not correct!
                                    </div>
                                </div>
                            </div>
                        </div>`
                        document.querySelector("#pemdasgame-page").innerHTML = ""
                    }
                })
            }
        })
    })
}

function backToMenu() {
    gameRef.on("value", (gameSnapshot) => {
        let currentUser = firebase.auth().currentUser
        accountRef.once("value").then((snapshot) => {
            snapshot.forEach((data) => {
                let accountid = data.key
                let username = data.val().username
                let accountRoomCode = data.val().roomCode
                if (username == currentUser.displayName) {
                    gameSnapshot.forEach((data) => {
                        let gameid = data.key
                        let gameRoomCode = data.val().roomCode
                        if (gameRoomCode == accountRoomCode) {
                            gameRef.child(gameid).remove().then(function () {
                                document.location.href = "Home.html"
                            }).then(function () {
                                accountRef.child(accountid).child("roomCode").remove();
                            })
                        }
                    })
                } else {
                    document.location.href = "Home.html"
                }
            })
        })
    })
}

function clickedBox(event) {
    let currentUser = firebase.auth().currentUser.displayName
    if (currentUser == playerTurn) {
        accountRef.once("value").then((snapshot) => {
            snapshot.forEach((data) => {
                let accountRoomCode = data.val().roomCode
                gameRef.once("value").then((snapshot) => {
                    snapshot.forEach((data) => {
                        let gameid = data.key
                        let table = data.val().table
                        let gameRoomCode = data.val().roomCode
                        let user1 = data.val().user1
                        let user2 = data.val().user2
                        if (accountRoomCode == gameRoomCode) {
                            if (currentUser == user1 && isClicked == false) {
                                table[event.target.dataset.boxid] = "x"
                                isClicked = true;
                                gameRef.child(gameid).update({
                                    table: table
                                })
                            } else if (currentUser == user2 && isClicked == false) {
                                table[event.target.dataset.boxid] = "o"
                                isClicked = true;
                                gameRef.child(gameid).update({
                                    table: table
                                })
                            }
                            if (table[0] == table[6] && table[6] == table[12] && table[12] == table[18] ||
                                table[1] == table[7] && table[7] == table[13] && table[13] == table[19] ||
                                table[5] == table[11] && table[11] == table[17] && table[17] == table[23] ||
                                table[6] == table[12] && table[12] == table[18] && table[18] == table[24] ||
                                table[4] == table[8] && table[8] == table[12] && table[12] == table[16] ||
                                table[3] == table[7] && table[7] == table[11] && table[11] == table[15] ||
                                table[9] == table[13] && table[13] == table[17] && table[17] == table[21] ||
                                table[8] == table[12] && table[12] == table[16] && table[16] == table[20] ||
                                table[0] == table[5] && table[5] == table[10] && table[10] == table[15] ||
                                table[1] == table[6] && table[6] == table[11] && table[11] == table[16] ||
                                table[2] == table[7] && table[7] == table[12] && table[12] == table[17] ||
                                table[3] == table[8] && table[8] == table[13] && table[13] == table[18] ||
                                table[4] == table[9] && table[9] == table[14] && table[14] == table[19] ||
                                table[20] == table[15] && table[5] == table[10] && table[10] == table[15] ||
                                table[21] == table[16] && table[6] == table[11] && table[11] == table[16] ||
                                table[22] == table[17] && table[7] == table[12] && table[12] == table[17] ||
                                table[23] == table[18] && table[8] == table[13] && table[13] == table[18] ||
                                table[24] == table[19] && table[9] == table[14] && table[14] == table[19] ||
                                table[0] == table[1] && table[1] == table[2] && table[2] == table[3] ||
                                table[5] == table[6] && table[6] == table[7] && table[7] == table[8] ||
                                table[10] == table[11] && table[11] == table[12] && table[12] == table[13] ||
                                table[15] == table[16] && table[16] == table[17] && table[17] == table[18] ||
                                table[20] == table[21] && table[21] == table[22] && table[22] == table[23] ||
                                table[3] == table[4] && table[1] == table[2] && table[2] == table[3] ||
                                table[8] == table[9] && table[6] == table[7] && table[7] == table[8] ||
                                table[13] == table[14] && table[11] == table[12] && table[12] == table[13] ||
                                table[18] == table[19] && table[16] == table[17] && table[17] == table[18] ||
                                table[23] == table[24] && table[21] == table[22] && table[22] == table[23]) {
                                gameRef.child(gameid).update({
                                    userWin: currentUser
                                }).then(function () {
                                    document.querySelector("#pemdasgame-page").innerHTML = ""
                                    document.querySelector("#player-turn").innerHTML = ""
                                    document.querySelector("#winlose").innerHTML = `<div class="absolute flex justify-center items-center z-10"
                            style="width:100vw; height:100%; background-color: rgba(1,0,0,0.5);">
                            <div class="p-14 flex justify-center items-center btn-color" style="width: 60vw; height: 80vh;">
                                <div class="relative w-auto h-auto text-center">
                                    <div class="textstroke text-size">
                                        You<br>
                                        <span id="player-winlose">Win</span>
                                    </div>
                                    <div class="flex justify-center">
                                        <button class="btn-height flex justify-center items-center btn-color" style="width: 25vw;" onclick="goBackToMenu()">
                                            <span class="textstroke test-text">BACK TO MENU</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>`
                                })
                            }
                        }
                    })
                })
            })
        })
    }
}
