//↓↓GENERAL↓↓//
const url = "http://equipe02.alphaedtech.org.br"
let idPlayer = 0;
let rankingVisibility = 0;
let configContent = document.getElementById("config_content");
let configStep1 = document.getElementById("config_step1");
let nickName = document.getElementById("config_step1_nick_input");
let configStep2 = document.getElementById("config_step2");
let boardGame = document.getElementById("game_board");
let x = document.body.clientWidth;
const simon = new Simon();
const timer = new Timer();
let finalTime;
let level;
let buttons = {};
const userKeys = {};
const keyParagraphs = {
  topLeft: document.getElementById("set_top_left"),
  topRight: document.getElementById("set_top_right"),
  bottomRight: document.getElementById("set_bottom_right"),
  bottomLeft: document.getElementById("set_bottom_left"),
};

function boardWelcome() {
  boardGame.innerHTML = `
  <p class="welcome_message">Test your memory having 
    <span class="green_text style_text"> f</span>
    <span class="yellow_text style_text">u</span>
    <span class="blue_text style_text">n</span>
    <span class="red_text style_text">!</span>
  </p>`;
}

boardWelcome();
//↑↑GENERAL↑↑//

//↓↓RESPONSIVE TEXT↓↓//
function showResponsiveStructure() {
  if (x <= 1080) {
    document.getElementById("config_step1_title").innerHTML = "Please Answer";
  }
}
showResponsiveStructure();
//↑↑RESPONSIVE TEXT↑↑//

//↓↓AJAX↓↓//
function showRankingUsers() {
  let xhttp = new XMLHttpRequest();

  xhttp.onload = function () {
    let rankingUserList = JSON.parse(this.response);

    if (rankingUserList.length != 0) {
   
      rankingUserList.sort((r1, r2) => (r1.time > r2.time ? 1 : -1));
      rankingUserList.sort((r1, r2) => (parseInt(r1.step) > parseInt(r2.step) ? -1 : 1));
  
      
      document.getElementById("ranking_tbody").innerHTML = "";
      for (let i = 0; i < rankingUserList.length; i++) {
        document.getElementById("ranking_tbody").innerHTML += `
          <tr>
              <td>${rankingUserList[i].player}</td>
              <td>${rankingUserList[i].step}</td>
              <td>${rankingUserList[i].time}</td>
          </tr>`;
      }
    }
  };
  xhttp.open("GET", `${url}/ranking/all`, true);
  xhttp.send();
}

function rankPlayer() {
  let newPlayer = {};
  newPlayer["player"] = document.getElementById("config_step1_nick_input").value;
  newPlayer["step"] = document.getElementById("current_step_output").textContent;
  newPlayer["time"] = document.getElementById("total_time_output").textContent;
  let player = JSON.stringify(newPlayer);

  let xhttp = new XMLHttpRequest();

  xhttp.open("POST", `${url}/ranking`, true);
  xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");

  xhttp.onload = function () {};
  xhttp.send(player);
}
//↑↑AJAX↑↑//

//↓↓RANKING↓↓//
function openRanking(_rankingScreen, _rankingButton, _xWidth) {
  x <= 1080 ? (_xWidth = 180) : (_xWidth = 90);

  _rankingButton.style.transform = `rotate(${_xWidth}deg)`;
  _rankingButton.style.transition = "0.5s";
  _rankingScreen.style.display = "block";
  
  showRankingUsers();
  setTimeout(function () {
    _rankingScreen.style.transition = "opacity 0.5s linear";
    _rankingScreen.style.opacity = "1";
  }, 100);
  rankingVisibility = 1;
}

function closeRanking(_rankingScreen, _rankingButton) {
  x <= 1080 ? (_xWidth = 0) : (_xWidth = 90);

  _rankingButton.style.transform = `rotate(${_xWidth * -1}deg)`;
  _rankingButton.style.transition = "0.5s";
  _rankingScreen.style.transition = "opacity 0.5s linear";
  _rankingScreen.style.opacity = "0";
  setTimeout(function () {
    _rankingScreen.style.display = "none";
  }, 400);
  rankingVisibility = 0;
}

function showRanking() {
  let xWidth = 0;
  let rankingScreen = document.getElementById("ranking_screen");
  let rankingButton = document.getElementById("ranking_button");

  rankingVisibility == 0
    ? openRanking(rankingScreen, rankingButton, xWidth)
    : closeRanking(rankingScreen, rankingButton, xWidth);
}

//↑↑RANKING↑↑//

//↓↓MODAL↓↓//
function hideModal(_modal) {
  _modal.style.opacity = "0";
  _modal.style.transition = "opacity 0.5s linear";
  setTimeout(function () {
    _modal.style.display = "none";
  }, 400);
}

function showModal(_modal) {
  _modal.style.display = "flex";
  setTimeout(function () {
    _modal.style.opacity = "1";
    _modal.style.transition = "opacity 0.5s linear";
  }, 100);

  if (_modal == configStep2) {
    document.getElementById("skill_text").innerHTML =
      " Choose your skill level";
    document.getElementById("skill_level_range").value = 0;
    setSkillLevel();
  }
}
//↑↑MODAL↑↑//

//↓↓SETTING↓↓//
function playGameConfigStep1() {
  showModal(configContent);
}

function backToHome() {
  hideModal(configContent);
}

function playGameConfigStep2() {
  hideModal(configStep1);
  setTimeout(function () {
    showModal(configStep2);
  }, 500);
}

