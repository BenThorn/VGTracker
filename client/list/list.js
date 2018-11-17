class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return(
      <div className='App'>
        <h3>List</h3>
        <div id="gameList">
        </div>
      </div>
    );
  }
};

const setup = function(csrf) {
  ReactDOM.render(
    <App csrf={csrf} />, document.querySelector("#content")
  );

  loadGamesFromServer();
};

const loadGamesFromServer = () => {
  sendAjax('GET', '/getGames', null, (data) => {
    ReactDOM.render(
      <GameList games={data.games} />, document.querySelector("#gameList")
    )
  })
};

const GameList = function(props) {
  console.log(props.games);
  if(props.games.length === 0) {
    return (
      <div className="gameList">
        <h3 className="emptyGames">No Games yet</h3>
      </div>
    );
  }

  const gameNodes = props.games.map(function(game) {
    let year;
    // Check if the date wasn't available from the API
    if(game.year === 0) {
      year = 'N/A';
    } else {
      year = game.year;
    }
    return (
      <div key={game._id} className="game">
        <h3 className="gameName"> Name: {game.name} </h3>
        <h3 className="gameYear"> Year: {year} </h3>
      </div>
    );
  });

  return (
    <div className="gameList">
      {gameNodes}
    </div>
  );
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});