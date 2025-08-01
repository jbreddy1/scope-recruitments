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
    accommodationType: {
        type: String,
        required: [true, 'Accommodation type is required'],
        enum: ['dayScholar', 'hosteller']
    },

    // Academic Information
    currentSemester: {
        type: Number,
        required: [true, 'Current semester is required'],
        min: [1, 'Semester must be at least 1'],
        max: [8, 'Semester cannot exceed 8']
    },
    branch: {
        type: String,
        required: [true, 'Branch and section is required'],
        trim: true
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
        enum: ['technical', 'graphic-designing', 'photography-videography', 'external-affairs']
    },

    // Personal Introduction
    introduceYourself: {
        type: String,
        required: [true, 'Self introduction is required'],
        trim: true,
        maxlength: [1000, 'Introduction cannot exceed 1000 characters']
    },

    // Social Links (Optional)
    githubLink: {
        type: String,
        trim: true
    },
    linkedinLink: {
        type: String,
        trim: true
    },

    // Department-specific questions (only created for selected department)
    technicalQuestions: {
        whyTechnicalTeam: {
            type: String,
            required: function() { return this.department === 'technical'; }
        },
        technicalSkills: {
            type: String,
            required: function() { return this.department === 'technical'; }
        },
        projectsWorkedOn: {
            type: String,
            required: function() { return this.department === 'technical'; }
        },
        projectLinks: {
            type: String,
            required: function() { return this.department === 'technical'; }
        },
        technicalSkillsRating: {
            type: Number,
            required: function() { return this.department === 'technical'; },
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating cannot exceed 10']
        }
    },

    graphicQuestions: {
        whyGraphicDesigning: {
            type: String,
            required: function() { return this.department === 'graphic-designing'; }
        },
        graphicDesigningSkills: {
            type: String,
            required: function() { return this.department === 'graphic-designing'; }
        },
        toolsUsed: {
            type: String,
            required: function() { return this.department === 'graphic-designing'; }
        },
        portfolioLink: {
            type: String,
            required: function() { return this.department === 'graphic-designing'; }
        },
        graphicDesigningSkillsRating: {
            type: Number,
            required: function() { return this.department === 'graphic-designing'; },
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating cannot exceed 10']
        }
    },

    photographyQuestions: {
        whyPhotographyVideography: {
            type: String,
            required: function() { return this.department === 'photography-videography'; }
        },
        editingTools: {
            type: String,
            required: function() { return this.department === 'photography-videography'; }
        },
        shootingDevices: {
            type: [String],
            required: function() { return this.department === 'photography-videography'; }
        },
        photoVideoWorks: {
            type: [String],
            required: function() { return this.department === 'photography-videography'; }
        },
        portfolioLink: {
            type: String,
            required: function() { return this.department === 'photography-videography'; }
        },
        photographyVideographySkillsRating: {
            type: Number,
            required: function() { return this.department === 'photography-videography'; },
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating cannot exceed 10']
        }
    },

    externalAffairsQuestions: {
        whyExternalAffairs: {
            type: String,
            required: function() { return this.department === 'external-affairs'; }
        },
        externalAffairsRole: {
            type: [String],
            required: function() { return this.department === 'external-affairs'; }
        },
        relevantSkills: {
            type: String,
            required: function() { return this.department === 'external-affairs'; }
        },
        previousWorkExperience: {
            type: String,
            required: function() { return this.department === 'external-affairs'; }
        },
        workPortfolioLinks: {
            type: String,
            required: function() { return this.department === 'external-affairs'; }
        },
        communicationSkillsRating: {
            type: Number,
            required: function() { return this.department === 'external-affairs'; },
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating cannot exceed 10']
        }
    },

    // Common questions
    whyScopeClub: {
        type: String,
        required: function() {
            return this.awsClubPreference === 'no';
        }
    },
    whyAwsClub: {
        type: String,
        required: function() {
            return this.awsClubPreference === 'yes';
        }
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
    
    if (dept === 'technical') {
        if (!this.technicalQuestions.whyTechnicalTeam || 
            !this.technicalQuestions.technicalSkills || 
            !this.technicalQuestions.projectsWorkedOn || 
            !this.technicalQuestions.projectLinks || 
            !this.technicalQuestions.technicalSkillsRating) {
            return next(new Error('All technical questions are required'));
        }
    } else if (dept === 'graphic-designing') {
        if (!this.graphicQuestions.whyGraphicDesigning || 
            !this.graphicQuestions.graphicDesigningSkills || 
            !this.graphicQuestions.toolsUsed || 
            !this.graphicQuestions.portfolioLink || 
            !this.graphicQuestions.graphicDesigningSkillsRating) {
            return next(new Error('All graphic designing questions are required'));
        }
    } else if (dept === 'photography-videography') {
        if (!this.photographyQuestions.whyPhotographyVideography || 
            !this.photographyQuestions.editingTools || 
            !this.photographyQuestions.shootingDevices || 
            !this.photographyQuestions.photoVideoWorks || 
            !this.photographyQuestions.portfolioLink || 
            !this.photographyQuestions.photographyVideographySkillsRating) {
            return next(new Error('All photography & videography questions are required'));
        }
        
        // Check if shootingDevices and photoVideoWorks arrays have at least one element
        if (!this.photographyQuestions.shootingDevices || this.photographyQuestions.shootingDevices.length === 0) {
            return next(new Error('At least one shooting device must be selected'));
        }
        
        if (!this.photographyQuestions.photoVideoWorks || this.photographyQuestions.photoVideoWorks.length === 0) {
            return next(new Error('At least one photo/video work type must be selected'));
        }
    } else if (dept === 'external-affairs') {
        if (!this.externalAffairsQuestions?.whyExternalAffairs || 
            !this.externalAffairsQuestions?.externalAffairsRole || 
            !this.externalAffairsQuestions?.relevantSkills || 
            !this.externalAffairsQuestions?.previousWorkExperience || 
            !this.externalAffairsQuestions?.workPortfolioLinks || 
            !this.externalAffairsQuestions?.communicationSkillsRating) {
            return next(new Error('All external affairs questions are required'));
        }
        
        // Check if externalAffairsRole array has at least one element
        if (!this.externalAffairsQuestions.externalAffairsRole || this.externalAffairsQuestions.externalAffairsRole.length === 0) {
            return next(new Error('At least one external affairs role must be selected'));
        }
    }
    
    next();
});

module.exports = mongoose.model('Application', applicationSchema); 