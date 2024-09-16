'use client';

import { useAuth } from '@/hooks/auth'
import Loading from './Loading'
import Navigation from './Navigation'

const AppLayout = ({ children }: { children: any }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            <main>{children}</main>
        </div>
    )
}

export default AppLayout;
