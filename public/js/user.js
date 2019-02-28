const btnFriends = document.querySelector('.friends');

btnFriends.addEventListener('click', function() {
  socket.emit('gettingFriends', {});
});
socket.on('gettingFriends', function (data) {
  
}); 