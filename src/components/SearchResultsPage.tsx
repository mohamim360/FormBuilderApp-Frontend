import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Template } from '../types/types'
import { TemplateService } from '../services/templateService'
import TemplateCard from '../components/TemplateCard'
import { Button, Spinner, Alert, Container, Row, Col, Form } from 'react-bootstrap'
import { FaSearch, FaArrowRight, FaTimes } from 'react-icons/fa'

export default function SearchResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const [searchInput, setSearchInput] = useState(queryParams.get('q') || '')
  const query = queryParams.get('q') || ''
  
  const [results, setResults] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    const searchTemplates = async () => {
      try {
        setLoading(true)
        const { templates, total } = await TemplateService.searchTemplates(query, page)
        setResults(prev => page === 1 ? templates : [...prev, ...templates])
        setHasMore(results.length + templates.length < total)
      } catch (error) {
        console.error('Error searching templates:', error)
        setError('Failed to load search results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      searchTemplates()
    } else {
      setError('No search query provided')
    }
  }, [query, page])

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
      setPage(1) // Reset to first page for new search
    }
  }

  const clearSearch = () => {
    setSearchInput('')
    navigate('/search')
  }

  if (loading && page === 1) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  )

  if (error && !query) return (
    <Container className="py-5">
      <Alert variant="danger" className="text-center">
        {error}
        <div className="mt-3">
          <Button variant="primary" onClick={() => navigate('/')}>
            Browse Popular Templates
          </Button>
        </div>
      </Alert>
    </Container>
  )

  return (
    <Container className="py-5">
      {/* Search Header */}
      <Row className="justify-content-center mb-5">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSearchSubmit} className="position-relative">
            <Form.Control
              type="search"
              placeholder="Search templates..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="ps-5 py-3 rounded-pill shadow-sm"
              style={{ border: '1px solid #dee2e6' }}
            />
            <FaSearch 
              className="position-absolute top-50 start-0 translate-middle-y ms-3" 
              style={{ color: '#6c757d' }}
            />
            {searchInput && (
              <Button
                variant="link"
                onClick={clearSearch}
                className="position-absolute top-50 end-0 translate-middle-y me-3 p-0"
                style={{ color: '#6c757d' }}
              >
                <FaTimes />
              </Button>
            )}
          </Form>
        </Col>
      </Row>

      {/* Results Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">
            {results.length > 0 ? (
              <>
                Results for <span className="text-primary">"{query}"</span>
                <span className="text-muted fs-5 ms-2">{results.length}+ templates</span>
              </>
            ) : (
              `No results found for "${query}"`
            )}
          </h2>
          {results.length > 0 && (
            <p className="text-muted">Browse through our collection of templates</p>
          )}
        </Col>
      </Row>

      {/* Results Grid */}
      {results.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={3} className="g-4 mb-5">
            {results.map(template => (
              <Col key={template.id}>
                <TemplateCard template={template} />
              </Col>
            ))}
          </Row>

          {hasMore && (
            <div className="text-center mt-4">
              <Button 
                variant="outline-primary" 
                onClick={handleLoadMore}
                disabled={loading}
                className="px-4 py-2 rounded-pill"
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More <FaArrowRight className="ms-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Row className="justify-content-center py-5">
          <Col md={8} className="text-center">
            <div className="py-5">
             
              <h4 className="mb-3">No templates found matching your search</h4>
              <p className="text-muted mb-4">
                Try different keywords or browse our popular templates
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                className="rounded-pill px-4"
                onClick={() => navigate('/')}
              >
                Explore Templates
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  )
}