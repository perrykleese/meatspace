import { NextResponse } from 'next/server';

export async function GET() {
  const payload = {
    rules: [
      { pathPattern: '/task/*', apiPath: '/api/actions/task/*' },
      { pathPattern: '/feed', apiPath: '/api/actions/feed' },
      { pathPattern: '/feed/*', apiPath: '/api/actions/feed/*' },
      { pathPattern: '/worker/*', apiPath: '/api/actions/worker/*' },
    ],
  };

  return NextResponse.json(payload, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
