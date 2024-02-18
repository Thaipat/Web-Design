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
                id="roomcode" type="text" placeholder="######">
            <button class="ent-color pl-2 pr-2" style="font-size: 35px;">Enter</button>
        </div>
    </div>
</div>
</div>`

function joinRoom(){
    document.querySelector("#join-room").style = "width:100%; height:100%;"
    document.querySelector("#join-room").innerHTML = joinPopup
}

function closeJoinRoom(){
    document.querySelector("#join-room").style = ""
    document.querySelector("#join-room").innerHTML = ""
}