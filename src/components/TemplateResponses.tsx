import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TemplateService } from '../services/templateService'
import { useAuth } from '../context/AuthContext'
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap'
import moment from 'moment'

export default function TemplateResponses() {
  const { templateId } = useParams()
  const [forms, setForms] = useState<any[]>([])
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch template first to get questions structure
        const templateData = await TemplateService.getTemplate(templateId!, user?.userId)
        setTemplate(templateData)
        
        // Then fetch responses
        const formsData = await TemplateService.getTemplateForms(
          templateId!, 
          user?.userId || '', 
          currentPage, 
          limit
        )
        
        setForms(formsData.forms)
        setTotalPages(formsData.totalPages)
      } catch (err) {
        setError('Failed to fetch responses')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [templateId, user, currentPage])

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const getAnswerForQuestion = (form: any, questionId: string) => {
    const answer = form.answers.find((a: any) => a.questionId === questionId)
    if (!answer) return null
    
    // Handle different question types
    switch (answer.question?.type) {
      case 'CHECKBOX':
        return answer.booleanValue ? 'Yes' : 'No'
      case 'INTEGER':
        return answer.integerValue
      case 'SINGLE_CHOICE':
        return answer.textValue
      case 'SINGLE_LINE_TEXT':
      case 'MULTI_LINE_TEXT':
        return answer.textValue || '-'
      default:
        return '-'
    }
  }

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Spinner animation="border" variant="primary" />
    </Container>
  )

  if (error) return (
    <Container className="mt-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  )

  if (!template) return (
    <Container className="mt-5">
      <Alert variant="warning">Template not found</Alert>
    </Container>
  )

  if (forms.length === 0) return (
    <Container className="mt-5">
      <Alert variant="info">No responses found for this template</Alert>
    </Container>
  )

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col>
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 mb-0">Responses ({forms.length})</h2>
                <div>
             
                </div>
              </div>

              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Respondent</th>
                      <th>Submitted</th>
                      {template.questions
                        .sort((a: any, b: any) => a.order - b.order)
                        .map((question: any) => (
                          <th key={question.id}>
                            {question.title}
                            {question.isRequired && <span className="text-danger ms-1">*</span>}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map((form, index) => (
                      <tr key={form.id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{form.user?.name || 'Anonymous'}</td>
                        <td>{moment(form.createdAt).format('MMM D, YYYY h:mm A')}</td>
                        {template.questions
                          .sort((a: any, b: any) => a.order - b.order)
                          .map((question: any) => {
                            const answer = getAnswerForQuestion(form, question.id)
                            return (
                              <td key={`${form.id}-${question.id}`}>
                                {answer !== null ? (
                                  <>
                                    {question.type === 'CHECKBOX' ? (
                                      <Badge bg={answer === 'Yes' ? 'success' : 'secondary'}>
                                        {answer}
                                      </Badge>
                                    ) : (
                                      <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                        {answer}
                                      </span>
                                    )}
                                  </>
                                ) : '-'}
                              </td>
                            )
                          })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

          
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}