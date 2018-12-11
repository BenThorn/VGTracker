/* Form for adding a game to the collection from the search screen.
Display is hidden from the CSS, so the user will not see it.
I did this so I could create it at setup with the csrf token */
const AddForm = (props) => {
  return (
    <form id="addForm"
      onSubmit={handleAdd}
      name="addForm"
      action="/addPage"
      method="POST"
      className="addForm"
    >
      <input id="gameName" type="text" name="name" placeholder="Game Name" value=""/>
      <input id="gameYear" type="text" name="year" placeholder="Game Year" value=""/>
      <input id="gameId" type="text" name="gameId" value=""/>
      <input id="gamePlatform" type="text" name="platform" value=""/>
      <input id="gameCategory" type="text" name="category" value=""/>
      <input id="gamePicUrl" type="text" name="picUrl" value=""/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="addGameSubmit" type="submit" value="Add Game"/>
    </form>
  );
};

/* Form for removing a game to the collection from the search or list screens.
Display is hidden from the CSS, so the user will not see it.
I did this so I could create it at setup with the csrf token */
const RemoveForm = (props) => {
  return (
    <form id="removeForm"
      onSubmit={handleRemove}
      name="removeForm"
      action="/remove"
      method="DELETE"
      className="removeForm"
    >
      <input id="gameIdRemove" type="text" name="gameId" value=""/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="removeGameSubmit" type="submit" value="Remove Game" />
    </form>
  )
}


/* Form for sending the options to update an existing game to the api.
  Hidden using CSS, so the user won't see it.
*/
const EditGameForm = (props) => {
  return (
    <form id="editGameForm"
      onSubmit={handleEdit}
      name="editForm"
      action="/edit"
      method="POST"
      className="editGameForm"
    >
      <input id="gameIdEdit" type="text" name="gameId" value=""/>
      <input id="categoryEdit" type="text" name="category" value=""/>
      <input id="lastPlayedEdit" type="text" name="lastPlayed" value=""/>
      <input id="playTimeEdit" type="text" name="playTime" value=""/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="editGameSubmit" type="submit" value="Edit Game" />
    </form>
  )
}

// Adds options to the form's dropdown menu for platforms
const populateDropdown = (platforms) => {
  // Some games, for some reason, have no platform listed, so we need to check for that.
  if(platforms) {
    let options = [];

    for (let i = 0; i < platforms.length; i++) {
      options.push(
        <option value={platforms[i].name}>{platforms[i].name}</option>
      )
    }
  
    const dropDown = <select id="resultPlatforms">{options}</select>;
  
    return dropDown;
  } else {
    return (
    <select id="resultPlatforms">
      <option value="N/A">No system listed</option>
    </select>);
  }
};
