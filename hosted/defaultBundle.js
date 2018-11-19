"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Component to be rendered to the body
var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "App" },
        React.createElement(
          "div",
          { id: "default" },
          React.createElement(
            "h3",
            null,
            "Welcome to VGTracker!"
          ),
          React.createElement(HomeButtons, null)
        )
      );
    }
  }]);

  return App;
}(React.Component);

;

// Buttons on the default screen
var HomeButtons = function HomeButtons(props) {
  return React.createElement(
    "div",
    { className: "homeButtons" },
    React.createElement(
      "div",
      null,
      React.createElement(
        "button",
        null,
        React.createElement(
          "a",
          { href: "/addPage" },
          "Search and Add Games"
        )
      ),
      React.createElement(
        "button",
        null,
        React.createElement(
          "a",
          { href: "/list" },
          "View your Collection"
        )
      )
    ),
    React.createElement(
      "button",
      { id: "changePassButton" },
      "Change your password"
    )
  );
};

// Form for changing the password, similar to login and signup forms
var ChangePassWindow = function ChangePassWindow(props) {
  return React.createElement(
    "div",
    { className: "ChangePassWindow" },
    React.createElement(
      "form",
      { id: "changePassForm",
        name: "changePassForm",
        onSubmit: handleChangePassword,
        action: "/changePassword",
        method: "POST",
        className: "mainForm"
      },
      React.createElement(
        "label",
        { htmlFor: "username" },
        "Username: "
      ),
      React.createElement("input", { id: "user", type: "text", name: "username" }),
      React.createElement(
        "label",
        { htmlFor: "pass" },
        " Old Password: "
      ),
      React.createElement("input", { id: "oldPass", type: "password", name: "oldPass" }),
      React.createElement(
        "label",
        { htmlFor: "pass2" },
        " New Password: "
      ),
      React.createElement("input", { id: "newPass", type: "password", name: "newPass" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "Change password" })
    )
  );
};

// Renders the change password window
var createChangePassWindow = function createChangePassWindow(csrf) {
  ReactDOM.render(React.createElement(ChangePassWindow, { csrf: csrf }), document.querySelector("#content"));
};

// Setup page
var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(App, { csrf: csrf }), document.querySelector("#content"));

  var changePassButton = document.querySelector("#changePassButton");

  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    createChangePassWindow(csrf);
    return false;
  });
};

// Get csrf token
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

// Sends search info to the API, to be called by the external API
var handleSearch = function handleSearch(e) {
  e.preventDefault();

  if ($("#searchTerm").val() === '') {
    handleError("Please fill in a search term.");
    return false;
  }

  $("#searchResults").text("Searching...");

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

  handleAdd(e);
};

// Called when sending the data from the result or game node to the hidden remove form
var handleRemoveGame = function handleRemoveGame(e) {
  e.preventDefault();

  var form = e.target;

  if (form.className === 'gameNodeForm') {
    $("#gameIdRemove").val(form.gameId.value.toString());
  } else if (form.className === 'result') {
    $("#gameIdRemove").val(form.resultGameId.value.toString());
  }

  handleRemove(e, form.className);
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
"use strict";

// A simple browser alert when an error occurs
var handleError = function handleError(message) {
  alert(message);
};

// Redirects the window to the designated url
var redirect = function redirect(response) {
  window.location = response.redirect;
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
