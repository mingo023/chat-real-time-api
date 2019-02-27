const token = document.cookie.split('token=Bearer%20')[1];
const socket = io(`http://localhost:3000?token=Bearer ${token}`);

function handleEvent(error, data) {
  if (error) {
    console.log(error);
    return alert(error);
  }
  console.log(data);
};

function createGroup(data) {
  socket.emit('creatingGroup', {
    authorId: 'A',
    name: 'Chem gio',
    members: ['5c497dae7d09bd058859265f'],
    type: 'private'
  }, handleEvent);
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
};

const boxChat = document.querySelector('.list-user');
boxChat.addEventListener('click', getGroup);

socket.on('gettingGroup', function (data) {
  for (let item of data) {
    const boxChat = document.querySelector('.list-user');
    boxChat.insertAdjacentHTML('beforeend', `<li data-group-id=${item._id}>
      <i class="fas fa-circle"></i>${item.name}
    </li>`);
  };
});
