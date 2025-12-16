// routes/drawer/add.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { AddChildItem } from '../../../src/components/childs/AddChildItem';
import { Drawer } from '@/components/ui/drawer'; // likely shadcn/ui
import React from 'react';

export const Route = createFileRoute("/drawer/add")({
    component: AddDrawer,
});

function AddDrawer() {
    const router = useRouter();              // ✅ from @tanstack/react-router
    const search = Route.useSearch();        // ✅ from the Route object

    return (
        <Drawer open onClose={() => router.history.back()}>
            <div className="p-4">
                <AddChildItem
                    personId={search.personId}
                    thingKey={0}
                    onSuccess={() => router.history.back()}
                />
            </div>
        </Drawer>
    );
}

