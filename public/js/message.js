const now = new Date();
const hours = now.getHours();
const mins = now.getMinutes();
const dateTimeFormat = now.getHours() <= 12 ? 'AM' : 'PM';

function handleEvent(error, data) {
  if (error) {
    console.log(error);
    return alert(error);
  }
  console.log(data);
};

function sendMessage() {
  let message = document.querySelector('#message-to-send').value;
  const chatBox = document.querySelector('.chat-history');
  message = message.trim();
  if (message) {
    socket.emit('sendingMessage', {
      message,
      token
    }, handleEvent);

    document.querySelector('#message-to-send').value = '';
    const hisMessage = document.querySelector('.history-massage');

    hisMessage.insertAdjacentHTML('beforeend', `<li class="clearfix">
    <div class="message-data align-right">
      <span class="message-data-time">${hours}:${mins} ${dateTimeFormat}, Today</span> &nbsp; &nbsp;
      <span class="message-data-name">Olia</span> <i class="fa fa-circle me"></i>

    </div>
    <div class="message other-message float-right">
      ${message}
    </div>
  </li>`);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

const btnSend = document.querySelector('.msg_send_btn');
btnSend.addEventListener('click', sendMessage);

socket.on('loadingMessages', function (data) {
  const hisMessage = document.querySelector('.history-massage');
  const chatBox = document.querySelector('.chat-history');
  for (let item of data) {
    const time = new Date(item.createdAt);
    const dateTimeFormat = time.getHours() <= 12 ? 'AM' : 'PM';
    hisMessage.insertAdjacentHTML('afterbegin', `<li class="clearfix">
    <div class="message-data align-right">
      <span class="message-data-time">${hours}:${mins} ${dateTimeFormat}, Today</span> &nbsp; &nbsp;
      <span class="message-data-name">Olia</span> <i class="fa fa-circle me"></i>

    </div>
    <div class="message other-message float-right">
      ${item.messages}
    </div>
  </li>`);
  }
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('sendingMessage', function (data) {
  const hisMessage = document.querySelector('.history-massage');
  const chatBox = document.querySelector('.chat-history');
  if (data.token !== token) {
    hisMessage.insertAdjacentHTML('beforeend', `<li>
  <div class="message-data">
      <span class="message-data-name"><i class="fa fa-circle online"></i> Vincent</span>
      <span class="message-data-time">${hours}:${mins} ${dateTimeFormat}, Today</span>
    </div>
    <div class="message my-message">
      ${data.message}
    </div>
  </li>`);
  } else {
    hisMessage.insertAdjacentHTML('beforeend', ` <li class="clearfix">
    <div class="message-data align-right">
      <span class="message-data-time">${hours}:${mins} ${dateTimeFormat}, Today</span> &nbsp; &nbsp;
      <span class="message-data-name">Olia</span> <i class="fa fa-circle me"></i>

    </div>
    <div class="message other-message float-right">
      ${data.message}
    </div>
  </li>`);
  }
  chatBox.scrollTop = chatBox.scrollHeight;
});