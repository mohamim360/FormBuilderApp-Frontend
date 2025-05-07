import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Template } from '../types/types'
import { TemplateService } from '../services/templateService'
import { useAuth } from '../context/AuthContext'
import { Button, Container, Row, Col, Card, Badge, Form, ListGroup, Spinner, Alert } from 'react-bootstrap'
import { FaHeart, FaRegHeart, FaComment, FaUser, FaStar } from 'react-icons/fa'
import moment from 'moment'

export default function PublicTemplateView() {
  const { templateId } = useParams()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<{ id: string; user: { name: string }; content: string; createdAt: string }[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentLoading, setCommentLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await TemplateService.getTemplate(templateId!)
        setTemplate(data)
        setLikeCount(data._count?.likes || 0)

        // Fetch comments
        const commentsData = await TemplateService.getComments(templateId!)
        setComments(commentsData.comments)

        // Check if user liked the template
        if (user) {
          const liked = await TemplateService.checkUserLike(templateId!)
          setIsLiked(!!liked)
        }
      } catch (err) {
        setError('Template not found or you don\'t have access')
        console.error('Error fetching template:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId, user])

  const handleLike = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setLikeLoading(true)
      if (isLiked && likeCount > 0) {
        await TemplateService.unlikeTemplate(templateId!)
        setLikeCount(prev => prev - 1)
      } else {
        await TemplateService.likeTemplate(templateId!)
        setLikeCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
      setError('Failed to update like status')
    } finally {
      setLikeLoading(false)
    }
  }
  const handleDelete = async () => {
    if (!user || !template) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this template? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      if (template.id) {
        await TemplateService.deleteTemplate(template.id);
      } else {
        throw new Error('Template ID is undefined');
      }
      navigate('/template'); // Or wherever you want to redirect after deletion
    } catch (error) {
      console.error('Error deleting template:', error);

    } finally {
      setIsDeleting(false);
    }
  };
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !comment.trim()) return

    try {
      setCommentLoading(true)
      const newComment = await TemplateService.addComment(templateId!, comment)
      setComments(prev => [newComment, ...prev])
      setComment('')
    } catch (error) {
      console.error('Error submitting comment:', error)
      setError('Failed to submit comment')
    } finally {
      setCommentLoading(false)
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

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Template Header */}
          <Card className="mb-4 border-0 shadow-sm">
            {template.imageUrl && (
              <Card.Img
                variant="top"
                src={template.imageUrl}
                alt={template.title}
                style={{ height: '300px', objectFit: 'cover' }}
              />
            )}
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="h2 mb-2">{template.title}</h1>
                  <div className="d-flex align-items-center mb-3">
                    <FaUser className="me-2 text-muted" />
                    <span className="text-muted me-3">By {template.author?.name || 'Anonymous'}</span>
                    <span className="text-muted">
                      Created {moment(template.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <Button
                  variant={isLiked ? 'danger' : 'outline-danger'}
                  onClick={handleLike}
                  disabled={likeLoading}
                >
                  {likeLoading ? (
                    <Spinner as="span" animation="border" size="sm" />
                  ) : (
                    <>
                      {isLiked ? <FaHeart /> : <FaRegHeart />}
                    </>
                  )}
                </Button>
              </div>

              <div className="mb-4">
                <Badge bg="primary" className="me-2">{template.topic}</Badge>
                <Badge bg="light" text="dark" className="me-2">
                  <FaStar className="text-warning me-1" />
                  {template._count?.forms || 0} uses
                </Badge>
                <Badge bg="light" text="dark">
                  <FaHeart className="text-danger me-1" />
                  {likeCount} likes
                </Badge>
              </div>

              <Card.Text className="lead mb-4">{template.description}</Card.Text>

              <div className="d-flex gap-2">
                {user ? (
                  <Link to={`/templates/${templateId}`}>  <Button


                    variant="primary"
                    size="lg"
                  >
                    Use this template
                  </Button></Link>

                ) : (
                  <Link to="/login">
                    <Button
                      variant="primary"
                      size="lg"
                    >
                      Login to use template
                    </Button>
                  </Link>

                )}
                {user && template.author?.id === user.id && (
                  <Link to={`/templates/${templateId}/responses`}>  <Button
                    variant="outline-primary"
                    size="lg"
                  >
                    View Responses
                  </Button></Link>

                )}
                {user && (template.author?.id === user.id || user.role === 'ADMIN') && (
                  <>
                    <Link to={`/templates/${templateId}/edit`}>  <Button
                      variant="outline-secondary"
                      size="lg"
                    >
                      Edit Template
                    </Button></Link>

                    <Button
                      variant="outline-danger"
                      size="lg"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        'Delete Template'
                      )}
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Questions Section */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <h2 className="h4 mb-4">Questions</h2>
              <div className="gap-3">
                {template.questions?.map((question, index) => (
                  <Card key={question.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <Card.Title className="h6 mb-0">
                          {index + 1}. {question.title}
                          {question.isRequired && <span className="text-danger ms-1">*</span>}
                        </Card.Title>
                        <Badge bg="light" text="dark" className="text-uppercase">
                          {question.type.replace('_', ' ').toLowerCase()}
                        </Badge>
                      </div>
                      {question.description && (
                        <Card.Text className="text-muted small mb-3">
                          {question.description}
                        </Card.Text>
                      )}
                      {question.options && question.options.length > 0 && (
                        <ListGroup variant="flush">
                          {question.options.map((option, i) => (
                            <ListGroup.Item key={i} className="d-flex align-items-center py-2">
                              <Form.Check
                                type={question.type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                                className="me-2"
                                disabled
                              />
                              <span>{option}</span>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Comments Section */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h2 className="h4 mb-4">
                <FaComment className="me-2" />
                Comments ({comments.length})
              </h2>

              {user ? (
                <Form onSubmit={handleCommentSubmit} className="mb-4">
                  <Form.Group controlId="commentText">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="mb-2"
                    />
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={commentLoading || !comment.trim()}
                    >
                      {commentLoading ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        'Post Comment'
                      )}
                    </Button>
                  </Form.Group>
                </Form>
              ) : (
                <Alert variant="info" className="mb-4">
                  Please <Link to="/login">login</Link> to leave a comment.
                </Alert>
              )}

              <div className="comments-list">
                {comments.length === 0 ? (
                  <Alert variant="light" className="text-center">
                    No comments yet. Be the first to comment!
                  </Alert>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className="mb-3">
                      <Card.Body>
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <FaUser />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <h6 className="mb-1">{comment.user.name}</h6>
                              <small className="text-muted">
                                {moment(comment.createdAt).fromNow()}
                              </small>
                            </div>
                            <p className="mb-0">{comment.content}</p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}