function returnToGameConfigStep1() {
  hideModal(configStep2);
  setTimeout(function () {
    showModal(configStep1);
  }, 500);
}
function validateNickname() {
  nickName.value == ""
    ? (nickName.value = `Anonymous Player`)
    : playGameConfigStep2();
}
function setSkillLevel() {
  let skillLevelText = document.getElementById("choosed_skill_level");
  let skillValue = parseInt(document.getElementById("skill_level_range").value);
  level = skillValue - 1;

  skillValue == 0
    ? (skillLevelText.innerHTML = ``)
    : skillValue == 1
    ? (skillLevelText.innerHTML = `Easy<br />😁`)
    : skillValue == 2
    ? (skillLevelText.innerHTML = "Normal<br />😎")
    : skillValue == 3
    ? (skillLevelText.innerHTML = "Hard<br />😨")
    : skillValue == 4
    ? (skillLevelText.innerHTML = "Insane<br />😭")
    : false;
}

function saveConfig() {
  if (document.getElementById("skill_level_range").value == 0) {
    document.getElementById("skill_text").innerHTML =
      " If you don't choose, you will play in insane mode";
    document.getElementById("skill_level_range").value = 4;
    setSkillLevel();
  } else {
    document.getElementById("play_button").style.display = "none";
    document.getElementById("play_button").style.fontSize = "20px";
    document.getElementById("play_button").style.padding = "0 20px";
    setBoard();
    simon.reset();
    timer.resetTimer();

    backToHome();
    hideModal(configStep2);
    setTimeout(function () {
      showModal(configStep1);
    }, 500);
  }
}

//↑↑SETTINGS↑↑//

