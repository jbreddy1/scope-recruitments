// Global variables
let currentStep = 1;
const totalSteps = 2;
let isSubmitting = false;

console.log('Script.js loaded successfully');

// Initialize recruitment process
function initializeRecruitment() {
    console.log('Initializing recruitment process...');
    const landingSection = document.getElementById('landingSection');
    const applicationForm = document.getElementById('applicationForm');
    
    if (landingSection && applicationForm) {
        landingSection.style.display = 'none';
        applicationForm.style.display = 'block';
        console.log('Switched from landing to application form');
    } else {
        console.error('Landing section or application form not found');
    }
}

// Multi-step form functions
function showStep(step) {
    console.log('showStep called with step:', step);
    // Hide all steps
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show current step
    const stepElement = document.querySelector(`.step-${step}`);
    if (stepElement) {
        stepElement.style.display = 'block';
    } else {
        console.error('Step element not found for step:', step);
    }
    
    // Update buttons
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (step === 1) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.style.float = 'right';
        prevBtn.style.display = 'none';
        submitBtn.style.display = 'none';
    } else if (step === totalSteps) {
        nextBtn.style.display = 'none';
        prevBtn.style.display = 'inline-flex';
        prevBtn.style.float = 'left';
        submitBtn.style.display = 'inline-flex';
        submitBtn.style.float = 'right';
    } else {
        nextBtn.style.display = 'inline-flex';
        nextBtn.style.float = 'right';
        prevBtn.style.display = 'inline-flex';
        prevBtn.style.float = 'left';
        submitBtn.style.display = 'none';
    }
}

function updateStepIndicator() {
    console.log('updateStepIndicator called');
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            dot.classList.add('completed');
        } else if (index + 1 === currentStep) {
            dot.classList.add('active');
        }
    });
}

