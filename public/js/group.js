const token = document.cookie.split('token=Bearer%20')[1];
const socket = io(`http://localhost:3000?token=Bearer ${token}`);

function handleEvent(error, data) {
  if (error) {
    console.log(error);
    return alert(error);
  }
  console.log(data);
};

function loadGroup() {
  socket.emit('gettingGroup', {});
};

function getGroup(event) {
  const { groupId } = event.target.dataset;
  console.log(groupId);
  socket.emit('joiningGroup', {
    groupId
  }, handleEvent);
  socket.emit('loadingMessages', {
    id: groupId,
    token
  });
  while (hisMessage.firstChild) {
    hisMessage.removeChild(hisMessage.firstChild);
  };
};

const boxChat = document.querySelector('.list-user');
boxChat.addEventListener('click', getGroup);

function returnSocketPromise(id) {
  return new Promise((res, rej) => {
    socket.emit('joiningGroup', {
      groupId: id
    });
    res();
  });
};



socket.on('gettingGroup', function (data) {
  for (let item of data) {
    const boxChat = document.querySelector('.list-user');
    boxChat.insertAdjacentHTML('beforeend', `<li data-group-id=${item._id}>
      <i class="fas fa-circle"></i>${item.name}
    </li>`);
  };
  const firstGroup = document.querySelector('.list-user li').dataset.groupId;

  socket.emit('loadingMessages', {
    id: firstGroup,
    token
  });

  returnSocketPromise(firstGroup)
    .then(function () {
      socket.emit('loadingMessages', {
        id: firstGroup,
        token
      });
    });
});
