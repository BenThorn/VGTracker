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
        React.createElement(EditGameForm, { csrf: this.props.csrf }),
        React.createElement(
          "div",
          { id: "current" },
          React.createElement(
            "h3",
            null,
            "Select from currently playing"
          ),
          React.createElement(
            "div",
            { className: "currentLog" },
            React.createElement(
              "p",
              { id: "noGames" },
              "No games in this category."
            )
          )
        ),
        React.createElement("div", { id: "timerWrapper" })
      );
    }
  }]);

  return App;
}(React.Component);

;

/* Timer class component that appears when a 'currently playing' 
 game is clicked on the log view.
 Keeps track of a setInterval object and seconds of playtime in the state*/

var Timer = function (_React$Component2) {
  _inherits(Timer, _React$Component2);

  function Timer(props) {
    _classCallCheck(this, Timer);

    var _this2 = _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).call(this, props));

    _this2.state = { interval: null, seconds: props.seconds };

    _this2.startTimer = _this2.startTimer.bind(_this2);
    _this2.stopTimer = _this2.stopTimer.bind(_this2);
    _this2.saveTime = _this2.saveTime.bind(_this2);
    return _this2;
  }

  _createClass(Timer, [{
    key: "startTimer",
    value: function startTimer(e) {
      var _this3 = this;

      e.preventDefault();
      var seconds = this.props.seconds;
      var interval = setInterval(function () {
        seconds++;
        loadTime(seconds);
        _this3.setState({ seconds: seconds });
      }, 1000);

      this.setState({ interval: interval });

      // Make certain buttons unclickable during counting/stopped
      $(e.target).css('pointer-events', 'none');
      $('#stopButton').css('pointer-events', 'unset');
      $('#saveButton').css('pointer-events', 'none');
    }
  }, {
    key: "stopTimer",
    value: function stopTimer(e) {
      e.preventDefault();
      $('#startButton').css('pointer-events', 'unset');
      $('#stopButton').css('pointer-events', 'none');
      $('#saveButton').css('pointer-events', 'unset');

      clearInterval(this.state.interval);
    }
  }, {
    key: "saveTime",


    // Sends the playtime in seconds, and the current date (since you were playing today!)
    value: function saveTime(e) {
      e.preventDefault();
      var options = {
        gameId: this.props.gameId,
        playTime: this.state.seconds,
        lastPlayed: getDate(),
        category: 'current'
      };
      handleSendTime(options);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "timer" },
        React.createElement(
          "form",
          { id: "timeForm" },
          React.createElement(
            "p",
            { id: "selectedName" },
            "Currently selected game: ",
            React.createElement(
              "span",
              { id: "displayName" },
              this.props.gameName
            )
          ),
          React.createElement(
            "p",
            { id: "time" },
            convertSeconds(this.state.seconds)
          ),
          React.createElement(
            "div",
            { id: "controlButtons" },
            React.createElement(
              "button",
              { id: "startButton", onClick: this.startTimer },
              "Start"
            ),
            React.createElement(
              "button",
              { id: "stopButton", onClick: this.stopTimer },
              "Stop"
            ),
            React.createElement(
              "button",
              { id: "saveButton", onClick: this.saveTime },
              "Save"
            )
          ),
          React.createElement("input", { type: "hidden", id: "gameId", name: "gameId", value: this.props.gameId })
        )
      );
    }
  }]);

  return Timer;
}(React.Component);

;

// Taken from https://www.tutorialspoint.com/How-to-convert-seconds-to-HH-MM-SS-with-JavaScript
// Converts an int of seconds into HH:MM:SS format
var convertSeconds = function convertSeconds(sec) {
  var hrs = Math.floor(sec / 3600);
  var min = Math.floor((sec - hrs * 3600) / 60);
  var seconds = sec - hrs * 3600 - min * 60;
  seconds = Math.round(seconds * 100) / 100;

  var result = hrs < 10 ? "0" + hrs : hrs;
  result += ":" + (min < 10 ? "0" + min : min);
  result += ":" + (seconds < 10 ? "0" + seconds : seconds);
  return result;
};

// Loads in the converted time (or 0s if there is no time) into the timer
var loadTime = function loadTime(seconds) {
  var timeString = '';
  if (seconds === '') {
    timeString = '00:00:00';
  } else {
    timeString = convertSeconds(seconds);
  }

  $('#time').text(timeString);
};

// Similar to the GameList of the List view. Will only contain currently playing
var GameList = function GameList(props) {
  var gameNodes = props.games.map(function (game) {
    var node = createGameNode(game);
    // Sends the game node's edit form category select
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
};

// Loads the games from the server, then checks through the list and grabs only currentlyPlaying
var loadGamesFromServer = function loadGamesFromServer() {
  sendAjax('GET', '/getGames', null, function (data) {
    var games = data.games;
    var currentGames = [];

    games.forEach(function (game) {
      if (game.category === 'current') {
        currentGames.push(game);
      }
    });
    currentGames.sort(function (a, b) {
      return new Date(b.lastPlayed) - new Date(a.lastPlayed);
    });
    ReactDOM.render(React.createElement(GameList, { games: currentGames }), document.querySelector(".currentLog"));
  });
};

// Similar to createGameNode of the list view. Gets playTime and lastPlayed instead
// of game year and platform
var createGameNode = function createGameNode(game) {
  var lastPlayed = game.lastPlayed;
  var playTime = game.playTime;
  if (lastPlayed === null) {
    lastPlayed = 'No date set';
  } else {
    lastPlayed = lastPlayed.slice(0, 10);
  }

  if (playTime === null) {
    playTime = 'No time logged';
  } else {
    playTime = convertSeconds(playTime);
  }
  return React.createElement(
    "div",
    { key: game._id, id: game._id, className: "game" },
    React.createElement(
      "div",
      {
        className: "gameNodeLog", onClick: nodeClick
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
        { className: "gameNodePlayTime" },
        " ",
        playTime,
        " "
      ),
      React.createElement(
        "p",
        { className: "gameNodeDate" },
        " ",
        lastPlayed,
        " "
      ),
      React.createElement("input", { type: "hidden", id: "gameId", value: game.gameId }),
      React.createElement("input", { type: "hidden", id: "playTime", value: game.playTime })
    )
  );
};

// OnClick for a game element in the GameList
var nodeClick = function nodeClick(e) {
  var node = e.target;

  // Checking if user clicked name or other inside element
  if (e.target.className !== 'gameNodeLog') {
    node = e.target.parentNode;
  }

  if (e.target.className === "") {
    node = e.target.parentNode.parentNode; // If they click the image
  }
  var gameName = node.querySelector(".gameNodeName").textContent;
  var gameId = node.querySelector("#gameId").value;
  var playTime = node.querySelector("#playTime").value;

  $('#displayName').text(gameName);
  $('#timerId').val(gameId);
  $('.gameNodeLog').css('background-color', 'inherit');
  $(node).css('background-color', 'cyan');
  loadTime(playTime);

  // Creation of the Timer component
  ReactDOM.render(React.createElement(Timer, { seconds: playTime, gameName: gameName, gameId: gameId }), document.querySelector("#timerWrapper"));
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
  loadGamesFromServer();
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
