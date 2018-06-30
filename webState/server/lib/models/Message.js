/**
 * Created by Administrator on 2015/4/15.
 * 留言管理
 */
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;
var moment = require('moment')
moment.locale('zh-cn');
var AdminUser = require('./AdminUser');
var User = require('./User');
var Content = require('./Content');
var MessageSchema = new Schema({
    _id: {
        type: String,
        'default': shortid.generate
    },
    name:{type:String,default:"游客"},
    telphone:{type:String,default:"12345678901"},
    email:{type:String,default:"@"},
    date: { type: Date, default: Date.now }, // 留言时间
    content: { type: String, default: "请输入留言..." }// 留言内容
});


MessageSchema.set('toJSON', { getters: true, virtuals: true });
MessageSchema.set('toObject', { getters: true, virtuals: true });

MessageSchema.path('date').get(function (v) {
    return moment(v).startOf('hour').fromNow();
});

var Message = mongoose.model("Message", MessageSchema);

module.exports = Message;

