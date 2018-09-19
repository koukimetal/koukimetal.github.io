window.document.querySelector('#hoge').innerText = window.parent.document.querySelector('#content').innerText;

var count = 1;
setInterval(function() {window.document.querySelector('#piyo').innerText = count; count++;}, 1000);
