import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TemplateService } from '../services/templateService'
import { useAuth } from '../context/AuthContext'
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
  Alert,
  Pagination,
} from 'react-bootstrap'
import moment from 'moment'
import {
  Template,
  Form,

  Answer,
} from '../types/types' // Assuming interfaces are exported from a central file

export default function TemplateResponses() {
  const { templateId } = useParams<{ templateId: string }>()
  const [forms, setForms] = useState<Form[]>([])
  const [template, setTemplate] = useState<Template | null>(null)
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

        const templateData = await TemplateService.getTemplate(templateId!)
        setTemplate(templateData)

        const formsData = await TemplateService.getTemplateForms(
          templateId!,
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

  const getAnswerForQuestion = (form: Form, questionId: string): string | number | boolean | null => {
    const answer: Answer | undefined = form.answers.find(
      (a) => a.questionId === questionId
    )
    if (!answer) return null

    switch (answer.question?.type) {
      case 'CHECKBOX':
        return answer.booleanValue ? 'Yes' : 'No'
      case 'INTEGER':
        return answer.integerValue ?? '-'
      case 'SINGLE_CHOICE':
      case 'SINGLE_LINE_TEXT':
      case 'MULTI_LINE_TEXT':
        return answer.textValue || '-'
      default:
        return '-'
    }
  }

  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    )

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )

  if (!template)
    return (
      <Container className="mt-5">
        <Alert variant="warning">Template not found</Alert>
      </Container>
    )

  if (forms.length === 0)
    return (
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
              </div>

              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Respondent</th>
                      <th>Submitted</th>
                      {template.questions
                        .sort((a, b) => a.order - b.order)
                        .map((question) => (
                          <th key={question.id}>
                            {question.title}
                            {question.isRequired && (
                              <span className="text-danger ms-1">*</span>
                            )}
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
                          .sort((a, b) => a.order - b.order)
                          .map((question) => {
                            const answer = getAnswerForQuestion(form, question.id)
                            return (
                              <td key={`${form.id}-${question.id}`}>
                                {answer !== null ? (
                                  <>
                                    {question.type === 'CHECKBOX' ? (
                                      <Badge bg={answer === 'Yes' ? 'success' : 'secondary'}>
                                        {String(answer)}
                                      </Badge>
                                    ) : (
                                      <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                        {String(answer)}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  '-'
                                )}
                              </td>
                            )
                          })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === currentPage}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
