import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { clientPromise } from '@/lib/mongodb';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ email });
  const res = NextResponse.json({ success: true });
  res.cookies.set('token', token, { httpOnly: true });
  return res;
}