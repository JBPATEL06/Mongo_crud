const addUserBtn = document.getElementById('addUserBtn');
const userDialog = document.getElementById('userDialog');
const cancelBtn = document.getElementById('cancelBtn');
const userTable = document.getElementById('showUser');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const form = document.getElementById('userForm');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('site-search');

let pageNo = 1;
let isEditMode = false; 
let currentEditEmail = null; 

addUserBtn.addEventListener('click', () => {
    isEditMode = false;
    currentEditEmail = null;
    let emailField = document.getElementById('email');
    emailField.disabled = false;
    form.reset();
    userDialog.showModal();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit();
});

const handleFormSubmit = async () => {
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
        !/^\d{10}$/.test(phone)
            ? 'Enter valid 10-digit phone'
            : '';

    if (
        username.length >= 3 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 
        /^\d{10}$/.test(phone)
    ) {
        try {
            const formData = new FormData(form);

            const url = isEditMode ? `/updateUser/${currentEditEmail}` : '/createUser';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert(isEditMode ? 'User updated successfully!' : 'User created successfully!');
                form.reset();
                userDialog.close();
                fetchUsers(); 
            } else {
                alert(result.message || 'Operation failed');
            }
        } catch (error) {
            console.error('API error:', error);
            alert('Unable to connect to the server');
        }
    }
};

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
        isEditMode = true;
        const email = e.target.getAttribute('data-email');
        currentEditEmail = email;
        console.log('Edit clicked for user email:', email);
        
        try {
            const user_data = await fetch(`/findOneUser/${email}`);
            const userData = await user_data.json();
            
            let form_email = document.getElementById('email');
            let form_username = document.getElementById('username'); 
            let form_phone = document.getElementById('phone');
            
            form_email.value = userData.email;
            form_email.disabled = true; 
            form_username.value = userData.username; 
            form_phone.value = userData.phone;
            
            userDialog.showModal();
        } catch (err) {
            console.error('Error loading user data:', err);
        }
    }

    if (e.target.classList.contains('btn-danger')) {
        const email = e.target.getAttribute('data-email').trim();
        console.log('Delete clicked for user email:', email);  

        try {
            const response = await fetch(`/deleteUser/${email}`, { method: 'DELETE' });
            const deleteResult = await response.json();
            if (response.ok) {
                alert('User Deleted Successfully');
                fetchUsers();
            } else {       
                alert(deleteResult.message || 'Failed to delete user');
            }
        } catch (err) {
            console.error('API error:', err);
        }
    }
});




searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    try {
        const response = await fetch(`/search?q=${encodeURIComponent(searchTerm)}`);
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
        } else {
            userTable.innerHTML += `<tr><td colspan="6" style="text-align: center;">No matching users found</td></tr>`;
        }
    } catch (error) {
        console.error('Search error:', error);
    }
});

searchInput.addEventListener('input', (e) => {
    if (e.target.value.trim() === '') {
        pageNo = 1;
        fetchUsers();
    }
});