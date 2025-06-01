// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        
        // Add animation effect
        this.themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 300);
    }
    
    updateThemeIcon() {
        if (this.theme === 'dark') {
            this.themeIcon.className = 'fas fa-sun';
        } else {
            this.themeIcon.className = 'fas fa-moon';
        }
    }
}

// Form Validation
class FormValidator {
    constructor() {
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        this.usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    }
    
    validateEmail(email) {
        if (!email) {
            return { isValid: false, message: 'Email is required' };
        }
        if (!this.emailRegex.test(email)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        return { isValid: true, message: '' };
    }
    
    validatePassword(password) {
        if (!password) {
            return { isValid: false, message: 'Password is required' };
        }
        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }
        if (!this.passwordRegex.test(password)) {
            return { 
                isValid: false, 
                message: 'Password must contain uppercase, lowercase, number and special character' 
            };
        }
        return { isValid: true, message: '' };
    }
    
    validateUsername(username) {
        if (!username) {
            return { isValid: false, message: 'Username is required' };
        }
        if (!this.usernameRegex.test(username)) {
            return { 
                isValid: false, 
                message: 'Username must be 3-20 characters, letters, numbers and underscore only' 
            };
        }
        return { isValid: true, message: '' };
    }
    
    validateConfirmPassword(password, confirmPassword) {
        if (!confirmPassword) {
            return { isValid: false, message: 'Please confirm your password' };
        }
        if (password !== confirmPassword) {
            return { isValid: false, message: 'Passwords do not match' };
        }
        return { isValid: true, message: '' };
    }
    
    checkPasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        if (password.length >= 8) score++;
        else feedback.push('At least 8 characters');
        
        if (/[a-z]/.test(password)) score++;
        else feedback.push('Lowercase letter');
        
        if (/[A-Z]/.test(password)) score++;
        else feedback.push('Uppercase letter');
        
        if (/\d/.test(password)) score++;
        else feedback.push('Number');
        
        if (/[@$!%*?&]/.test(password)) score++;
        else feedback.push('Special character');
        
        const strength = ['weak', 'weak', 'fair', 'good', 'strong'][score];
        const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
        
        return { strength, strengthText, score, feedback };
    }
}

// Password Visibility Toggle
class PasswordToggle {
    constructor() {
        this.toggleButtons = document.querySelectorAll('.password-toggle');
        this.init();
    }
    
    init() {
        this.toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => this.togglePassword(e));
        });
    }
    
    togglePassword(e) {
        const button = e.currentTarget;
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
}

// Message System
class MessageSystem {
    constructor() {
        this.messageContainer = document.getElementById('messageContainer');
        this.message = document.getElementById('message');
        this.messageText = this.message.querySelector('.message-text');
        this.messageIcon = this.message.querySelector('.message-icon');
        this.messageClose = document.getElementById('messageClose');
        
        this.init();
    }
    
    init() {
        this.messageClose.addEventListener('click', () => this.hideMessage());
    }
    
    showMessage(text, type = 'success', duration = 5000) {
        this.messageText.textContent = text;
        this.message.className = `message ${type}`;
        
        // Set appropriate icon
        if (type === 'success') {
            this.messageIcon.className = 'fas fa-check-circle message-icon';
        } else if (type === 'error') {
            this.messageIcon.className = 'fas fa-exclamation-circle message-icon';
        }
        
        this.messageContainer.classList.add('show');
        
        // Auto hide after duration
        if (duration > 0) {
            setTimeout(() => this.hideMessage(), duration);
        }
    }
    
    hideMessage() {
        this.messageContainer.classList.remove('show');
    }
}

// Form Manager
class FormManager {
    constructor() {
        this.validator = new FormValidator();
        this.messageSystem = new MessageSystem();
        
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.loginFormElement = document.getElementById('loginFormElement');
        this.signupFormElement = document.getElementById('signupFormElement');
        
        this.showSignupBtn = document.getElementById('showSignup');
        this.showLoginBtn = document.getElementById('showLogin');
        
        this.init();
    }
    
