import { NextResponse } from 'next/server';

export function middleware(req) {
	const host = req.headers.get('host');
	const url = req.nextUrl;

	if (host === 'ilist.proptexx.ai' && url.pathname === '/') {
		return NextResponse.redirect('https://goiconnect.com', 308);
	} else if (host === 'exp.proptexx.ai' && url.pathname === '/') {
		return NextResponse.redirect('https://expglobal.realestateplatform.com', 308);
	} else if (host === 'c21-online-plus.proptexx.ai' && url.pathname === '/') {
		return NextResponse.redirect('https://www.21onlineplus.com', 308);
	} else if (host === 'kwcp.proptexx.ai' && url.pathname === '/') {
		return NextResponse.redirect('https://www.kwcontrolpanel.com', 308);
	} else if (host === 'cb.proptexx.ai' && url.pathname === '/') {
		return NextResponse.redirect('https://cb.realestateplatform.com', 308);
	} else if (host === 'realsmart.proptexx.ai' && url.pathname === '/') {
		return NextResponse.redirect('https://www.realsmartsystem.com', 308);
	} else if (host === 'viking.proptexx.ai' && url.pathname === '/') {
		return NextResponse.redirect('https://vk.realestateplatform.com', 308);
	} else if (host === 'realty.proptexx.ai' && url.pathname === '/') {
		return NextResponse.redirect('https://zoneglobal.ai', 308);
	}

	return NextResponse.next();
}