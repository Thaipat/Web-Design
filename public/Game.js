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

gameRef.on("value", (snapshot) => {
    getGameInfo(snapshot);
})

function getGameInfo(gameSnapshot) {
    accountRef.once("value").then((snapshot) => {
        let currentUser = firebase.auth().currentUser;
        snapshot.forEach((data) => {
            let username = data.val().username
            let userRoomCode = data.val().roomCode
            if (username == currentUser.displayName) {
                document.querySelector("#Roomcode-number") == null ? document.querySelector("#Roomcode-number") : document.querySelector("#Roomcode-number").innerText = userRoomCode
                gameSnapshot.forEach((data) => {
                    let gameRoomCode = data.val().roomCode
                    let user1 = data.val().user1
                    let user2 = data.val().user2
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
                let username = data.val().username
                let accountRoomCode = data.val().roomCode
                if (username == currentUser.displayName) {
                    gameSnapshot.forEach((data) => {
                        let gameid = data.key
                        let gameRoomCode = data.val().roomCode
                        if (gameRoomCode == accountRoomCode) {
                            gameRef.child(gameid).remove().then(function(){
                                document.location.href = "Home.html"
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
