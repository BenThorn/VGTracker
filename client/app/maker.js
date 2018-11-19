// Class component to be rendered to the body
class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return(
      <div className='App'>
        <AddForm csrf = {this.props.csrf}/>
        <RemoveForm csrf = {this.props.csrf}/>
        <SearchForm csrf = {this.props.csrf} />
        <div id="searchResults">
        </div>
      </div>
    );
  }
};

// Calls the external API and gets the search results data back
const loadSearchResults = (data) => {
  // Callback so it has time to load the user's games
  getUserGames((userGames) => {
    ReactDOM.render(
      <SearchResults results={data} userGames={userGames.games} />, document.querySelector("#searchResults")
    )
  })
};

// For checking if games in the search results already exist in the collection
const getUserGames = (callback) => {
  sendAjax('GET', '/getGames', null, callback);
};

// Setup page
const setup = function(csrf) {
  ReactDOM.render(
    <App csrf={csrf} />, document.querySelector("#content")
  );
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