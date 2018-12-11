// Component for the searchbar at the top of the page
const SearchForm = (props) => {
  return (
    <form id="searchForm"
      onSubmit={handleSearch}
      name="searchForm"
      action="/search"
      method="GET"
      className="searchForm"
    >
      <input id="searchTerm" type="text" name="searchTerm" placeholder="Title"/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="searchSubmit" type="submit" value="Search for Game" />
    </form>
  );
};

/*Maps the search results into form elements
Checks if the game is already present in the collection,
and changes the submit button to add or delete*/
const SearchResults = (props) => {
  let submitValue = "Add Game";
  let submitMethod = handleSendGame;
  let backgroundColor;

  // If search returns empty
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
        backgroundColor = {backgroundColor: 'cyan'};
        break;
      } else {
        backgroundColor = {backgroundColor: 'inherit'}
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
        style={backgroundColor}
      >
        <div id='imgWrapper'>
          <img src={result.image['small_url']} alt='image'/>
        </div>
        <div id="resultInfo">
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
          <input id="resultPicVal" type="hidden" name="resultPicVal" value={result.image['small_url']} />
          <input id="resultSubmit" type="submit" value={submitValue} />
        </div>
      </form>
    );
  });
// Stores the initial results in the wrapper div so it can be reloaded 
// without calling search again.
  return (
    <div className="resultList" 
    data-results={JSON.stringify(props.results)}>
    <h3>Search Results</h3>
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


