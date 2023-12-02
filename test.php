<?php
$userAgent = 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/116.0';
$url = '6w3sze98rsyn99nvukjzabuwxn3erauyj.oastify.com';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$content = curl_exec($ch);
curl_close($ch);

echo $content;
?>
