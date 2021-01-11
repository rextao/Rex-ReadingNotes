import { Controller, Context } from 'egg';

export default class IndexController extends Controller {
    public async index(ctx: Context) {

        await ctx.renderClient('admin/home.js', {
            url: ctx.url,
        });
        // if (ctx.query.mode === 'csr') {
        //     await ctx.renderClient('admin/home.js', { url: ctx.url.replace(/\/admin/, '') }, { viewEngine: null });
        // } else {
        //     await ctx.render('admin/home.js', { url: ctx.url.replace(/\/admin/, '') });
        // }
    }
}
