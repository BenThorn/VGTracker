// Component to render tot the body
class App extends React.Component {
  constructor(props){
    super(props);
  }

  // Creates five divs to contain the list, and the title of the list and the list itself
  render() {
    return(
      <div className='App'>
        <RemoveForm csrf={this.props.csrf} />
        <EditGameForm csrf={this.props.csrf} />
        <div id="current">
          <h3>Currently playing</h3>
          <div className="currentList">
            <p>No games in this category.</p>
          </div>
        </div>
        
        <div id="owned">
          <h3>Own but never played</h3>
          <div className="ownedList">
          </div>
        </div>

        <div id="finished">
          <h3>Finished</h3>
          <div className="finishedList">
          </div>
        </div>

        <div id="hold">
          <h3>On hold</h3>
          <div className="holdList">
          </div>
        </div>

        <div id="dropped">
          <h3>Dropped</h3>
          <div className="droppedList">
          </div>
        </div>
      </div>
    );
  }
};

// The list of the user's games
const GameList = function(props) {
  const gameNodes = props.games.map(function(game) {
    const node = createGameNode(game);
    // Sends the game node's edit form category select
    const categorySelect = node.props.children[1].props.children[1].props.children;
    const lastPlayedField = node.props.children[1].props.children[4];
    setEditOptions(categorySelect, lastPlayedField, game.category, game.lastPlayed);
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

  loadGamesFromServer();
};

// Loads the games from the server, then checks through the list to separate the categories
const loadGamesFromServer = () => {
  sendAjax('GET', '/getGames', null, (data) => {
    const categories = ['current', 'owned', 'finished', 'hold', 'dropped'];
    const games = data.games;

    for(let i = 0; i < categories.length; i++) {
      let separatedGames = []; // Only sending an array with the pre-separated list
      games.forEach((game) => {
        if(game.category === categories[i]) {
          separatedGames.push(game);
        }
      });
      ReactDOM.render(
        <GameList games={separatedGames} currentCategory={categories[i]} />, document.querySelector(`.${categories[i]}List`)
      )
    }
  })
};

// Creates a single game listing in your collection
const createGameNode = (game) => {
  let year;
  // Check if the date wasn't available from the API
  if(game.year === 0) {
    year = 'N/A';
  } else {
    year = game.year;
  }
  return (
    <div key={game._id} id={game._id} className="game">
      <form
        className='gameNodeForm'
        onSubmit={handleRemoveGame}
        action="removeList"
      >
        <div id='img'>
          <img src={game.picUrl} alt="game picture" />
        </div>
        <p className="gameNodeName"> {game.name} </p>
        <p className="gameNodeYear"> {year} </p>
        <p className="gameNodePlatform"> {game.platform} </p>
        <input id="editButton" type='button' value='Edit' onClick={editClick}/>
        <input type='hidden' id='gameId' value={game.gameId} />
        <input type='button' value='Delete' onClick={handleRemoveGame}/>
      </form>
      <form 
      className="editForm"
      onSubmit={handleEditGame}
      >
        <label for="category" >Category: </label>
        <select id="resultCategory">
          <option value="current">Currently playing</option>
          <option value="owned">Owned, but not played</option>
          <option value="finished">Finished</option>
          <option value="hold">On hold</option>
          <option value="dropped">Dropped</option>
        </select>
        <label for="date">Last played:</label>
        <input type='hidden' id='gameId' value={game.gameId} />
        <input type="date" id="lastPlayed" name="lastPlayed"
          min="1970-01-01" max={getDate()} />
        <input id="editSubmit" type="submit" value="Save"/>
        <input id="editCancel" type="button" onClick={cancelClick} value="Cancel" />
      </form>
    </div>
  );
};

// For opening the edit menu
const editClick = (e) => {
  const gameWrapper = e.target.parentNode.parentNode;

  $(".game").animate({height: "82px"}, {queue: false});
  $(gameWrapper).animate({height: "120px"}, {queue: false});
};

const cancelClick = (e) => {
  const gameWrapper = e.target.parentNode.parentNode;
  $(gameWrapper).animate({height: "82px"}, {queue: false});
};

// Sets the initial selected option of the category select and last played date
const setEditOptions = (options, lastPlayedField, category, lastPlayed) =>{
  options.forEach((option) => {
    if(category === option.props.value) {
      option.props.selected = true;
    }
  });

  if(lastPlayed) {
    lastPlayedField.props.value = lastPlayed.slice(0, 10);
  }
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
});