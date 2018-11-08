"use strict";

var handleAdd = function handleAdd(e) {
  e.preventDefault();

  if ($("#gameName").val() == '' || $("#gameYear").val == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#addForm").attr("action"), $("#addForm").serialize(), function () {
    loadGamesFromServer();
  });

  return false;
};

// const handleRemove = (e) => {
//   e.preventDefault();

//   $("#domoMessage").animate({width:'hide'},350);

//   if($("#domoNameRemove").val() == '') {
//     handleError("RAWR! All fields are required");
//     return false;
//   }

//   sendAjax('DELETE', $("#removeForm").attr("action"), $("#removeForm").serialize(), function() {
//     loadDomosFromServer();
//   });

//   return false;
// };

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
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "gameName", type: "text", name: "name", placeholder: "Game Name" }),
    React.createElement(
      "label",
      { htmlFor: "year" },
      "Year: "
    ),
    React.createElement("input", { id: "gameYear", type: "text", name: "year", placeholder: "Game Year" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "addGameSubmit", type: "submit", value: "Add Game" })
  );
};

// const RemoveForm = (props) => {
//   return (
//     <form id="removeForm"
//       onSubmit={handleRemove}
//       name="removeForm"
//       action="/remove"
//       method="DELETE"
//       className="removeForm"
//     >
//       <label htmlFor="remove">Remove Domo: </label>
//       <input id="domoNameRemove" type="text" name="name" placeholder="Domo Name"/>
//       <input type="hidden" name="_csrf" value={props.csrf} />
//       <input className="removeDomoSubmit" type="submit" value="Remove Domo" />
//     </form>
//   )
// }

var GameList = function GameList(props) {
  if (props.games.length === 0) {
    return React.createElement(
      "div",
      { className: "gameList" },
      React.createElement(
        "h3",
        { className: "emptyGames" },
        "No Games yet"
      )
    );
  }

  var gameNodes = props.games.map(function (game) {
    return React.createElement(
      "div",
      { key: game._id, className: "game" },
      React.createElement(
        "h3",
        { className: "gameName" },
        " Name: ",
        game.name,
        " "
      ),
      React.createElement(
        "h3",
        { className: "gameYear" },
        " Year: ",
        game.year,
        " "
      )
    );
  });

  return React.createElement(
    "div",
    { className: "gameList" },
    gameNodes
  );
};

var loadGamesFromServer = function loadGamesFromServer() {
  sendAjax('GET', '/getGames', null, function (data) {
    ReactDOM.render(React.createElement(GameList, { games: data.games }), document.querySelector("#games"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(AddForm, { csrf: csrf }), document.querySelector("#addGame"));

  // ReactDOM.render(
  //   <RemoveForm csrf={csrf} />, document.querySelector("#removeDomo")
  // )

  ReactDOM.render(React.createElement(GameList, { games: [] }), document.querySelector("#games"));

  loadGamesFromServer();
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
