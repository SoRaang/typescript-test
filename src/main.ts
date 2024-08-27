const frmUser = document.getElementById('frmUser') as HTMLFormElement;
const txtName = document.getElementById('txtName');
const txtAddr = document.getElementById('txtAddr');
const txtMail = document.getElementById('txtMail');
const txtDesc = document.getElementById('txtDesc');
const labelDone = document.getElementById('labelDone');
const btnSubmit = document.getElementById('btnSubmit');

let myToken = '';

document.addEventListener('DOMContentLoaded', async () => { // 인증 토큰 받아오기
    const response = await fetch('/api/v1/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'applicaation/json'
        },
        body: JSON.stringify({ username: 'silverwolf' })
    })
    .then(response => response.json())
    .then(result => myToken = result);
});

frmUser?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(frmUser);

    try {
        console.log(myToken);

        const response = await fetch(frmUser.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': myToken
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            labelDone?.classList.add('show');
            frmUser.reset();

            setTimeout(() => {
                labelDone?.classList.remove('show');
            }, 5000);
        }
    } catch(error) {
        console.error(error);
    }
});