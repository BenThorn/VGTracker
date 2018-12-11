// Component to render tot the body
class App extends React.Component {
  constructor(props){
    super(props);
  }

  // Creates five divs to contain the list, and the title of the list and the list itself
  render() {
    return(
      <div className='App'>
      <EditGameForm csrf={this.props.csrf} />
        <div id="current">
          <h3>Select from currently playing</h3>
          <div className="currentLog">
            <p id="noGames">No games in this category.</p>
          </div>
        </div>
        <div id='timerWrapper'>
        </div>
      </div>
    );
  }
};

/* Timer class component that appears when a 'currently playing' 
 game is clicked on the log view.
 Keeps track of a setInterval object and seconds of playtime in the state*/
class Timer extends React.Component {
  constructor(props){
    super(props);
    this.state = {interval: null, seconds: props.seconds};

    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.saveTime = this.saveTime.bind(this);
  }

  startTimer (e) {
    e.preventDefault();
    let seconds = this.props.seconds;
    const interval = setInterval(() => { 
      seconds++;
      loadTime(seconds);
      this.setState({seconds: seconds});
    }, 1000);

    this.setState({interval: interval});

    // Make certain buttons unclickable during counting/stopped
    $(e.target).css('pointer-events', 'none');
    $('#stopButton').css('pointer-events', 'unset');
    $('#saveButton').css('pointer-events', 'none');
  };

  stopTimer (e) {
    e.preventDefault();
    $('#startButton').css('pointer-events', 'unset');
    $('#stopButton').css('pointer-events', 'none');
    $('#saveButton').css('pointer-events', 'unset');


    clearInterval(this.state.interval);
  };

  // Sends the playtime in seconds, and the current date (since you were playing today!)
  saveTime (e) {
    e.preventDefault();
    const options = {
      gameId: this.props.gameId,
      playTime: this.state.seconds,
      lastPlayed: getDate(),
      category: 'current'
    }
    handleSendTime(options);
  }

  render() {
    return(
      <div id="timer">
        <form id="timeForm">
          <p id='selectedName'>Currently selected game: <span id="displayName">{this.props.gameName}</span></p>
          <p id='time'>{convertSeconds(this.state.seconds)}</p>
          <div id="controlButtons">
            <button id="startButton" onClick={this.startTimer}>Start</button>
            <button id="stopButton" onClick={this.stopTimer}>Stop</button>
            <button id="saveButton" onClick={this.saveTime}>Save</button>
          </div>
          <input type="hidden" id="gameId" name="gameId" value={this.props.gameId}/>
        </form>
      </div>
    )
  }
};

// Taken from https://www.tutorialspoint.com/How-to-convert-seconds-to-HH-MM-SS-with-JavaScript
// Converts an int of seconds into HH:MM:SS format
const convertSeconds = (sec) => {
  var hrs = Math.floor(sec / 3600);
  var min = Math.floor((sec - (hrs * 3600)) / 60);
  var seconds = sec - (hrs * 3600) - (min * 60);
  seconds = Math.round(seconds * 100) / 100
 
  var result = (hrs < 10 ? "0" + hrs : hrs);
  result += ":" + (min < 10 ? "0" + min : min);
  result += ":" + (seconds < 10 ? "0" + seconds : seconds);
  return result;
};

// Loads in the converted time (or 0s if there is no time) into the timer
const loadTime = (seconds) => {
  let timeString = '';
  if(seconds === '') {
    timeString = '00:00:00';
  } else {
    timeString = convertSeconds(seconds);
  }

  $('#time').text(timeString);
};

// Similar to the GameList of the List view. Will only contain currently playing
const GameList = function(props) {
  const gameNodes = props.games.map(function(game) {
    const node = createGameNode(game);
    // Sends the game node's edit form category select
    return node;
  });
  if (gameNodes.length === 0) {
    return (
      <div className="gameList">
        <p id="noGames">Currently no games in this category.</p>
      </div>
    )
  } else {
    return (
      <div className="gameList">
        {gameNodes}
      </div>
    );
  }
};

// Page setup
const setup = function(csrf) {
  ReactDOM.render(
    <App csrf={csrf} />, document.querySelector("#content")
  );
};

// Loads the games from the server, then checks through the list and grabs only currentlyPlaying
const loadGamesFromServer = () => {
  sendAjax('GET', '/getGames', null, (data) => {
    const games = data.games;
    let currentGames = [];

    games.forEach((game) => {
      if(game.category === 'current') {
        currentGames.push(game);
      }
    });
    currentGames.sort(function(a,b){
      return new Date(b.lastPlayed) - new Date(a.lastPlayed);
    });
    ReactDOM.render(
      <GameList games={currentGames} />, document.querySelector(`.currentLog`)
    )
  })
};

// Similar to createGameNode of the list view. Gets playTime and lastPlayed instead
// of game year and platform
const createGameNode = (game) => {
  let lastPlayed = game.lastPlayed;
  let playTime = game.playTime;
  if(lastPlayed === null) {
    lastPlayed = 'No date set'
  } else {
    lastPlayed = lastPlayed.slice(0, 10);
  }

  if(playTime === null) {
    playTime = 'No time logged'
  } else {
    playTime = convertSeconds(playTime);
  }
  return (
    <div key={game._id} id={game._id} className="game">
      <div
        className='gameNodeLog' onClick={nodeClick}
      >
        <div id='img'>
          <img src={game.picUrl} alt="game picture" />
        </div>
        <p className="gameNodeName"> {game.name} </p>
        <p className="gameNodePlayTime"> {playTime} </p>
        <p className="gameNodeDate"> {lastPlayed} </p>
        <input type='hidden' id='gameId' value={game.gameId} />
        <input type='hidden' id='playTime' value={game.playTime} />
      </div>
    </div>
  );
};

// OnClick for a game element in the GameList
const nodeClick = (e) => {
  let node = e.target;

  // Checking if user clicked name or other inside element
  if(e.target.className !== 'gameNodeLog'){
    node = e.target.parentNode;
  } 
  
  if (e.target.className === "") {
    node = e.target.parentNode.parentNode; // If they click the image
  }
  const gameName = node.querySelector(".gameNodeName").textContent;
  const gameId = node.querySelector("#gameId").value;
  const playTime = node.querySelector("#playTime").value;

  $('#displayName').text(gameName);
  $('#timerId').val(gameId);
  $('.gameNodeLog').css('background-color', 'inherit')
  $(node).css('background-color', 'cyan');
  loadTime(playTime);

  // Creation of the Timer component
  ReactDOM.render(
    <Timer seconds={playTime} gameName={gameName} gameId={gameId} />, document.querySelector(`#timerWrapper`)
  )
};

// Get CSRF token
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

// Ready
$(document).ready(function() {
  getToken();
  loadGamesFromServer();
});