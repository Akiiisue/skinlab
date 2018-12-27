var express = require('express');//express 모듈을 가져오기 위해 사용
var app = express();//express 모듈을 가져오기 위해 사용. app객체를 만들어 준다
var bodyParser = require('body-parser')//post방식으로 사용하기 위해 필요한 모듈
app.use(bodyParser.urlencoded({ extended: true }));//post방식으로 사용하기 위해 필요한 모듈
app.locals.pretty = true; //예쁘게 pug파일을 만들어준다

app.use(express.static('uploads'));//정적파일을 public 위치에 놓으면 바로 사용가능
var fs = require('fs'); //nodejs의 파일 시스템을 사용하기 위해 객체 소환
var multer = require('multer');//파일 업로드를 위해 multer를 설치하고 객체를 정의

//저장 하는 방법 중 store로 하는 방법--> 파일이름과 동일한 이름으로 저장하는 방법
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //만약 파일이 img면 폴더를 고르고 만약 다른곳이면 또 파일의 폴더를 고를 수 있어
    //즉 콜백함수를 사용함으로써 조건을 변경 시킬 수 있다.
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: _storage })


//var upload = multer({ dest: 'uploads/' })//사용자가 업로드한 파일이 어디에 저장-> uploads

//pug(템플릿엔진)와 Express를 연결하는 코드
app.set('views','./views_file'); //pug에 사용하는 템플릿엔진 파일을 위치
app.set('view engine', 'pug'); //사용할 템틀릿 엔진  pug을 설정

app.post('/topic',function(req,res){//라우트(post)를 연결한다.
  var title = req.body.title;//parse를 사용해 body를 읽을 수 있다.
  var description = req.body.description;

  //파일을 쓰는 과정 (데이터를 입력)
  fs.writeFile('Data/'+title,description,function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');//에러가 있는경우
    }//send가 실행되면 다음 코드가 출력되지 않는다.
  res.send('Success');//성공한 경우 출력콜백함수가 완료된 후 send할 수 있다
  });
})
//사용자가 topic으로 직접 들어오는 경우
app.get('/topic',function(req,res){
  fs.readdir('data',function(err, files){//디렉토리의 파일을 읽기 위해
    if(err){

      res.status(500).send('Internal Server Error');//에러가 있는경우
    }

      res.render('view',{topics:files});// views_file에서 변수를 쓰기위해
  });// topics란 이름으로 변수를 쑬수 있다.
})

//바뀔수 있는 정보를 :으로 표시한다. 파일을 읽어서 데이터를 출력한res
app.get('/topic/:id',function(req,res){
  var id = req.params.id;
//topics와 titl을 모두 쓰기위해
  fs.readdir('data',function(err, files){//디렉토리의 파일을 읽기 위해
    if(err){

      res.status(500).send('Internal Server Error');//에러가 있는경우
    }

      res.render('view',{topics:files});// views_file에서 변수를 쓰기위해
  });// topics란 이름으로 변수를 쑬수 있다.

  fs.readFile('Data/'+id, 'utf-8', function(err,data){
    if(err){

      res.status(500).send('Internal Server Error');//에러가 있는경우
    }
    res.render('view',{topics:files,title:id, description:data});//이때에도 view를 사용할때는 topics 부분이
  });

})

app.get('/topic/new',function(req,res){

  res.render('new');//pug 템플렛 엔진을 연결
})



//upload로 들어오면 보여주는 get을 잡아준다

app.get('/upload',function(req,res){
  res.render('upload');
})
//upload로 서버로 보낸 자료는 post방식으로 들어오게 되고 이를 위헤 post방식으로 데이터를 받는다
//사용자가 post방식으로 전송한 데이터가 들어오고 이 함수의 두번째 인자로 upload라는미들웨어가 필요하고
// function이 실행되기 전에 먼저 실행되서 사용자가 보낸 파일이 있다면 객체와 한 개의 file 혹은 여러개의
//files 객체를 request 객체에 추가합니다. single에는 파일을 받는 네임이 들어간다
app.post('/upload',upload.single('userfile'),function(req,res){
  console.log(req.file);
  res.send('uploaded');
})

app.listen(3000,function(){
//console.log('connected 3000 port End');
})
