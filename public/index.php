<?php
	$url = strtok("$_SERVER[REQUEST_SCHEME]://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]", "\?|#");

	// page basic settings
	$page_title 		= "File Converter";
	$page_description 	= "Convert between video and image formats.";
	$page_author		= "Morgan";
	$page_keywords		= "Heledron, Hadron, Cymaera, File, Converter, MP4, MOV";

	// page open graph settings
	$page_og_title = $page_title;
	$page_og_description = $page_description;
	$page_og_url = $url;
	$page_og_image = $url . "thumbnail.webp";
	$page_og_type = "website";

	header('Cross-Origin-Embedder-Policy: require-corp');
	header('Cross-Origin-Opener-Policy: same-origin');
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<!-- title & favicon -->
	<title><?php echo $page_title;?></title>
	<link rel="icon" href="/favicon.png" type="image/png"/>
	<link rel="canonical" href="<?php echo $page_og_url;?>"/>

	<!-- pwa -->
	<link rel="manifest" href="./manifest.json">
	<meta name="theme-color" content="#fff">
	<link rel="apple-touch-icon" href="./icon-bg-512.png">
	<meta name="apple-mobile-web-app-status-bar-style" content="default">
	<meta name="apple-mobile-web-app-capable" content="yes" />
	
	<!-- info -->
	<meta name="author" content="<?php echo $page_author;?>"/>
	<meta name="description" content="<?php echo $page_description;?>"/>
	<meta name="keywords" content="<?php echo $page_keywords;?>"/>
	
	<!-- sharing -->
	<meta property="og:title" content="<?php echo $page_og_title;?>"/>
	<meta property="og:description" content="<?php echo $page_og_description;?>"/>
	<meta property="og:url"   content="<?php echo $page_og_url;?>"/>
	<meta property="og:image" content="<?php echo $page_og_image;?>"/>
	<meta property="og:type"  content="<?php echo $page_og_type;?>"/>

	<!-- styles -->
	<link rel="stylesheet" href="./dst/main.css" />

	<!-- scripts -->
	<script src="./dst/main.js" type="module"></script>
</head>
<body>
</body>
</html>