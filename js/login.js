document.addEventListener('DOMContentLoaded',
function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password')

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    function showError(element, message){
        if (element){
            element.textContent = message
            element.classList.remove('invisible');
        }
    }

    function hideAllErrors(){
        if(emailError) emailError.classList.add('invisible');
        if(passwordError) passwordError.classList.add('invisible');
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return regex.test(email);
    }

    // function checkCredentials(email, password) {
    //     const usersJSON = localStorage.getItem('users')
    //     if(!usersJSON){
    //         return false;
    //     }

    //     const users = JSON.parse(usersJSON);

    //     const found = users.find(user => user.email === email && user.password === password)

    //     return found !== undefined
    // }

    function setLoginSession(email){
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('userEmail', email)
    }
    
    form.addEventListener('submit', function (e){
        e.preventDefault();

        hideAllErrors();

        const email = emailInput.value.trim()
        const password = passwordInput.value.trim()

        let isValid = true

        if(!email) {
            showError(emailError, 'Email is required. ')
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError(emailError, 'Invalid email format. ')
            isValid = false
        }

        if(!password) {
                showError(passwordError, 'Password is required. ')
                isValid = false;
        } else if (password.length < 6) {
                showError(passwordError, 'Password must be at least 6 characters. ')
                isValid = false;
        }

        if(isValid){
            const usersJSON = localStorage.getItem('users')

            if(!usersJSON){
                showError(emailError, 'No registered account. Please Sign Up')
                return;
            }

            const users = JSON.parse(usersJSON)
            const foundUser = users.find(user => user.email === email)

            if(!foundUser){
                showError(emailError, 'Email not registered')
                return;
            }

            if(foundUser.password !== password){
                showError(passwordError, 'Incorrect password')
                return;
            }
            
            setLoginSession(email)
            window.location.href = '../index.html'
        }

        
    })
})