<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="sources/css/main.css">
    <link rel="stylesheet" href="sources/css/bootstrap.rtl.min.css">
</head>
<body dir="rtl">

<div class='radio_container'>
    <input name='test' type='radio' class='radio' value='1'>
    <label class='radio_content'>Test</label>
</div>
<div class='radio_container'>
    <input name='test' type='radio' class='radio' value='2'>
    <label class='radio_content'>Test2</label>
</div>

<div class='chips_container'>
    <input type='checkbox' class='chips' value='1'>
    <label class='chips_content'>
        <img class='checked' src='sources/images/checked_checkbox.svg'
             alt='check'>
        <img class='unchecked' src='sources/images/unchecked_checkbox.svg'
             alt='uncheck'>
        <span>Test 3</span>
    </label>
</div>

<div class='chips_container'>
    <input type='checkbox' class='chips' value='2'>
    <label class='chips_content'>
        <img class='checked' src='sources/images/checked_checkbox.svg'
             alt='check'>
        <img class='unchecked' src='sources/images/unchecked_checkbox.svg'
             alt='uncheck'>
        <span>Test 4</span>
    </label>
</div>

<div id='loadingDiv'>
    <div>
        <img src='sources/images/loading.gif' alt='loading'>
        <p>لطفا کمی صبر کنید ...</p>
    </div>
</div>
</body>
<script src="sources/js/bootstrap.min.js"></script>
<script src="sources/js/jquery.min.js"></script>
<script src="sources/js/sweetalert2.all.min.js"></script>
<script src="sources/js/main.js"></script>
</html>