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
        React.createElement(EditGameForm, { csrf: this.props.csrf }),
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
  var gameNodes = props.games.map(function (game) {
    var node = createGameNode(game);
    // Sends the game node's edit form category select
    var categorySelect = node.props.children[1].props.children[1].props.children;
    var lastPlayedField = node.props.children[1].props.children[4];
    setEditOptions(categorySelect, lastPlayedField, game.category, game.lastPlayed);
    return node;
  });
  if (gameNodes.length === 0) {
    return React.createElement(
      "div",
      { className: "gameList" },
      React.createElement(
        "p",
        { id: "noGames" },
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
    var games = data.games;

    var _loop = function _loop(i) {
      var separatedGames = []; // Only sending an array with the pre-separated list
      games.forEach(function (game) {
        if (game.category === categories[i]) {
          separatedGames.push(game);
        }
      });
      ReactDOM.render(React.createElement(GameList, { games: separatedGames, currentCategory: categories[i] }), document.querySelector("." + categories[i] + "List"));
    };

    for (var i = 0; i < categories.length; i++) {
      _loop(i);
    }
  });
};

// Creates a single game listing in your collection
var createGameNode = function createGameNode(game) {
  var year = void 0;
  // Check if the date wasn't available from the API
  if (game.year === 0) {
    year = 'N/A';
  } else {
    year = game.year;
  }
  return React.createElement(
    "div",
    { key: game._id, id: game._id, className: "game" },
    React.createElement(
      "form",
      {
        className: "gameNodeForm",
        onSubmit: handleRemoveGame,
        action: "removeList"
      },
      React.createElement(
        "div",
        { id: "img" },
        React.createElement("img", { src: game.picUrl, alt: "game picture" })
      ),
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
      React.createElement("input", { id: "editButton", type: "button", value: "Edit", onClick: editClick }),
      React.createElement("input", { type: "hidden", id: "gameId", value: game.gameId }),
      React.createElement("input", { type: "button", value: "Delete", onClick: handleRemoveGame })
    ),
    React.createElement(
      "form",
      {
        className: "editForm",
        onSubmit: handleEditGame
      },
      React.createElement(
        "label",
        { "for": "category" },
        "Category: "
      ),
      React.createElement(
        "select",
        { id: "resultCategory" },
        React.createElement(
          "option",
          { value: "current" },
          "Currently playing"
        ),
        React.createElement(
          "option",
          { value: "owned" },
          "Owned, but not played"
        ),
        React.createElement(
          "option",
          { value: "finished" },
          "Finished"
        ),
        React.createElement(
          "option",
          { value: "hold" },
          "On hold"
        ),
        React.createElement(
          "option",
          { value: "dropped" },
          "Dropped"
        )
      ),
      React.createElement(
        "label",
        { "for": "date" },
        "Last played:"
      ),
      React.createElement("input", { type: "hidden", id: "gameId", value: game.gameId }),
      React.createElement("input", { type: "date", id: "lastPlayed", name: "lastPlayed",
        min: "1970-01-01", max: getDate() }),
      React.createElement("input", { id: "editSubmit", type: "submit", value: "Save" }),
      React.createElement("input", { id: "editCancel", type: "button", onClick: cancelClick, value: "Cancel" })
    )
  );
};

// For opening the edit menu
var editClick = function editClick(e) {
  var gameWrapper = e.target.parentNode.parentNode;

  $(".game").animate({ height: "82px" }, { queue: false });
  $(gameWrapper).animate({ height: "120px" }, { queue: false });
};

var cancelClick = function cancelClick(e) {
  var gameWrapper = e.target.parentNode.parentNode;
  $(gameWrapper).animate({ height: "82px" }, { queue: false });
};

// Sets the initial selected option of the category select and last played date
var setEditOptions = function setEditOptions(options, lastPlayedField, category, lastPlayed) {
  options.forEach(function (option) {
    if (category === option.props.value) {
      option.props.selected = true;
    }
  });

  if (lastPlayed) {
    lastPlayedField.props.value = lastPlayed.slice(0, 10);
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
