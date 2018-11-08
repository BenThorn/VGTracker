const handleAdd = (e) => {
  e.preventDefault();

  if($("#gameName").val() == '' || $("#gameYear").val == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#addForm").attr("action"), $("#addForm").serialize(), function() {
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

const AddForm = (props) => {
  return (
    <form id="addForm"
      onSubmit={handleAdd}
      name="addForm"
      action="/addPage"
      method="POST"
      className="addForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="gameName" type="text" name="name" placeholder="Game Name"/>
      <label htmlFor="year">Year: </label>
      <input id="gameYear" type="text" name="year" placeholder="Game Year"/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="addGameSubmit" type="submit" value="Add Game" />
    </form>
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

const GameList = function(props) {
  if(props.games.length === 0) {
    return (
      <div className="gameList">
        <h3 className="emptyGames">No Games yet</h3>
      </div>
    );
  }

  const gameNodes = props.games.map(function(game) {
    return (
      <div key={game._id} className="game">
        <h3 className="gameName"> Name: {game.name} </h3>
        <h3 className="gameYear"> Year: {game.year} </h3>
      </div>
    );
  });

  return (
    <div className="gameList">
      {gameNodes}
    </div>
  );
};

const loadGamesFromServer = () => {
  sendAjax('GET', '/getGames', null, (data) => {
    ReactDOM.render(
      <GameList games={data.games} />, document.querySelector("#games")
    )
  })
};

const setup = function(csrf) {
  ReactDOM.render(
    <AddForm csrf={csrf} />, document.querySelector("#addGame")
  );
  
  // ReactDOM.render(
  //   <RemoveForm csrf={csrf} />, document.querySelector("#removeDomo")
  // )

  ReactDOM.render(
    <GameList games={[]} />, document.querySelector("#games")
  );

  loadGamesFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});