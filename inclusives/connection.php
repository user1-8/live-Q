<?php

$host = "localhost";
$username = "root";
$password = '';
$dbname = "liveqdb";

$conn = mysqli_connect($host, $username, $password, $dbname);

if($conn){
  // echo '<script>alert("connected");</script>';
}else{
  echo '<script>alert("not connected");</script>';
}