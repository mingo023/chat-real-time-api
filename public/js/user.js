
const btnFriends = document.querySelector('.friends');
const modal = document.querySelector('.modal');
const friends = document.querySelector('.modal ul');

function handleEvent(error, data) {
  if (error) {
    console.log(error);
    return alert(error);
  }
  console.log(data);
};


socket.emit('gettingFriends', {}, handleEvent);
socket.on('gettingFriends', function (data) {
  for (const item of data) {
    friends.insertAdjacentHTML('beforeend', ` <li data-user-id=${item._id}>${item.fullName.first}</li>`);
  }
});

btnFriends.addEventListener('click', function () {
  modal.style.display = 'block';
});

document.querySelector('.middle-content').addEventListener('click', function () {
  modal.style.display = 'none';
});

function createAndLoadGroup(data) {
  socket.emit('creatingGroup', data, function (error, data) {
    if (error) {
      console.log(error);
    } else {
      socket.emit('loadingMessages', {
        id: data._id,
        token
      });
    }
  });
};

friends.addEventListener('click', function (event) {
  const { userId } = event.target.dataset;
  const name = event.target.innerHTML;
  createAndLoadGroup({ userId, name });
});