function validateCurrentStep() {
    console.log('validateCurrentStep called for step:', currentStep);
    const currentStepElement = document.querySelector(`.step-${currentStep}`);
    if (!currentStepElement) {
        console.error('Current step element not found');
        return false;
    }
    
    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize recruitment button
    const initializeBtn = document.getElementById('initializeBtn');
    if (initializeBtn) {
        initializeBtn.addEventListener('click', function() {
            console.log('Initialize recruitment button clicked');
            const landingSection = document.getElementById('landingSection');
            const applicationForm = document.getElementById('applicationForm');
            
            if (landingSection && applicationForm) {
                landingSection.style.display = 'none';
                applicationForm.style.display = 'block';
                console.log('Switched from landing to application form');
            } else {
                console.error('Landing section or application form not found');
            }
        });
        console.log('Initialize button event listener attached');
    }
    
    const form = document.getElementById('recruitmentForm');
    const submitBtn = document.getElementById('submitBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    console.log('Form elements found:', {
        form: !!form,
        submitBtn: !!submitBtn,
        nextBtn: !!nextBtn,
        prevBtn: !!prevBtn
    });

    // Multi-step form navigation
    nextBtn.addEventListener('click', function() {
        console.log('Next button clicked');
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
                updateStepIndicator();
            }
        }
    });

    prevBtn.addEventListener('click', function() {
        console.log('Previous button clicked');
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            updateStepIndicator();
        }
    });

    // Add click event listener for submit button
    submitBtn.addEventListener('click', function(e) {
        console.log('Submit button clicked');
        e.preventDefault();
        
        if (!isSubmitting && validateForm()) {
            console.log('Form validation passed, calling submitApplication');
            submitApplication();
        } else {
            console.log('Form validation failed or already submitting');
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    console.log('Event listeners attached successfully');
    

});

// Form validation
function validateForm() {
    let isValid = true;
    const form = document.getElementById('recruitmentForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput.value && !isValidEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid @mlrit.ac.in email address');
        isValid = false;
    }

    // Mobile number validation
    const mobileInput = document.getElementById('mobileNumber');
    if (mobileInput.value) {
        const mobilePattern = /^[0-9]{10}$/;
        if (!mobilePattern.test(mobileInput.value)) {
            showFieldError(mobileInput, 'Mobile number must be exactly 10 digits');
            isValid = false;
        }
    }

    // AWS Club preference validation
    const awsClubRadios = document.querySelectorAll('input[name="awsClubPreference"]');
    const awsClubSelected = Array.from(awsClubRadios).some(radio => radio.checked);
    if (!awsClubSelected) {
        showFieldError(awsClubRadios[0], 'Please select your AWS Club preference');
        isValid = false;
    }

    // Dynamic club question validation
    const awsPreference = document.querySelector('input[name="awsClubPreference"]:checked')?.value;
    if (awsPreference === 'yes') {
        const whyAwsTextarea = document.getElementById('whyAwsClub');
        if (whyAwsTextarea && !whyAwsTextarea.value.trim()) {
            showFieldError(whyAwsTextarea, 'Please tell us why you want to join AWS Club');
            isValid = false;
        }
    } else if (awsPreference === 'no') {
        const whyScopeTextarea = document.getElementById('whyScope');
        if (whyScopeTextarea && !whyScopeTextarea.value.trim()) {
            showFieldError(whyScopeTextarea, 'Please tell us why you want to join SCOPE Club');
            isValid = false;
        }
    }

    // CGPA validation
    const cgpaInput = document.getElementById('cgpa');
    if (cgpaInput.value) {
        const cgpa = parseFloat(cgpaInput.value);
        if (cgpa < 0 || cgpa > 10) {
            showFieldError(cgpaInput, 'CGPA must be between 0 and 10');
            isValid = false;
        }
    }

    // Backlogs validation
    const backlogsInput = document.getElementById('backlogs');
    if (backlogsInput.value) {
        const backlogs = parseInt(backlogsInput.value);
        if (backlogs < 0) {
            showFieldError(backlogsInput, 'Number of backlogs cannot be negative');
            isValid = false;
        }
    }

    // Department-specific validation
    const departmentSelect = document.getElementById('department');
    if (departmentSelect.value === 'technical') {
        const technicalFields = ['whyTechnical', 'technicalSkills', 'projectsWorkedOn', 'projectLinks', 'technicalSkillsRating'];
        technicalFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                showFieldError(field, 'This field is required for Technical department');
                isValid = false;
            }
        });
    } else if (departmentSelect.value === 'graphic-designing') {
        const graphicFields = ['whyGraphic', 'graphicSkills', 'graphicPortfolio', 'graphicLinks', 'graphicSkillsRating'];
        graphicFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                showFieldError(field, 'This field is required for Graphic Designing department');
                isValid = false;
            }
        });
    } else if (departmentSelect.value === 'photography-videography') {
        const photographyFields = ['whyPhotography', 'photographySkills', 'photographyPortfolio', 'photographyLinks', 'photographySkillsRating'];
        photographyFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                showFieldError(field, 'This field is required for Photography & Videography department');
                isValid = false;
            }
        });
    } else if (departmentSelect.value === 'external-affairs') {
        const externalAffairsFields = ['whyExternalAffairs', 'externalAffairsSkills', 'externalAffairsExperience', 'externalAffairsLinks', 'externalAffairsSkillsRating'];
        externalAffairsFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                showFieldError(field, 'This field is required for External Affairs department');
                isValid = false;
            }
        });
    }

    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid @mlrit.ac.in email address');
        return false;
    }

    // Mobile number validation
    if (field.type === 'tel' && value) {
        const mobilePattern = /^[0-9]{10}$/;
        if (!mobilePattern.test(value)) {
            showFieldError(field, 'Mobile number must be exactly 10 digits');
            return false;
        }
    }

    // Backlogs validation
    if (field.id === 'backlogs' && value) {
        const backlogs = parseInt(value);
        if (backlogs < 0) {
            showFieldError(field, 'Number of backlogs cannot be negative');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e53e3e;
        font-size: 12px;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    
    const errorIcon = document.createElement('i');
    errorIcon.className = 'fas fa-exclamation-circle';
    errorDiv.insertBefore(errorIcon, errorDiv.firstChild);
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e53e3e';
}

// Clear field error
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '#e2e8f0';
}

// Email validation
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@mlrit\.ac\.in$/;
    return emailPattern.test(email);
}

