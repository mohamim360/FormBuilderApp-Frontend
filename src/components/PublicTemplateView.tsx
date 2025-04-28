import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Template } from '../types/types'
import { TemplateService } from '../services/templateService'
import { useAuth } from '../context/AuthContext'

export default function PublicTemplateView() {
  const { templateId } = useParams()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await TemplateService.getTemplate(templateId!)
        setTemplate(data)
      } catch (err) {
        setError('Template not found or you don\'t have access')
        console.error('Error fetching template:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!template) return <div>Template not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {template.imageUrl && (
          <img 
            src={template.imageUrl} 
            alt={template.title} 
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        
        <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
        <p className="text-gray-600 mb-4">By {template.author?.name || 'Anonymous'}</p>
        
        <div className="flex gap-4 mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            {template.topic}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
            {template._count?.forms || 0} uses
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
            {template._count?.likes || 0} likes
          </span>
        </div>
        
        <div className="prose max-w-none mb-8">
          <p>{template.description}</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Questions</h2>
          <div className="space-y-4">
            {template.questions?.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">
                    {index + 1}. {question.title}
                    {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  <span className="text-sm text-gray-500">{question.type}</span>
                </div>
                {question.description && (
                  <p className="text-gray-600 text-sm mb-3">{question.description}</p>
                )}
                {question.options && question.options.length > 0 && (
                  <div className="space-y-2">
                    {question.options.map((option, i) => (
                      <div key={i} className="flex items-center">
                        <input 
                          type={question.type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'} 
                          className="mr-2"
                          disabled
                        />
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {user ? (
          <Link 
            to={`/templates/${templateId}`} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Use this template
          </Link>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">Sign in to use this template</p>
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}