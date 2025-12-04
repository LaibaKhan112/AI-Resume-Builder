import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react'
import React from 'react'

const personalInfo = ({ data, onChange, removeBackground, setRemoveBackground }) => {

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value })
    }

    const fields = [
        { key: "full_name", label: "Full Name", icon: User, type: "text", required: true },
        { key: "email", label: "Email Address", icon: Mail, type: "email", required: true },
        { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
        { key: "location", label: "Location", icon: MapPin, type: "text" },
        {key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text"},
        { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url" },
        { key: "website", label: "Personal Website", icon: Globe, type: "url" }
    ];

    return (
        <div>
            <hr className='border-gray-300 border my-3' />
            <h3 className='text-xl mt-6'>Personal Information</h3>
            <p className="text-sm text-gray-500">Get started with personal Information</p>

            <div className='flex items-center gap-4'>

                {data.image ? <div className='mt-3'>
                    <img src={
                        typeof data.image === "string"
                            ? data.image
                            : data.image instanceof File
                                ? URL.createObjectURL(data.image)
                                : null
                    } alt="" className='w-16 h-16 rounded-full shadow-md ring-1 ring-gray-300' />
                </div> :
                    (<>
                        <label className='flex gap-4 items-center mt-6'>
                            <div className='mt-3 border h-16 w-16 rounded-full flex justify-center items-center ring-1' >
                                <User />
                            </div>
                            <p className='text-gray-600'>Upload user image</p>
                            <input type="file" accept='image/jpeg, image/png' className='hidden' onChange={(e) => handleChange("image", e.target.files[0])} />



                        </label>

                    </>)}

                {
                    typeof data.image === 'object' && (
                        <div className='flex flex-col gap-1 pl-4 text-sm'>
                            <p>Remove Background</p>
                            <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                                <input
                                    type="checkbox"
                                    className='sr-only peer'
                                    onChange={() => setRemoveBackground(prev => !prev)}
                                    checked={removeBackground}
                                />
                                <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out transform peer-checked:translate-x-4'></span>
                                <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200'></div>

                            </label>

                        </div>
                    )
                }
            </div>

            {fields.map((field) => {
                return <div key={field.key} className='mt-4'>

                    <h3 className='  pb-1 flex items-center gap-2 text-gray-500'><field.icon size={16} />{field.label}</h3>
                    <input type={field.type} value={data[field.key] || ""} onChange={(e) => handleChange(field.key, e.target.value)} className='ring-1 w-full p-2 px-3 rounded-md ring-gray-300 text-sm' placeholder={`Enter your ${field.label.toLowerCase()}`} required={field.required} />

                </div>
            })}

        </div>
    )
}

export default personalInfo