//for inter-conversion of millisec & hr,min,sec obj
function ms_to_hms(ms, returnWithExtraZeros=false){ 

	let timediffObj = {h:0, m:0, s:0};

	let timeSec_diff = Math.round((ms) / 1000);


	let sec_iknw = timeSec_diff%60;
	let min_iknw = Math.floor((timeSec_diff/60)%60);
	let hr_iknw = Math.floor(timeSec_diff/3600);

	timediffObj = {h:hr_iknw, m:min_iknw, s:sec_iknw};

	// console.log(timediffObj);
	if(returnWithExtraZeros){
		if(timediffObj['h']<10) timediffObj['h_str']="0"+timediffObj['h'];
		else timediffObj['h_str']=timediffObj['h'];
		if(timediffObj['m']<10) timediffObj['m_str']="0"+timediffObj['m'];
		else timediffObj['m_str']=timediffObj['m'];
		if(timediffObj['s']<10) timediffObj['s_str']="0"+timediffObj['s'];
		else timediffObj['s_str']=timediffObj['s'];
	}
	return timediffObj;

}

function hms_to_ms(hms_obj={h:0, m:0, s:0}){

	let output_ms = (hms_obj['h']*3600 + hms_obj['m']*60 + hms_obj['s'] )*1000;
	// console.log(output_ms);
	return output_ms;

}

function ms_comparable_hKya(ms1, ms2){
	// console.log('Math.abs(ms1-ms2) = '+Math.abs(ms1-ms2));
	if(Math.abs(ms1-ms2) < 5000){
		return true;
	}else{
		return false;
	}
}


// to calc time on each given q array times... ITS NOT A GENRAL USE FUNCTION. Its specific.
function calc_t_on_zswfg(q_arr, just_return_timespent=false){
	// debugger;
	let time_spent=0; //milisec from 1970
	for(let i=0; i<q_arr.length; i++){

		if( q_arr[i]['end'] !=undefined ){
			// console.log(q_arr[i]['end']);
			time_spent+= q_arr[i]['end'] - q_arr[i]['start'];
		}else{
			time_spent+= (new Date().getTime()) - q_arr[i]['start'];
		}

	}
	if(just_return_timespent){
		return time_spent;
	}else{
		return (new Date().getTime())-time_spent;
	}
}




