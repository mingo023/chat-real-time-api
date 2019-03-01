async function loadGroup() {
  try {
    const res = await socketPromise('gettingGroup');
    const { groups } = res;
    document.querySelector('.top-content p').innerHTML = groups[0].name;

    for (let item of groups) {//show all group
      if (item.members > 2) {
        boxChat.insertAdjacentHTML('beforeend', `<li data-group-id=${item._id}>
          <i class="fas fa-circle"></i>${item.name}
        </li>`);
      } else {
        const user = item.members.find(mem => mem._id !== res.user._id);//handle when group is private
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


