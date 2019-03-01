function showMessages(message, user) {
  if (message.createdAt) {
    hours = new Date(message.createdAt).getHours();
    if (hours < 10) {
      hours = '0' + hours;
    }
    mins = new Date(message.createdAt).getMinutes();
    if (mins < 10) {
      mins = '0' + mins;
    }
  }
  hisMessage.insertAdjacentHTML('beforeend', `<div class=${user}>
    <span>${message.author.fullName.first}</span>
    <div class="chat-content">${message.messages}</div>
    <small>${hours}:${mins}</small>
  </div>`);
  hisMessage.scrollTop = hisMessage.scrollHeight;
}

function sendMessage() {
  let message = document.querySelector('#message-to-send').value;
  message = message.trim();
  if (message) {
    socket.emit('sendingMessage', {
      message,
      token
    }, handleEvent);
    document.querySelector('#message-to-send').value = '';
    hisMessage.scrollTop = hisMessage.scrollHeight;
  }
};

async function joinGroupAndLoadMessages(event) {
  const group = event.target;
  groupId = group.dataset.groupId;
  try {
    await socketPromise('joiningGroup', { groupId });
    const data = await socketPromise('loadingMessages', { id: groupId });
    const { messages } = data;

    cleanMessages();
    for (let item of messages) {
      if (item.author._id === data.user) {
        showMessages(item, 'me');
      } else {
        showMessages(item, 'fr');
      }
    }
    nameGroup.innerHTML = group.innerHTML;
  } catch (error) {
    showError(error);
    closeMessage(errorHTML);
  }
};

boxChat.addEventListener('click', joinGroupAndLoadMessages);

btnSend.addEventListener('click', sendMessage);

socket.on('sendingMessage', function (data) {
  if (data.group._id === groupId) {
    if (data.token !== token) {
      showMessages(data, 'fr');
    } else {
      showMessages(data, 'me');
    }
  }
});