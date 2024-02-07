const notificationStack = [];

export async function notify(message, colour) {
    if (notificationStack.length >= 5) {
        const removedNotification = notificationStack.shift();
        removedNotification.remove();
    }

    let notification = document.createElement("div");
    notification.setAttribute("class", "notification");
    notification.style.top = `${80 + notificationStack.length * 60}px`;
    let icon;
    if (colour === "red") {
        icon = "x";
        notification.style.backgroundColor = "#C53838";
    } else {
        icon = "check";
        notification.style.backgroundColor = "#38C542";
    }
    notification.innerHTML = `
    <i class="fa-solid fa-${icon}"></i>
    <p style="margin-left: 20px;">${message}</p>
    `;

    document.body.append(notification);

    setTimeout(() => {
        notification.classList.add("slide-in");
        notificationStack.push(notification);
    }, 100);

    setTimeout(() => {
        const index = notificationStack.indexOf(notification);
        if (index > -1) {
            notificationStack.splice(index, 1);
        }
        notification.remove();
        notificationStack.forEach((notif, i) => {
            notif.style.top = `${80 + i * 60}px`;
        });
    }, 3000);
}
