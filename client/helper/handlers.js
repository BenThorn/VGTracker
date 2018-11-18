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

const handleSearch = (e) => {
  e.preventDefault();

  if($("#searchTerm").val() === ''){
    handleError("Please fill in a search term.");
    return false;
  }
  sendAjax('GET', $("#searchForm").attr("action"), $("#searchTerm").val(), (data) => {
    console.log(data);
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

const handleRemoveGame = (e) => {
  e.preventDefault();

  const form = e.target;

  console.log(form.className);

  if(form.className === 'gameNodeForm') {
    $("#gameIdRemove").val(form.gameId.value.toString());
  } else if(form.className === 'result') {
    $("#gameIdRemove").val(form.resultGameId.value.toString());
  }

  handleRemove(e, form.className);
};

const handleChangePassword = (e) => {
  console.log('change password');

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