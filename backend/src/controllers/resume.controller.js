import imagekit from "../config/imageKit.js"
import Resume from "../models/resume.model.js"
import fs from 'fs'



// Creating the resume
const createResume = async (req, res) => {
    try {
        const userId = req.userId

        if (!userId) {
           return  res.status(404).json({ message: "Unauthorized: User ID not found" })
        }

        const {title} = req.body

        const newResume = await Resume.create({ userId, title })

        return res.status(201).json({ message: "Resume created successfully", resume: newResume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}



// Deleting the resume

const deleteResume = async (req, res) => {
    try {
        const userId = req.userId
        const { resumeId } = req.params

        const updatedResumes = await Resume.findOneAndDelete({ userId, _id: resumeId })

        return res.status(201).json({ message: "Resume deleted successfully" })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

}

// Get user resume by id

const getUserResumeById = async (req, res) => {
    try {
        const userId = req.userId
        const { resumeId } = req.params

        const resume = await Resume.findOne({ userId, _id: resumeId })

        if (!resume) {
            return res.status(400).json({ message: "resume not found" })
        }
        return res.status(201).json({ resume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }


}

// Get public resume

const getResumeByPublicId = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // find ONE public resume
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Update Resume

// PUT: /api/resumes/update
const updateResume = async (req, res) => {
    try {
        const userId = req.userId;

        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        // resumeData arrives as a string → convert to object
        let resumeDataCopy = JSON.parse(resumeData);

        if (image) {
            const imageBufferData = fs.createReadStream(image.path)
            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre: 'w-300, h-300, fo-focus, z-0.75' +
                    (removeBackground ? ',e-bgremove' : '')
                }
            });

            resumeDataCopy.personal_info.image = response.url
        }

        const resume = await Resume.findOneAndUpdate(
            { userId, _id: resumeId },
            resumeDataCopy,
            { new: true }
        );

        return res.status(200).json({
            message: "Saved successfully",
            resume
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Get all resumes for logged-in user
const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });

        return res.status(200).json({ resumes });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


export {createResume, deleteResume, getUserResumeById, getResumeByPublicId, updateResume, getUserResumes}
