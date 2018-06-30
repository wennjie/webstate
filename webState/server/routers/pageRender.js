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
    req.render={page:'index',seo:{
        title:"成都天麒科技有限公司",
        Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保",
        description:"    成都天麒科技有限公司是一家以人工智能为核心，提供智能一体化农业服务的科技创新型企业， 成立于2013年6月，总部位于成都高新区。公司致力于空中无人机器人的研发和制造， 对于无人机在农林牧业等应用有深入的探索，已取得业内瞩目的成果和产品。"
    }}
    next()
},Content.getContents)

router.get('/product', (req, res) => {
    res.render('index', {
        seo:{
            title:"成都天麒科技有限公司-产品",
            Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保，v02，v02s，v03,v04,v05",
            description:"v02，v02s，v03,v04,v05"
        }
    })
})
router.get('/V02', (req, res) => {
    res.render('V02', {
        seo:{
            title:"成都天麒科技-v02",
            Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保，v02，v02s，v03,v04,v05",
            description:"v02，v02s，v03,v04,v05"
        }
    })
})
router.get('/V02S', (req, res) => {
    res.render('V02S', {
        title: "天麒科技-V02S",
        seo:{
            title:"成都天麒科技-v02s",
            Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保，v02，v02s，v03,v04,v05",
            description:"v02，v02s，v03,v04,v05"
        }
    })
})
router.get('/solution', (req, res) => {
    res.render('solution', {
        title: "天麒科技-解决方案",
        seo:{
            title:"成都天麒科技-解决方案",
            Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保，v02，v02s，v03,v04,v05，解决方案",
            description:"v02，v02s，v03,v04,v05,解决方案"
        }
    })
})
router.get('/monitor', (req, res) => {
    res.render('monitor', {
        title: "天麒科技-解决方案",
        seo:{
            title:"成都天麒科技-解决方案",
            Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保，v02，v02s，v03,v04,v05，解决方案",
            description:"v02，v02s，v03,v04,v05,解决方案"
        }
    })
})

router.get('/service', (req, res) => {
    res.render('contact', {
        title: "天麒科技-服务与支持",
        seo:{
            title:"成都天麒科技-解决方案",
            Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保，v02，v02s，v03,v04,v05，解决方案",
            description:"v02，v02s，v03,v04,v05,解决方案"
        }
    })
})
router.get('/aboutUs', (req, res) => {
    res.render('about', {
        title: "天麒科技-关于",
        seo:{
            title:"成都天麒科技-解决方案",
            Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保，v02，v02s，v03,v04,v05，解决方案",
            description:"v02，v02s，v03,v04,v05,解决方案"
        }
    })
})
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: "天麒科技-联系我们",
        seo:{
            title:"成都天麒科技-解决方案",
            Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保，v02，v02s，v03,v04,v05，解决方案",
            description:"v02，v02s，v03,v04,v05,解决方案"
        }
    })
})
router.get('/news', async (req, res,next) => {
    req.query.state=true
    req.query.model='normal'
    req.query.pageSize=5
    req.render={page:'news',seo:{
        title:"成都天麒科技-行业新闻",
        Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保，v02，v02s，v03,v04,v05，解决方案",
        description:"v02，v02s，v03,v04,v05,解决方案"
    }}
    next()
},Content.getContents)

router.get('/news/:id.html', (req, res,next) => {
    req.query.id=req.params.id
    req.render={page:'newDetails',seo:{
        title:"成都天麒科技-新闻详情",
        Keywords:"天麒，天麒科技，无人机，科技兴农，智能，农业，植保，v02，v02s，v03,v04,v05，解决方案",
        description:"v02，v02s，v03,v04,v05,解决方案"
    }}
    next()
},Content.getOneContent)
module.exports = router;