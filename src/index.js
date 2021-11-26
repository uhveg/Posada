const express = require('express');

const path = require('path');
const app = express();

app.use(express.json());

// Configuration
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

const fs = require('fs');
let rawData = fs.readFileSync('data.json');
let jsonData = JSON.parse(rawData);

// Routes
app.get('/', (req, res) => {
    // for0
    console.log("Connection from "+req.ip);


    res.render('index.html');
});

app.get('/takepaper', (req, res) => {
    console.log("Connection from "+req.ip);
    var hmleft = 0;
    for(let i = 0;i < jsonData.length; i++) {
        if(jsonData[i].taked == false) {
            hmleft++;
        }
    }
    // console.log(jsonData.length);
    if(hmleft>0)
        res.render('take.html');
    else
        res.render('none.html');
});

app.post('/newclient', (req, res) => {
    // console.log(req.body);
    var username = req.body.name;
    // var code = req.body.code;
    // console.log(req.ip + " - " + username + " - " + code);
    // setTimeout(() => {
    let code = () => {
        var auxC = '';
        for(let i=0;i<5;i++) {
            var x = () => {
                var aux = Math.floor(Math.random() * 42 + 48);
                while(aux < 65 && aux > 57) {
                    aux = Math.floor(Math.random() * 42 + 48);
                }
                return String.fromCharCode(aux);
            }
            auxC += x();
        }
        return auxC;
    }

    var myC = code()
    for(let i = 0;i < jsonData.length; i++) {
        if(myC == jsonData[i].code) {
            myC = code();
            i = -1;
        }
    }

    jsonData.push({code: myC, ip: req.ip, name: username, taked: false});
    fs.writeFileSync('data.json', JSON.stringify(jsonData));

    res.status(200).json({Code:myC});
        // return;
    // }, 1000);
    // res.end('yes');
});

app.post('/verclient', (req, res) => {
    // console.log(req.body);
    var code = req.body.code;
    var valid = false;
    var index = -1;
    // var code = req.body.code;
    for(let i = 0;i < jsonData.length; i++) {
        if(code == jsonData[i].code) {
            valid = true;
            index = i;
        }
    }
    if(valid == false) {
        res.status(200).json({isValid:valid, name:""});
        return;
    }
    var chose = () => {
        var x = Math.floor(Math.random() * jsonData.length);
        while(x == index || jsonData[x].taked == true) {
            x = Math.floor(Math.random() * jsonData.length);
        }
        return x;
    }
    var cc = chose();
    console.log(cc);
    jsonData[cc].taked = true;
    jsonData[index].code = jsonData[index].code+'-done';
    jsonData[index].to = jsonData[cc].name;
    fs.writeFileSync('data.json', JSON.stringify(jsonData));
    res.status(200).json({isValid:valid, name:jsonData[cc].name});
        // return;
    // }, 1000);
    // res.end('yes');
});

// Static
//app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log("Server on port: ", app.get('port'));
});
