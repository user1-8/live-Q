"use strict"

$(document).ready(function(){


  function showValidationErr(errElemId, msg){
    var elem = document.getElementById(errElemId);
    elem.innerHTML = msg;
    setTimeout(function(){
      elem.setAttribute('style', 'max-height:150px;');
    },200);
  }

  function hideValidationErr(errElemId){
    var elem = document.getElementById(errElemId);
    elem.setAttribute('style', 'max-height:0px;');
    /*setTimeout(function(){
      elem.innerHTML = "";
    },5000);*/
  }





  // signup validation

  if(document.getElementById('regform') != undefined)
  document.getElementById('regform').onsubmit = function(e){
    var regname = document.querySelector('.regname');
    var regpass1 = document.querySelector('.regpass1');
    var regpass2 = document.querySelector('.regpass2');
    var noErrs=true;

    var conditions = [
      (regname.value.length>1),
      (regpass1.value.length>3),
      (regpass1.value==regpass2.value),
      (!(/\W/.test(regname.value)))
    ];

    for(let p=0; p<conditions.length; p++){
      if(conditions[p] == false){
        noErrs = false;
      }
    }

    if(!noErrs){
      e.preventDefault();

      if(conditions[0]==false){
        showValidationErr('regnameerr',"Username must be atleast 2 characters.");
      }else{ hideValidationErr('regnameerr'); }

      if(conditions[1]==false){
        showValidationErr('regpass1err',"Password must be atleast 4 characters.");
      }else{ hideValidationErr('regpass1err'); }

      if(conditions[2]==false){
        showValidationErr('regpass2err',"Passwords not matching.");
      }else{ hideValidationErr('regpass2err'); }

      if(conditions[3]==false){
        showValidationErr('regnameerr',"Username must contain only alphabets, numbers or underscore.");
      }else{ hideValidationErr('regnameerr'); }

    }else{
      console.log('registration success');
    }

  };







  // login validation

  if(document.getElementById('logform') != undefined)
  document.getElementById('logform').onsubmit = function(e){
    var logname = document.querySelector('.logname');
    var logpass = document.querySelector('.logpass');
    var noErrs=true;

    var conditions = [
      (logname.value.length>1),
      (logpass.value.length>3),
      (!(/\W/.test(logname.value)))
    ];

    for(let p=0; p<conditions.length; p++){
      if(conditions[p] == false){
        noErrs = false;
      }
    }

    if(!noErrs){
      e.preventDefault();

      if(conditions[0]==false){
        showValidationErr('lognameerr',"Username must be atleast 2 characters.");
      }else{ hideValidationErr('lognameerr'); }

      if(conditions[1]==false){
        showValidationErr('logpasserr',"Password must be atleast 4 characters.");
      }else{ hideValidationErr('logpasserr'); }

      if(conditions[2]==false){
        showValidationErr('lognameerr',"Username must contain only alphabets, numbers or underscore.");
      }else{ hideValidationErr('lognameerr'); }

    }else{
      console.log('login success');
    }

  };




});