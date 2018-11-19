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

// Sends search info to the API, to be called by the external API
const handleSearch = (e) => {
  e.preventDefault();

  if($("#searchTerm").val() === ''){
    handleError("Please fill in a search term.");
    return false;
  }

  $("#searchResults").text("Searching...");

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

  handleAdd(e);
};

// Called when sending the data from the result or game node to the hidden remove form
const handleRemoveGame = (e) => {
  e.preventDefault();

  const form = e.target;

  if(form.className === 'gameNodeForm') {
    $("#gameIdRemove").val(form.gameId.value.toString());
  } else if(form.className === 'result') {
    $("#gameIdRemove").val(form.resultGameId.value.toString());
  }

  handleRemove(e, form.className);
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