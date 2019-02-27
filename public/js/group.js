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

const boxChat = document.querySelector('.list');
boxChat.addEventListener('click', getGroup);

socket.on('gettingGroup', function (data) {
  for (let item of data) {
    const boxChat = document.querySelector('.list');
    boxChat.insertAdjacentHTML('beforeend', `<li class="clearfix" data-group-id=${item._id}>
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg" alt="avatar" />
    <div class="about">
      <div class="name">${item.name}</div>
      <div class="status">
        <i class="fa fa-circle online"></i> ${item.lastMessage.messages}
      </div>
    </div>
  </li>`);
  };
});
