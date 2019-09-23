var app = require('express')();
var http = require('http').createServer(app);

//Veri Tabanı işlemleri için mongodb modülünü kullanacağız
var mongodb = require('mongodb');
//MongoDb bağlantısı ve sorgular için client oluşturuyoruz
var mongoclient = mongodb.MongoClient;

//Post isteklernini parse edebilmek için body parser modülünü kullanacağız
var bodyparser = require('body-parser');
//Express modül ile entegre body parser kullanmamız için aşağıdaki kod satırnı yazıyoruz.
app.use(bodyparser.urlencoded({ 'extended': 'true' }));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get("/getNotes", function (req, res) {

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://mongo", function (err, client) {
        if (err) {
            res.send("Veri Tabanı Bağlantısı Yapılamadı");
        } else {

            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("node-note-app");
            //Kullanacağımız Tabloyu Seçiyoruz
            var notlar = db.collection("notlar");
            //İlgili tablodaki butun kayıtları alıyoruz
            notlar.find({}).toArray(function (err, result) {
                res.send(result);
            });
        }
    });
});

app.post("/addNote", function (req, res) {

    mongoclient.connect("mongodb://mongo", function (err, client) {
        if (err) {
            res.send("Veri Tabanı Bağlantısı Yapılamadı");
        } else {
            //Sunucudaki Veri Tabanını Seçiyoruz
            var db = client.db("node-note-app");
            //Kullanacağımız Tabloyu Seçiyoruz
            var notlar = db.collection("notlar");
            //İlgili tabloya kayıt giriyoruz
            notlar.insert({ "baslik": req.body["baslik"], "not": req.body["not"] }, function (err, result) {
                if (err) {
                    res.send("Kayıt işleminde hata oluştu");
                }
                res.redirect('/');
            });
        }

    });
    /*API için kullanılan diğer metodlar ise
    app.post() post(KAyıt) işlemleri için
    app.put() güncelleme için
    app.get() veri almak için
    app.delete() silme işlemleri için
    */
});

//Kayıt Silme
app.get("/removeNote", function (req, res) {

    //!!!!! Bağlantı öncesi mongod çalıştırılmalı aksi halde bağlanamayacaktır.
    //Veri tabanı bağlantısını yapıyoruz
    mongoclient.connect("mongodb://mongo", function (err, client) {
        if (err) {
            res.send("Veri Tabanı Bağlantısı Yapılamadı");
        } else {
            var db = client.db("node-note-app");
            //Kullanacağımız Tabloyu Seçiyoruz
            var notlar = db.collection("notlar");
            //Id ile silme yapmak için ObjectId nesnesini tanımlamamız gerekiyor
            var ObjectId = mongodb.ObjectId;
            //İlgili tablodaki istenen kayıdı siliyoruz
        
            //İd ye göre siler
            notlar.remove({ "_id": ObjectId(req.param("id")) }, function (err, result) {
                if (err) {
                    res.send("Silme işlemi yapılamadı");
                } else {
                    res.redirect('/');
                }
            });
        }
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});
