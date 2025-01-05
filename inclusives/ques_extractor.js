
// ----- this file is for insert in console of website -----


function sync_wait_for(millisec){
    let startTime = new Date().getTime();
    while(new Date().getTime() - startTime <millisec);
}


// adding jquery cdn
var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(script);


// sync_wait_for(1500);
// ----- this sync wait does work well here ----

setTimeout(function(){


    // Check Answer button selector
    let checkAns_btnSlctr = 'button[aria-label="Check Answer Button"]';

    let quesArr = [];

    for (let i=0; i<$('.question-component').length; i++){
        let obj_topush = {};
        let this_qCompnt = $('.question-component')[i];
        obj_topush['q'] = this_qCompnt.outerHTML;


        $(this_qCompnt).find(checkAns_btnSlctr).click();


        setTimeout(function(){
            let this_optns = $($('.question-component')[i]).children('.options').children();
        

            for(let j=0; j<this_optns.length; j++){
                console.log(this_optns[j].innerText); 
                if(this_optns[j].innerText.search(/correct answer/i) > -1 && this_optns[j].getAttribute('class').search(/green/i) > -1){
                    obj_topush['correct'] = j;
                }
            }
            obj_topush['explanation'] = ($($('.question-component')[i]).children())[2].outerHTML;
            
            quesArr.push(obj_topush);
        },1500);
    }

    setTimeout(function(){
        let xyzw = quesArr;
        if(localStorage.getItem('quesArr') != null){
            xyzw = JSON.parse(localStorage.getItem('quesArr'));
            for(let k=0; k<quesArr.length; k++){
                xyzw.push(quesArr[k]);
            }
        }
        localStorage.setItem('quesArr',JSON.stringify(xyzw));

        // console.log(quesArr);
        console.log(xyzw);
        document.querySelector("body > div:nth-child(1) > div.app > main > div > div > div.main-container.flex.flex-wrap.gap-2.lg\\:gap-4 > div.flex-grow.flex.flex-col.gap-2.lg\\:gap-4 > div:nth-child(2) > a:nth-child(2)").click();
    },2000);
},500);






/* 

------ this is for checking if 'correct' is missing (for console) -------
a=question wala array

console.log('started');
for(let i=0; i<a.length; i++){
    let cne = a[i]['correct'];
    if(cne==undefined){
        console.log(a[i]);
    }
}
console.log('ended');






------ this is for assigning qid to chapter questions (for console) -------
a=allsubj_qbank[original_chapCode]


for(let i=0; i<a.length; i++){
    if(!('qid' in a[i])){
        a[i]['qid'] = i;
    }
}
console.log(a);

*/