    init() {
        // Form switching
        this.showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSignupForm();
        });
        
        this.showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
        
        // Form submissions
        this.loginFormElement.addEventListener('submit', (e) => this.handleLogin(e));
        this.signupFormElement.addEventListener('submit', (e) => this.handleSignup(e));
        
        // Real-time validation
        this.setupRealTimeValidation();
        
        // Password strength checker
        this.setupPasswordStrength();
    }
    
    showSignupForm() {
        this.loginForm.classList.add('hidden');
        this.signupForm.classList.remove('hidden');
        this.clearAllErrors();
    }
    
    showLoginForm() {
        this.signupForm.classList.add('hidden');
        this.loginForm.classList.remove('hidden');
        this.clearAllErrors();
    }
    
    setupRealTimeValidation() {
        // Login form validation
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');
        
        loginEmail.addEventListener('blur', () => this.validateField(loginEmail, 'email'));
        loginPassword.addEventListener('blur', () => this.validateField(loginPassword, 'password'));
        
        // Signup form validation
        const signupUsername = document.getElementById('signupUsername');
        const signupEmail = document.getElementById('signupEmail');
        const signupPassword = document.getElementById('signupPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        
        signupUsername.addEventListener('blur', () => this.validateField(signupUsername, 'username'));
        signupEmail.addEventListener('blur', () => this.validateField(signupEmail, 'email'));
        signupPassword.addEventListener('blur', () => this.validateField(signupPassword, 'password'));
        confirmPassword.addEventListener('blur', () => this.validateField(confirmPassword, 'confirmPassword'));
        
        // Real-time password confirmation
        confirmPassword.addEventListener('input', () => {
            const password = signupPassword.value;
            const confirm = confirmPassword.value;
            if (confirm) {
                this.validateField(confirmPassword, 'confirmPassword');
            }
        });
    }
    
    setupPasswordStrength() {
        const signupPassword = document.getElementById('signupPassword');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        signupPassword.addEventListener('input', () => {
            const password = signupPassword.value;
            if (password) {
                const strength = this.validator.checkPasswordStrength(password);
                strengthFill.className = `strength-fill ${strength.strength}`;
                strengthText.textContent = `${strength.strengthText} password`;
                
                if (strength.feedback.length > 0 && password.length > 0) {
                    strengthText.textContent += ` (Missing: ${strength.feedback.join(', ')})`;
                }
            } else {
                strengthFill.className = 'strength-fill';
                strengthText.textContent = 'Password strength';
            }
        });
    }
    
    validateField(field, type) {
        const value = field.value.trim();
        const errorElement = document.getElementById(field.id + 'Error');
        let validation;
        
        switch (type) {
            case 'email':
                validation = this.validator.validateEmail(value);
                break;
            case 'password':
                validation = this.validator.validatePassword(value);
                break;
            case 'username':
                validation = this.validator.validateUsername(value);
                break;
            case 'confirmPassword':
                const password = document.getElementById('signupPassword').value;
                validation = this.validator.validateConfirmPassword(password, value);
                break;
            default:
                validation = { isValid: true, message: '' };
        }
        
        this.showFieldError(field, errorElement, validation);
        return validation.isValid;
    }
    
    showFieldError(field, errorElement, validation) {
        if (validation.isValid) {
            field.classList.remove('error');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        } else {
            field.classList.add('error');
            errorElement.textContent = validation.message;
            errorElement.classList.add('show');
        }
    }
    
    clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('input');
        
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.remove('show');
        });
        
        inputElements.forEach(element => {
            element.classList.remove('error');
        });
    }
    
    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Validate all fields
        const emailValid = this.validateField(document.getElementById('loginEmail'), 'email');
        const passwordValid = this.validateField(document.getElementById('loginPassword'), 'password');
        
        if (emailValid && passwordValid) {
            // Simulate login process
            this.simulateLogin(email, password);
        } else {
            this.messageSystem.showMessage('Please fix the errors above', 'error');
        }
    }
    
    handleSignup(e) {
        e.preventDefault();
        
        const username = document.getElementById('signupUsername').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validate all fields
        const usernameValid = this.validateField(document.getElementById('signupUsername'), 'username');
        const emailValid = this.validateField(document.getElementById('signupEmail'), 'email');
        const passwordValid = this.validateField(document.getElementById('signupPassword'), 'password');
        const confirmPasswordValid = this.validateField(document.getElementById('confirmPassword'), 'confirmPassword');
        
        // Check terms agreement
        if (!agreeTerms) {
            this.messageSystem.showMessage('Please agree to the Terms & Conditions', 'error');
            return;
        }
        
        if (usernameValid && emailValid && passwordValid && confirmPasswordValid) {
            // Simulate signup process
            this.simulateSignup(username, email, password);
        } else {
            this.messageSystem.showMessage('Please fix the errors above', 'error');
        }
    }
    
    simulateLogin(email, password) {
        const submitBtn = this.loginFormElement.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Simulate success (in real app, this would depend on API response)
            if (email === 'demo@example.com' && password === 'Demo123!') {
                this.messageSystem.showMessage('Login successful! Welcome back.', 'success');
                // In real app: redirect to dashboard
            } else {
                this.messageSystem.showMessage('Invalid email or password. Try demo@example.com / Demo123!', 'error');
            }
        }, 2000);
    }
    
    simulateSignup(username, email, password) {
        const submitBtn = this.signupFormElement.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Simulate success
            this.messageSystem.showMessage('Account created successfully! Please check your email for verification.', 'success');
            
            // Clear form
            this.signupFormElement.reset();
            this.clearAllErrors();
            
            // Reset password strength indicator
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            strengthFill.className = 'strength-fill';
            strengthText.textContent = 'Password strength';
            
            // Switch to login form after a delay
            setTimeout(() => {
                this.showLoginForm();
            }, 2000);
        }, 2000);
    }
}

