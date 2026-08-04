function formatTime(date) {

    const now = new Date();
    const created = new Date(date);

    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) {
        return `${diff} sec ago`;
    }

    if (diff < 3600) {
        return `${Math.floor(diff / 60)} min ago`;
    }

    if (diff < 86400) {
        return `${Math.floor(diff / 3600)} hr ago`;
    }

    if (diff < 604800) {
        return `${Math.floor(diff / 86400)} day ago`;
    }

    return created.toLocaleDateString();

}

export default formatTime;