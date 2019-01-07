const fs = require('fs');

function render(templateName, data, response){
    var contents = fs.readFileSync('./htmltemplates/'+templateName+'.html', {encoding: 'utf8'});
    contents = bindVal(data, contents);
    response.write(contents);
};

function bindVal(data, content){
    for(var key in data)
        content = content.replace('{{'+key+'}}',data[key]);
    return content;
}

module.exports = render;