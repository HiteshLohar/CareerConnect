import NotificationItem from "./NotificationItem";

function NotificationDropdown({
    notifications,
    loading,
    onRead,
    onMarkAllAsRead
}) {

    if (loading) {
        return (
            <div className="absolute right-0 mt-3 w-[430px] bg-white rounded-xl shadow-2xl p-5 border z-50">
                Loading...
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="absolute right-0 mt-3 w-[430px] bg-white rounded-xl shadow-2xl border z-50">

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

        <div className="absolute right-0 mt-3 w-[430px] bg-white rounded-xl shadow-2xl border z-50">

            <div className="flex items-center justify-between p-4 border-b">

                <h2 className="text-xl font-bold">
                    🔔 Notifications
                </h2>

                <button
                    onClick={onMarkAllAsRead}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Mark all as read
                </button>

            </div>

            <div className="max-h-[500px] overflow-y-auto">

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