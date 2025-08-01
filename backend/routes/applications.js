const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Submit new application
router.post('/submit', async (req, res) => {
    try {
        console.log('Received request body:', JSON.stringify(req.body, null, 2));
        
        const {
            fullName,
            rollNumber,
            email,
            mobileNumber,
            academicYear,
            branch,
            cgpa,
            backlogs,
            department,
            whyScope,
            whyAwsClub,
            awsClubPreference,
            introduceYourself,
            accommodationType,
            githubLink,
            linkedinLink
        } = req.body;
        
        // Only destructure department questions if they exist
        const technicalQuestions = req.body.technicalQuestions || null;
        const graphicQuestions = req.body.graphicQuestions || null;
        const photographyQuestions = req.body.photographyQuestions || null;
        const externalAffairsQuestions = req.body.externalAffairsQuestions || null;

        // Check if application already exists with same email or roll number
        const existingApplication = await Application.findOne({
            $or: [{ email }, { rollNumber }]
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'An application with this email or roll number already exists'
            });
        }

        // Create application data object
        const applicationData = {
            fullName,
            rollNumber,
            email,
            mobileNumber,
            accommodationType,
            // Map academic fields to match schema
            currentSemester: parseInt(academicYear),
            branch,
            currentCGPA: parseFloat(cgpa),
            numberOfBacklogs: parseInt(backlogs),
            department,
            introduceYourself,
            githubLink,
            linkedinLink,
            whyScopeClub: whyScope,
            whyAwsClub,
            awsClubPreference,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };

        // Add department-specific questions based on selection
        if (department === 'technical' && technicalQuestions) {
            applicationData.technicalQuestions = {
                whyTechnicalTeam: technicalQuestions.whyTechnicalTeam,
                technicalSkills: technicalQuestions.technicalSkills,
                projectsWorkedOn: technicalQuestions.projectsWorkedOn,
                projectLinks: technicalQuestions.projectLinks,
                technicalSkillsRating: parseInt(technicalQuestions.technicalSkillsRating)
            };
        } else if (department === 'graphic-designing' && graphicQuestions) {
            applicationData.graphicQuestions = {
                whyGraphicDesigning: graphicQuestions.whyGraphicDesigning,
                graphicDesigningSkills: graphicQuestions.graphicDesigningSkills,
                toolsUsed: graphicQuestions.toolsUsed,
                portfolioLink: graphicQuestions.portfolioLink,
                graphicDesigningSkillsRating: parseInt(graphicQuestions.graphicDesigningSkillsRating)
            };
        } else if (department === 'photography-videography' && photographyQuestions) {
            applicationData.photographyQuestions = {
                whyPhotographyVideography: photographyQuestions.whyPhotographyVideography,
                editingTools: photographyQuestions.editingTools,
                shootingDevices: photographyQuestions.shootingDevices,
                photoVideoWorks: photographyQuestions.photoVideoWorks,
                portfolioLink: photographyQuestions.portfolioLink,
                photographyVideographySkillsRating: parseInt(photographyQuestions.photographyVideographySkillsRating)
            };
        } else if (department === 'external-affairs' && externalAffairsQuestions) {
            applicationData.externalAffairsQuestions = {
                whyExternalAffairs: externalAffairsQuestions.whyExternalAffairs,
                externalAffairsRole: externalAffairsQuestions.externalAffairsRole,
                relevantSkills: externalAffairsQuestions.relevantSkills,
                previousWorkExperience: externalAffairsQuestions.previousWorkExperience,
                workPortfolioLinks: externalAffairsQuestions.workPortfolioLinks,
                communicationSkillsRating: parseInt(externalAffairsQuestions.communicationSkillsRating)
            };
        }
        
        // Only include the selected department's questions in the final data
        console.log('Final application data before saving:', JSON.stringify(applicationData, null, 2));
        
        // Explicitly exclude unselected department questions
        if (department !== 'technical') {
            delete applicationData.technicalQuestions;
        }
        if (department !== 'graphic-designing') {
            delete applicationData.graphicQuestions;
        }
        if (department !== 'photography-videography') {
            delete applicationData.photographyQuestions;
        }
        if (department !== 'external-affairs') {
            delete applicationData.externalAffairsQuestions;
        }
        
        console.log('After deleting unselected departments:');
        console.log('technicalQuestions:', applicationData.technicalQuestions);
        console.log('graphicQuestions:', applicationData.graphicQuestions);
        console.log('photographyQuestions:', applicationData.photographyQuestions);
        console.log('externalAffairsQuestions:', applicationData.externalAffairsQuestions);

        // Create and save the application
        const application = new Application(applicationData);
        await application.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully!',
            data: {
                applicationId: application._id,
                fullName: application.fullName,
                email: application.email,
                department: application.department,
                submittedAt: application.submittedAt
            }
        });

    } catch (error) {
        console.error('Application submission error:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get all applications (for admin panel)
router.get('/all', async (req, res) => {
    try {
        const { page = 1, limit = 10, department, status, search } = req.query;
        
        const query = {};
        
        // Filter by department
        if (department) {
            query.department = department;
        }
        
        // Filter by status
        if (status) {
            query.applicationStatus = status;
        }
        
        // Search by name, email, or roll number
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { rollNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const applications = await Application.find(query)
            .sort({ submittedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        const total = await Application.countDocuments(query);

        res.json({
            success: true,
            data: applications,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalApplications: total,
                applicationsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get application by ID
router.get('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).select('-__v');
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            data: application
        });

    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Update application status (for admin panel)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['Pending', 'Under Review', 'Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { applicationStatus: status },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            message: 'Application status updated successfully',
            data: application
        });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get application statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ applicationStatus: 'Pending' });
        const underReviewApplications = await Application.countDocuments({ applicationStatus: 'Under Review' });
        const acceptedApplications = await Application.countDocuments({ applicationStatus: 'Accepted' });
        const rejectedApplications = await Application.countDocuments({ applicationStatus: 'Rejected' });

        const departmentStats = await Application.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentApplications = await Application.find()
            .sort({ submittedAt: -1 })
            .limit(5)
            .select('fullName email department submittedAt applicationStatus');

        res.json({
            success: true,
            data: {
                totalApplications,
                statusBreakdown: {
                    pending: pendingApplications,
                    underReview: underReviewApplications,
                    accepted: acceptedApplications,
                    rejected: rejectedApplications
                },
                departmentBreakdown: departmentStats,
                recentApplications
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router; 