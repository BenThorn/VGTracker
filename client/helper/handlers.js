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

const handleRemove = (e) => {
  e.preventDefault();

  sendAjax('DELETE', $("#removeForm").attr("action"), $("#removeForm").serialize(), function() {
    loadSearchResults($(".resultList").data('results'));
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

  $("#gameIdRemove").val(form.resultGameId.value.toString());

  handleRemove(e);
};
