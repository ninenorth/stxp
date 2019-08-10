// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
 
// var app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// // app.set('views', __dirname + '/views');
// // app.set('view engine', 'ejs');
// // app.engine('html', require('ejs').renderFile);


// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
 
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
var template = require('./public/template.js');




// app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.static('public'))

app.get('/', (req, res) => {

  fs.readFile(path.join(__dirname, 'public', 'url_list.json'), (err, data) => {
    if (err) {
      console.error('There was an error reading the file!', err);
      console.log(error.code);
    }
    var list_a = '';
    var list_b = '';
    var list_c = '';
    var list_d = '';

    var obj = JSON.parse(data);

    list_a = appendItem(obj, 'listA', list_a);
    list_b = appendItem(obj, 'listB', list_b);
    list_c = appendItem(obj, 'listC', list_c);
    list_d = appendItem(obj, 'listD', list_d);

    var html = template.html(list_a, list_b, list_c, list_d);
     res.send(html);
  });
});



// app.get('/',  (req, res)=> {
//   res.sendFile(path.join(__dirname, 'public', 'template.html'));
// });




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




// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`app listening on port ${PORT}`);
// });



module.exports = app;
