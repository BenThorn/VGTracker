"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Component to render tot the body
var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));
  }

  // Creates five divs to contain the list, and the title of the list and the list itself


  _createClass(App, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "App" },
        React.createElement(RemoveForm, { csrf: this.props.csrf }),
        React.createElement(
          "div",
          { id: "current" },
          React.createElement(
            "h3",
            null,
            "Currently playing"
          ),
          React.createElement(
            "div",
            { className: "currentList" },
            React.createElement(
              "p",
              null,
              "No games in this category."
            )
          )
        ),
        React.createElement(
          "div",
          { id: "owned" },
          React.createElement(
            "h3",
            null,
            "Own but never played"
          ),
          React.createElement("div", { className: "ownedList" })
        ),
        React.createElement(
          "div",
          { id: "finished" },
          React.createElement(
            "h3",
            null,
            "Finished"
          ),
          React.createElement("div", { className: "finishedList" })
        ),
        React.createElement(
          "div",
          { id: "hold" },
          React.createElement(
            "h3",
            null,
            "On hold"
          ),
          React.createElement("div", { className: "holdList" })
        ),
        React.createElement(
          "div",
          { id: "dropped" },
          React.createElement(
            "h3",
            null,
            "Dropped"
          ),
          React.createElement("div", { className: "droppedList" })
        )
      );
    }
  }]);

  return App;
}(React.Component);

;

// The list of the user's games
var GameList = function GameList(props) {
  if (props.games.length === 0) {
    return React.createElement("div", { className: "gameList" });
  }

  var gameNodes = props.games.map(function (game) {
    var node = createGameNode(game, props.currentCategory);
    if (node !== null) {
      return node;
    }
  });

  if (gameNodes[0] === null) {
    return React.createElement(
      "div",
      { className: "gameList" },
      React.createElement(
        "p",
        null,
        "Currently no games in this category."
      )
    );
  } else {
    return React.createElement(
      "div",
      { className: "gameList" },
      gameNodes
    );
  }
};

// Page setup
var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(App, { csrf: csrf }), document.querySelector("#content"));

  loadGamesFromServer();
};

// Loads the games from the server, then checks through the list to separate the categories
var loadGamesFromServer = function loadGamesFromServer() {
  sendAjax('GET', '/getGames', null, function (data) {
    var categories = ['current', 'owned', 'finished', 'hold', 'dropped'];

    for (var i = 0; i < categories.length; i++) {
      ReactDOM.render(React.createElement(GameList, { games: data.games, currentCategory: categories[i] }), document.querySelector("." + categories[i] + "List"));
    }
  });
};

var createGameNode = function createGameNode(game, currentCategory) {
  // To separate the user's games into the five categories, it only returns an element if the category matches 
  // the current category
  if (game.category === currentCategory) {
    var year = void 0;
    // Check if the date wasn't available from the API
    if (game.year === 0) {
      year = 'N/A';
    } else {
      year = game.year;
    }
    return React.createElement(
      "div",
      { key: game._id, className: "game" },
      React.createElement(
        "form",
        {
          id: game._id,
          className: "gameNodeForm",
          onSubmit: handleRemoveGame,
          action: "removeList"
        },
        React.createElement(
          "p",
          { className: "gameNodeName" },
          " ",
          game.name,
          " "
        ),
        React.createElement(
          "p",
          { className: "gameNodeYear" },
          " ",
          year,
          " "
        ),
        React.createElement(
          "p",
          { className: "gameNodePlatform" },
          " ",
          game.platform,
          " "
        ),
        React.createElement("input", { type: "hidden", id: "gameId", value: game.gameId }),
        React.createElement("input", { type: "submit", value: "Remove Game From Collection" })
      )
    );
  } else {
    return null;
  }
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
