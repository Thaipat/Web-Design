let boxes = document.querySelectorAll(".box")
let countBox = 0
boxes.forEach(function (box) {
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
                    id="roomcode" type="number" placeholder="_______________">
                <button class="ent-color pl-2" style="font-size: 35px;" onclick="">Enter</button>
            </div>
        </div>
    </div>
</div>
</div>`

let quizText = ""
let quizAns = 0

function randomQuiz(gameid) {
    let numPlus = Math.floor(Math.random() * 50)
    let numMinus = Math.floor(Math.random() * 40)
    let numDivide = Math.floor(Math.random() * 3 + 1)
    let numMultiply = Math.floor(Math.random() * 9 + 2)
    let order = Math.floor(Math.random() * 5)
    console.log("Random order:", order)
    if (order == 0) {
        if (!Number.isInteger(numPlus - numMinus / numDivide * numMultiply)) {
            randomQuiz(gameid)
        } else {
            quizText = numPlus + "-" + numMinus + "/" + numDivide + "*" + numMultiply
            quizAns = numPlus - numMinus / numDivide * numMultiply
            console.log(numPlus, "-", numMinus, "/", numDivide, "*", numMultiply)
            console.log("Ans :", (numPlus - numMinus / numDivide * numMultiply))
            gameRef.child(gameid).update({
                quizText: quizText,
                quizAns: quizAns
            })
        }
    } else if (order == 1) {
        if (!Number.isInteger(numPlus / numDivide - numMinus * numMultiply)) {
            randomQuiz(gameid)
        } else {
            quizText = numPlus + "/" + numDivide + "-" + numMinus + "*" + numMultiply
            quizAns = numPlus / numDivide - numMinus * numMultiply
            console.log(numPlus, "/", numDivide, "-", numMinus, "*", numMultiply)
            console.log("Ans :", (numPlus / numDivide - numMinus * numMultiply))
            gameRef.child(gameid).update({
                quizText: quizText,
                quizAns: quizAns
            })
        }
    } else if (order == 2) {
        if (!Number.isInteger(numPlus / numDivide * numMultiply - numMinus)) {
            randomQuiz(gameid)
        } else {
            quizText = numPlus + "/" + numDivide + "*" + numMultiply + "-" + numMinus
            quizAns = numPlus / numDivide * numMultiply - numMinus
            console.log(numPlus, "/", numDivide, "*", numMultiply, "-", numMinus)
            console.log("Ans :", (numPlus / numDivide * numMultiply - numMinus))
            gameRef.child(gameid).update({
                quizText: quizText,
                quizAns: quizAns
            })
        }
    } else if (order == 3) {
        if (!Number.isInteger(numPlus * numMultiply / numDivide - numMinus)) {
            randomQuiz(gameid)
        } else {
            quizText = numPlus + "*" + numMultiply + "/" + numDivide + "-" + numMinus
            quizAns = numPlus * numMultiply / numDivide - numMinus
            console.log(numPlus, "*", numMultiply, "/", numDivide, "-", numMinus)
            console.log("Ans :", (numPlus * numMultiply / numDivide - numMinus))
            gameRef.child(gameid).update({
                quizText: quizText,
                quizAns: quizAns
            })
        }
    } else if (order == 4) {
        if (!Number.isInteger(numPlus * numMultiply - numMinus / numDivide)) {
            randomQuiz(gameid)
        } else {
            quizText = numPlus + "*" + numMultiply + "-" + numMinus + "/" + numDivide
            quizAns = numPlus * numMultiply - numMinus / numDivide
            console.log(numPlus, "*", numMultiply, "-", numMinus, "/", numDivide)
            console.log("Ans :", (numPlus * numMultiply - numMinus / numDivide))
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

function getGameInfo(gameSnapshot) {
    accountRef.once("value").then((snapshot) => {
        let currentUser = firebase.auth().currentUser;
        snapshot.forEach((data) => {
            let username = data.val().username
            let userRoomCode = data.val().roomCode
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
                        
                        if(!isCount){
                            isCount = true
                            gameCountDown(gameid)
                        }
                    }
                })
            }
        })
    })
}

function gameCountDown(gameid){
    setInterval(function () {
        if (counDownNum >= 0) {
            console.log(counDownNum)
            gameRef.child(gameid).update({
                timer: counDownNum
            }).then(function(){
                counDownNum -= 1
            })
        } else if (counDownNum == -1) {
            randomQuiz(gameid)
            document.querySelector("#pemdas-question").innerText = gameQuizText
            counDownNum -= 1
        }
    }, 1000)
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
                }
            })
        })
    })
}

let turn = "x"
let table = [
    "0", "1", "2", "3", "4",
    "5", "6", "7", "8", "9",
    "10", "11", "12", "13", "14",
    "15", "16", "17", "18", "19",
    "20", "21", "22", "23", "24",
]

function clickedBox(event) {
    if (turn == "x") {
        event.target.innerText = "X"
        table[event.target.dataset.boxid] = "x"
        turn = "o"
    } else if (turn == "o") {
        event.target.innerText = "O"
        table[event.target.dataset.boxid] = "o"
        turn = "x"
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
        console.log(`${turn == "x" ? "o" : "x"} is win!!`)
    }
}
