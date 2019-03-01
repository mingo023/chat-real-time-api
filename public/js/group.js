const token = document.cookie.split('token=Bearer%20')[1];
const socket = io(`http://localhost:3000?token=Bearer ${token}`);

let nameGroup = document.querySelector('.top-content p');
let groupId;

function socketPromise(event, data) {
  return new Promise((res, rej) => {
    socket.emit(event, data, function (error, data) {
      if (error) {
        rej(error);
      }
      res(data);
    });
  });
};

async function loadGroup() {
  try {
    const res = await socketPromise('gettingGroup');
    const { groups } = res;
    document.querySelector('.top-content p').innerHTML = groups[0].name;

    const boxChat = document.querySelector('.list-user');

    for (let item of groups) {//show all group
      if (item.members > 2) {
        boxChat.insertAdjacentHTML('beforeend', `<li data-group-id=${item._id}>
          <i class="fas fa-circle"></i>${item.name}
        </li>`);
      } else {
        const user = item.members.find(mem => mem._id !== res.user._id);//handle when group is private
        console.log(user);
        boxChat.insertAdjacentHTML('beforeend', `<li data-group-id=${item._id}>
          <i class="fas fa-circle"></i>${user.fullName.first}
        </li>`);
      }

    };
    const group = document.querySelector('.list-user li');
    groupId = group.dataset.groupId;
    nameGroup.innerHTML = group.innerHTML;
    await socketPromise('joiningGroup', { groupId });
    const data = await socketPromise('loadingMessages', { id: groupId, token });
    const { messages } = data;
    for (let item of messages) {
      if (item.author._id === data.user) {
        showMessages(item, 'me');
      } else {
        showMessages(item, 'fr');
      }
    }
  } catch (error) {
    showError(error);
    closeMessage(errorHTML);
  }
};


