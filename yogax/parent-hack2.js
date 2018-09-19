window.document.querySelector('#get-parent-content').onclick = function() {
  window.document.querySelector('#hoge').innerText = window.parent.document.querySelector('#content').innerText;
};
