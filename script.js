$(document).ready(function(){

	$('.new_game').hide();
	$('.old_game').hide();

	$('select.chooseAction').change(function(){
		if($(this).val() == 'new'){
			$('.new_game').show();
			$('.old_game').hide();
		}else if($(this).val() == 'old'){
			$('.new_game').hide();
			$('.old_game').show();
		}
	});



	let select_chap_original_html = $('.new_game select.chap_select').html();

	$('.new_game select.subj_select').change(function(){
		let chap_kardena = "";
		let chaps_of_dis_subj = chap_list[$(this).val().trim()];
		console.log(chaps_of_dis_subj);

		$('.new_game select.chap_select').html(select_chap_original_html);

		for(let i=0; i<chaps_of_dis_subj.length; i++){
			$('.new_game select.chap_select').append(`<option value="${chaps_of_dis_subj[i]}">${chap_codes[chaps_of_dis_subj[i]]}</option>`);
			
		}

		if($(this).val()=='physics' || $(this).val()=='chemistry'){
			$('.new_game .exam_select').slideDown();
		}else{
			$('.new_game .exam_select').slideUp();
		}
		/*
			if($(this).val().trim()=="physics"){
				// chap_kardena = `<option value="phychap">phychap</option>`;
			}else if($(this).val().trim()=="chemistry"){
				chap_kardena = `<option value="lech203">Aldehydes, Ketones & Carboxylic Acids</option>`;
			}else if($(this).val().trim()=="biology"){
				// chap_kardena = `<option value="phychap">biuo  chap</option>`;
			}else if($(this).val().trim()=="math"){
				// chap_kardena = `<option value="phychap">math  chap</option>`;
			}

			$('.new_game select.chap_select').html(select_chap_original_html + chap_kardena);
		*/
	});


	$('.new_game select.chap_select').change(function(){

		function chap_has_noQ(){
			alert("Sorry, we currently don't have Questions related to this Chapter. ");
			$('.new_game input[name="numOfQ"]').attr('disabled','');
		}

		if($(this).val() in allsubj_qbank){
			if( allsubj_qbank[$(this).val()].length >0 ){
				$('.new_game input[name="numOfQ"]').attr('max', allsubj_qbank[$(this).val()].length);
				$('.new_game input[name="numOfQ"]').removeAttr('disabled');
			}else chap_has_noQ();
		}else chap_has_noQ();

	});




	$('.new_game').on('submit',function(e){

		// debugger;

		// console.log('returned is: '+randomExclude(200000, 200004, 1));

		// let randQidArr = randomExclude(151, 154, 4);
		let randQidArr = randomExclude(0, allsubj_qbank[$('.new_game select.chap_select').val()].length-1, parseInt($('.new_game input[name="numOfQ"]').val(), 10));
		console.log(randQidArr);

		const urlParams = new URLSearchParams(window.location.search);

		if(urlParams.get('ques_ids') == undefined || urlParams.get('ques_ids') == null){
			e.preventDefault();

			$('.new_game button[type="submit"] ').css('pointer-events','none');
			setTimeout(function(){
				$('.new_game button[type="submit"] ').css('pointer-events','auto');

			},3000);



			let newurl = new URL(window.location.href); 
			newurl.searchParams.set('ques_ids', randQidArr.toString());
			// window.location.href = newurl.href;
			window.history.replaceState(null, null, newurl);

			console.log($(this));
			setTimeout(function(){
				$('.new_game button[type="submit"] ').click();
			},500);
			
		}



	});



	let prevG_tbody_trs = $('.joinedGcontainer table tbody tr');
	let yrsp = $('.joinedGcontainer table thead tr th');
	let dsjj;

	for(let i=0; i<yrsp.length; i++){
		if($(yrsp[i]).text().trim().toLowerCase() == "chapter" ){
			dsjj=i;
		}
	}

	for(let i=0; i<prevG_tbody_trs.length; i++){

		let pqkk = $(prevG_tbody_trs[i]).children('td')[dsjj];

		$(pqkk).text(chap_codes[$(pqkk).text().trim()]);

	}

});