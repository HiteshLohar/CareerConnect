import NotificationItem from "./NotificationItem";

function NotificationDropdown({
    notifications,
    loading,
    onRead,
    onMarkAllAsRead
}) {

    if (loading) {
        return (
            <div className="absolute bottom-full right-0 mb-3 w-[calc(100vw-2rem)] max-w-[430px] z-50 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border bg-white p-5 shadow-2xl md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:mt-3 md:w-[430px] md:max-h-[calc(100dvh-6rem)]">
                Loading...
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="absolute bottom-full right-0 mb-3 w-[calc(100vw-2rem)] max-w-[430px] z-50 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border bg-white shadow-2xl md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:mt-3 md:w-[430px] md:max-h-[calc(100dvh-6rem)]">

                <div className="flex items-center justify-between p-4 border-b">

                    <h2 className="text-xl font-bold">
                        🔔 Notifications
                    </h2>

                </div>

                <div className="flex flex-col items-center justify-center py-10">

                    <div className="text-5xl mb-3">
                        🔔
                    </div>

                    <h3 className="font-semibold text-lg">
                        You're all caught up!
                    </h3>

                    <p className="text-gray-500 mt-2">
                        No new notifications.
                    </p>

                </div>

            </div>
        );
    }

    return (

        <div className="absolute bottom-full right-0 mb-3 w-[calc(100vw-2rem)] max-w-[430px] z-50 flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-xl border bg-white shadow-2xl md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:mt-3 md:w-[430px] md:max-h-[calc(100dvh-6rem)]">

            <div className="flex shrink-0 items-center justify-between gap-3 border-b p-4">

                <h2 className="text-lg font-bold sm:text-xl">
                    🔔 Notifications
                </h2>

                <button
                    onClick={onMarkAllAsRead}
                    className="shrink-0 text-sm text-blue-600 hover:underline"
                >
                    Mark all as read
                </button>

            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">

                {
                    notifications.map((notification) => (

                        <NotificationItem
                            key={notification._id}
                            notification={notification}
                            onRead={onRead}
                        />

                    ))
                }

            </div>

        </div>

    );
}

export default NotificationDropdown;
