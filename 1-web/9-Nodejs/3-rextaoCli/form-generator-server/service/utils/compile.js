const handlebars = require('handlebars');
module.exports = async function parse(content, options) {
    const template = handlebars.compile(content);
    handlebars.registerHelper('raw', function(options) {
        return options.fn()
    });
    try {
        const result = await template(options);
        return result;
    } catch (e) {
        console.log(e)
    }
};
