// /app/api/news/route.ts
import { NextResponse } from 'next/server';

const NEWSAPI_URL = 'https://newsapi.org/v2/everything';

// trusted moto domains (example list — add/remove as you like)
const TRUSTED_DOMAINS = [
  'rideapart.com',
  'motorcyclenews.com',
  'motorcycle.com',
  'visordown.com',
  'asphaltandrubber.com',
  'bikewale.com',
  'bikernet.com',
  'autoexpress.co.uk' // has moto content sometimes
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    // client can pass q or we'll default to focused moto keywords
    const q = url.searchParams.get('q') || 'motorcycle OR motorbike OR bike OR superbike OR "two wheeler"';
    const pageSize = url.searchParams.get('pageSize') || '6';

    const key = process.env.NEWSAPI_KEY;
    if (!key) return NextResponse.json({ error: 'Missing NEWSAPI_KEY' }, { status: 500 });

    // restrict to our trusted domains to keep it moto-only
    const domains = TRUSTED_DOMAINS.join(',');

    const params = new URLSearchParams({
      q,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize,
      domains // NewsAPI supports `domains` to restrict sources
    });

    const res = await fetch(`${NEWSAPI_URL}?${params.toString()}`, {
      headers: { 'X-Api-Key': key },
      cache: 'no-store'
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Upstream error', details: text }, { status: res.status });
    }

    const data = await res.json();
    const articles = (data.articles || []).map((a: any, i: number) => ({
      id: `${a.publishedAt}-${i}`,
      title: a.title,
      excerpt: a.description || a.content || '',
      image: a.urlToImage || null,
      source: a.source?.name || 'Unknown',
      date: a.publishedAt,
      url: a.url,
      category: 'Moto'
    }));

    return NextResponse.json({ articles });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
