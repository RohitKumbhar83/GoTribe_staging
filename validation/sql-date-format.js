
module.exports = {


  birthdayCheck: function checkBirthday(birthday){
    let birth_date = birthday;
                  // console.log(birth_date);
    try{
      if(typeof (birth_date)!= 'undefined' && birth_date!=null && birth_date!="" && birth_date!=undefined ){
          birth_date = new Date(birthday).toISOString();
          console.log('date toISOString');
          let str = (birth_date).split('T');
            // console.log(str+'str');
          birthday = (str[0]);
      }else{
          birthday = "";
      }
    }catch(ex){
      birthday = "";
    }
    finally{
      return birthday;
    }
  }

}
