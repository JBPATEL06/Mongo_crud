const addUserBtn = document.getElementById('addUserBtn');
const userDialog = document.getElementById('userDialog');
const cancelBtn = document.getElementById('cancelBtn');
const userTable = document.getElementById('showUser');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

let pageNo = 1;

addUserBtn.addEventListener('click', () => {
    userDialog.showModal();
});



const form = document.getElementById('userForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let username = document.getElementById('username').value.trim();
    let email = document.getElementById('email').value.trim();
    let phone = document.getElementById('phone').value.trim();

    document.getElementById('nameError').textContent =
        username.length < 3 ? 'Name must be at least 3 characters' : '';

    document.getElementById('emailError').textContent =
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ? 'Enter valid email'
            : '';

    document.getElementById('phoneError').textContent =
       /^\d{10}$/.test(phone)
            ? 'Enter valid 10-digit phone'
            : '';

    if (
        username.length >= 3 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && /^[6-9]\d{9}$/.test(phone)
    ) {
        try {
            const formData = new FormData(form);

            const response = await fetch('/createUser', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert('User created successfully!');
                form.reset();
                userDialog.close();
                fetchUsers(); 
            } else {
                alert(result.message || 'Failed to create user');
            }
        } catch (error) {
            console.error('API error:', error);
            alert('Unable to connect to the server');
        }
    }
});

cancelBtn.addEventListener('click', () => {
    form.reset();
    userDialog.close();
});




const updatePaginationUI = () => {
    pageInfo.textContent = `Page: ${pageNo}`;
    prevBtn.disabled = pageNo <= 1;
};

const fetchUsers = async () => {
    try {
        const response = await fetch('/users?page=' + pageNo);
        const users = await response.json();

        userTable.innerHTML = `
            <tr>
                <th>UserName</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Image</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        `;

        if (Array.isArray(users) && users.length > 0) {
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.userProfile ? `<img src="/${user.userProfile}" width="40" height="40" style="object-fit: cover; border-radius: 50%;">` : 'No Image'}</td>
                    <td><button class="btn btn-sm btn-warning" data-email="${user.email}">Edit</button></td>
                    <td><button class="btn btn-sm btn-danger" data-email="${user.email}">Delete</button></td>
                `;
                userTable.appendChild(row);
            });
        } else if (pageNo > 1) {
            pageNo--;
            fetchUsers();
            return;
        }
        updatePaginationUI();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

prevBtn.addEventListener('click', () => {
    if (pageNo > 1) {
        pageNo--;
        fetchUsers();
    }
});

nextBtn.addEventListener('click', () => {
    pageNo++;
    fetchUsers();
});

fetchUsers();

userTable.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-warning')) {

        const email = e.target.getAttribute('data-email');
        console.log('Edit clicked for user email:', email);
        userDialog.showModal();
    const user_data = await fetch(`/findOneUser/${email}`);
    const userData =  await user_data.json();
    let form_email = document.getElementById('email');
    let form_username =  document.getElementById('username'); 
    let form_phone = document.getElementById('phone');
    form_email.value = userData.email;
    form_email.disabled = true;
    form_username.value = userData.username; 
    form_phone.value = userData.phone;
        
     
    }

    if (e.target.classList.contains('btn-danger')) {
        const email = e.target.getAttribute('data-email').trim();
        console.log('Delete clicked for user email:', email);  

        try{
        const response = await fetch(`/deleteUser/${email}`,{method : 'DELETE'});
        const deleteResult = await response.json();
        if(response.ok){
            alert('User Deleted Successfully');
        }
        else{       
            alert('deleteResult.message' || 'Failed to delete user')
        }
    }
    catch(err){
        console.error('API error:', err);
    }

    fetchUsers();
}

});
