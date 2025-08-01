const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    // Personal Information
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    rollNumber: {
        type: String,
        required: [true, 'Roll number is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^[^\s@]+@mlrit\.ac\.in$/, 'Please enter a valid @mlrit.ac.in email address'],
        lowercase: true,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'],
        trim: true
    },

    // Academic Information
    currentSemester: {
        type: Number,
        required: [true, 'Current semester is required'],
        min: [1, 'Semester must be at least 1'],
        max: [8, 'Semester cannot exceed 8']
    },
    currentCGPA: {
        type: Number,
        required: [true, 'Current CGPA is required'],
        min: [0, 'CGPA cannot be negative'],
        max: [10, 'CGPA cannot exceed 10']
    },
    numberOfBacklogs: {
        type: Number,
        required: [true, 'Number of backlogs is required'],
        min: [0, 'Number of backlogs cannot be negative']
    },

    // Department Selection
    department: {
        type: String,
        required: [true, 'Department selection is required'],
        enum: ['Technical', 'Graphic Designing', 'Photography & Videography', 'External Affairs (Content, Promotion, Operations)']
    },

    // Department-specific questions
    technicalQuestions: {
        whyTechnicalTeam: {
            type: String,
            required: function() { return this.department === 'Technical'; }
        },
        technicalSkills: {
            type: String,
            required: function() { return this.department === 'Technical'; }
        },
        projectsWorkedOn: {
            type: String,
            required: function() { return this.department === 'Technical'; }
        },
        projectLinks: {
            type: String,
            required: function() { return this.department === 'Technical'; }
        },
        technicalSkillsRating: {
            type: Number,
            required: function() { return this.department === 'Technical'; },
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating cannot exceed 10']
        }
    },

    graphicQuestions: {
        whyGraphicDesigning: {
            type: String,
            required: function() { return this.department === 'Graphic Designing'; }
        },
        graphicDesigningSkills: {
            type: String,
            required: function() { return this.department === 'Graphic Designing'; }
        },
        toolsUsed: {
            type: String,
            required: function() { return this.department === 'Graphic Designing'; }
        },
        portfolioLink: {
            type: String,
            required: function() { return this.department === 'Graphic Designing'; }
        },
        graphicDesigningSkillsRating: {
            type: Number,
            required: function() { return this.department === 'Graphic Designing'; },
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating cannot exceed 10']
        }
    },

    photographyQuestions: {
        whyPhotographyVideography: {
            type: String,
            required: function() { return this.department === 'Photography & Videography'; }
        },
        photographyVideographySkills: {
            type: String,
            required: function() { return this.department === 'Photography & Videography'; }
        },
        equipmentOwned: {
            type: String,
            required: function() { return this.department === 'Photography & Videography'; }
        },
        portfolioLink: {
            type: String,
            required: function() { return this.department === 'Photography & Videography'; }
        },
        photographyVideographySkillsRating: {
            type: Number,
            required: function() { return this.department === 'Photography & Videography'; },
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating cannot exceed 10']
        }
    },

    externalAffairsQuestions: {
        whyExternalAffairs: {
            type: String,
            required: function() { return this.department === 'External Affairs (Content, Promotion, Operations)'; }
        },
        communicationSkills: {
            type: String,
            required: function() { return this.department === 'External Affairs (Content, Promotion, Operations)'; }
        },
        previousExperience: {
            type: String,
            required: function() { return this.department === 'External Affairs (Content, Promotion, Operations)'; }
        },
        socialMediaHandles: {
            type: String,
            required: function() { return this.department === 'External Affairs (Content, Promotion, Operations)'; }
        },
        communicationSkillsRating: {
            type: Number,
            required: function() { return this.department === 'External Affairs (Content, Promotion, Operations)'; },
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating cannot exceed 10']
        }
    },

    // Common question
    whyScopeClub: {
        type: String,
        required: [true, 'Why SCOPE Club question is required']
    },
    awsClubPreference: {
        type: String,
        required: [true, 'AWS Club preference is required'],
        enum: ['yes', 'no']
    },

    // Application metadata
    applicationStatus: {
        type: String,
        enum: ['Pending', 'Under Review', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

// Index for better query performance
applicationSchema.index({ email: 1, rollNumber: 1 });
applicationSchema.index({ department: 1, applicationStatus: 1 });
applicationSchema.index({ submittedAt: -1 });

// Pre-save middleware to validate department-specific questions
applicationSchema.pre('save', function(next) {
    const dept = this.department;
    
    if (dept === 'Technical') {
        if (!this.technicalQuestions.whyTechnicalTeam || 
            !this.technicalQuestions.technicalSkills || 
            !this.technicalQuestions.projectsWorkedOn || 
            !this.technicalQuestions.projectLinks || 
            !this.technicalQuestions.technicalSkillsRating) {
            return next(new Error('All technical questions are required'));
        }
    } else if (dept === 'Graphic Designing') {
        if (!this.graphicQuestions.whyGraphicDesigning || 
            !this.graphicQuestions.graphicDesigningSkills || 
            !this.graphicQuestions.toolsUsed || 
            !this.graphicQuestions.portfolioLink || 
            !this.graphicQuestions.graphicDesigningSkillsRating) {
            return next(new Error('All graphic designing questions are required'));
        }
    } else if (dept === 'Photography & Videography') {
        if (!this.photographyQuestions.whyPhotographyVideography || 
            !this.photographyQuestions.photographyVideographySkills || 
            !this.photographyQuestions.equipmentOwned || 
            !this.photographyQuestions.portfolioLink || 
            !this.photographyQuestions.photographyVideographySkillsRating) {
            return next(new Error('All photography & videography questions are required'));
        }
    } else if (dept === 'External Affairs (Content, Promotion, Operations)') {
        if (!this.externalAffairsQuestions.whyExternalAffairs || 
            !this.externalAffairsQuestions.communicationSkills || 
            !this.externalAffairsQuestions.previousExperience || 
            !this.externalAffairsQuestions.socialMediaHandles || 
            !this.externalAffairsQuestions.communicationSkillsRating) {
            return next(new Error('All external affairs questions are required'));
        }
    }
    
    next();
});

module.exports = mongoose.model('Application', applicationSchema); 