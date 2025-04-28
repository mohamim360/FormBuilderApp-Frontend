// src/pages/SearchResultsPage.tsx
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Template } from '../types/types'
import { TemplateService } from '../services/templateService'
import TemplateCard from '../components/TemplateCard'
import { Button, Spinner } from 'react-bootstrap'

export default function SearchResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const query = queryParams.get('q') || ''
  
  const [results, setResults] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const searchTemplates = async () => {
      try {
        setLoading(true)
        const data = await TemplateService.searchTemplates(query, page)
        setResults(prev => page === 1 ? data.templates : [...prev, ...data.templates])
        setHasMore(data.templates.length > 0)
      } catch (error) {
        console.error('Error searching templates:', error)
      } finally {
        setLoading(false)
      }
    }

    searchTemplates()
  }, [query, page])

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  if (loading && page === 1) return (
    <div className="container text-center py-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {results.length > 0 ? `Search Results for "${query}"` : `No results found for "${query}"`}
      </h1>
      
      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {results.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <Button 
                variant="outline-primary" 
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}

      {results.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Try searching for something else</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Browse Popular Templates
          </Button>
        </div>
      )}
    </div>
  )
}