const axios = require('axios');
document.addEventListener('DOMContentLoaded', function() {
  const btnLogin = document.querySelector('#login');
  const postLogin = () => {
    const email = document.querySelector('#exampleInputEmail1').value;
    const password = document.querySelector('#exampleInputPassword1').value;
    // axios.post('/login', {
    //   email,
    //   password
    // })
    // .then(function(res) {
    //   console.log(res);
    // })
    alert(email);
  };  
  btnLogin.addEventListener('click', postLogin);
});