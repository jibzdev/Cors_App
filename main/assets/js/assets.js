// FIXED
const notificationStack = [];

export async function notify(message, colour) {
    if (notificationStack.length >= 5) {
        const removedNotification = notificationStack.shift();
        removedNotification.remove();
    }

    let notification = document.createElement("div");
    notification.setAttribute("class", "notification");
    notification.style.position = "fixed";
    notification.style.top = `${80 + notificationStack.length * 60}px`;
    let icon;
    if (colour === "red") {
        icon = "x";
        notification.style.backgroundColor = "#C53838";
    } else {
        icon = "check";
        notification.style.backgroundColor = "#38C542";
    }
    let iconElement = document.createElement('i');
    iconElement.setAttribute('class',`fa-solid fa-${icon}`)
    let p = document.createElement('p');
    p.style.marginLeft = "20px";
    p.textContent = message;
    notification.append(iconElement,p);

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
};

export function logoutHandler() {
    document.querySelector("#logoutButton").addEventListener("click", async () => {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("userName");
        window.location.href = `/`;
    });
};

export function sidebarHandler() {
    document.querySelector("#menuIcon").addEventListener("click", () => {
        document.querySelector("#sidebar").classList.add("fade");
        document.querySelector("#sidebar").style.opacity = 1;
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest("#controlButtons")) {
            document.querySelector("#sidebar").style.opacity = 0;
        }
    });
}

export function dayHandler() {
    const today = new Date().toLocaleString('en-us', {weekday: 'short'});
    const todayElement = document.getElementById(today);
    if(todayElement) {
        todayElement.style.color = '#b67806';
    }
}