<?php

require 'connection.php';
extract($_POST);
$qbankto_phpArr = json_decode($this_ques, true);


foreach ($qbankto_phpArr as $this_chapCode=>$chap) {
// echo ($this_chapCode);
// print_r($chap);

	foreach($chap as $ques){
		// if ($ques['qid']>3) break;

		$ques['q'] = addslashes($ques['q']);
		$ques['explanation'] = addslashes($ques['explanation']);

		$q632 = mysqli_query($conn, "INSERT INTO allsubj_qbank (chap, qid, q, correct, explanation) VALUES ('{$this_chapCode}', {$ques['qid']}, '{$ques['q']}', {$ques['correct']}, '{$ques['explanation']}' )");

		if($q632){
			echo "'".$this_chapCode."' ".$ques['qid']." done ";
		}else{
			echo "Something went wrong... Err: ".mysqli_error($conn);
		}
		echo "<br>";

	}
}
