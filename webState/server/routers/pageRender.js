const express = require('express');
const router = express.Router();
import axios from 'axios';
const {
    settings
} = require('../../utils')
const port = process.env.PORT || settings.serverPort
var newsData = []

// const {
//     Content
// } = require('../lib/models')

import { Content } from '../lib/controller'


router.get('/', async (req, res,next) => {
    req.query.isTop=1
    req.query.state=true
    req.query.model='normal'
    req.query.pageSize=3
    req.render={page:'index',title:'天麒科技'}
    next()
},Content.getContents)

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
router.get('/monitor', (req, res) => {
    res.render('monitor', {
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
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: "天麒科技-联系我们"
    })
})
router.get('/news', async (req, res,next) => {
    // req.query.isTop=1
    req.query.state=true
    req.query.model='normal'
    // req.query.pageSize=3
    req.render={page:'news',title:'天麒科技-行业新闻'}
    next()
},Content.getContents)

router.get('/news/:id', async (req, res) => {
    req.query.id='r1NVgKpTf'
    //获取新闻列表
    // Content.find({'_id':'r1NVgKpTf'},function(error, data){  
    //     if(error){
    //         console.log("error :" + error);
    //     }else{
    //         res.send(data)
    //     }
    // })
    Content.getOneContent(req,res).then(r=>{
        res.send(r)

    })
})
router.get('/content/getList', (req, res, next) => { req.query.state = true; next() }, Content.getContents);
module.exports = router;