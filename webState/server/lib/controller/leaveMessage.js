const messageModel = require("../models").Message;
const formidable = require('formidable');
import _ from 'lodash';
const { service, settings, validatorUtil, logUtil, siteFunc } = require('../../../utils');
class leaveMessage {
    constructor(){

    }
   
    async getLeveMessage(req,res,next){
        try{
            let current = req.query.current || 1;
            let pageSize = req.query.pageSize || 10;
            let searchkey = req.query.searchkey || '';
            // res.send({
            //     data:req.query,
            //     current,
            //     pageSize,
            //     searchkey,
            // })
            let queryObj = {};
            if (searchkey) {
                let reKey = new RegExp(searchkey, 'i')
                queryObj.content = { $regex: reKey }
            }
            
            const messages = await messageModel.find(queryObj).sort({
                date: -1
            }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).populate([]).exec();
            //.populate() 关联查询
            const totalItems = await messageModel.count(queryObj);
            res.send({
                state: 'success',
                docs: messages,
                pageInfo: {
                    totalItems,
                    current: Number(current) || 1,
                    pageSize: Number(pageSize) || 10,
                    searchkey: searchkey || ''
                }
            })
        }catch(err){
            res.send({
                state: 'error',
                type: 'ERROR_DATA',
                message: '获取Message失败'
            })
        }
    }
    
    async postLeaveMessage(req,res,next){
        const form = new formidable.IncomingForm();
        form.parse(req,async (err,fields,file)=>{
            try{
                console.log(fields)
                let errMsg=''
                if (fields.name && (fields.name.length < 2 || fields.name.length > 6)) {
                    errMsg = '姓名为2-6字'
                    throw new siteFunc.UserException(errMsg);
                }
                if (!fields.name) {
                    errMsg = '姓名不能为空'
                    throw new siteFunc.UserException(errMsg);
                }
                if (fields.telphone && (fields.telphone.length!=11)) {
                    errMsg = '电话号码为11位数字'
                    throw new siteFunc.UserException(errMsg);
                }
                if (!fields.telphone) {
                    errMsg = '电话号码不能为空'
                    throw new siteFunc.UserException(errMsg);
                }
                if (fields.email && (fields.email.length < 7|| fields.email.length > 30)) {
                    errMsg = '邮箱为7-30位'
                    throw new siteFunc.UserException(errMsg);
                }
                if (!fields.email) {
                    errMsg = '邮箱不能为空'
                    throw new siteFunc.UserException(errMsg);
                }
                if (fields.content && (fields.content.length < 5 || fields.content.length > 200)) {
                    errMsg = '留言内容为5-200字'
                    throw new siteFunc.UserException(errMsg);
                }
                if (!fields.content) {
                    errMsg = '留言内容不能为空'
                    throw new siteFunc.UserException(errMsg);
                }
  
              

            }catch(err){
                res.send({
                    state: 'error',
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return

            }

            const messageObj = {
                name:fields.name,
                telphone:fields.telphone,
                email:fields.email,
                content:fields.content
            }
            const newMessage = new messageModel(messageObj)
            try{
                let currentMessage = await newMessage.save()
                res.send({
                    state: 'success',
                    id: newMessage._id
                });
            }catch(err){
                res.send({
                    state: 'error',
                    type: 'ERROR_IN_SAVE_DATA',
                    message: '保存留言数据失败:' + err,
                })

            }
        })


    }
    async delLeaveMessage(req,res,next){

    }

}


module.exports = new leaveMessage();