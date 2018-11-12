<?php
$uploaddir = 'storage/';
$uploadfile = $uploaddir . basename($_FILES['document']['name']);

if (move_uploaded_file($_FILES['document']['name'], $uploadfile)) {
    echo '{"success": true, "file": "'. $uploadfile .'" }';
} else {
    echo '{"success": false}';
}