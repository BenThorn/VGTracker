"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

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

var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    "div",
    { className: "LoginWindow" },
    React.createElement(
      "div",
      { id: "welcome" },
      "Welcome to VGTimer! Please login, or sign up if you don't have an account."
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
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" })
    )
  );
};

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
      React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign up" })
    )
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

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

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

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
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "addGameSubmit", type: "submit", value: "Add Game" })
  );
};

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

var handleSearch = function handleSearch(e) {
  e.preventDefault();

  if ($("#searchTerm").val() === '') {
    handleError("Please fill in a search term.");
    return false;
  }
  sendAjax('GET', $("#searchForm").attr("action"), $("#searchTerm").val(), function (data) {
    console.log(data);
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

  handleAdd(e);
};

var handleRemoveGame = function handleRemoveGame(e) {
  e.preventDefault();

  var form = e.target;

  console.log(form.className);

  if (form.className === 'gameNodeForm') {
    $("#gameIdRemove").val(form.gameId.value.toString());
  } else if (form.className === 'result') {
    $("#gameIdRemove").val(form.resultGameId.value.toString());
  }

  handleRemove(e, form.className);
};

var handleChangePassword = function handleChangePassword(e) {
  console.log('change password');

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
"use strict";

var handleError = function handleError(message) {
  alert(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

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
