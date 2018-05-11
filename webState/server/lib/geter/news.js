const axios = require('axios')
const {
    settings
} = require('../../../utils')
const port = process.env.PORT || settings.serverPort

const getNews =  () => {
    return  axios.get('http://localhost:' + port + '/api/content/getList')
}

module.exports =getNews