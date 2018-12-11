<?php
$u = $_GET['u'];
echo <<<EOT
<!doctype html>
<html>
        <head>
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-124574215-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-124574215-1');
</script><script type="text/javascript" src="//platform-api.sharethis.com/js/sharethis.js#property=5be44e9afca3ce00111502f6&product=sticky-share-buttons"></script>
                <title>Chalchitra player</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdn.plyr.io/3.4.7/plyr.css">
        </head>
        <body style="text-align:center">
        <h1>Chalchitra online player</h1>
        <p>It may take a few seconds for buffering depending on your internet speed. Be patient!</p>
EOT;

if (preg_match("/(http(s)?:\/\/)?(www.)?y2mate.com\/youtube/", $u)){
$nU = "https://www.youtube.com/embed/".preg_replace("/(http(s)?:\/\/)?(www.)?y2mate.com\/youtube\//", '', $u);
echo <<<EOT
<div class="plyr__video-embed" id="player">
    <iframe src="{$nU}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1" allowfullscreen allowtransparency allow="autoplay"></iframe>
    </div>
EOT;
}
else {
    if(preg_match("/^.+(\.mkv)$/",$u)){
    echo <<<EOT
    <video id="player" playsinline controls>
    <source src="{$u}" type="video/webm">
    <!-- <track kind="captions" label="English captions" src="/path/to/captions.vtt" srclang="en" default> -->
    </video>
EOT;
    }
    else {
    echo <<<EOT
    <video id="player" playsinline controls>
    <source src="{$u}" type="video/mp4">
    <!-- <track kind="captions" label="English captions" src="/path/to/captions.vtt" srclang="en" default> -->
    </video>
EOT;
    }
}

echo <<<EOT
<script src="https://cdn.plyr.io/3.4.7/plyr.polyfilled.js"></script>
<script>const player = new Plyr('#player');</script>
</body>
</html>
EOT;
?>