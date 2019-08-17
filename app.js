
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const qs = require('querystring');
const internalIp = require('ip');
var template = require('./public/template.js');
var notetxt = '';



// app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.static('public'))



app.get('/', (req, res) => {

  var myLocaIP =internalIp.address();

  // ============== Add Note Box ==========================================
  fs.readFile(path.join(__dirname, 'public', 'note_txt.txt'), (err, data) => {
    notetxt = String(data);
  });

  // ============== create LISTs from JSON ==========================================
  fs.readFile(path.join(__dirname, 'public', 'url_list.json'), (err, data) => {
    if (err) {
      console.error('There was an error reading the file!', err);
      console.log(error.code);
    }
    var list_a = '';
    var list_b = '';
    var list_c = '';
    var list_d = '';
    var list_e = '';

    var obj = JSON.parse(data);

    list_a = appendItem(obj, 'listA', list_a);
    list_b = appendItem(obj, 'listB', list_b);
    list_c = appendItem(obj, 'listC', list_c);
    list_d = appendItem(obj, 'listD', list_d);
    list_e = appendItem(obj, 'listE', list_e);

    var html = template.html(list_a, list_b, list_c, list_d, list_e, notetxt, myLocaIP);
    res.send(html);
  });

});


  // ================= add a LIST from FORM =========================================

  app.post('/addurl', function (req, res) {
    var body = '';
    req.on('data', (data) => {
      body = body + data;
    });

    req.on('end', () => {

      fs.readFile(path.join(__dirname, 'public', 'url_list.json'), (err, data) => {

        var obj = JSON.parse(data);
        var post = qs.parse(body);
        console.log(post.listtogo);

        if (post.linktitle && post.linkurl) {
          obj[post.listtogo].push({ title: post.linktitle, url: post.linkurl });
          var json = JSON.stringify(obj);
          // writejsonfile(res, json);
          fs.writeFile(path.join(__dirname, 'public', 'url_list.json'), json, function (err) { });
        }

      });

    });
    res.redirect('/');
  });


  // ================= Delete a ITEM from lists =========================================

  app.post('/delurl', function (req, res) {

    var key, value;

    req.on('data', (data) => {
      var data = String(data);
      var post = qs.parse(data);
      key = Object.keys(post)[0];
      value = Object.values(post)[0];

    });

    req.on('end', () => {
      fs.readFile(path.join(__dirname, 'public', 'url_list.json'), (err, data) => {
        var obj = JSON.parse(data);
        console.log(key + value)
        obj[key].splice(value, 1)
        var json = JSON.stringify(obj);
        fs.writeFile(path.join(__dirname, 'public', 'url_list.json'), json, function (err) { });
      });

    });

    res.redirect('/');
  });

  // ================= Reorder Lists =========================================

  app.post('/reorder', function (req, res) {
    var arraylist = [];
    var key, value;

    req.on('data', (data) => {
      var data = String(data);
      var post = qs.parse(data);
      key = Object.keys(post)[0];
      value = Object.values(post)[0];
      arraylist = key.split(":");

    });
    req.on('end', () => {
      fs.readFile(path.join(__dirname, 'public', 'url_list.json'), (err, data) => {
        var obj = JSON.parse(data);
        var newobj = [];
        obj[value].forEach((e, index) => {
          newobj.push(obj[value][arraylist[index]]);
        });
        obj[value] = newobj;

        var json = JSON.stringify(obj);
        fs.writeFile(path.join(__dirname, 'public', 'url_list.json'), json, function (err) { });


      });

    });

    res.redirect('/');
  });



  // ================= Append Note =========================================

  app.post('/appendnote', function (req, res) {

    var key, value;
    req.on('data', (data) => {
      var post = qs.parse(String(data));
      key = Object.keys(post)[0];
      value = Object.values(post)[0];
    });
    req.on('end', () => {
      fs.writeFile(path.join(__dirname, 'public', 'note_txt.txt'), value, function (err) {
      });

    });
    res.redirect('/');
  });



//=======PACKAGING function=================================================================




function appendItem(obj, listname, listdata) {
  obj[listname].forEach((e, index, elem) => {
    listdata = listdata + ` 
    <li id = "item-${index}">
    <a href="${elem[index].url}" target="_blank">${elem[index].title}<form class="deletebutton" name="${listname}" action="/delurl" method="POST">
    <button name = "${listname}" type="submit" value = "${index}" class="delbtn"></button></form></a></li>`
  });
  return listdata;
};




module.exports = app;
