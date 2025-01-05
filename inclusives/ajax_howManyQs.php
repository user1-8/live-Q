<?php

require 'connection.php';
extract($_POST);

$chaps_arr = json_decode($chaps_arr, true);
// print_r($chaps_arr);

$newChapsArr = [];

foreach($chaps_arr as $chap){

	$q70 = mysqli_query($conn, "SELECT qid FROM allsubj_qbank WHERE chap='{$chap}' ");

	$newChapsArr[$chap] = mysqli_num_rows($q70);

}
// echo "start \n";
// print_r($newChapsArr);
// echo "end \n";

echo json_encode($newChapsArr);

