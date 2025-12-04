import openai from "../config/openai.js"
import Resume from "../models/resume.model.js"

const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body

        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const response = await openai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system", content: "You are an expert resume writer. Improve the user's professional summary by rewriting it into a concise, ATS-friendly, and compelling 1–2 sentence summary. Highlight key skills, experience, and career objectives. Return only the final rewritten summary with no explanations, no lists, and no extra text."
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        })

        const enhancedContent = response.choices[0].message.content
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}



const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body

        if (!userContent) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const response = await openai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system", content: "You are an expert in resume writing. Enhance the job description by rewriting it into a concise and ATS-friendly 1–2 sentence summary that highlights key responsibilities and achievements. Use strong action verbs and quantifiable results where possible. Return only the rewritten text with no options, explanations, or extra content."

                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        })

        const enhancedContent = response.choices[0].message.content
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body
        const userId = req.userId

        if (!resumeText) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const systemPrompt = "You are an expert Ai agent to extract data from resume"
        const userPrompt = `Extract data from this resume: ${resumeText}
        
        Provide data with following JSON format with no additional text before or after

        professional_summary: {
        type: String,
        default: ''
    },
    skills: [{type: String}],
    personal_info: {
        image: { type: String, default: ''},
        full_name: { type: String, default: ''},
        profession: { type: String, default: ''},
        email: { type: String, default: ''},
        phone: { type: String, default: ''},
        location: { type: String, default: ''},
        linkedin: { type: String, default: ''},
        website: { type: String, default: ''},
    },
    experience: [{
        company: {type: String},
        position: {type: String},
        start_date: {type: String},
        end_date: {type: String},
        description: {type: String},
        is_current: {type: Boolean}
        
    }
    ],
    projects: [{
        name: {type: String},
        type: {type: String},
        description: {type: String},
    }],
    education: [{
        institution: {type: String},
        degree: {type: String},
        field: {type: String},
        graduation_date: {type: String},
        gpa: {type: String},
    }]
        `

        const response = await openai.chat.completions.create({
            model: process.env.GEMINI_MODEL,
            messages: [
                {
                    role: "system", content: systemPrompt

                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            response_format: {type: 'json_object'}
        })

        const extractedData = response.choices[0].message.content
        const parsedData = JSON.parse(extractedData)
        const newResume = await Resume.create({userId, title, ...parsedData})

        return res.json({resumeId: newResume._id})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export {enhanceProfessionalSummary, enhanceJobDescription, uploadResume}