//↓↓PLAY↓↓//
function setBoard() {
  let boardModel = document.querySelector('input[name="simon_model"]:checked')
    .value;

  if (boardModel == "default") {
    boardGame.innerHTML = `<div id="game_board_play">
    <div class="match_elements">
        <div class="match_data">
            <span class="match_data_text">SCORE</span>
            <span id="current_step_output">
        </div>
        <div id="button_last" class="match_buttons">
            <svg width="121" height="121" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60.6183" cy="60.6034" r="60.0315" fill="#352B24"/>
                <path d="M24.7621 59.8431C25.8558 59.8431 26.7191 59.6244 27.3519 59.1869C27.9926 58.7494 28.3129 57.9603 28.3129 56.8197C28.3129 55.5931 27.8676 54.7572 26.9769 54.3119C26.5004 54.0775 25.8636 53.9603 25.0668 53.9603H19.3715V59.8431H24.7621ZM17.0394 51.9564H25.0082C26.3207 51.9564 27.4027 52.1478 28.2543 52.5306C29.8715 53.265 30.6801 54.6205 30.6801 56.597C30.6801 57.6283 30.4652 58.472 30.0355 59.1283C29.6136 59.7845 29.0199 60.3119 28.2543 60.7103C28.9261 60.9838 29.4301 61.3431 29.766 61.7885C30.1097 62.2338 30.3011 62.9564 30.3402 63.9564L30.4222 66.265C30.4457 66.9213 30.5004 67.4095 30.5863 67.7299C30.7269 68.2767 30.9769 68.6283 31.3363 68.7845V69.1713H28.4769C28.3988 69.0228 28.3363 68.8314 28.2894 68.597C28.2426 68.3627 28.2035 67.9095 28.1722 67.2377L28.0316 64.3666C27.9769 63.2416 27.559 62.4877 26.7777 62.1049C26.3324 61.8939 25.6332 61.7885 24.6801 61.7885H19.3715V69.1713H17.0394V51.9564ZM34.3246 51.9564H46.8754V54.0658H36.598V59.2924H46.1019V61.2845H36.598V67.1205H47.0511V69.1713H34.3246V51.9564ZM50.3324 51.9564H58.0785C59.6097 51.9564 60.8441 52.39 61.7816 53.2572C62.7191 54.1166 63.1879 55.3275 63.1879 56.89C63.1879 58.2338 62.7699 59.4056 61.934 60.4056C61.098 61.3978 59.8129 61.8939 58.0785 61.8939H52.6644V69.1713H50.3324V51.9564ZM60.8324 56.9017C60.8324 55.6361 60.3636 54.7767 59.4261 54.3236C58.9105 54.0814 58.2035 53.9603 57.3051 53.9603H52.6644V59.9252H57.3051C58.3519 59.9252 59.1996 59.7025 59.848 59.2572C60.5043 58.8119 60.8324 58.0267 60.8324 56.9017ZM66.1176 51.9564H68.4496V67.1205H77.1683V69.1713H66.1176V51.9564ZM88.3129 62.1166L85.6996 54.5111L82.9222 62.1166H88.3129ZM84.4808 51.9564H87.1176L93.3636 69.1713H90.809L89.0629 64.015H82.2543L80.391 69.1713H78.0004L84.4808 51.9564ZM92.3676 51.9564H95.0863L100.032 60.2299L104.977 51.9564H107.707L101.203 62.2338V69.1713H98.8715V62.2338L92.3676 51.9564Z" fill="white"/>
                <circle onclick="lastSequence()" id="last_key" class="keys" cx="60.6182" cy="60.5352" r="54.31" fill="white" fill-opacity="0.15"/>
        </svg>
        </div>
    </div>
    <div class="match_elements_center">
    <div id="simon_board_content" class="simon_board_content">
        <svg class="simon_board" width="397" height="397" viewBox="0 0 397 397" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="198.498" cy="198.11" r="198" fill="#18110F" />
            <path id="bg_key_top_left" d="M25.9172 173.711C24.7172 181.711 29.0838 184.378 31.4172 184.711H103.857C107.261 184.711 108.076 181.886 108.651 179.891L108.667 179.836C125.603 121.155 178.917 108.711 181.417 108.711C183.917 107.711 183.917 105.378 183.917 103.711V33.7113C182.317 28.1113 176.917 27.3779 174.417 27.7113C73.2171 42.1113 31.4172 127.711 25.9172 173.711Z" fill="#4AAB99" />
            <path id="bg_key_top_right" d="M224.281 27.8484C216.281 26.6484 213.614 31.0151 213.281 33.3484L213.281 105.788C213.281 108.961 216.332 110.072 218.156 110.598C276.837 127.534 289.281 180.848 289.281 183.348C289.281 185.348 292.614 185.848 294.281 185.848L364.281 185.848C369.881 184.248 370.614 178.848 370.281 176.348C355.881 75.1484 270.281 33.3484 224.281 27.8484Z" fill="#F53A59" />
            <path id="bg_key_bottom_right" d="M370.144 225.212C371.344 217.212 366.977 214.546 364.644 214.212L292.204 214.212C289.042 214.212 287.996 217.001 287.394 219.087C270.458 277.768 217.667 290.212 214.644 290.212C212.144 290.961 212.144 293.546 212.144 295.212L212.144 365.212C213.744 370.812 219.144 371.546 221.644 371.212C322.844 356.812 364.644 271.212 370.144 225.212Z" fill="#2F95B8" />
            <path data-id="2" id="key_bottom_right" class="keys" d="M368.681 230.882C371.169 220.779 369.067 219.477 367.916 219.477L294.675 219.477C291.745 219.477 290.776 222.079 290.218 224.027C274.526 278.79 223.773 291.998 220.729 293.456C218.413 294.155 218.647 297.224 218.647 297.224L217.9 368C218.13 370.336 218.896 370.714 221.052 370.714C224.937 370.712 230.637 369.099 230.637 369.099C323.41 352.147 361.633 273.601 368.681 230.882Z" fill="white" fill-opacity="0.15" />
            <path data-id="0" id="key_top_left" class="keys" d="M27.3596 167.476C24.872 177.579 26.9742 178.881 28.1247 178.881H101.366C104.296 178.881 105.265 176.279 105.823 174.331C121.515 119.568 172.268 106.36 175.311 104.902C177.628 104.203 177.394 101.134 177.394 101.134L178.141 30.3578C177.911 28.0218 177.145 27.6437 174.989 27.6437C171.104 27.6456 165.403 29.2592 165.403 29.2592C72.6304 46.2106 34.4073 124.757 27.3596 167.476Z" fill="white" fill-opacity="0.15" />
            <path data-id="1" id="key_top_right" class="keys" d="M230.516 28.8071C220.414 26.3195 219.111 28.4217 219.111 29.5722L219.111 102.814C219.111 105.743 221.714 106.712 223.661 107.27C278.425 122.962 291.632 173.715 293.09 176.759C293.789 179.075 296.858 178.841 296.858 178.841L367.634 179.588C369.97 179.359 370.349 178.593 370.349 176.436C370.347 172.551 368.733 166.851 368.733 166.851C351.484 75.5773 273.235 35.8548 230.516 28.8071Z" fill="white" fill-opacity="0.15" />
            <path id="bg_key_bottom_left" d="M171.78 371.075C179.78 372.275 182.447 367.909 182.78 365.575L182.78 293.135C182.042 289.711 179.519 288.791 177.905 288.325C119.224 271.389 106.78 218.075 106.78 215.575C105.667 213.075 103.447 213.075 101.78 213.075L31.78 213.075C26.18 214.675 25.4467 220.075 25.78 222.575C40.18 323.775 125.78 365.575 171.78 371.075Z" fill="#cea838" />
            <path data-id="3" id="key_bottom_left" class="keys" d="M166.029 369.857C176.131 372.344 177.433 370.242 177.433 369.092L177.433 295.85C177.433 292.921 174.831 291.951 172.884 291.393C118.12 275.701 104.912 224.949 103.455 221.905C102.755 219.588 99.6861 219.822 99.6861 219.822L28.9102 219.075C26.5741 219.305 26.1961 220.071 26.196 222.228C26.198 226.113 27.8115 231.813 27.8115 231.813C44.763 324.586 123.31 362.809 166.029 369.857Z" fill="white" fill-opacity="0.15" />
            <circle cx="198.498" cy="198.178" r="60.0315" fill="#808080" />
            <circle onclick="startGame()" id="start_key" class="keys" cx="198.497" cy="198.11" r="54.31" fill="white" fill-opacity="0.15" />
            <path onclick="startGame()" id="start_text" d="M163.349 200.624C163.404 201.6 163.634 202.393 164.041 203.003C164.814 204.143 166.177 204.714 168.13 204.714C169.005 204.714 169.802 204.589 170.521 204.339C171.912 203.854 172.607 202.987 172.607 201.737C172.607 200.799 172.314 200.131 171.728 199.733C171.134 199.342 170.205 199.003 168.939 198.714L166.607 198.186C165.083 197.842 164.005 197.464 163.373 197.049C162.279 196.331 161.732 195.256 161.732 193.827C161.732 192.28 162.267 191.01 163.337 190.018C164.408 189.026 165.923 188.53 167.884 188.53C169.689 188.53 171.22 188.967 172.478 189.842C173.744 190.71 174.376 192.1 174.376 194.014H172.185C172.068 193.092 171.818 192.385 171.435 191.893C170.724 190.995 169.517 190.546 167.814 190.546C166.439 190.546 165.451 190.835 164.849 191.413C164.248 191.991 163.947 192.663 163.947 193.428C163.947 194.272 164.298 194.889 165.001 195.28C165.462 195.53 166.505 195.842 168.13 196.217L170.544 196.768C171.708 197.034 172.607 197.397 173.24 197.858C174.333 198.663 174.88 199.831 174.88 201.362C174.88 203.268 174.185 204.631 172.794 205.452C171.412 206.272 169.802 206.682 167.966 206.682C165.826 206.682 164.15 206.135 162.939 205.042C161.728 203.956 161.134 202.483 161.158 200.624H163.349ZM190.361 188.964V191.014H184.56V206.178H182.193V191.014H176.392V188.964H190.361ZM199.56 199.124L196.947 191.518L194.169 199.124H199.56ZM195.728 188.964H198.365L204.611 206.178H202.056L200.31 201.022H193.501L191.638 206.178H189.248L195.728 188.964ZM214.736 196.85C215.83 196.85 216.693 196.631 217.326 196.194C217.966 195.756 218.287 194.967 218.287 193.827C218.287 192.6 217.841 191.764 216.951 191.319C216.474 191.085 215.837 190.967 215.041 190.967H209.345V196.85H214.736ZM207.013 188.964H214.982C216.294 188.964 217.376 189.155 218.228 189.538C219.845 190.272 220.654 191.628 220.654 193.604C220.654 194.635 220.439 195.479 220.009 196.135C219.587 196.792 218.994 197.319 218.228 197.717C218.9 197.991 219.404 198.35 219.74 198.796C220.083 199.241 220.275 199.964 220.314 200.964L220.396 203.272C220.419 203.928 220.474 204.417 220.56 204.737C220.701 205.284 220.951 205.635 221.31 205.792V206.178H218.451C218.373 206.03 218.31 205.839 218.263 205.604C218.216 205.37 218.177 204.917 218.146 204.245L218.005 201.374C217.951 200.249 217.533 199.495 216.751 199.112C216.306 198.901 215.607 198.796 214.654 198.796H209.345V206.178H207.013V188.964ZM236.181 188.964V191.014H230.38V206.178H228.013V191.014H222.212V188.964H236.181Z" fill="#262626" />
        </svg>
    </div>
    <div id="finish_game_message" class="finish_game_message">   
    </div>
    </div>
    <div class="match_elements">
        <div class="match_data">
            <span class="match_data_text">TIME</span>
            <span id="total_time_output"></span>
        </div>
        <div id="button_reset" class="match_buttons">
            <svg width="121" height="121" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60.9301" cy="60.1101" r="60.0315" fill="#808080" />
                <circle onclick="restartGame()" id="reset_key" class="keys" cx="60.93" cy="60.0419" r="54.31" fill="white" fill-opacity="0.15" />
                <path d="M19.4427 60.6276C20.4454 60.6276 21.2367 60.427 21.8168 60.026C22.404 59.625 22.6976 58.9017 22.6976 57.8561C22.6976 56.7317 22.2894 55.9655 21.473 55.5573C21.0362 55.3424 20.4525 55.235 19.722 55.235H14.5013V60.6276H19.4427ZM12.3636 53.3981H19.6683C20.8715 53.3981 21.8633 53.5735 22.6439 53.9244C24.1263 54.5976 24.8676 55.8401 24.8676 57.652C24.8676 58.5973 24.6706 59.3707 24.2767 59.9723C23.89 60.5739 23.3457 61.0573 22.6439 61.4225C23.2598 61.6731 23.7217 62.0026 24.0297 62.4108C24.3448 62.819 24.5202 63.4814 24.556 64.3981L24.6312 66.5143C24.6527 67.1158 24.7028 67.5634 24.7816 67.8571C24.9105 68.3584 25.1397 68.6806 25.4691 68.8239V69.1783H22.848C22.7764 69.0423 22.7191 68.8668 22.6761 68.652C22.6332 68.4371 22.5974 68.0218 22.5687 67.4059L22.4398 64.774C22.3897 63.7428 22.0066 63.0517 21.2904 62.7008C20.8822 62.5074 20.2413 62.4108 19.3676 62.4108H14.5013V69.1783H12.3636V53.3981ZM28.2084 53.3981H39.7133V55.3317H30.2924V60.1227H39.0043V61.9489H30.2924V67.2985H39.8744V69.1783H28.2084V53.3981ZM44.0746 64.0865C44.1247 64.9817 44.336 65.7086 44.7084 66.2672C45.4174 67.3128 46.667 67.8356 48.4574 67.8356C49.2595 67.8356 49.9899 67.721 50.6488 67.4918C51.9235 67.0478 52.5609 66.2529 52.5609 65.1071C52.5609 64.2477 52.2924 63.6354 51.7552 63.2701C51.211 62.9121 50.3588 62.6005 49.1986 62.3356L47.0609 61.8522C45.6644 61.5371 44.6761 61.1897 44.0961 60.8102C43.0935 60.1513 42.5922 59.1666 42.5922 57.8561C42.5922 56.4381 43.0827 55.2744 44.0638 54.3649C45.045 53.4554 46.4343 53.0006 48.2318 53.0006C49.8861 53.0006 51.2898 53.4017 52.4427 54.2037C53.6029 54.9987 54.183 56.2734 54.183 58.028H52.1742C52.0668 57.1829 51.8376 56.5348 51.4867 56.0836C50.835 55.2601 49.7286 54.8483 48.1674 54.8483C46.9069 54.8483 46.001 55.1132 45.4496 55.6432C44.8982 56.1731 44.6224 56.789 44.6224 57.4908C44.6224 58.2643 44.9447 58.83 45.5892 59.1881C46.0118 59.4173 46.9678 59.7037 48.4574 60.0475L50.6703 60.5524C51.7373 60.7959 52.5609 61.1289 53.141 61.5514C54.1436 62.289 54.6449 63.3597 54.6449 64.7633C54.6449 66.5107 54.0075 67.7604 52.7328 68.5123C51.4652 69.2643 49.9899 69.6403 48.307 69.6403C46.3448 69.6403 44.8086 69.139 43.6986 68.1364C42.5886 67.1409 42.0443 65.791 42.0658 64.0865H44.0746ZM68.8353 53.3981V55.278H63.5179V69.1783H61.348V55.278H56.0306V53.3981H68.8353ZM77.2679 62.7115L74.8724 55.7399L72.3265 62.7115H77.2679ZM73.7552 53.3981H76.1722L81.8978 69.1783H79.556L77.9554 64.4518H71.7142L70.0062 69.1783H67.8148L73.7552 53.3981ZM91.1791 60.6276C92.1817 60.6276 92.973 60.427 93.5531 60.026C94.1403 59.625 94.434 58.9017 94.434 57.8561C94.434 56.7317 94.0258 55.9655 93.2094 55.5573C92.7725 55.3424 92.1888 55.235 91.4584 55.235H86.2377V60.6276H91.1791ZM84.1 53.3981H91.4047C92.6078 53.3981 93.5997 53.5735 94.3802 53.9244C95.8627 54.5976 96.6039 55.8401 96.6039 57.652C96.6039 58.5973 96.4069 59.3707 96.0131 59.9723C95.6263 60.5739 95.0821 61.0573 94.3802 61.4225C94.9961 61.6731 95.458 62.0026 95.766 62.4108C96.0811 62.819 96.2566 63.4814 96.2924 64.3981L96.3676 66.5143C96.389 67.1158 96.4392 67.5634 96.5179 67.8571C96.6469 68.3584 96.876 68.6806 97.2054 68.8239V69.1783H94.5844C94.5127 69.0423 94.4554 68.8668 94.4125 68.652C94.3695 68.4371 94.3337 68.0218 94.3051 67.4059L94.1761 64.774C94.126 63.7428 93.7429 63.0517 93.0267 62.7008C92.6185 62.5074 91.9776 62.4108 91.1039 62.4108H86.2377V69.1783H84.1V53.3981ZM110.837 53.3981V55.278H105.52V69.1783H103.35V55.278H98.0326V53.3981H110.837Z" fill="black" />
            </svg>
        </div>
    </div>
</div>`;
    showStartText();
  } else {
    boardGame.innerHTML = `
    <div id="game_board_play">
    <div class="match_elements">
        <div class="match_data">
            <span class="match_data_text">SCORE</span>
            <span id="current_step_output">
        </div>
        <div id="button_last" class="match_buttons">
        <svg width="121" height="121" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60.6183" cy="60.6034" r="60.0315" fill="#352B24"/>
              <path d="M24.7621 59.8431C25.8558 59.8431 26.7191 59.6244 27.3519 59.1869C27.9926 58.7494 28.3129 57.9603 28.3129 56.8197C28.3129 55.5931 27.8676 54.7572 26.9769 54.3119C26.5004 54.0775 25.8636 53.9603 25.0668 53.9603H19.3715V59.8431H24.7621ZM17.0394 51.9564H25.0082C26.3207 51.9564 27.4027 52.1478 28.2543 52.5306C29.8715 53.265 30.6801 54.6205 30.6801 56.597C30.6801 57.6283 30.4652 58.472 30.0355 59.1283C29.6136 59.7845 29.0199 60.3119 28.2543 60.7103C28.9261 60.9838 29.4301 61.3431 29.766 61.7885C30.1097 62.2338 30.3011 62.9564 30.3402 63.9564L30.4222 66.265C30.4457 66.9213 30.5004 67.4095 30.5863 67.7299C30.7269 68.2767 30.9769 68.6283 31.3363 68.7845V69.1713H28.4769C28.3988 69.0228 28.3363 68.8314 28.2894 68.597C28.2426 68.3627 28.2035 67.9095 28.1722 67.2377L28.0316 64.3666C27.9769 63.2416 27.559 62.4877 26.7777 62.1049C26.3324 61.8939 25.6332 61.7885 24.6801 61.7885H19.3715V69.1713H17.0394V51.9564ZM34.3246 51.9564H46.8754V54.0658H36.598V59.2924H46.1019V61.2845H36.598V67.1205H47.0511V69.1713H34.3246V51.9564ZM50.3324 51.9564H58.0785C59.6097 51.9564 60.8441 52.39 61.7816 53.2572C62.7191 54.1166 63.1879 55.3275 63.1879 56.89C63.1879 58.2338 62.7699 59.4056 61.934 60.4056C61.098 61.3978 59.8129 61.8939 58.0785 61.8939H52.6644V69.1713H50.3324V51.9564ZM60.8324 56.9017C60.8324 55.6361 60.3636 54.7767 59.4261 54.3236C58.9105 54.0814 58.2035 53.9603 57.3051 53.9603H52.6644V59.9252H57.3051C58.3519 59.9252 59.1996 59.7025 59.848 59.2572C60.5043 58.8119 60.8324 58.0267 60.8324 56.9017ZM66.1176 51.9564H68.4496V67.1205H77.1683V69.1713H66.1176V51.9564ZM88.3129 62.1166L85.6996 54.5111L82.9222 62.1166H88.3129ZM84.4808 51.9564H87.1176L93.3636 69.1713H90.809L89.0629 64.015H82.2543L80.391 69.1713H78.0004L84.4808 51.9564ZM92.3676 51.9564H95.0863L100.032 60.2299L104.977 51.9564H107.707L101.203 62.2338V69.1713H98.8715V62.2338L92.3676 51.9564Z" fill="white"/>
              <circle onclick="lastSequence()" id="last_key" class="keys" cx="60.6182" cy="60.5352" r="54.31" fill="white" fill-opacity="0.15"/>
        </svg>
        </div>
    </div>
    <div class="match_elements_center">
<div id="simon_board_content" class="simon_board_content">
        <svg class="simon_board" width="388" height="388" viewBox="0 0 388 388" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.770996" y="0.647949" width="387" height="387" rx="21" fill="#18110F"/>
            <rect id="bg_key_top_left" x="21.4229" y="21.2854" width="162.905" height="161.971" rx="21" fill="#4AAB99"/>
            <rect data-id="0"  id="key_top_left" class="keys" x="21.7942" y="22.6432" width="158.162" height="157.256" rx="21" fill="white" fill-opacity="0.15"/>
            <rect id="bg_key_top_right" x="203.932" y="21.2854" width="162.905" height="161.971" rx="21" fill="#F53A59"/>
            <rect id="bg_key_bottom_left" x="21.4229" y="204.728" width="162.905" height="161.971" rx="21" fill="#cea838"/>
            <rect id="bg_key_bottom_right" x="203.932" y="204.728" width="162.905" height="161.971" rx="21" fill="#2F95B8"/>
            <rect data-id="1" id="key_top_right" class="keys" x="208.932" y="21.6432" width="158.162" height="157.256" rx="21" fill="white" fill-opacity="0.15"/>
            <rect data-id="3" id="key_bottom_left" class="keys" x="21.4229" y="209.153" width="158.162" height="157.256" rx="21" fill="white" fill-opacity="0.15"/>
            <rect data-id="2" id="key_bottom_right" class="keys" x="208.932" y="209.444" width="158.162" height="157.256" rx="21" fill="white" fill-opacity="0.15"/>
        </svg>
    </div>
    <div id="finish_game_message" class="finish_game_message">
    <div id="button_start_square" class="button_start_square">
            <svg width="121" height="121" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60.3048" cy="60.1784" r="60.0315" fill="#808080"/>
                <circle onclick="startGame()" id="start_key" class="keys" cx="60.3048" cy="60.1102" r="54.31" fill="white" fill-opacity="0.15"/>
                <path d="M25.1564 62.6237C25.2111 63.6002 25.4415 64.3932 25.8478 65.0026C26.6212 66.1432 27.9845 66.7135 29.9376 66.7135C30.8126 66.7135 31.6095 66.5885 32.3282 66.3385C33.7189 65.8541 34.4142 64.9869 34.4142 63.7369C34.4142 62.7994 34.1212 62.1315 33.5353 61.733C32.9415 61.3424 32.0118 61.0026 30.7462 60.7135L28.4142 60.1862C26.8907 59.8424 25.8126 59.4635 25.1798 59.0494C24.0861 58.3307 23.5392 57.2565 23.5392 55.8268C23.5392 54.2799 24.0743 53.0104 25.1447 52.0182C26.215 51.026 27.7306 50.5299 29.6915 50.5299C31.4962 50.5299 33.0275 50.9674 34.2853 51.8424C35.5509 52.7096 36.1837 54.1002 36.1837 56.0143H33.9923C33.8751 55.0924 33.6251 54.3854 33.2423 53.8932C32.5314 52.9948 31.3243 52.5455 29.6212 52.5455C28.2462 52.5455 27.2579 52.8346 26.6564 53.4127C26.0548 53.9908 25.754 54.6627 25.754 55.4283C25.754 56.2721 26.1056 56.8893 26.8087 57.2799C27.2697 57.5299 28.3126 57.8424 29.9376 58.2174L32.3517 58.7682C33.5157 59.0338 34.4142 59.3971 35.047 59.858C36.1407 60.6627 36.6876 61.8307 36.6876 63.3619C36.6876 65.2682 35.9923 66.6315 34.6017 67.4518C33.2189 68.2721 31.6095 68.6823 29.7736 68.6823C27.6329 68.6823 25.9572 68.1354 24.7462 67.0416C23.5353 65.9557 22.9415 64.483 22.965 62.6237H25.1564ZM52.1681 50.9635V53.0143H46.3673V68.1783H44.0001V53.0143H38.1993V50.9635H52.1681ZM61.3673 61.1237L58.754 53.5182L55.9767 61.1237H61.3673ZM57.5353 50.9635H60.172L66.4181 68.1783H63.8634L62.1173 63.0221H55.3087L53.4454 68.1783H51.0548L57.5353 50.9635ZM76.5431 58.8502C77.6368 58.8502 78.5001 58.6315 79.1329 58.194C79.7736 57.7565 80.0939 56.9674 80.0939 55.8268C80.0939 54.6002 79.6486 53.7643 78.7579 53.319C78.2814 53.0846 77.6447 52.9674 76.8478 52.9674H71.1525V58.8502H76.5431ZM68.8204 50.9635H76.7892C78.1017 50.9635 79.1837 51.1549 80.0353 51.5377C81.6525 52.2721 82.4611 53.6276 82.4611 55.6041C82.4611 56.6354 82.2462 57.4791 81.8165 58.1354C81.3947 58.7916 80.8009 59.319 80.0353 59.7174C80.7072 59.9908 81.2111 60.3502 81.547 60.7955C81.8907 61.2408 82.0822 61.9635 82.1212 62.9635L82.2032 65.2721C82.2267 65.9283 82.2814 66.4166 82.3673 66.7369C82.5079 67.2838 82.7579 67.6354 83.1173 67.7916V68.1783H80.2579C80.1798 68.0299 80.1173 67.8385 80.0704 67.6041C80.0236 67.3698 79.9845 66.9166 79.9532 66.2448L79.8126 63.3737C79.7579 62.2487 79.34 61.4948 78.5587 61.1119C78.1134 60.901 77.4142 60.7955 76.4611 60.7955H71.1525V68.1783H68.8204V50.9635ZM97.9884 50.9635V53.0143H92.1876V68.1783H89.8204V53.0143H84.0197V50.9635H97.9884Z" fill="black"/>  
            </svg>
        </div>  
    </div>
    </div>
    <div class="match_elements">
        <div class="match_data">
            <span class="match_data_text">TIME</span>
            <span id="total_time_output"></span>
        </div>
        <div id="button_reset" class="match_buttons">
            <svg width="121" height="121" viewBox="0 0 121 121" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60.9301" cy="60.1101" r="60.0315" fill="#808080" />
                <circle onclick="restartGame()" id="reset_key" class="keys" cx="60.93" cy="60.0419" r="54.31" fill="white" fill-opacity="0.15" />
                <path d="M19.4427 60.6276C20.4454 60.6276 21.2367 60.427 21.8168 60.026C22.404 59.625 22.6976 58.9017 22.6976 57.8561C22.6976 56.7317 22.2894 55.9655 21.473 55.5573C21.0362 55.3424 20.4525 55.235 19.722 55.235H14.5013V60.6276H19.4427ZM12.3636 53.3981H19.6683C20.8715 53.3981 21.8633 53.5735 22.6439 53.9244C24.1263 54.5976 24.8676 55.8401 24.8676 57.652C24.8676 58.5973 24.6706 59.3707 24.2767 59.9723C23.89 60.5739 23.3457 61.0573 22.6439 61.4225C23.2598 61.6731 23.7217 62.0026 24.0297 62.4108C24.3448 62.819 24.5202 63.4814 24.556 64.3981L24.6312 66.5143C24.6527 67.1158 24.7028 67.5634 24.7816 67.8571C24.9105 68.3584 25.1397 68.6806 25.4691 68.8239V69.1783H22.848C22.7764 69.0423 22.7191 68.8668 22.6761 68.652C22.6332 68.4371 22.5974 68.0218 22.5687 67.4059L22.4398 64.774C22.3897 63.7428 22.0066 63.0517 21.2904 62.7008C20.8822 62.5074 20.2413 62.4108 19.3676 62.4108H14.5013V69.1783H12.3636V53.3981ZM28.2084 53.3981H39.7133V55.3317H30.2924V60.1227H39.0043V61.9489H30.2924V67.2985H39.8744V69.1783H28.2084V53.3981ZM44.0746 64.0865C44.1247 64.9817 44.336 65.7086 44.7084 66.2672C45.4174 67.3128 46.667 67.8356 48.4574 67.8356C49.2595 67.8356 49.9899 67.721 50.6488 67.4918C51.9235 67.0478 52.5609 66.2529 52.5609 65.1071C52.5609 64.2477 52.2924 63.6354 51.7552 63.2701C51.211 62.9121 50.3588 62.6005 49.1986 62.3356L47.0609 61.8522C45.6644 61.5371 44.6761 61.1897 44.0961 60.8102C43.0935 60.1513 42.5922 59.1666 42.5922 57.8561C42.5922 56.4381 43.0827 55.2744 44.0638 54.3649C45.045 53.4554 46.4343 53.0006 48.2318 53.0006C49.8861 53.0006 51.2898 53.4017 52.4427 54.2037C53.6029 54.9987 54.183 56.2734 54.183 58.028H52.1742C52.0668 57.1829 51.8376 56.5348 51.4867 56.0836C50.835 55.2601 49.7286 54.8483 48.1674 54.8483C46.9069 54.8483 46.001 55.1132 45.4496 55.6432C44.8982 56.1731 44.6224 56.789 44.6224 57.4908C44.6224 58.2643 44.9447 58.83 45.5892 59.1881C46.0118 59.4173 46.9678 59.7037 48.4574 60.0475L50.6703 60.5524C51.7373 60.7959 52.5609 61.1289 53.141 61.5514C54.1436 62.289 54.6449 63.3597 54.6449 64.7633C54.6449 66.5107 54.0075 67.7604 52.7328 68.5123C51.4652 69.2643 49.9899 69.6403 48.307 69.6403C46.3448 69.6403 44.8086 69.139 43.6986 68.1364C42.5886 67.1409 42.0443 65.791 42.0658 64.0865H44.0746ZM68.8353 53.3981V55.278H63.5179V69.1783H61.348V55.278H56.0306V53.3981H68.8353ZM77.2679 62.7115L74.8724 55.7399L72.3265 62.7115H77.2679ZM73.7552 53.3981H76.1722L81.8978 69.1783H79.556L77.9554 64.4518H71.7142L70.0062 69.1783H67.8148L73.7552 53.3981ZM91.1791 60.6276C92.1817 60.6276 92.973 60.427 93.5531 60.026C94.1403 59.625 94.434 58.9017 94.434 57.8561C94.434 56.7317 94.0258 55.9655 93.2094 55.5573C92.7725 55.3424 92.1888 55.235 91.4584 55.235H86.2377V60.6276H91.1791ZM84.1 53.3981H91.4047C92.6078 53.3981 93.5997 53.5735 94.3802 53.9244C95.8627 54.5976 96.6039 55.8401 96.6039 57.652C96.6039 58.5973 96.4069 59.3707 96.0131 59.9723C95.6263 60.5739 95.0821 61.0573 94.3802 61.4225C94.9961 61.6731 95.458 62.0026 95.766 62.4108C96.0811 62.819 96.2566 63.4814 96.2924 64.3981L96.3676 66.5143C96.389 67.1158 96.4392 67.5634 96.5179 67.8571C96.6469 68.3584 96.876 68.6806 97.2054 68.8239V69.1783H94.5844C94.5127 69.0423 94.4554 68.8668 94.4125 68.652C94.3695 68.4371 94.3337 68.0218 94.3051 67.4059L94.1761 64.774C94.126 63.7428 93.7429 63.0517 93.0267 62.7008C92.6185 62.5074 91.9776 62.4108 91.1039 62.4108H86.2377V69.1783H84.1V53.3981ZM110.837 53.3981V55.278H105.52V69.1783H103.35V55.278H98.0326V53.3981H110.837Z" fill="black" />
            </svg>
        </div>
    </div>
</div>`;
  }
  daltonicAccessibilitySetBoardGame();
  buttons = {
    topLeft: document.getElementById("key_top_left"),
    topRight: document.getElementById("key_top_right"),
    bottomRight: document.getElementById("key_bottom_right"),
    bottomLeft: document.getElementById("key_bottom_left"),
  };
}

