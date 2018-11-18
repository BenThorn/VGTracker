const SearchForm = (props) => {
  return (
    <form id="searchForm"
      onSubmit={handleSearch}
      name="searchForm"
      action="/search"
      method="GET"
      className="searchForm"
    >
      <label htmlFor="search">Name: </label>
      <input id="searchTerm" type="text" name="searchTerm" placeholder="Title"/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="searchSubmit" type="submit" value="Search for Game" />
    </form>
  );
};

const SearchResults = (props) => {
  let submitValue = "Add Game";
  let submitMethod = handleSendGame;

  if(props.results.length === 0) {
    return (
      <div className="gameList">
        <h3 className="emptyGames">No games found.</h3>
      </div>
    );
  }

  const resultNodes = props.results.map(function(result) {
    for(let i = 0; i < props.userGames.length; i++) {
      if(props.userGames[i].gameId === result.id) {
        submitValue = "Delete Game";
        submitMethod = handleRemoveGame;
        break;
      } else {
        submitValue = "Add Game";
        submitMethod = handleSendGame;
      }
    }
    return (
      <form 
        key={result.id} 
        onSubmit={submitMethod}
        name={result.name}
        className="result"
      >
        <p id="resultName">{result.name} </p>
        <p id="resultYear">{formatDate(result.original_release_date, result.expected_release_year, false)} </p>
        {populateDropdown(result.platforms)}
        <select id="resultCategory">
          <option value="current">Currently playing</option>
          <option value="owned">Owned, but not played</option>
          <option value="finished">Finished</option>
          <option value="hold">On hold</option>
          <option value="dropped">Dropped</option>
        </select>
        <input id="resultGameId" type="hidden" name="resultGameId" value={result.id} />
        <input id="resultYearVal" type="hidden" name="resultYearVal" value={formatDate(result.original_release_date, result.expected_release_year, true)} />
        <input id="resultSubmit" type="submit" value={submitValue} />
      </form>
    );
  });

  return (
    <div className="resultList" 
    data-results={JSON.stringify(props.results)}>
      {resultNodes}
    </div>
  );
};

// Get just year from full date. Also checks if the date is future, or doesn't exist
const formatDate = (date, futureDate, needsNum) => {
  if(date){
    const dateStr = date.slice(0,4);
    const year = parseInt(dateStr);
    return year;
  } else if(!date && futureDate) {
    return futureDate
  } else if (!date && !futureDate && !needsNum) {
    return null;
  } else if (!date && !futureDate && needsNum) {
    return 0;
  }

};

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
