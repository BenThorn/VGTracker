"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        React.createElement(AddForm, { csrf: this.props.csrf }),
        React.createElement(RemoveForm, { csrf: this.props.csrf }),
        React.createElement(SearchForm, { csrf: this.props.csrf }),
        React.createElement("div", { id: "searchResults" })
      );
    }
  }]);

  return App;
}(React.Component);

;

var loadSearchResults = function loadSearchResults(data) {
  // Callback so it has time to load the user's games
  getUserGames(function (userGames) {
    ReactDOM.render(React.createElement(SearchResults, { results: data, userGames: userGames.games }), document.querySelector("#searchResults"));
  });
};

// For checking if games in the search results already exist in the collection
var getUserGames = function getUserGames(callback) {
  sendAjax('GET', '/getGames', null, callback);
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(App, { csrf: csrf }), document.querySelector("#content"));

  // loadGamesFromServer();
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

var SearchForm = function SearchForm(props) {
  return React.createElement(
    "form",
    { id: "searchForm",
      onSubmit: handleSearch,
      name: "searchForm",
      action: "/search",
      method: "GET",
      className: "searchForm"
    },
    React.createElement("input", { id: "searchTerm", type: "text", name: "searchTerm", placeholder: "Title" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "searchSubmit", type: "submit", value: "Search for Game" })
  );
};

var SearchResults = function SearchResults(props) {
  var submitValue = "Add Game";
  var submitMethod = handleSendGame;

  if (props.results.length === 0) {
    return React.createElement(
      "div",
      { className: "gameList" },
      React.createElement(
        "h3",
        { className: "emptyGames" },
        "No games found."
      )
    );
  }

  var resultNodes = props.results.map(function (result) {
    for (var i = 0; i < props.userGames.length; i++) {
      if (props.userGames[i].gameId === result.id) {
        submitValue = "Delete Game";
        submitMethod = handleRemoveGame;
        break;
      } else {
        submitValue = "Add Game";
        submitMethod = handleSendGame;
      }
    }
    return React.createElement(
      "form",
      {
        key: result.id,
        onSubmit: submitMethod,
        name: result.name,
        className: "result"
      },
      React.createElement(
        "div",
        { id: "imgWrapper" },
        React.createElement("img", { src: result.image['small_url'], alt: "image" })
      ),
      React.createElement(
        "div",
        { id: "resultInfo" },
        React.createElement(
          "p",
          { id: "resultName" },
          result.name,
          " "
        ),
        React.createElement(
          "p",
          { id: "resultYear" },
          formatDate(result.original_release_date, result.expected_release_year, false),
          " "
        ),
        populateDropdown(result.platforms),
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
        React.createElement("input", { id: "resultGameId", type: "hidden", name: "resultGameId", value: result.id }),
        React.createElement("input", { id: "resultYearVal", type: "hidden", name: "resultYearVal", value: formatDate(result.original_release_date, result.expected_release_year, true) }),
        React.createElement("input", { id: "resultSubmit", type: "submit", value: submitValue })
      )
    );
  });

  return React.createElement(
    "div",
    { className: "resultList",
      "data-results": JSON.stringify(props.results) },
    resultNodes
  );
};

// Get just year from full date. Also checks if the date is future, or doesn't exist
var formatDate = function formatDate(date, futureDate, needsNum) {
  if (date) {
    var dateStr = date.slice(0, 4);
    var year = parseInt(dateStr);
    return year;
  } else if (!date && futureDate) {
    return futureDate;
  } else if (!date && !futureDate && !needsNum) {
    return null;
  } else if (!date && !futureDate && needsNum) {
    return 0;
  }
};

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

  $("#searchResults").text("Searching...");

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
