import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({selectedTemplate, onChange}) => {
    const [isOpen, setIsOpen] = useState(false)

    const templates = [
        {
            id: 'modern',
            name: 'Modern',
            Preview: 'A clean, traditional resume format with clear sections and professional typography'
        },
        {
            id: 'minimal',
            name: 'Minimal',
            Preview: 'Ultra-clean design that puts your content front and center'
        },
        {
            id: 'minimal-image',
            name: 'Minimal Image',
            Preview: 'Minimal design with a single image and clean typography'
        },
        {
            id: 'classic',
            name: 'Classic',
            Preview: 'A clean, traditional resume format with clear sections and professional typography'
        },
    ]
  return (
    <div className='relative'>
        <button onClick={()=>setIsOpen(!isOpen)} className='flex items-center bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-lg'>
            <Layout size={16}/>Templates
        </button>

        {isOpen && (
            <div  className='absolute bg-white top-full w-xs p-3 mt-2 space-y-3 rounded-md border border-gray-200 shadow-sm'>
                {templates.map((template)=>{
                    return <div key={template.id}  onClick={()=>{onChange(template.id); setIsOpen(false)}} className={`relative p-3 rounded-md border cursor-pointer transition-all ${selectedTemplate===template.id ? 'border-blue-400 bg-blue-100':
                        'border-blue-300 hover:border-gray-400 hover:bg-gray-100'
                    }`}>
                        {selectedTemplate===template.id && (
                            <div className='absolute top-2 right-2'>
                                <div className='size-5 bg-blue-400 rounded-full flex justify-center items-center '>
                                    <Check className='w-3 h-3 text-white'/>
                                </div>
                            </div>
                        )}
                        <div>
                        <h3 className='text-gray-600 font-medium'>{template.name}</h3>
                        <div className='mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic'>{template.Preview}</div>

                        </div>
                    </div>
                })}
                </div>
        )}
    </div>
  )
}

export default TemplateSelector