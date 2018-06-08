const express = require('express');
const router = express.Router();
import axios from 'axios';
const {
    settings
} = require('../../utils')
const port = process.env.PORT || settings.serverPort
var newsData=[]

const {Content} = require('../lib/models')




router.get('/', async (req, res) => {
    let t = new Date()
    let data = await axios.get('http://localhost:'+port+'/api/content/getList')
    let resdata = data.data.docs
    newsData=resdata
    if(resdata.length>3){
        resdata=resdata.splice(0,3)
    }
    console.log(new Date() -t)
    res.render('index', {
        title: "天麒科技",
        data: resdata
    })
})
router.get('/product', (req, res) => {
    res.render('index', {
        title: "天麒科技-产品"
    })
})
router.get('/V02', (req, res) => {
    res.render('V02', {
        title: "天麒科技-V02"
    })
})
router.get('/V02S', (req, res) => {
    res.render('V02S', {
        title: "天麒科技-V02S"
    })
})
router.get('/solution', (req, res) => {
    res.render('solution', {
        title: "天麒科技-解决方案"
    })
})
router.get('/service', (req, res) => {
    res.render('contact', {
        title: "天麒科技-服务与支持"
    })
})
router.get('/aboutUs', (req, res) => {
    res.render('about', {
        title: "天麒科技-关于"
    })
})
router.get('/news', async(req, res) => {
    let data = await axios.get('http://localhost:'+port+'/api/content/getList')
    let resdata = data.data.docs
    newsData=resdata
    res.render('news', {
        title: "天麒科技-新闻"
    })
})
router.get('/news/:id', async(req, res) => {
    let id = req.params.id
    //  let data=await dbFind('contents',{_id:id})
//    let data= Content.findOne({'_id.last':id},'_id',(e)=>{
//        console.log(e)
//    })
Content.find({'_id':id},function(error, data){
    if(error){
        console.log("error :" + error);
      }else{

        res.send(data)
      }
})
//    console.log(data)
    // res.send(data)
    // res.render('news', {
    //     title: "天麒科技-新闻"
    // })
})

module.exports = router;