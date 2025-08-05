const formEl = document.querySelector('form');
const nameInputEl = document.getElementById('username-input');
const errorEl = document.getElementById('error-message');

const userDataEl = document.getElementById('user-data');

const avatarImg = document.querySelector('#icon img');
const nameEl = document.getElementById('name');
const usernameEl = document.getElementById('username');
const bioEl = document.getElementById('bio');
const statsEl = Array.from(document.querySelectorAll('#stats > div'));
const contactsAnchor = Array.from(document.querySelectorAll('#contacts a'));
const createdEl = document.querySelector('#extras div:first-child');
const locationEl = document.querySelector('#extras div:nth-child(2)');

userDataEl.classList.add('hidden');

function normaliseBlogUrl(url) {
  if(!url) return null;
  try {
    if(!/^https?:\/\//i.test(url)) url = 'http://' + url;
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    return null;
  }
}

function formatDate(dateStr) {
  if(!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {day: 'numeric', month: 'long', year: 'numeric'});
}

function showLoading() {
  avatarImg.src = '';
  nameEl.textContent = 'Loading...';
  usernameEl.textContent = '';
  bioEl.textContent = '';
  statsEl.forEach(s => s.textContent = '-');
  contactsAnchor.forEach(a => {
    a.href = '#';
    a.textContent = '-';
  });
  errorEl.textContent = '';
}

function showUserNotFound() {
  errorEl.textContent = 'User not found. Please check the username.';
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = nameInputEl.value.trim();
  if(!username) {
    errorEl.textContent = 'Please enter a GitHub username.';
    return;
  }

  showLoading();

  const url = `https://api.github.com/users/${encodeURIComponent(username)}`;

  try {
    const res = await fetch(url);
    if(res.status === 404) {
      showUserNotFound();
      return;
    }
    if(res.status === 403) {
      const rateText = 'Request Blocked, you may have hit the GitHub rate limit. Try again later or use an authenticated request.';
      errorEl.textContent = rateText;
      return;
    }
    if(!res.ok) {
      throw new Error('Network error: ' + res.status);
    }
    userDataEl.classList.remove('hidden');
    const data = await res.json();

    avatarImg.src = data.avatar_url || '';
    avatarImg.alt = `${data.login}'s avatar`;
    nameEl.textContent = data.name || data.login || 'No name';
    usernameEl.textContent = data.login ? '@' + data.login : '-';
    bioEl.textContent = data.bio || 'No bio available';
    statsEl[0].textContent = `Followers: ${data.followers ?? '-'}`;
    statsEl[1].textContent = `Following: ${data.following ?? '-'}`;
    statsEl[2].textContent = `Public Repos: ${data.public_repos ?? '-'}`;
    statsEl[3].textContent = `Public Gists: ${data.public_gists ?? '-'}`;

    contactsAnchor[0].href = data.html_url || '#';
    contactsAnchor[0].textContent = data.html_url || '-';

    const blog = normaliseBlogUrl(data.blog);
    contactsAnchor[1].href = blog || '#';
    contactsAnchor[1].textContent = blog ? (new URL(blog).hostname) : '-';

    contactsAnchor[2].href = data.twitter_username ? `https://twitter.com/${data.twitter_username}` : '#';
    contactsAnchor[2].textContent = data.twitter_username ? '@' + data.twitter_username : '-';

    createdEl.innerHTML = `Created At: <span class="small">${formatDate(data.created_at)}</span>`;
    locationEl.innerHTML = `Location: <span class="small">${data.location || '-'}</span>`;

    
  } catch (err) {
    userDataEl.classList.add('hidden');
    console.error(err);
    errorEl.textContent = 'Something Went Wrong. Please try again.';
  }
})