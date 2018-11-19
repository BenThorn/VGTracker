// Component to be rendered to the body
class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return(
      <div className='App'>
        <div id="default">
          <h3>Welcome to VGTracker!</h3>
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
        <button><a href="/addPage">Search and Add Games</a></button>
        <button><a href="/list">View your Collection</a></button>
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
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username"/>
      <label htmlFor="pass"> Old Password: </label>
      <input id="oldPass" type="password" name="oldPass" />
      <label htmlFor="pass2"> New Password: </label>
      <input id="newPass" type="password" name="newPass" />
      <input type="hidden" name="_csrf" value={props.csrf}/>
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