// Component to be rendered to the body
class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return(
      <div className='App'>
        <div id="default">
          <HomeButtons />
        </div>
      </div>
    );
  }
};

// Buttons on the default screen
const HomeButtons = (props) => {
  return(
    <div className="homeButtons">
      <div>
        <a href="/addPage"><button>Search</button></a>
        <a href="/list"><button>View</button></a>
        <a href="/log"><button>Log</button></a>
      </div>
      <button id="changePassButton">Change your password</button>
    </div>
  );
};

// Form for changing the password, similar to login and signup forms
const ChangePassWindow = (props) => {
  return (
  <div className = 'ChangePassWindow'>
    <form id="changePassForm" 
      name="changePassForm"
      onSubmit={handleChangePassword}
      action="/changePassword"
      method="POST"
      className="mainForm"
    >
      <div>
        <label htmlFor="username">Username: </label>
        <input id="user" type="text" name="username"/>
      </div>
      <div>
        <label htmlFor="pass"> Old: </label>
        <input id="oldPass" type="password" name="oldPass" />
      </div>
      <div>
        <label htmlFor="pass2"> New: </label>
        <input id="newPass" type="password" name="newPass" />
      </div>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <div id="error"></div>
      <input className="formSubmit" type="submit" value="Change password" />
    </form>
  </div>
  );
};

// Renders the change password window
const createChangePassWindow = (csrf) => {
  ReactDOM.render(
    <ChangePassWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Setup page
const setup = function(csrf) {
  ReactDOM.render(
    <App csrf={csrf} />, document.querySelector("#content")
  );

  const changePassButton = document.querySelector("#changePassButton");

  changePassButton.addEventListener("click", (e) => {
    e.preventDefault();
    createChangePassWindow(csrf);
    return false;
  });
};

// Get csrf token
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

// Ready
$(document).ready(function() {
  getToken();
});