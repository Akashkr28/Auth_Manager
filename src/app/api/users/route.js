import { NextResponse } from 'next/server';
import { clientPromise } from '@/lib/mongodb';

export async function GET(req) {
  const client = await clientPromise;
  const db = client.db();
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const limit = 10;
  const users = await db.collection('users').find().skip((page - 1) * limit).limit(limit).toArray();
  return NextResponse.json({ users });
}

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db();
  const body = await req.json();
  const result = await db.collection('users').insertOne(body);
  return NextResponse.json(result);
}