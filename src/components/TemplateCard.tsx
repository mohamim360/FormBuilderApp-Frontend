import { Link } from 'react-router-dom'
import { Template } from '../types/types'
import { FaHeart, FaRegHeart, FaClone, FaTags } from 'react-icons/fa'

interface TemplateCardProps {
  template: Template
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden hover-shadow">
      {template.imageUrl && (
        <div className="card-img-top overflow-hidden" style={{ height: '180px' }}>
          <img
            src={template.imageUrl}
            alt={template.title}
            className="w-100 h-100 object-cover"
          />
        </div>
      )}
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-2">
          <Link 
            to={`/${template.id}`} 
            className="text-decoration-none text-dark hover-primary"
          >
            {template.title}
          </Link>
        </h5>
        
        <p className="card-text text-muted mb-3 flex-grow-1" style={{ minHeight: '40px' }}>
          {template.description}
        </p>
        
        {template.tags && template.tags.length > 0 && (
          <div className="mb-3">
            <small className="text-muted d-flex align-items-center mb-1">
              <FaTags className="me-1" />
              Tags:
            </small>
            <div className="d-flex flex-wrap gap-2">
              {template.tags.map(tag => (
                <span
                  key={tag.id}
                  className="badge bg-light text-dark border rounded-pill text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
          <div className="d-flex gap-3">
            {template._count?.forms !== undefined && (
              <small className="text-muted d-flex align-items-center">
                <FaClone className="me-1" />
                {template._count.forms}
              </small>
            )}
            {template._count?.likes !== undefined && (
              <small className="text-muted d-flex align-items-center">
                {template._count.likes > 0 ? (
                  <FaHeart className="text-danger me-1" />
                ) : (
                  <FaRegHeart className="me-1" />
                )}
                {template._count.likes}
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}