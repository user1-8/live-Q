<?php

require 'connection.php';

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>Insert into qbank Db</title>

</head>
<body style="padding:60px;">
	
	<button type="button" class="insert_btn">Insert!</button>
	<div class="show_output" readonly style="width:100%; min-height:400px; border:2px solid; padding:10px; box-sizing:border-box;"></div>






	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    
    <script src="qbank.js"></script>


	<script>
		/*
		var allsubj_qbank = {

			// for Heat & Thermodynamics
			'chapcode1': [
			    {
			        "q": "<b>this is question1 </b>",
			        "correct": 1,
			        "explanation": "<i>this is expl1 </i>",
			        "qid": 0
			    },
			    {
			        "q": "<b>this is question2 </b>",
			        "correct": 1,
			        "explanation": "<i>this is expl2 </i>",
			        "qid": 1
			    },
			],
			'chapcode2': [
			    {
			        "q": "<b>this is question3 </b>",
			        "correct": 1,
			        "explanation": "<i>this is expl3 </i>",
			        "qid": 0
			    },
			    {
			        "q": "<b>this is question4 </b>",
			        "correct": 1,
			        "explanation": "<i>this is expl4 </i>",
			        "qid": 1
			    },
			]
		}
		*/


		// console.log(allsubj_qbank);

		$('.insert_btn').on('click',function(e){
			
			// for(i in allsubj_qbank){
				// for(let j=0; j<allsubj_qbank['keph203&4&5'].length; j++){
					// if(j==5)break;
					$.ajax({
			    		url:'ajax_insertInto_qbankDb.php',
			        	type:'post',
			        	data:{
			        		// 'this_chapCode': 'keph203&4&5',
			        		'this_ques': JSON.stringify(allsubj_qbank),
				        },
				        success:function(d){
				       	  console.log((d));
				       	  $('.show_output').html( $('.show_output').val() +d+"\n" );
				        }
			    	});
		    	// }
	    	// }


		});



	</script>

</body>
</html>