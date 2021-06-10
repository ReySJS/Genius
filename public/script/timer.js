function Timer() {
  let currentTime = 0;
  let timerInterval = 10;
  let callbackTimeInterval;
  let internalTimer;
  let mm = 0;
  let ss = 0;
  let cs = 0;

  function setTimerInterval(_timerInterval) {
    timerInterval = _timerInterval;
  }

  function setCallbackTimeInterval(_callbackTimeInterval) {
    callbackTimeInterval = _callbackTimeInterval;
  }

  function getCurrentTime() {
    currentTime =
      (mm < 10 ? "0" + mm : mm) +
      ":" +
      (ss < 10 ? "0" + ss : ss) +
      "." +
      (cs < 10 ? "0" + cs : cs);
    return currentTime;
  }

  function startTimer() {
    internalTimer = setInterval(function () {
      callbackTimeInterval();
      cs++;

      if (cs == 100) {
        cs = 0;
        ss++;

        if (ss == 60) {
          ss = 0;
          mm++;
        }
      }
    }, timerInterval);
  }

  function stopTimer() {
    clearInterval(internalTimer);
  }

  function resetTimer() {
    setTimerInterval(10);
    clearInterval(internalTimer);
    currentTime = 0;
    mm = 0;
    ss = 0;
    cs = 0;
  }

  return {
    setTimerInterval,
    setCallbackTimeInterval,
    getCurrentTime,
    startTimer,
    stopTimer,
    resetTimer,
  };
}