// Submit application
async function submitApplication() {
    console.log('submitApplication function called');
    
    if (isSubmitting) {
        console.log('Already submitting, preventing double submission');
        return;
    }
    
    console.log('Starting form submission...');
    
    const submitBtn = document.querySelector('.submit-btn');
    if (!submitBtn) {
        console.error('Submit button not found!');
        return;
    }
    
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    isSubmitting = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    try {
        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            rollNumber: document.getElementById('rollNumber').value,
            email: document.getElementById('email').value,
            mobileNumber: document.getElementById('mobileNumber').value,
            academicYear: document.getElementById('academicYear').value,
            branch: document.getElementById('branch').value,
            cgpa: document.getElementById('cgpa').value,
            backlogs: document.getElementById('backlogs').value,
            department: document.getElementById('department').value,
            awsClubPreference: document.querySelector('input[name="awsClubPreference"]:checked')?.value
        };

        // Add dynamic club question based on preference
        const awsPreference = formData.awsClubPreference;
        if (awsPreference === 'yes') {
            formData.whyAwsClub = document.getElementById('whyAwsClub').value;
        } else if (awsPreference === 'no') {
            formData.whyScope = document.getElementById('whyScope').value;
        }

        console.log('Form data collected:', formData);

        // Add department-specific questions
        const department = formData.department;
        if (department === 'technical') {
            formData.technicalQuestions = {
                whyTechnicalTeam: document.getElementById('whyTechnical').value,
                technicalSkills: document.getElementById('technicalSkills').value,
                projectsWorkedOn: document.getElementById('projectsWorkedOn').value,
                projectLinks: document.getElementById('projectLinks').value,
                technicalSkillsRating: document.getElementById('technicalSkillsRating').value
            };
        } else if (department === 'graphic-designing') {
            formData.graphicQuestions = {
                whyGraphicDesigning: document.getElementById('whyGraphic').value,
                graphicDesigningSkills: document.getElementById('graphicSkills').value,
                toolsUsed: document.getElementById('graphicPortfolio').value,
                portfolioLink: document.getElementById('graphicLinks').value,
                graphicDesigningSkillsRating: document.getElementById('graphicSkillsRating').value
            };
        } else if (department === 'photography-videography') {
            formData.photographyQuestions = {
                whyPhotographyVideography: document.getElementById('whyPhotography').value,
                photographyVideographySkills: document.getElementById('photographySkills').value,
                equipmentOwned: document.getElementById('photographyPortfolio').value,
                portfolioLink: document.getElementById('photographyLinks').value,
                photographyVideographySkillsRating: document.getElementById('photographySkillsRating').value
            };
        } else if (department === 'external-affairs') {
            formData.externalAffairsQuestions = {
                whyExternalAffairs: document.getElementById('whyExternalAffairs').value,
                communicationSkills: document.getElementById('externalAffairsSkills').value,
                previousExperience: document.getElementById('externalAffairsExperience').value,
                socialMediaHandles: document.getElementById('externalAffairsLinks').value,
                communicationSkillsRating: document.getElementById('externalAffairsSkillsRating').value
            };
        }

        console.log('Sending data to backend...');

        // Send data to backend
        const response = await fetch('/api/applications/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('Backend response:', result);

        if (result.success) {
            console.log('Submission successful, showing success message');
            showSuccessMessage(result.data);
            
            // Reset form
            document.getElementById('recruitmentForm').reset();
            currentStep = 1;
            showStep(1);
            updateStepIndicator();
            hideAllDepartmentQuestions();
        } else {
            console.log('Submission failed, showing error message');
            showErrorMessage(result.message || 'Failed to submit application');
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        showErrorMessage('Network error. Please check your connection and try again.');
    } finally {
        console.log('Resetting submission state');
        isSubmitting = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Show success message
function showSuccessMessage(applicationData = null) {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 500px;
        margin: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease;
    `;
    
    let applicationDetails = '';
    if (applicationData) {
        applicationDetails = `
            <div style="background: #f7fafc; padding: 15px; border-radius: 10px; margin: 15px 0; text-align: left;">
                <p style="margin: 5px 0; color: #4a5568;"><strong>Application ID:</strong> ${applicationData.applicationId}</p>
                <p style="margin: 5px 0; color: #4a5568;"><strong>Name:</strong> ${applicationData.fullName}</p>
                <p style="margin: 5px 0; color: #4a5568;"><strong>Department:</strong> ${applicationData.department}</p>
                <p style="margin: 5px 0; color: #4a5568;"><strong>Submitted:</strong> ${new Date(applicationData.submittedAt).toLocaleString()}</p>
            </div>
        `;
    }
    
    modalContent.innerHTML = `
        <div style="font-size: 60px; color: #38ef7d; margin-bottom: 20px;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2 style="color: #2d3748; margin-bottom: 15px; font-size: 24px;">Application Submitted Successfully!</h2>
        <p style="color: #718096; margin-bottom: 25px; line-height: 1.6;">
            Thank you for your interest in SCOPE Club! We've received your application and will review it carefully.
            <br><br>
            You'll hear from us soon via email or Instagram.
        </p>
        ${applicationDetails}
        <button onclick="this.closest('.success-modal').remove()" style="
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Close
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Show error message
function showErrorMessage(message) {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 500px;
        margin: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="font-size: 60px; color: #e53e3e; margin-bottom: 20px;">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2 style="color: #2d3748; margin-bottom: 15px; font-size: 24px;">Submission Failed</h2>
        <p style="color: #718096; margin-bottom: 25px; line-height: 1.6;">
            ${message}
        </p>
        <button onclick="this.closest('.error-modal').remove()" style="
            background: linear-gradient(135deg, #e53e3e 0%, #fc8181 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Close
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Department-specific questions function
function showDepartmentQuestions() {
    const departmentSelect = document.getElementById('department');
    const selectedDepartment = departmentSelect.value;
    
    // Hide all department question sections
    hideAllDepartmentQuestions();
    
    // Show questions for selected department
    if (selectedDepartment === 'technical') {
        const technicalQuestions = document.getElementById('technical-questions');
        if (technicalQuestions) {
            technicalQuestions.style.display = 'block';
        }
    } else if (selectedDepartment === 'graphic-designing') {
        const graphicQuestions = document.getElementById('graphic-questions');
        if (graphicQuestions) {
            graphicQuestions.style.display = 'block';
        }
    } else if (selectedDepartment === 'photography-videography') {
        const photographyQuestions = document.getElementById('photography-questions');
        if (photographyQuestions) {
            photographyQuestions.style.display = 'block';
        }
    } else if (selectedDepartment === 'external-affairs') {
        const externalAffairsQuestions = document.getElementById('external-affairs-questions');
        if (externalAffairsQuestions) {
            externalAffairsQuestions.style.display = 'block';
        }
    }
}

// Hide all department questions
function hideAllDepartmentQuestions() {
    const allDepartmentQuestions = document.querySelectorAll('.department-questions');
    allDepartmentQuestions.forEach(section => {
        section.style.display = 'none';
    });
}

// Toggle club questions based on AWS preference
function toggleClubQuestions() {
    const awsPreference = document.querySelector('input[name="awsClubPreference"]:checked')?.value;
    const awsClubQuestion = document.getElementById('awsClubQuestion');
    const scopeClubQuestion = document.getElementById('scopeClubQuestion');
    
    // Hide both questions first
    if (awsClubQuestion) {
        awsClubQuestion.classList.add('hidden');
        setTimeout(() => {
            awsClubQuestion.style.display = 'none';
        }, 400);
    }
    
    if (scopeClubQuestion) {
        scopeClubQuestion.classList.add('hidden');
        setTimeout(() => {
            scopeClubQuestion.style.display = 'none';
        }, 400);
    }
    
    // Show appropriate question based on selection
    if (awsPreference === 'yes') {
        setTimeout(() => {
            if (awsClubQuestion) {
                awsClubQuestion.style.display = 'block';
                awsClubQuestion.classList.remove('hidden');
                awsClubQuestion.classList.add('showing');
                
                // Make AWS question required
                const whyAwsTextarea = document.getElementById('whyAwsClub');
                if (whyAwsTextarea) {
                    whyAwsTextarea.required = true;
                }
                
                // Remove required from SCOPE question
                const whyScopeTextarea = document.getElementById('whyScope');
                if (whyScopeTextarea) {
                    whyScopeTextarea.required = false;
                }
            }
        }, 450);
    } else if (awsPreference === 'no') {
        setTimeout(() => {
            if (scopeClubQuestion) {
                scopeClubQuestion.style.display = 'block';
                scopeClubQuestion.classList.remove('hidden');
                scopeClubQuestion.classList.add('showing');
                
                // Make SCOPE question required
                const whyScopeTextarea = document.getElementById('whyScope');
                if (whyScopeTextarea) {
                    whyScopeTextarea.required = true;
                }
                
                // Remove required from AWS question
                const whyAwsTextarea = document.getElementById('whyAwsClub');
                if (whyAwsTextarea) {
                    whyAwsTextarea.required = false;
                }
            }
        }, 450);
    }
} 