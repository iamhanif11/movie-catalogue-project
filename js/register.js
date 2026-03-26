document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmError = document.getElementById('confirmError');

    function showError(element, message){
        if (element){
            element.textContent = message;
            element.classList.remove('invisible');
        }
    }

    function hideAllErrors(){
        if(emailError) emailError.classList.add('invisible');
        if(passwordError) passwordError.classList.add('invisible');
        if(confirmError) confirmError.classList.add('invisible');
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return regex.test(email);
    }

    function saveUser(newUser){
        let users = localStorage.getItem('users')
        if (users){
            users = JSON.parse(users)
        } else {
            users = []
        }

        const existing = users.find(user => user.email === newUser.email)
        if (existing) {
            showError(emailError, 'User already exist! ')
            return false;
        }

        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))
        return true;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            hideAllErrors();

            const email = emailInput.value.trim()
            const password = passwordInput.value.trim()
            const confirm = confirmInput.value.trim()

            let isValid = true;

            if(!email){
                showError(emailError, 'Email is required. ')
                isValid = false; 
            } else if (!isValidEmail(email)) {
                showError(emailError, 'Invalid email format')
                isValid = false;
            }

            if(!password) {
                showError(passwordError, 'Password is required. ')
                isValid = false;
            } else if (password.length < 6) {
                showError(passwordError, 'Password must be at least 6 characters. ')
                isValid = false;
            }

            if (!confirm) {
                showError(confirmError, 'Please confirm your password. ')
                isValid = false;
            } else if (password !== confirm) {
                showError(confirmError, 'Password no match. ')
                isValid = false;
            }

            if (isValid) {
                const saved = saveUser({email, password})
                if (saved){
                    window.location.href = 'login.html';
                }
            }
            })
        })


