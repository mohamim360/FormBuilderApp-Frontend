// src/components/TemplateCard.tsx
import { Link } from 'react-router-dom'
import { Template } from '../types/types'

interface TemplateCardProps {
  template: Template
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {template.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={template.imageUrl}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">
          <Link 
            to={`/public/${template.id}`} 
            className="hover:text-blue-600 transition-colors"
          >
            {template.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-3 line-clamp-2">
          {template.description}
        </p>
        
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {template.tags.map(tag => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>By {template.author?.name || 'Anonymous'}</span>
          <div className="flex gap-2">
            {template._count?.forms !== undefined && (
              <span>{template._count.forms} uses</span>
            )}
            {template._count?.likes !== undefined && (
              <span>{template._count.likes} likes</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}