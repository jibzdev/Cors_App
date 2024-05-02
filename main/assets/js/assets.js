// FIXED
const notificationStack = [];

export function notify(message, colour) {
  if (notificationStack.length >= 5) {
    const removedNotification = notificationStack.shift();
    removedNotification.remove();
  }

  const notification = document.createElement('div');
  notification.setAttribute('class', 'notification');
  notification.style.position = 'fixed';
  notification.style.top = `${80 + notificationStack.length * 60}px`;
  let icon;
  if (colour === 'red') {
    icon = 'x';
    notification.style.backgroundColor = '#C53838';
  } else {
    icon = 'check';
    notification.style.backgroundColor = '#38C542';
  }
  const iconElement = document.createElement('i');
  iconElement.setAttribute('class', `fa-solid fa-${icon}`);
  const p = document.createElement('p');
  p.style.marginLeft = '20px';
  p.textContent = message;
  notification.append(iconElement, p);

  document.body.append(notification);

  setTimeout(() => {
    notification.classList.add('slide-in');
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

export function logoutHandler() {
  document.querySelector('#logoutButton').addEventListener('click', () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    window.location.href = '/';
  });
}

export function sidebarHandler() {
  document.querySelector('#menuIcon').addEventListener('click', () => {
    document.querySelector('#sidebar').classList.add('fade');
    document.querySelector('#sidebar').style.opacity = 1;
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('#controlButtons')) {
      document.querySelector('#sidebar').style.opacity = 0;
    }
  });
}

export function dayHandler() {
  const today = new Date().toLocaleString('en-us', { weekday: 'short' });
  const todayElement = document.getElementById(today);
  if (todayElement) {
    todayElement.style.color = '#b67806';
  }
}

export function activateWorkoutMenus() {
  document.querySelector('#leftControls').addEventListener('click', () => {
    document.querySelector('#inWorkSettings').classList.add('fade');
    document.querySelector('#inWorkSettings').style.opacity = 1;
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#leftControls')) {
      document.querySelector('#inWorkSettings').style.opacity = 0;
    }
  });

  document.querySelector('#arrow').addEventListener('click', () => {
    document.querySelector('#sidebar2').classList.add('fade');
    document.querySelector('#sidebar2').style.opacity = 1;
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#arrow')) {
      document.querySelector('#sidebar2').style.opacity = 0;
    }
  });

  document.querySelector('#shareWorkout').addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'overlayStyle';
    const text = document.createElement('h1');
    text.textContent = 'Share this workout with your friends!';
    text.className = 'overlayTextStyle';
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = window.location.href;
    inputField.readOnly = true;
    inputField.className = 'overlayInputFieldStyle';

    const socialMediaContainer = document.createElement('div');
    socialMediaContainer.className = 'socialMediaContainerStyle';

    const facebookButton = createSocialButton('Facebook', "<i class='fab fa-facebook-f'></i>");
    const instagramButton = createSocialButton('Instagram', "<i class='fab fa-instagram'></i>");
    const snapchatButton = createSocialButton('Snapchat', "<i class='fab fa-snapchat-ghost'></i>");

    socialMediaContainer.appendChild(facebookButton);
    socialMediaContainer.appendChild(instagramButton);
    socialMediaContainer.appendChild(snapchatButton);

    overlay.appendChild(text);
    overlay.appendChild(inputField);
    overlay.appendChild(socialMediaContainer);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => overlay.remove());
    inputField.addEventListener('click', (e) => e.stopPropagation());
  });

  function createSocialButton(platform, iconHTML) {
    const button = document.createElement('button');
    button.className = 'buttonStyle1';
    button.innerHTML = iconHTML;
    button.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Share this workout!',
          url: window.location.href,
        }).then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        console.log(`Share on ${platform}`);
      }
    });
    return button;
  }
}