// Input Animation Handler
class InputAnimationHandler {
    constructor() {
        this.inputs = document.querySelectorAll('input');
        this.init();
    }
    
    init() {
        this.inputs.forEach(input => {
            // Handle placeholder animation
            input.addEventListener('focus', () => this.handleFocus(input));
            input.addEventListener('blur', () => this.handleBlur(input));
            
            // Check if input has value on page load
            if (input.value) {
                input.classList.add('has-value');
            }
            
            // Monitor value changes
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    }
    
    handleFocus(input) {
        input.parentElement.classList.add('focused');
    }
    
    handleBlur(input) {
        input.parentElement.classList.remove('focused');
    }
}

// Accessibility Handler
class AccessibilityHandler {
    constructor() {
        this.init();
    }
    
    init() {
        // Add keyboard navigation support
        this.setupKeyboardNavigation();
        
        // Add ARIA labels and descriptions
        this.setupAriaLabels();
        
        // Handle focus management
        this.setupFocusManagement();
    }
    
    setupKeyboardNavigation() {
        // Allow Enter key to submit forms
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                const form = e.target.closest('form');
                if (form) {
                    const submitBtn = form.querySelector('.submit-btn');
                    if (submitBtn && !submitBtn.disabled) {
                        submitBtn.click();
                    }
                }
            }
        });
        
        // Allow Escape key to close messages
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const messageContainer = document.getElementById('messageContainer');
                if (messageContainer.classList.contains('show')) {
                    messageContainer.classList.remove('show');
                }
            }
        });
    }
    
    setupAriaLabels() {
        // Add aria-describedby for error messages
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            const errorElement = document.getElementById(input.id + 'Error');
            if (errorElement) {
                input.setAttribute('aria-describedby', errorElement.id);
            }
        });
        
        // Add aria-live for dynamic content
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.setAttribute('aria-live', 'polite');
        messageContainer.setAttribute('aria-atomic', 'true');
    }
    
    setupFocusManagement() {
        // Focus first input when switching forms
        const showSignupBtn = document.getElementById('showSignup');
        const showLoginBtn = document.getElementById('showLogin');
        
        showSignupBtn.addEventListener('click', () => {
            setTimeout(() => {
                document.getElementById('signupUsername').focus();
            }, 100);
        });
        
        showLoginBtn.addEventListener('click', () => {
            setTimeout(() => {
                document.getElementById('loginEmail').focus();
            }, 100);
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        });
        
        // Monitor form interaction performance
        this.monitorFormPerformance();
    }
    
    monitorFormPerformance() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const startTime = performance.now();
                
                // Monitor validation time
                setTimeout(() => {
                    const endTime = performance.now();
                    console.log('Form Validation Time:', endTime - startTime, 'ms');
                }, 0);
            });
        });
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new PasswordToggle();
    new FormManager();
    new InputAnimationHandler();
    new AccessibilityHandler();
    new PerformanceMonitor();
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation completion
    document.body.classList.add('loaded');
    
    // Console welcome message
    console.log('%c🚀 Login/Signup App Loaded Successfully!', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cDemo Credentials:', 'color: #10b981; font-weight: bold;');
    console.log('Email: demo@example.com');
    console.log('Password: Demo123!');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment the following lines if you want to add PWA capabilities
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(registrationError => console.log('SW registration failed'));
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Global Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});