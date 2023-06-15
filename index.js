require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const dns = require('dns')
const {parse} = require('url')


const connectDB = (url)=>{
  return mongoose.connect(url,{
      useNewUrlParser: true, 
      useUnifiedTopology:true,
  })
}
const UrlSchema = new mongoose.Schema({
  
  original_url:String,
  short_url: String
})

const Urls = mongoose.model('Urls',UrlSchema)

// Urls.create({id:'1',original_url:'www.google.com',short_url:'ram'})

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({extended:true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

app.post('/api/shorturl',(req,res)=>{
  const urlshow =req.body.url

  const parsedUrl = parse(urlshow);

  const dnslookup = dns.lookup(parsedUrl.hostname,
  async (err, address)=>{
    if(!address){
      res.json({error: "invalid url"})
      console.log(err)
    }else{

      const urlCount = await Urls.countDocuments({})
     
      Urls.create({
        original_url:urlshow,
        short_url:urlCount
      })
res.json({
  original_url:urlshow,
        short_url:urlCount
})
    }
  }
  )
  
  })

  app.get("/api/shorturl/:short_url",async (req,res)=>{
    const shorturl = req.params.short_url
    const urlDoc = await Urls.findOne({short_url: shorturl })
  res.redirect(urlDoc.original_url)

  })

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

 async function start(){
try {
  await connectDB(process.env.MONGO_URI)
  console.log('connected to DB')

} catch (error) {
  console.log(error)
}
}
start();
