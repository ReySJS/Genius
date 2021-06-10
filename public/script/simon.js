function Simon() {
  const levels = [11, 21, 31, 41];
  const delays = [5000, 4500, 4000, 3500];
  let speed = 1500;
  let sequence = [];
  let userSequence = [];
  let round = 0;
  let numberOfRounds;
  let startTurnCallback;
  let endTurnCallback;
  let startHighlightCallback;
  let endHighlightCallback;
  let errorCallback;
  let successCallback;
  let delay;
  let userDelay;
  const buttons = ["topLeft", "topRight", "bottomRight", "bottomLeft"];
  const errorSound = "sounds/error.wav";
  const successSound = "sounds/applause.wav";
  const silence = "sounds/silence-1sec.wav";
  const sounds = {
    topLeft: "sounds/green-sound.mp3",
    topRight: "sounds/red-sound.mp3",
    bottomRight: "sounds/blue-sound.mp3",
    bottomLeft: "sounds/yellow-sound.mp3",
  };
  const speeds = {
    3: 1250,
    7: 1000,
    12: 800,
    17: 700,
    22: 600,
    32: 500,
    37: 300,
  };

  function getScore() {
    return round;
  }

  function getButtons() {
    return buttons;
  }

  function play(level) {
    setConfigs(level);
    startComputerTurn();
    playAudio(silence);
  }

  function setConfigs(level) {
    numberOfRounds = levels[level];
    delay = delays[level];
    userSequence = [];

    for (let i = 0; i < numberOfRounds; i++) {
      sequence.push(Math.floor(Math.random() * 4));
    }
  }

  function setStartHighlightCallback(_startHighlightCallback) {
    startHighlightCallback = _startHighlightCallback;
  }

  function setEndHighlightCallback(_endHighlightCallback) {
    endHighlightCallback = _endHighlightCallback;
  }

  function setStartTurnCallback(_startTurnCallback) {
    startTurnCallback = _startTurnCallback;
  }

  function setEndTurnCallback(_endTurnCallback) {
    endTurnCallback = _endTurnCallback;
  }

  function setErrorCallback(_errorCallback) {
    errorCallback = _errorCallback;
  }

  function setSuccessCallback(_successCallback) {
    successCallback = _successCallback;
  }

  function startComputerTurn() {
    userSequence = [];

    if (startTurnCallback) {
      startTurnCallback();
    }

    turn(0);
  }

  function endComputerTurn() {
    if (endTurnCallback) {
      endTurnCallback();
      initUserErrorDelay();
    }
  }

  function userTurn(buttonIndex) {
    removeUserErrorDelay();

    if (buttonIndex === sequence[userSequence.length]) {
      playColorSound(buttonIndex);
      userSequence.push(buttonIndex);
      initUserErrorDelay();

      if (userSequence.length === round + 1) {
        round += 1;

        if (speeds[round]) {
          speed = speeds[round];
        }

        removeUserErrorDelay();

        if (round === numberOfRounds) {
          playAudio(successSound);
          if (successCallback) {
            successCallback(round);
          }
        } else {
          startComputerTurn();
        }
      }
    } else {
      playAudio(errorSound);

      if (errorCallback) {
        errorCallback(round);
      }
    }
  }

  function initUserErrorDelay() {
    userDelay = setTimeout(() => {
      playAudio(errorSound);
      errorCallback(round);
    }, delay);
  }

  function removeUserErrorDelay() {
    clearTimeout(userDelay);
  }

  function turn(sequenceIndex, isReplay = false) {
    if (sequenceIndex === round + 1) {
      if (!isReplay) {
        endComputerTurn();
      }
    } else {
      setTimeout(() => {
        startHighlightColor(sequenceIndex);
      }, speed * 0.8);

      setTimeout(() => {
        endHighlightColor(sequenceIndex);
        turn(sequenceIndex + 1, isReplay);
      }, speed);
    }
  }

  function startHighlightColor(sequenceIndex) {
    const buttonIndex = sequence[sequenceIndex];
    const button = buttons[buttonIndex];

    playColorSound(buttonIndex);

    if (startHighlightCallback) {
      startHighlightCallback(button);
    }
  }

  function endHighlightColor(sequenceIndex) {
    const buttonIndex = sequence[sequenceIndex];
    const button = buttons[buttonIndex];

    if (endHighlightCallback) {
      endHighlightCallback(button);
    }
  }

  function playLastSequence() {
    turn(0, true);
  }

  function playColorSound(buttonIndex) {
    const button = buttons[buttonIndex];
    const sound = sounds[button];

    playAudio(sound);
  }

  function playAudio(sound) {
    const audio = new Audio(sound);
    audio.play();
  }

  function reset() {
    sequence = [];
    userSequence = [];
    round = 0;
  }

  return {
    play,
    setStartHighlightCallback,
    setEndHighlightCallback,
    setStartTurnCallback,
    setEndTurnCallback,
    setErrorCallback,
    setSuccessCallback,
    userTurn,
    getScore,
    getButtons,
    reset,
    playLastSequence,
  };
}