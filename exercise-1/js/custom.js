const URL = 'https://5dc588200bbd050014fb8ae1.mockapi.io/assessment';

// Fetch data
let fetchData = (URL) => {
  fetch(URL)
  .then((res) => res.json())
  .then(response => {
    let data = response;
    renderData(data);
  })
  .catch(function(error) {
    renderErrorMessage(error);
  });
}

// Render error
let renderErrorMessage = (error) => {
  const ERROR_MSG = `
    <h3>Ups, there was an error loading the data :(</h3>
    <p>Please try again later.</p>
    <div class="error-message">
      <p><em>${error}</em></p>
    </div>
  `;
  document.getElementById('users-list').innerHTML = ERROR_MSG;
}

// Render data
let renderData = (data) => {
  // Check if the retrieved user objects have the required keys
  let expectedUserKeys = ['id','createdAt','name','avatar'];
  if ( expectedUserKeys.every(item => data[0].hasOwnProperty(item)) ) {
    const compiledHTML = compile({data: data});
    document.getElementById('users-list').innerHTML += compiledHTML;
  } else {
    throw new Error('The data received is different from the expected data');
  }
}

// Display default Avatar on img loading error
let setDefaultAvatar = (image) => {
  image.onerror = "";
  image.src = "img/avatar-default.png";
  return true;
}

// Display aditional data by clicking the "view more" button
let viewMore = (userID) => {
  const item = document.getElementById('user-' + userID);
  if (item.classList.contains("js-isExpanded")) {
    item.classList.remove("js-isExpanded");
  } else item.classList.add("js-isExpanded");
}


