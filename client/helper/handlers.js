// Sends game info to the API to be sent to the database
const handleAdd = (e) => {
  e.preventDefault();

  if($("#gameName").val() == '' || $("#gameYear").val == '') {
    handleError("All fields are required");
    return false;
  }
  sendAjax('POST', $("#addForm").attr("action"), $("#addForm").serialize(), function() {
    loadSearchResults($(".resultList").data('results'));
  });

  return false;
};

// Sends game ID to the API for it to be removed from the database
const handleRemove = (e, page) => {
  e.preventDefault();
  sendAjax('DELETE', $("#removeForm").attr("action"), $("#removeForm").serialize(), function() {

    // Differentiate between removing from the search page or the list page
    if (page === 'result') {
      loadSearchResults($(".resultList").data('results'));
    } else if (page  === 'gameNodeForm') {
      loadGamesFromServer();
    }
  });

  return false;
};

// Sends game ID and options to be changed or added to the API
const handleEdit = (e) => {
  e.preventDefault();
  sendAjax('POST', $("#editGameForm").attr("action"), $("#editGameForm").serialize(), function () {
    console.log('success');
    loadGamesFromServer();
  });

  return false;
};

// Similar to edit, but specifically for sending update time parameters
const handleUpdateTime = () => {
  sendAjax('POST', $("#editGameForm").attr("action"), $("#editGameForm").serialize(), function () {
    console.log('success');
    loadGamesFromServer();
  });

  return false
};

// Sends search info to the API, to be called by the external API
const handleSearch = (e) => {
  e.preventDefault();

  const searching = document.createElement('p');
  $(searching).text('Searching...');
  searching.id = 'searching';
  $("#searchResults").empty();
  $("#searchResults").append(searching);

  sendAjax('GET', $("#searchForm").attr("action"), $("#searchTerm").val(), (data) => {
    loadSearchResults(data);
  });
};


// Called when sending the data from the result node to the hidden add form
const handleSendGame = (e) => {
  e.preventDefault();

  const form = e.target;

  $("#gameName").val(form.getAttribute("name"));
  $("#gameYear").val(form.resultYearVal.value.toString());
  $("#gameId").val(form.resultGameId.value.toString());
  $("#gamePlatform").val(form.resultPlatforms.value);
  $("#gameCategory").val(form.resultCategory.value);
  $("#gamePicUrl").val(form.resultPicVal.value);

  handleAdd(e);
};

// Called when sending the data from the result or game node to the hidden remove form
const handleRemoveGame = (e) => {
  e.preventDefault();

  let form = e.target;
  if(!form.className) {
    form = e.target.parentNode; // Workaround for nesting of elements
    $("#gameIdRemove").val(form.gameId.value.toString());
  } else if(form.className === 'result') {
    form = e.target;
    $("#gameIdRemove").val(form.resultGameId.value.toString());
  }

  handleRemove(e, form.className);
};

// Sets up the hidden form with the parameters to update the game with
const handleEditGame = (e) => {
  e.preventDefault();
  const form = e.target;
  $("#gameIdEdit").val(form.gameId.value.toString());
  $("#categoryEdit").val(form.resultCategory.value.toString());
  $("#lastPlayedEdit").val(form.lastPlayed.value.toString());

  handleEdit(e);
};

// Sets up the hidden form with the parameters to update the game with
const handleSendTime = (options) => {
  $("#gameIdEdit").val(options.gameId);
  $("#lastPlayedEdit").val(options.lastPlayed);
  $("#playTimeEdit").val(options.playTime);
  $("#categoryEdit").val(options.category);


  handleUpdateTime();
};

// Called when sending the user's credentials and new password to the API
const handleChangePassword = (e) => {

  e.preventDefault();

  if( $("#oldPass").val() == '' || $("#newPass").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if($("#oldPass").val() === $("#newPass").val()) {
    handleError("Please enter a different password");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

  return false;
};