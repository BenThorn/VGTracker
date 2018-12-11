"use strict";

// Sends ajax request when logging in
var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Please enter all fields");
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

// Sends ajax request when signing up
var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
};

// Window for logging in
var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    "div",
    { className: "LoginWindow" },
    React.createElement(
      "div",
      { id: "welcome" },
      React.createElement(
        "p",
        null,
        "Welcome to VGTracker!"
      ),
      React.createElement(
        "p",
        null,
        "Log in, or sign up if you don't have an account."
      ),
      React.createElement(
        "p",
        null,
        "VGTracker lets you search for, categorize, and track your time playing games. Use the log timer when you boot up a game!"
      )
    ),
    React.createElement(
      "form",
      { id: "loginForm", name: "loginForm",
        onSubmit: handleLogin,
        action: "/login",
        method: "POST",
        className: "mainForm"
      },
      React.createElement(
        "label",
        { htmlFor: "username" },
        "Username: "
      ),
      React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
      React.createElement(
        "label",
        { htmlFor: "pass" },
        "Password: "
      ),
      React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
      React.createElement("div", { id: "error" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" })
    )
  );
};

// Window for signing up
var SignupWindow = function SignupWindow(props) {
  return React.createElement(
    "div",
    { className: "SignupWindow" },
    React.createElement(
      "form",
      { id: "signupForm",
        name: "signupForm",
        onSubmit: handleSignup,
        action: "/signup",
        method: "POST",
        className: "mainForm"
      },
      React.createElement(
        "label",
        { htmlFor: "username" },
        "Username: "
      ),
      React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
      React.createElement(
        "label",
        { htmlFor: "pass" },
        "Password: "
      ),
      React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
      React.createElement(
        "label",
        { htmlFor: "pass2" },
        "Password: "
      ),
      React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("div", { id: "error" }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign up" })
    )
  );
};

// Renders login window
var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

// Renders signup window
var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

// Page setup
var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

  // Event listner hookups
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); // default
};

// Get CSRF token
var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

// Ready
$(document).ready(function () {
  getToken();
});
"use strict";

/* Form for adding a game to the collection from the search screen.
Display is hidden from the CSS, so the user will not see it.
I did this so I could create it at setup with the csrf token */
var AddForm = function AddForm(props) {
  return React.createElement(
    "form",
    { id: "addForm",
      onSubmit: handleAdd,
      name: "addForm",
      action: "/addPage",
      method: "POST",
      className: "addForm"
    },
    React.createElement("input", { id: "gameName", type: "text", name: "name", placeholder: "Game Name", value: "" }),
    React.createElement("input", { id: "gameYear", type: "text", name: "year", placeholder: "Game Year", value: "" }),
    React.createElement("input", { id: "gameId", type: "text", name: "gameId", value: "" }),
    React.createElement("input", { id: "gamePlatform", type: "text", name: "platform", value: "" }),
    React.createElement("input", { id: "gameCategory", type: "text", name: "category", value: "" }),
    React.createElement("input", { id: "gamePicUrl", type: "text", name: "picUrl", value: "" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "addGameSubmit", type: "submit", value: "Add Game" })
  );
};

/* Form for removing a game to the collection from the search or list screens.
Display is hidden from the CSS, so the user will not see it.
I did this so I could create it at setup with the csrf token */
var RemoveForm = function RemoveForm(props) {
  return React.createElement(
    "form",
    { id: "removeForm",
      onSubmit: handleRemove,
      name: "removeForm",
      action: "/remove",
      method: "DELETE",
      className: "removeForm"
    },
    React.createElement("input", { id: "gameIdRemove", type: "text", name: "gameId", value: "" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "removeGameSubmit", type: "submit", value: "Remove Game" })
  );
};

/* Form for sending the options to update an existing game to the api.
  Hidden using CSS, so the user won't see it.
*/
var EditGameForm = function EditGameForm(props) {
  return React.createElement(
    "form",
    { id: "editGameForm",
      onSubmit: handleEdit,
      name: "editForm",
      action: "/edit",
      method: "POST",
      className: "editGameForm"
    },
    React.createElement("input", { id: "gameIdEdit", type: "text", name: "gameId", value: "" }),
    React.createElement("input", { id: "categoryEdit", type: "text", name: "category", value: "" }),
    React.createElement("input", { id: "lastPlayedEdit", type: "text", name: "lastPlayed", value: "" }),
    React.createElement("input", { id: "playTimeEdit", type: "text", name: "playTime", value: "" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "editGameSubmit", type: "submit", value: "Edit Game" })
  );
};

