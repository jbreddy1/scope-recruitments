const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Submit new application
router.post('/submit', async (req, res) => {
    try {
        const {
            fullName,
            rollNumber,
            email,
            academicYear,
            branch,
            cgpa,
            backlogs,
            department,
            technicalQuestions,
            graphicQuestions,
            photographyQuestions,
            externalAffairsQuestions,
            whyScope
        } = req.body;

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

        // Map department values to match the database schema
        let mappedDepartment = department;
        if (department === 'technical') {
            mappedDepartment = 'Technical';
        } else if (department === 'graphic-designing') {
            mappedDepartment = 'Graphic Designing';
        } else if (department === 'photography-videography') {
            mappedDepartment = 'Photography & Videography';
        } else if (department === 'external-affairs') {
            mappedDepartment = 'External Affairs (Content, Promotion, Operations)';
        }

        // Create application data object
        const applicationData = {
            fullName,
            rollNumber,
            email,
            // Map academic fields to match schema
            currentSemester: parseInt(academicYear),
            currentCGPA: parseFloat(cgpa),
            numberOfBacklogs: parseInt(backlogs),
            department: mappedDepartment,
            whyScopeClub: whyScope,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };

        // Add department-specific questions based on selection
        if (department === 'technical') {
            applicationData.technicalQuestions = {
                whyTechnicalTeam: technicalQuestions.whyTechnicalTeam,
                technicalSkills: technicalQuestions.technicalSkills,
                projectsWorkedOn: technicalQuestions.projectsWorkedOn,
                projectLinks: technicalQuestions.projectLinks,
                technicalSkillsRating: parseInt(technicalQuestions.technicalSkillsRating)
            };
        } else if (department === 'graphic-designing') {
            applicationData.graphicQuestions = {
                whyGraphicDesigning: graphicQuestions.whyGraphicDesigning,
                graphicDesigningSkills: graphicQuestions.graphicDesigningSkills,
                toolsUsed: graphicQuestions.toolsUsed,
                portfolioLink: graphicQuestions.portfolioLink,
                graphicDesigningSkillsRating: parseInt(graphicQuestions.graphicDesigningSkillsRating)
            };
        } else if (department === 'photography-videography') {
            applicationData.photographyQuestions = {
                whyPhotographyVideography: photographyQuestions.whyPhotographyVideography,
                photographyVideographySkills: photographyQuestions.photographyVideographySkills,
                equipmentOwned: photographyQuestions.equipmentOwned,
                portfolioLink: photographyQuestions.portfolioLink,
                photographyVideographySkillsRating: parseInt(photographyQuestions.photographyVideographySkillsRating)
            };
        } else if (department === 'external-affairs') {
            applicationData.externalAffairsQuestions = {
                whyExternalAffairs: externalAffairsQuestions.whyExternalAffairs,
                communicationSkills: externalAffairsQuestions.communicationSkills,
                previousExperience: externalAffairsQuestions.previousExperience,
                socialMediaHandles: externalAffairsQuestions.socialMediaHandles,
                communicationSkillsRating: parseInt(externalAffairsQuestions.communicationSkillsRating)
            };
        }

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