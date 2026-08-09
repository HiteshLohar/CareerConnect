import {
    FaBell,
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

import formatTime from "../../utils/formatTime";

function NotificationItem({
    notification,
    onRead
}) {

    const accepted =
        notification.type === "APPLICATION_ACCEPTED";

    const isNewApplication =
        notification.type === "NEW_APPLICATION";

    const isAccepted =
        notification.type === "APPLICATION_ACCEPTED";

    const isRejected =
        notification.type === "APPLICATION_REJECTED";

    return (

        <div
            onClick={() => onRead(notification._id)}
            className={`flex items-start gap-4 p-4 cursor-pointer transition border-b

                ${notification.isRead
                    ? "bg-white"
                    : "bg-blue-50 border-l-4 border-l-blue-500"
                }

                hover:bg-gray-100`}
        >

            <div className="mt-1">

                {isNewApplication ? (
                    <FaBell className="text-blue-600 text-2xl" />
                ) : isAccepted ? (
                    <FaCheckCircle className="text-green-600 text-2xl" />
                ) : isRejected ? (
                    <FaTimesCircle className="text-red-600 text-2xl" />
                ) : (
                    <FaBell className="text-gray-500 text-2xl" />
                )}

            </div>

            <div className="flex-1">

                <h3 className="font-semibold text-gray-800 text-lg">

                    {notification.title}

                </h3>

                <p className="text-gray-600 mt-1 leading-6">

                    {notification.message}

                </p>

                <p className="text-xs text-gray-400 mt-3">

                    {
                        notification.createdAt
                            ? formatTime(notification.createdAt)
                            : ""
                    }

                </p>

            </div>

        </div>

    );

}

export default NotificationItem;