$(document).ready(function(){

	let original_chapCode = $('.game_info .chap span').text().trim();

	$('.game_info .chap span').text(chap_codes[original_chapCode]);

	let thisGid = $('.game_info .gid span').text().trim();



	function destroyAllMyTemp_localStor(){
		let nytp = [
			'tAtStart_'+thisGid, 
			'qtimer_startTime_'+thisGid, 
			'curr_showedQ_'+thisGid, 
			'qAttemptedOptn_temp_'+thisGid,
		];

		for(let i=0; i<nytp.length; i++){
			if( localStorage.getItem(nytp[i])!=undefined ){
				localStorage.removeItem(nytp[i]);
			}
		}
	}




	let tva = [];   //timer_vars_arr

	function make_stopwatch(in_elem, started_time=0, time_obj={'h':0, 'm':0, 's':0}){
// debugger;
		console.log(started_time);
		if($(in_elem).children('.timer_inner').length >0){
			$(in_elem).children('.timer_inner').prop('outerHTML','');
		}

		let l=tva.length;
		tva[l]={};

		tva[l]['in_elem'] = in_elem;

		tva[l]['h']=time_obj['h'];
		tva[l]['m']=time_obj['m'];
		tva[l]['s']=time_obj['s'];

		$(in_elem).append(`<div class="timer_inner d-inline-block">
				<span class="hr">${ (tva[l]['h']<10) ? '0':''}${tva[l]['h']}</span>:<span class="min">${ (tva[l]['m']<10) ? '0':''}${tva[l]['m']}</span>:<span class="sec">${ (tva[l]['s']<10) ? '0':''}${tva[l]['s']}</span>
			</div>`);

		let pwm = function(){

			if(tva[l]['s']%4 ==0 && started_time!=0){
				let etw = hms_to_ms({h:tva[l]['h'], m:tva[l]['m'], s:tva[l]['s']});
				let nmx = new Date().getTime() - started_time;

				if( ms_comparable_hKya(etw, nmx) ){
					tva[l]['s']++;
				}else{
					let wek = ms_to_hms(nmx);
					tva[l]['h'] = wek['h'];
					tva[l]['m'] = wek['m'];
					tva[l]['s'] = wek['s'];
				}
			}else{
				tva[l]['s']++;
			}



			if(tva[l]['s']>59){
				tva[l]['s']=0; tva[l]['m']++;
			}
			if(tva[l]['m']>59){
				tva[l]['m']=0; tva[l]['h']++;
			}

			if(tva[l]['h']<10) tva[l]['h_str']="0"+tva[l]['h'];
			else tva[l]['h_str']=tva[l]['h'];
			if(tva[l]['m']<10) tva[l]['m_str']="0"+tva[l]['m'];
			else tva[l]['m_str']=tva[l]['m'];
			if(tva[l]['s']<10) tva[l]['s_str']="0"+tva[l]['s'];
			else tva[l]['s_str']=tva[l]['s'];

			$(in_elem).children('.timer_inner').children('.hr').text(tva[l]['h_str']);
			$(in_elem).children('.timer_inner').children('.min').text(tva[l]['m_str']);
			$(in_elem).children('.timer_inner').children('.sec').text(tva[l]['s_str']);
		};

		pwm();

		tva[l]['fc'] = setInterval(pwm, 1000);
		return l;
	}



	function resume_stopwatch(in_elem, its_l, started_time=0){
// debugger;
		let rtq = function(){
			
			if(tva[its_l]['s']%4 ==0 && started_time!=0){
				let etw = hms_to_ms({h:tva[its_l]['h'], m:tva[its_l]['m'], s:tva[its_l]['s']});
				let nmx = new Date().getTime() - started_time;

				if( ms_comparable_hKya(etw, nmx) ){
					tva[its_l]['s']++;
				}else{
					let wek = ms_to_hms(nmx);
					tva[its_l]['h'] = wek['h'];
					tva[its_l]['m'] = wek['m'];
					tva[its_l]['s'] = wek['s'];
				}
			}else{
				tva[its_l]['s']++;
			}


			if(tva[its_l]['s']>59){
				tva[its_l]['s']=0; tva[its_l]['m']++;
			}
			if(tva[its_l]['m']>59){
				tva[its_l]['m']=0; tva[its_l]['h']++;
			}

			if(tva[its_l]['h']<10) tva[its_l]['h_str']="0"+tva[its_l]['h'];
			else tva[its_l]['h_str']=tva[its_l]['h'];
			if(tva[its_l]['m']<10) tva[its_l]['m_str']="0"+tva[its_l]['m'];
			else tva[its_l]['m_str']=tva[its_l]['m'];
			if(tva[its_l]['s']<10) tva[its_l]['s_str']="0"+tva[its_l]['s'];
			else tva[its_l]['s_str']=tva[its_l]['s'];

			$(in_elem).children('.timer_inner').children('.hr').text(tva[its_l]['h_str']);
			$(in_elem).children('.timer_inner').children('.min').text(tva[its_l]['m_str']);
			$(in_elem).children('.timer_inner').children('.sec').text(tva[its_l]['s_str']);
		};

		rtq();

		tva[its_l]['fc'] = setInterval(rtq, 1000);
	}


	function pause_stopwatch(its_l){
		clearInterval(tva[its_l]['fc']);
	}


	

	

	// setTimeout(function(){
	// 	pause_stopwatch(afs)
	// },3000);

	// setTimeout(function(){
	// 	resume_stopwatch('.qSection .timers .gTimer b', afs);
	// },6000);






	let ques_idsArr = $('.game_info .ques_ids').text().trim().split(',');

	for(let i=0; i<ques_idsArr.length; i++){
		ques_idsArr[i] = parseInt(ques_idsArr[i], 10);
	}

	console.log('ques_idsArr = ');
	console.log(ques_idsArr);

	let playersChosenOptn_arr = [];
	if($('.qSection .chosen_optns_show .chosen_inner').length>0){
		for(let i=0; i<$('.qSection .chosen_optns_show .chosen_inner').length; i++){

			playersChosenOptn_arr.push( [
				$($('.qSection .chosen_optns_show .chosen_inner')[i]).children('i').text().trim(), 
				$($('.qSection .chosen_optns_show .chosen_inner')[i]).children('b').text().trim().split(',')
			] );

		}

	}
	console.log(playersChosenOptn_arr);


	let afd=1;

	for(let i=0; i<allsubj_qbank[original_chapCode].length; i++){

		if(ques_idsArr != 'infiniteloop'){
			if( ques_idsArr.includes( allsubj_qbank[original_chapCode][i]['qid'] ) ){
				$('.qSection .qcompContainer').append(allsubj_qbank[original_chapCode][i]['q'] );

				let allQcompo = $('.qcompContainer .question-component');
				let lastWalaQcompo = allQcompo[allQcompo.length - 1];

				//ques no. change karrhe
				$(lastWalaQcompo).find('div.flex.flex-col.gap-2.max-md\\:card.max-md\\:pt-3 > div.flex.items-center.justify-between.gap-3.px-4.pb-2.border-b-gray-100.dark\\:border-opacity-20 > div.flex.items-center.gap-3 > div.flex.items-center.justify-center.text-white.dark\\:text-blue-400.bg-blue-600.dark\\:bg-opacity-10.text-sm.shrink-0').text(afd);
				afd++;


				//extra options hata rhe
				$(lastWalaQcompo).children('div:first-child').children('div:first-child').children('div:nth-child(2)').css('display','none');

				$(lastWalaQcompo).find('div.flex.flex-col.gap-2.max-md\\:card.max-md\\:pt-3 > div.flex.items-center.justify-between.gap-3.px-4.pb-2.border-b-gray-100.dark\\:border-opacity-20 > div.flex.items-center.gap-3 > div.flex.flex-col.gap-1\\.5 > div.flex.items-center.gap-1\\.5.text-xs > div.px-1\\.5.py-0\\.5.bg-opacity-10.rounded-sm.text-blue-700.bg-blue-600.dark\\:text-blue-400.text-ellipsis.overflow-hidden').removeClass('whitespace-nowrap');


				//konsa correct hoga, class daal rhe
				$($(lastWalaQcompo).children('.options').children('div[role="button"]')[allsubj_qbank[original_chapCode][i]['correct']]).addClass('willbecorrect');

				//kon player kon optn selected wo daal rhe
				if(playersChosenOptn_arr.length>0 && playersChosenOptn_arr.length<=3){
					for(let i=0; i<playersChosenOptn_arr.length; i++){
						let jgk = playersChosenOptn_arr[i][1][allQcompo.length - 1];
						console.log('jgk: '+jgk);

						let mwhbtp = 'unattempted';

						if(jgk.trim()!=""){

							let tlev = $($(lastWalaQcompo).children('.options').children('div[role="button"]')[parseInt(jgk.trim(), 10)]);

							if($(tlev).hasClass('willbecorrect')){
								mwhbtp = 'correct';
							}else{
								mwhbtp = 'wrong';
							}

							let top_fjsd = ((tlev.children('.myclass_ewcoj').length)*22 + 2.2)/16;
							tlev.append(
								`<span class="position-absolute myclass_ewcoj badge bg-dark ms-2" style="top:${top_fjsd}rem; right:7px; transform:scale(0.94); opacity:.8;">${playersChosenOptn_arr[i][0]}</span>` );
						}
						$(lastWalaQcompo).addClass(`mX2C36n7_${playersChosenOptn_arr[i][0]}_${mwhbtp}H_tqBQ0KPE`);
					}
				}

				//getting abhi wala player konsa options choose kiya 
				if($('.result_overview').length <1){
					let bte = localStorage.getItem('qAttemptedOptn_temp_'+thisGid);
					if(bte!=undefined){
						bte=JSON.parse(bte);
						if(bte.length>0 && bte[allQcompo.length]!=null){
							$($(lastWalaQcompo).children('.options').children('div[role="button"]')[bte[allQcompo.length]]).addClass('bg-blue-600 border-2 !border-blue-500');
						}
					}
				}


				//ansr show btn ko disappear karrhe
				if( $('.game_info .gStatus span').text().trim().toLowerCase() != 'ended' ){
					$(lastWalaQcompo).find('button[aria-label="Check Answer Button"]').css('display','none');
				}else{

				}

				//adding explanation and making it disappear
				$(lastWalaQcompo).append(allsubj_qbank[original_chapCode][i]['explanation']);
				$(lastWalaQcompo).children("div:last-child").css('display','none');
			}
		}

	}


	if($('.result_overview').length>0){
		let nctk = [];
		let ysert = $('.result_overview table thead tr th');
		let ntwp_tbody_tr = $('.result_overview table tbody tr');

		for(let i=0; i<ysert.length; i++){
			let ftfrp = $(ysert[i]).text().trim().toLowerCase();

			if(ftfrp=="c"){
				nctk[0] = i;
			}else if(ftfrp=="w"){
				nctk[1] = i;
			}else if (ftfrp=="u"){
				nctk[2] = i;
			}
		}

		for(let i=0; i<ntwp_tbody_tr.length; i++){
			for(let j=0; j<nctk.length; j++){

				let kprk = $(ntwp_tbody_tr[i]).children('td')[nctk[j]];
				let fnep_pInt = parseInt($(kprk).text().trim(), 10);
				let plyrname_cntpw = $($(ntwp_tbody_tr[i]).children('td')[0]).text().trim();

				if( fnep_pInt!=0 && !isNaN(fnep_pInt) ){
					$(kprk).addClass('clickable');

					let cwu;

					if(j==0) cwu = 'correct';
					if(j==1) cwu = 'wrong';
					if(j==2) cwu = 'unattempted';

					$(kprk).attr('data-plyr_cwu', `mX2C36n7_${plyrname_cntpw}_${cwu}H_tqBQ0KPE_showbtn`);
				}

			}
		}

	}


	




	let isGstarted='';
	function checkGstarted(mycallback=function(){}){
		$.ajax({
    		url:'inclusives/checkGstarted.php',
        	type:'post',
        	data:{
        		'gID': thisGid,
	        },
	        success:function(d){
	       	  // console.log(d);
	       	  isGstarted = d;
	       	  mycallback();
	        }
    	});
	}

	function setInterval_inclusive(func=function(){}, time, condition_for_clearIntvl){
		func();
		let olp = setInterval(function(){
			if(condition_for_clearIntvl){
				clearInterval(olp);
			}else{
				func();
			}
		}, time);
	}

	function setInterval_inclusive_fdsnfvsdj(func=function(){}, time){
		func();
		let olp = setInterval(function(){
			if(isGstarted=="yes"){
				clearInterval(olp);
			}else{
				func();
			}
		}, time);
	}
	


	let iok = $('.game_info .players ul').children('li:first-child').children('.badge').text();

	if(iok.search(/you/i) >-1 && iok.search(/creator/i) >-1){

		if($('.main .gameStartKarein').length<1 && $('.result_overview').length<1){
			$('.qSection').removeClass('d-none');
		}

	}else{
		if($('.wait_GnotStarted').length >0){

			

			setInterval_inclusive_fdsnfvsdj(function(){
				checkGstarted(function(){
					setTimeout(function(){
						// console.log(isGstarted);

						if(isGstarted.trim()=="yes"){
							// $('.qSection').removeClass('d-none');
							window.location.reload();
						}
					},0);
				});
			}, 7000);

		}
		
		

		// let olp = setInterval(function(){
		// 	if(isGstarted=="yes"){
		// 		clearInterval(olp);
		// 		console.log('cleared interval');
		// 	}else{
		// 		checkGstarted(function(){
		// 			setTimeout(function(){
		// 				console.log(isGstarted);
		// 			},0);
		// 		});
		// 	}

		// }, 1000);


	}




	let intrvl_34jh2 = setInterval(function(){

		if( $('.wait_GnotStarted').length>0 || $('.gameStartKarein').length>0 ){

			$('.game_info .players ul').load('inclusives/joinedUsers.php',{
				createdby: $('.game_info .gCreatedby').text().trim(),
				// uname:myuname
			},function(){
				console.log('loaded');
			});

		}else{
			clearInterval(intrvl_34jh2);
		}

	},5000);


	if( $('.game_info .gStatus span').text().trim().toLowerCase() != 'not started' ){
		$('.game_info .players .loading_players_anim').addClass('d-none');
	}





	let curr_showedQ = 1;
	if( localStorage.getItem('curr_showedQ_'+thisGid)!=undefined && $('.result_overview').length<1){
		curr_showedQ = parseInt(localStorage.getItem('curr_showedQ_'+thisGid), 10);
	}
console.log(curr_showedQ);
	let q_lvalueArr = [];
	let afs;

	if($('.result_overview').length <1 && $('.game_info .gStatus span').text().trim().toLowerCase() == 'started'){

		if(localStorage.getItem('tAtStart_'+thisGid) != null) {
			afs = make_stopwatch('.qSection .timers .gTimer b', localStorage.getItem('tAtStart_'+thisGid));
		}else{
			afs = make_stopwatch('.qSection .timers .gTimer b');
			localStorage.setItem('tAtStart_'+thisGid, new Date().getTime());
		}

		if(localStorage.getItem('qtimer_startTime_'+thisGid) == null){
			q_lvalueArr[curr_showedQ] = make_stopwatch('.qSection .timers .qTimer b');

			let afec = [];
			afec[curr_showedQ] = [];
			afec[curr_showedQ].push({start: new Date().getTime()});
			localStorage.setItem( 'qtimer_startTime_'+thisGid, JSON.stringify(afec) );


			/*[
				[{start:34534, end:34234},{start:34534, end:34234}] //for Q1
				[{start:34534, end:34234}] //for Q2
				[{start:34534, end:34234}] //for Q3

			]*/



		}else{
			// debugger;
			let mvte = calc_t_on_zswfg( JSON.parse( localStorage.getItem('qtimer_startTime_'+thisGid) )[curr_showedQ] );
			console.log('mvte = '+mvte);
			q_lvalueArr[curr_showedQ] = make_stopwatch('.qSection .timers .qTimer b', mvte );
		}
	}

	let playersTime_arr = [];
	if( $('.game_info .gStatus span').text().trim().toLowerCase() == 'ended' ){

		for(let i=0; i<$('.qSection .timers .playerTime').length; i++){
			playersTime_arr.push( $($('.qSection .timers .playerTime')[i]).children('b').text().trim().split(',') );
			$($('.qSection .timers .playerTime')[i]).children('b').text('');
		}
		console.log(playersTime_arr);

		$('.qSection .timers .gTimer').css('display','none');
		$('.qSection .timers .qTimer').css('display','none');

	}


	function show_nth_q(n){ // & hide the rest
		let allQcompo = $('.qcompContainer .question-component');

		if(n <= allQcompo.length && n>=1){

			for(let i=0; i<allQcompo.length; i++){
				if(i+1 == n){
					$(allQcompo[i]).show();
				}else{
					$(allQcompo[i]).hide();
				}
			}
			curr_showedQ = n;
			$('.qSection .navigateQ .next').text('Next');
			$('.qSection .navigateQ .next').removeAttr('disabled');

			if($('.result_overview').length <1){
				localStorage.setItem('curr_showedQ_'+thisGid, curr_showedQ);
			}

			if( $('.game_info .gStatus span').text().trim().toLowerCase() == 'ended' ){
				for(let i=0; i<$('.qSection .timers .playerTime').length; i++){
					$($('.qSection .timers .playerTime')[i]).children('b').text(playersTime_arr[i][n-1]);
				}
			}

			if(playersChosenOptn_arr.length>3){
				for(let p=0; p<$('.qSection .chosen_optns_show .chosen_inner').length; p++){

					let kbnw = playersChosenOptn_arr[p][1][curr_showedQ-1];

					if(kbnw.trim()==""){
						kbnw = 'unattempted';
					}else{
						kbnw++;
						kbnw = 'Option '+kbnw;
					}
					$($('.qSection .chosen_optns_show .chosen_inner')[p]).children('b').text(kbnw);
				}

			}else{
				$('.qSection .chosen_optns_show').addClass('d-none');
			}


			$('.qSection .navigateQ .prev').removeAttr('disabled');


			// if($('.result_overview').length <1){
			// 	let ycw = JSON.parse(localStorage.getItem('qtimer_startTime_'+thisGid));

			// 	if( ycw[curr_showedQ]==null || ycw[curr_showedQ]==undefined ){
			// 		ycw[curr_showedQ] = [];
			// 		ycw[curr_showedQ].push( {start: new Date().getTime()} );
			// 	}

			// 	localStorage.setItem( 'qtimer_startTime_'+thisGid, JSON.stringify(ycw) );
			// }
			

			if(n==1){
				$('.qSection .navigateQ .prev').attr('disabled', '');
			}
			if(n==(allQcompo.length)){
				if($('.result_overview').length <1){
					$('.qSection .navigateQ .next').text('Submit');
				}else{
					$('.qSection .navigateQ .next').attr('disabled', '');
				}
			}

			
			
		}
	}
	
	show_nth_q(curr_showedQ);

	$('.qSection .navigateQ .prev').on("click", function(){

		show_nth_q(curr_showedQ-1);

		if($('.result_overview').length <1){
			pause_stopwatch(q_lvalueArr[curr_showedQ+1]);


			// ---------------------------------------------------------

			let mcw = JSON.parse(localStorage.getItem('qtimer_startTime_'+thisGid));

			mcw[curr_showedQ+1][ mcw[curr_showedQ+1].length-1 ]['end'] = new Date().getTime();
			mcw[curr_showedQ].push( {start: new Date().getTime()} );

			localStorage.setItem( 'qtimer_startTime_'+thisGid, JSON.stringify(mcw) );

			// ---------------------------------------------------------


			let wvte = calc_t_on_zswfg( JSON.parse( localStorage.getItem('qtimer_startTime_'+thisGid) )[curr_showedQ] );

			if(q_lvalueArr[curr_showedQ] == undefined){
				q_lvalueArr[curr_showedQ] = make_stopwatch('.qSection .timers .qTimer b', wvte);
			}else{

				resume_stopwatch('.qSection .timers .qTimer b', q_lvalueArr[curr_showedQ], wvte);
			}
		}

	});

	$('.qSection .navigateQ .nextbtn_form').on("submit", function(e){
		
		if($(this).children('button[type="submit"]').text().search(/submit/i) > -1){
			// e.preventDefault();
			let chosen_optns = [];
			let correct_optns = [];

			for(let i=0; i<$('.qcompContainer .question-component').length; i++){
				
				let yht = $($('.qcompContainer .question-component')[i]).children('.options').children('div[role="button"]');

				for(let j=0; j<yht.length; j++){

					if($(yht[j]).hasClass('bg-blue-600 border-2 !border-blue-500')){
						chosen_optns.push(j);

					}else if( j==(yht.length-1) && i>(chosen_optns.length-1) ){
						chosen_optns.push(' ');
					}

					if($(yht[j]).hasClass('willbecorrect')){
						correct_optns.push(j);
					}
				}
			}

			console.log(chosen_optns);
			console.log(correct_optns);




			let score=0;
			let correct=0;
			let wrong=0;
			let unattempted=0;

			for(let k=0; k<chosen_optns.length; k++){
				if(chosen_optns[k]!==" "){
					if(chosen_optns[k]==correct_optns[k]){
						score+=4;
						correct++;
					}else{
						score-=1;
						wrong++;
					}
				}else{
					unattempted++;
				}
			}

			console.log('score: '+score);
			console.log('correct: '+correct);
			console.log('wrong: '+wrong);
			console.log('unattempted: '+unattempted);

			$(this).prepend(`<input type="text" name="chosen_optns" value="${chosen_optns.toString()}" class="d-none">`);
			$(this).prepend(`<input type="text" name="score" value="${score}" class="d-none">`);
			$(this).prepend(`<input type="text" name="correct" value="${correct}" class="d-none">`);
			$(this).prepend(`<input type="text" name="wrong" value="${wrong}" class="d-none">`);
			$(this).prepend(`<input type="text" name="unattempted" value="${unattempted}" class="d-none">`);

			qtimes_arr = [];
			// debugger;
			// for(let i=1; i<q_lvalueArr.length; i++){
			// 	let ybj = tva[q_lvalueArr[i]];
			// 	qtimes_arr.push(ybj['h_str']+':'+ybj['m_str']+':'+ybj['s_str']);
				
			// }
			let nmrs = JSON.parse(localStorage.getItem('qtimer_startTime_'+thisGid));
			for(let i=1; i<nmrs.length; i++){
				let rdm = ms_to_hms(calc_t_on_zswfg(nmrs[i], true), true);
				qtimes_arr.push(rdm['h_str']+':'+rdm['m_str']+':'+rdm['s_str']);
			}
			console.log('qtimes_arr.toString() = '+qtimes_arr.toString());

			$(this).prepend(`<input type="text" name="qtimes" value="${qtimes_arr.toString()}" class="d-none">`);

			
			let aqt = ( tva[afs]['h']*3600 + tva[afs]['m']*60 + tva[afs]['s'] ) / parseInt($('.game_info .numOfQ span').text(), 10);
			aqt = Math.round(aqt);
			console.log(aqt);

			$(this).prepend(`<input type="text" name="aqt" value="${aqt}" class="d-none">`);

			destroyAllMyTemp_localStor();

		}else{
			e.preventDefault();
			// console.log(q_lvalueArr);
			show_nth_q(curr_showedQ+1);
// debugger;
			if($('.result_overview').length <1){
				pause_stopwatch(q_lvalueArr[curr_showedQ-1]);

				// ---------------------------------------------------------

				let ucw = JSON.parse(localStorage.getItem('qtimer_startTime_'+thisGid));

				ucw[curr_showedQ-1][ ucw[curr_showedQ-1].length-1 ]['end'] = new Date().getTime();

				if( ucw[curr_showedQ]==null || ucw[curr_showedQ]==undefined ){
					ucw[curr_showedQ] = [];
				}
				ucw[curr_showedQ].push( {start: new Date().getTime()} );

				localStorage.setItem( 'qtimer_startTime_'+thisGid, JSON.stringify(ucw) );

				// ---------------------------------------------------------


				let svte = calc_t_on_zswfg( JSON.parse( localStorage.getItem('qtimer_startTime_'+thisGid) )[curr_showedQ] );
				console.log('svte = '+svte);
				if(q_lvalueArr[curr_showedQ] == undefined){
					q_lvalueArr[curr_showedQ] = make_stopwatch('.qSection .timers .qTimer b', svte);
				}else{
					resume_stopwatch('.qSection .timers .qTimer b', q_lvalueArr[curr_showedQ], svte);
				}
			}

		}

	});


	

	




	$('.question-component .options div[role="button"]').on('click',function(){

		if( $('.game_info .gStatus span').text().trim().toLowerCase() != 'ended' ){
			let hpj = localStorage.getItem('qAttemptedOptn_temp_'+thisGid);
			if(hpj == undefined){
				hpj=[];
			}else{
				hpj=JSON.parse(hpj);
			}

			$(this).siblings('div[role="button"]').removeClass('bg-blue-600 border-2 !border-blue-500');

			if( !($(this).hasClass('bg-blue-600 border-2 !border-blue-500')) ){
				$(this).addClass('bg-blue-600 border-2 !border-blue-500');
				
				let tbkp = $(this).parents('.options').children('div[role="button"]');
				for(let i=0; i<tbkp.length; i++){
					if($(tbkp[i]).hasClass('bg-blue-600 border-2 !border-blue-500')){
						hpj[curr_showedQ] = i;
						break;
					}
				}

			}else{
				$(this).removeClass('bg-blue-600 border-2 !border-blue-500');
				hpj[curr_showedQ] = null;
			}

			localStorage.setItem('qAttemptedOptn_temp_'+thisGid, JSON.stringify(hpj));

		}
	});


	$('.question-component button[aria-label="Check Answer Button"]').on('click',function(){

		let jmw = $(this).parents('.question-component').children('.options').children('div[role="button"]');
		for(let i=0; i<jmw.length; i++){
			if($(jmw[i]).hasClass('willbecorrect')){
				$(jmw[i]).addClass('border-2  !border-green-500 text-green-500 bg-green-600');
				$($(jmw[i]).children()[0]).addClass('bg-green-600');

			}
		}

		$(this).css('display','none');
		$(this).parents('.question-component').children("div:last-child").css('display','');
	});

	if( $('.game_info .gStatus span').text().trim().toLowerCase() == 'ended' ){
		$('.question-component button[aria-label="Check Answer Button"]').click();
		destroyAllMyTemp_localStor();
	}


	$('.game_info .topGoptions form.endgame').on('submit',function(e){

		if(!confirm("Do you really want to end this game for all players in it?")){
			e.preventDefault();
		}
	});





	let initial_qcompContainer_html = $('.qSection .qcompContainer').html();
	let initial_playersTime_arrStr = JSON.stringify(playersTime_arr);

	$('.result_overview table td.clickable').on('click', function(){
		let yoshp = $(this).hasClass('bg-primary text-light');

		$('.result_overview table td.clickable').removeClass('bg-primary text-light');
		$('.qSection .qcompContainer').html(initial_qcompContainer_html);
		playersTime_arr = JSON.parse(initial_playersTime_arrStr);

		if( !(yoshp) ){ //not shuru se has class bg-prim
			$(this).addClass('bg-primary text-light');
			let ebz = $(this).attr('data-plyr_cwu').trim().replace(new RegExp('_showbtn' + '$'), '');
			let q_comps_xjpz = $('.qSection .qcompContainer .question-component');

			// let indexes_toRemove = [];
			let cbrw = 0;
			for(let i=0; i<q_comps_xjpz.length; i++){
				if( !( $(q_comps_xjpz[i]).hasClass(ebz) ) ){
					$(q_comps_xjpz[i]).prop('outerHTML', '');


					for(let j=0; j<playersTime_arr.length; j++){
						playersTime_arr[j].splice(i-cbrw, 1);
					}

					cbrw++;

				}
			}
		}
		console.log(playersTime_arr);

		show_nth_q(1);

	});



});