function computerStartHighlight(button) {
  buttons[button].classList.add("highlight");
}

function computerEndHighlight(button) {
  buttons[button].classList.remove("highlight");
}

function setKey(key) {
  keyParagraphs[key].innerHTML = "Press any button of your keyboard";

  document.addEventListener("keydown", function (event) {
    const keyboardKey = event.key;

    userKeys[key] = keyboardKey;
    keyParagraphs[key].innerHTML = keyboardKey.toUpperCase();
    this.removeEventListener("keydown", arguments.callee);
  });
}

function startTurn() {
  const table = document.getElementById("simon_board_content");
  table.style.pointerEvents = "none";
  for (const button in buttons) {
    buttons[button].removeEventListener("click", highlightColor);
  }
  const score = simon.getScore();
  document.getElementById("current_step_output").innerHTML = score;
  document.removeEventListener("keydown", highlightColorByKey);
}

function endTurn() {
  const table = document.getElementById("simon_board_content");
  table.style.pointerEvents = "auto";

  for (const button in buttons) {
    buttons[button].addEventListener("click", highlightColor);
  }

  document.addEventListener("keydown", highlightColorByKey);
}

function highlightColorByKey(event) {
  const key = event.key;

  for (const button in userKeys) {
    if (key === userKeys[button]) {
      const keyIndex = simon.getButtons().indexOf(button);
      simon.userTurn(keyIndex);

      buttons[button].classList.add("highlight");

      setTimeout(() => {
        buttons[button].classList.remove("highlight");
      }, 300);
    }
  }
}

