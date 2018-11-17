class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return(
      <div className='App'>
        <h3>Welcome {}</h3>
        <HomeButtons />
      </div>
    );
  }
};

const HomeButtons = (props) => {
  return(
    <div className="homeButtons">
      <button><a href="/addPage">Search and Add Games</a></button>
      <button><a href="/list">View List</a></button>
    </div>
  );
};

const setup = function(csrf) {
  ReactDOM.render(
    <App csrf={csrf} />, document.querySelector("#content")
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