
const btnFriends = document.querySelector('.friends');
const modal = document.querySelector('.modal');
const friends = document.querySelector('.modal ul');
const errorHTML = document.querySelector('.error');

function showError(error) {
  errorHTML.firstElementChild.innerHTML = error;
  errorHTML.style.display = 'block';
}

socket.emit('gettingFriends', {}, function (error, data) { //load all friends when user connected
  if (error) {
    console.log(error);
  } else {
    for (const item of data) {
      friends.insertAdjacentHTML('beforeend', ` <li data-user-id=${item._id}>${item.fullName.first}</li>`);
    }
  }
});

btnFriends.addEventListener('click', function () {
  modal.style.display = 'block';
});

function closeMessage(ele) {
  document.querySelector('.middle-content').addEventListener('click', function () {
    ele.style.display = 'none';
  });
};

closeMessage(modal);

friends.addEventListener('click', function (event) {
  const { userId } = event.target.dataset;
  socket.emit('creatingGroup', userId, function (error, data) {
    if (error) {

      modal.style.display = 'none';
      showError(error);
      closeMessage(errorHTML);

    } else {

      groupId = data._id;
      const boxChat = document.querySelector('.list-user');
      boxChat.insertAdjacentHTML('afterbegin', `<li data-group-id=${groupId}>
        <i class="fas fa-circle"></i>${data.name}
      </li>`);
      cleanMessages();
      socket.emit('joiningGroup', {});
      
    };
  });
});