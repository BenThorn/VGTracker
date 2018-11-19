// A simple browser alert when an error occurs
const handleError = (message) => {
  alert(message);
};

// Redirects the window to the designated url
const redirect = (response) => {
  window.location = response.redirect;
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