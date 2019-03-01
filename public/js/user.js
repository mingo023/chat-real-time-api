
const btnFriends = document.querySelector('.friends');
const modal = document.querySelector('.modal');
const friends = document.querySelector('.modal ul');


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

document.querySelector('.middle-content').addEventListener('click', function () {
  modal.style.display = 'none';
});

friends.addEventListener('click', function (event) {
  const { userId } = event.target.dataset;
  socket.emit('creatingGroup', userId, function (error, data) {
    if (error) {
      console.log(error);
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