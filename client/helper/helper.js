// A simple browser alert when an error occurs
const handleError = (message) => {
  $("#error").text(message);
};

// Redirects the window to the designated url
const redirect = (response) => {
  window.location = response.redirect;
};

// Taken from https://hype.codes/how-get-current-date-javascript
const getDate = () => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1;
  const yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  } 

  if(mm<10) {
      mm = '0'+mm
  } 

  let date = yyyy + '-' + mm + '-' + dd;
  return date;
};

// Sends ajax request
const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};