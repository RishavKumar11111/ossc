var mongo=require('../../mongo/mongo')

exports.failALot=function(data,callback){
    mongo.updateMany({lot_Number:data},{lotExpired:true},'seedData',function(response){
        if(response.matchedCount==0){
            callback({result:"No Data"})
        }else{
            callback({result:"success"})
        }
    })
}