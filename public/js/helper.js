const token = document.cookie.split('token=Bearer%20')[1];
const socket = io(`https://chat-realtime-socketio.herokuapp.com/?token=Bearer ${token}`);

const btnFriends = document.querySelector('.friends');
const modal = document.querySelector('.modal');
const friends = document.querySelector('.modal ul');
const errorHTML = document.querySelector('.error');
const boxChat = document.querySelector('.list-user');
const group = document.querySelector('.list-user li');
const hisMessage = document.querySelector('.middle-content');
const btnSend = document.querySelector('.msg_send_btn');

const now = new Date();
let hours = now.getHours();
let mins = now.getMinutes();
let dateTimeFormat = now.getHours() <= 12 ? 'AM' : 'PM';

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

function showError(error) {
  errorHTML.firstElementChild.innerHTML = error;
  errorHTML.style.display = 'block';
};

function closeMessage(ele) {
  document.querySelector('.middle-content').addEventListener('click', function () {
    ele.style.display = 'none';
  });
};

function cleanMessages() {
  while (hisMessage.firstChild) {
    hisMessage.removeChild(hisMessage.firstChild);
  };
};

function handleEvent(error, data) {
  if (error) {
    console.log(error);
    return alert(error);
  }
  console.log(data);
};

function runScript(event) {//tricker enter event 
  if (event.which == 13 || event.keyCode == 13) {
    sendMessage()
  }
};