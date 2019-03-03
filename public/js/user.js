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

closeMessage(modal);

friends.addEventListener('click', async function (event) {
  const { userId } = event.target.dataset;
  try {
    await socketPromise('creatingGroup', userId);
    const boxChat = document.querySelector('.list-user');
    boxChat.innerHTML = '';
    cleanMessages();
    loadGroup();
  } catch (error) {
    showError(error);
  }
});