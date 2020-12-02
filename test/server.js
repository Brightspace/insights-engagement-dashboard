
import { rest, setupWorker } from 'msw';

const handlers = [

	rest.post('/api/events', async(req, res, ctx) => {
		console.log('MSW');
		console.log(req.body);
		return res(ctx.json({ success: true }));
	}),

	rest.get('/d2l/lp/auth/xsrf-tokens', async(req, res, ctx) => {
		return res(ctx.json({ success: true }));
	}),

	rest.put('/d2l/api/ap/unstable/insights/mysettings/engagement', async(req, res, ctx) => {
		return res(ctx.json({ success: true }));
	}),
];

export const worker = setupWorker(...handlers);
