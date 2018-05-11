import mongodb from "mongodb";
// import {
//     dbConfig
// } from '../config/config';
const MongoClient = mongodb.MongoClient;
let dbase = null;


function dbConnect(dbName) {

    // return new Promise((resolve, reject) => {
    //     try {
    //         MongoClient.connect(dbConfig, (err, db) => {
    //             if (err) {
    //                 reject(err);
    //                 throw err;
    //             }
    //             dbase = db.db('webstate');
    //             resolve('数据库已创建')
                
    //         });
    //     } catch (err) {
    //         reject(err);
    //     }

    // })
}

function dbCreateCollection(dbName) {
    return new Promise((resolve, reject) => {
        try {
            dbase.createCollection(dbName, (err, res) => {
                if (err) {
                    reject(err);
                    throw err;
                }
                console.log("创建集合!");
                resolve('创建集合')
            });
        } catch (err) {
            reject(err);
        }
    })

}

function dbInsert(dbName, data) {
    return new Promise((resolve, reject) => {

        try {
            if (data instanceof Object) {
                dbase.collection(dbName).insertOne(data, (err, res) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    console.log("文档插入成功");
                    resolve(res);

                });
            } else {
                dbase.collection(dbName).insertMany(data, (err, res) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    console.log("插入的文档数量为: " + res.insertedCount);

                    resolve(res);

                });

            }
        } catch (err) {
            reject(err);
        }

    })

}

function dbFind(dbName, key) {
   
    key = key || {}
    try {
        return new Promise((resolve, reject) => {
            dbase.collection(dbName).find(key).toArray(function (err, res) { // 返回集合中所有数据
                if (err) {
                    reject(err);
                    throw err;
                }
                resolve(res);
                // console.log(res);
            });
        })
    } catch (err) {
        reject(err);
    }


}

function dbUpdateOne(dbName, whereStr, upData) {

    return new Promise((resolve, reject) => {
        try {
         
            let updateStr = {
                $set: upData
            };
            dbase.collection(dbName).updateOne({"username":"admin"}, updateStr,  (err, res)=> {
                console.log(11111)
                if (err) {
                    reject(false);
                    throw err;
                }
                console.log("文档更新成功");
                resolve(true);
            });
        } catch (err) {
            reject(false);

        }

    })



}

function dbUpdateMany(dbName, whereStr, upData) {

    return new Promise((resolve, reject) => {
        try {

            let updateStr = {
                $set: upData
            };
            dbase.collection(dbName).updateMany(whereStr, updateStr, function (err, res) {
                if (err) {
                    reject(err);
                    throw err;
                }
                console.log(res.result.nModified + " 条文档被更新");
                resolve(res);

            });
        } catch (err) {
            reject(err);
        }
    })



}



function dbDeleteOne(dbName, whereStr) {
    return new Promise((resolve, reject) => {
        try {
            dbase.collection(dbName).deleteOne(whereStr, function (err, obj) {
                if (err) {
                    reject(err);
                    throw err;
                }
                console.log("文档删除成功");
                resolve(obj);
            });
        } catch (err) {
            reject(err);
        }
    })

}

function deleteMany(dbName, whereStr) {
    return new Promise((resolve, reject) => {
        try {
            dbase.collection(dbName).deleteMany(whereStr, function (err, obj) {
                if (err) {
                    reject(err);
                    throw err;
                }
                console.log(obj.result.n + " 条文档被删除");
                resolve(obj)
            });
        } catch (err) {
            reject(err);
        }
    })
}

dbConnect()
export {
    dbConnect,
    dbCreateCollection,
    deleteMany,
    dbDeleteOne,
    dbUpdateMany,
    dbUpdateOne,
    dbFind,
    dbInsert
}