function highlightColor(event) {
  const buttonIndex = Number(event.currentTarget.getAttribute("data-id"));
  simon.userTurn(buttonIndex);
}

function error() {
  const table = document.getElementById("simon_board_content");
  table.style.pointerEvents = "none";
  timer.stopTimer();
  showFinishGameButtons();
  showErrorMessage();
  finalTime = timer.getCurrentTime();
  document.getElementById("total_time_output").innerHTML = finalTime;
  rankPlayer();
  showRankingUsers();
  showRefreshButton();

  for (const button in buttons) {
    buttons[button].removeEventListener("click", highlightColor);
  }
  document.removeEventListener("keydown", highlightColorByKey);
}

function success() {
  const table = document.getElementById("simon_board_content");
  table.style.pointerEvents = "none";
  timer.stopTimer();
  showFinishGameButtons();
  showSucessMessage();
  finalTime = timer.getCurrentTime();
  document.getElementById("total_time_output").innerHTML = finalTime;
  rankPlayer();
  showRankingUsers();
  showRefreshButton();
}

function lastSequence() {
  simon.playLastSequence();
}

function restartGame() {
  const table = document.getElementById("simon_board_content");
  table.style.pointerEvents = "auto";
  timer.resetTimer();
  simon.reset();
  startGame(1);
  cleanFinishGameMessage();
  hideFinishGameButtons();
}

