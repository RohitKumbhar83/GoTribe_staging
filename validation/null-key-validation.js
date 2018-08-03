module.exports = {


  iosNullValidation: function ios_NullValidation(objectData) {
    // console.log('iosNullValidation');
    try{

      for(property in objectData ){
        // console.log(property);
        //  console.log(objectData[property]);
        if((objectData[property])== 0){
          // don't change value
        }else if( (objectData[property])== null || (objectData[property])== "" ||
              (objectData[property])== "null"  || (objectData[property])== undefined
              || (objectData[property]) == "0000-00-00"){
                (objectData[property]) = "";
            }
      }
        // console.log(objectData);
      return objectData;
    }catch(e){
      return objectData;
    }


  }


}
