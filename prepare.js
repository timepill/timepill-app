const fs = require("fs");
const path = require('path')


const pagePath = './src/page';
const pageFiles = fs.readdirSync(pagePath)
                    .filter(x => x.endsWith('Page.js'));

const content = pageFiles.map(x => {
    let key = x.substring(0, x.indexOf('Page.js'));
    let value = 'require("./' + x + '").default'

    return key + ': ' + value;
}).join(',\n');

fs.writeFileSync("./src/page/_list.js", 'export default {\n' + content + '\n}');