function startGame(_con) {
  if(!_con == 1) {
  document.querySelector('input[name="simon_model"]:checked').value == "default"
    ? hideStartText()
    : hideStartButtonSquare();
}
  simon.setStartHighlightCallback(computerStartHighlight);
  simon.setEndHighlightCallback(computerEndHighlight);
  simon.setStartTurnCallback(startTurn);
  simon.setEndTurnCallback(endTurn);
  simon.setErrorCallback(error);
  simon.setSuccessCallback(success);
  simon.play(level);

  timer.setCallbackTimeInterval(function () {
    finalTime = timer.getCurrentTime();
    document.getElementById("total_time_output").innerHTML = finalTime;
  });
  timer.startTimer();
}

function showFinishGameButtons() {
  document.getElementById("button_last").style.display = "flex";
  document.getElementById("button_reset").style.display = "flex";
}
function hideFinishGameButtons() {
  document.getElementById("button_last").style.display = "none";
  document.getElementById("button_reset").style.display = "none";
}
function showSucessMessage() {
  document.getElementById(
    "finish_game_message"
  ).innerHTML = `<span class="finish_game_text">Congratulations! You Won!</span>`;
}
function showErrorMessage() {
  document.getElementById(
    "finish_game_message"
  ).innerHTML = `<span class="finish_game_text">Don't Give Up. Try Again!</span>`;
}

function cleanFinishGameMessage() {
  document.getElementById("finish_game_message").innerHTML = "";
}
function hideStartText() {
  document.getElementById("start_text").style.visibility = "hidden";
}
function showStartText() {
  document.getElementById("start_text").style.visibility = "visible";
}
function hideStartButtonSquare() {
  document.getElementById("button_start_square").style.visibility = "hidden";
}
function showRefreshButton() {
  document.getElementById("refresh_button").style.display = "block"
}
//↑↑PLAY↑↑//