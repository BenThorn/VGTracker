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
        <div id="current">
          <h3>Select from currently playing</h3>
          <div className="currentList">
            <p>No games in this category.</p>
          </div>
          <button>Begin log</button>
        </div>
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