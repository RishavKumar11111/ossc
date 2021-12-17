var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var DB = "OSSC";
var autoIncrement = require('mongodb-autoincrement');




exports.createCollection = function (collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.createCollection(collectionName, function (err, res) {
            if (err) throw err;
            ////console.log("Collection created!");
            callback(true);
            db.close();
        });
    });
};

exports.insertDocument = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).insertOne(myobj, function (error, res) {
            if (error) throw error;
            //console.log(res.insertedCount);
            callback(res);
            db.close();
        });
    });
};

// exports.insertDocumentt = function (myobj, collectionName, callback) {
//     MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
//         if (err) throw err;
//         var dbo = db.db(DB);
//         dbo.collection(collectionName).insertOne(myobj, function (error, res) {
//             if (error) throw error;
//             //console.log(res.insertedCount);
//             callback(err, res);
//             db.close();
//         });
//     });
// };

exports.removeDocument = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).deleteOne(myobj, function (err, res) {
            if (err) throw err;
            ////console.log("1 document inserted");
            callback(true);
            db.close();
        });
    });
};

exports.insertManyDocuments = function (myobj, collectionName, callback) {
    ////console.log(myobj);
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).insertMany(myobj, function (err, res) {
            if (err) throw err;
            ////console.log("1 document inserted");
            callback(true);
            db.close();
        });
    });
};

exports.findOne = function (collectionName, findData, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).findOne(findData, function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};



exports.queryFindAll = function (myobj, collectionName, callback) {

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find(myobj).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};


exports.updateOne = function (mquery, mvalue, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $set: mvalue };
        ////console.log(mquery);
        ////console.log(newvalues);
        dbo.collection(collectionName).updateOne(mquery, newvalues, function (error, res) {
            if (error) throw error;
            callback(res);
            db.close();
        });
    });
};

exports.queryWithAggregator = function (aggregate, collectionName, callback) {
    // ////console.log(aggregate);
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).aggregate(aggregate).toArray(function (err, result) {
            if (err) throw err;
            // ////console.log(result);
            callback(result);
            db.close();
        });
    });
};

exports.queryWithAggregatorLoop = function (aggregate, collectionName, db, callback) {
    var dbo = db.db(DB);
    dbo.collection(collectionName).aggregate(aggregate).toArray(function (err, result) {
        if (err) throw err;
        // ////console.log(result);
        callback(result);
        // db.close();
    });
};


exports.queryWithAggregatorrrr = function (aggregate, collectionName, callback) {
    // ////console.log(aggregate);
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).aggregate(aggregate).toArray(function (error, result) {
            if (err) throw err;
            // ////console.log(result);
            callback(error, result);
            db.close();
        });
    });
};


exports.findAll = function (collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        dbo.collection(collectionName).find({}).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
};




exports.updatePush = function (mquery, mvalue, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $push: mvalue };
        ////console.log(mquery);
        ////console.log(newvalues);
        dbo.collection(collectionName).updateOne(mquery, newvalues, function (err, res) {
            if (err) throw err;
            callback(true);
            ////console.log("1 document updated");
            db.close();
        });
    });
};
exports.update = function (mquery, mvalue, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $pull: mvalue };
        ////console.log(mquery);
        ////console.log(newvalues);
        dbo.collection(collectionName).updateOne(mquery, newvalues, function (err, res) {
            if (err) throw err;
            callback(true);
            ////console.log("1 document updated");
            db.close();
        });
    });
};

//by aditya for multiple array add to an existing array field
exports.updatePushMany = function (mquery, mvalue, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $push: mvalue };
        dbo.collection(collectionName).updateMany(mquery, newvalues, function (err, res) {
            if (err) throw err;
            callback(true);
            db.close();
        });
    });
};

exports.updateMany = function (mquery, mvalue, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $set: mvalue };
        ////console.log(mquery);
        ////console.log(newvalues);
        dbo.collection(collectionName).updateMany(mquery, newvalues, function (err, res) {
            if (err) throw err;
            callback(res);
            ////console.log("1 document updated");
            db.close();
        });
    });
};

exports.autoIncrement = function (myobj, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        var dbo = db.db(DB);
        autoIncrement.getNextSequence(dbo, collectionName, function (err, autoIndex) {
            callback(autoIndex);
            //save your code with this autogenerated id
        });
    });
};


exports.updateWithArrayFilter = function (mquery, mvalue, filter, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $set: mvalue };
        dbo.collection(collectionName).updateOne(mquery, newvalues, filter, function (err, res) {
            if (err) throw err;
            callback(res);
            db.close();
        });
    });
};

exports.updateWithArrayPush = function (mquery, mvalue, filter, collectionName, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(DB);
        var newvalues = { $push: mvalue };
        dbo.collection(collectionName).updateOne(mquery, newvalues, filter, function (err, res) {
            if (err) throw err;
            callback(res);
            db.close();
        });
    });
};

exports.mongoConnection = function (callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        callback(db)
    });
};

exports.mongoClose = function (db) {
    db.close()
}