// Adds options to the form's dropdown menu for platforms
var populateDropdown = function populateDropdown(platforms) {
  // Some games, for some reason, have no platform listed, so we need to check for that.
  if (platforms) {
    var options = [];

    for (var i = 0; i < platforms.length; i++) {
      options.push(React.createElement(
        "option",
        { value: platforms[i].name },
        platforms[i].name
      ));
    }

    var dropDown = React.createElement(
      "select",
      { id: "resultPlatforms" },
      options
    );

    return dropDown;
  } else {
    return React.createElement(
      "select",
      { id: "resultPlatforms" },
      React.createElement(
        "option",
        { value: "N/A" },
        "No system listed"
      )
    );
  }
};
"use strict";

// Sends game info to the API to be sent to the database
var handleAdd = function handleAdd(e) {
  e.preventDefault();

  if ($("#gameName").val() == '' || $("#gameYear").val == '') {
    handleError("All fields are required");
    return false;
  }
  sendAjax('POST', $("#addForm").attr("action"), $("#addForm").serialize(), function () {
    loadSearchResults($(".resultList").data('results'));
  });

  return false;
};

// Sends game ID to the API for it to be removed from the database
var handleRemove = function handleRemove(e, page) {
  e.preventDefault();
  sendAjax('DELETE', $("#removeForm").attr("action"), $("#removeForm").serialize(), function () {

    // Differentiate between removing from the search page or the list page
    if (page === 'result') {
      loadSearchResults($(".resultList").data('results'));
    } else if (page === 'gameNodeForm') {
      loadGamesFromServer();
    }
  });

  return false;
};

// Sends game ID and options to be changed or added to the API
var handleEdit = function handleEdit(e) {
  e.preventDefault();
  sendAjax('POST', $("#editGameForm").attr("action"), $("#editGameForm").serialize(), function () {
    console.log('success');
    loadGamesFromServer();
  });

  return false;
};

// Similar to edit, but specifically for sending update time parameters
var handleUpdateTime = function handleUpdateTime() {
  sendAjax('POST', $("#editGameForm").attr("action"), $("#editGameForm").serialize(), function () {
    console.log('success');
    loadGamesFromServer();
  });

  return false;
};

// Sends search info to the API, to be called by the external API
var handleSearch = function handleSearch(e) {
  e.preventDefault();

  var searching = document.createElement('p');
  $(searching).text('Searching...');
  searching.id = 'searching';
  $("#searchResults").empty();
  $("#searchResults").append(searching);

  sendAjax('GET', $("#searchForm").attr("action"), $("#searchTerm").val(), function (data) {
    loadSearchResults(data);
  });
};

// Called when sending the data from the result node to the hidden add form
var handleSendGame = function handleSendGame(e) {
  e.preventDefault();

  var form = e.target;

  $("#gameName").val(form.getAttribute("name"));
  $("#gameYear").val(form.resultYearVal.value.toString());
  $("#gameId").val(form.resultGameId.value.toString());
  $("#gamePlatform").val(form.resultPlatforms.value);
  $("#gameCategory").val(form.resultCategory.value);
  $("#gamePicUrl").val(form.resultPicVal.value);

  handleAdd(e);
};

// Called when sending the data from the result or game node to the hidden remove form
var handleRemoveGame = function handleRemoveGame(e) {
  e.preventDefault();

  var form = e.target;
  if (!form.className) {
    form = e.target.parentNode; // Workaround for nesting of elements
    $("#gameIdRemove").val(form.gameId.value.toString());
  } else if (form.className === 'result') {
    form = e.target;
    $("#gameIdRemove").val(form.resultGameId.value.toString());
  }

  handleRemove(e, form.className);
};

// Sets up the hidden form with the parameters to update the game with
var handleEditGame = function handleEditGame(e) {
  e.preventDefault();
  var form = e.target;
  $("#gameIdEdit").val(form.gameId.value.toString());
  $("#categoryEdit").val(form.resultCategory.value.toString());
  $("#lastPlayedEdit").val(form.lastPlayed.value.toString());

  handleEdit(e);
};

// Sets up the hidden form with the parameters to update the game with
var handleSendTime = function handleSendTime(options) {
  $("#gameIdEdit").val(options.gameId);
  $("#lastPlayedEdit").val(options.lastPlayed);
  $("#playTimeEdit").val(options.playTime);
  $("#categoryEdit").val(options.category);

  handleUpdateTime();
};

// Called when sending the user's credentials and new password to the API
var handleChangePassword = function handleChangePassword(e) {

  e.preventDefault();

  if ($("#oldPass").val() == '' || $("#newPass").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#oldPass").val() === $("#newPass").val()) {
    handleError("Please enter a different password");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

  return false;
};
'use strict';

// A simple browser alert when an error occurs
var handleError = function handleError(message) {
  $("#error").text(message);
};

// Redirects the window to the designated url
var redirect = function redirect(response) {
  window.location = response.redirect;
};

// Taken from https://hype.codes/how-get-current-date-javascript
var getDate = function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  var date = yyyy + '-' + mm + '-' + dd;
  return date;
};

// Sends ajax request
var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
