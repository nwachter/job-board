import { NextResponse } from 'next/server';

export const POST = async () => {
    const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });

    response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), //Expire immédiatement
        path: '/',
    });

    return response;
};