import React from 'react'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import ClassicTemplate from './templates/ClassicTemplate'

const ResumePreview = ({data, template, accentColor}) => {
    const renderTemplate = ()=>{
        switch (template) {
            case 'modern':
                return <ModernTemplate data={data} accentColor={accentColor}/>
                break;
            case 'minimal':
                return <MinimalTemplate data={data} accentColor={accentColor}/>
                break;
            case 'minimal-image':
                return <MinimalImageTemplate data={data} accentColor={accentColor}/>
                break;
            case 'classic':
                return <ClassicTemplate data={data} accentColor={accentColor}/>
                break;
        
            default:
                break;
        }
    }
  return (
    <div>
        <div>{renderTemplate()}</div>
    </div>
  )
}

export default ResumePreview