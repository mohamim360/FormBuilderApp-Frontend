import React, { useEffect, useState } from 'react';
import {
  Container,
  Form,
  Button,
  Card,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
  ProgressBar,
  Stack,
  Placeholder,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { 
  MdSend, 
  MdOutlineDescription, 
  MdCheckCircle,
  MdOutlineImage,
  MdOutlineNumbers,
  MdOutlineShortText,
  MdOutlineSubject,
  MdOutlineCheckBox,
  MdOutlineRadioButtonChecked,
  MdContentCopy,
} from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTemplateById, submitForm } from '../services/formService';
import { Template, QuestionType } from '../types/types';

type FormValues = {
  answers: Array<{
    questionId: string;
    value: string | number | string[] | boolean;
  }>;
  emailCopy: boolean;
  emailAddress?: string;
};

const questionTypeIcons = {
  [QuestionType.SINGLE_LINE_TEXT]: <MdOutlineShortText className="text-primary" />,
  [QuestionType.MULTI_LINE_TEXT]: <MdOutlineSubject className="text-primary" />,
  [QuestionType.INTEGER]: <MdOutlineNumbers className="text-primary" />,
  [QuestionType.CHECKBOX]: <MdOutlineCheckBox className="text-primary" />,
  [QuestionType.SINGLE_CHOICE]: <MdOutlineRadioButtonChecked className="text-primary" />,
};

const FormPreview: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<FormValues>({ mode: 'onChange' });

  useEffect(() => {
    // Set current URL for sharing
    setCurrentUrl(window.location.href);
    
    const loadTemplate = async () => {
      try {
        if (!templateId) {
          throw new Error('Template ID is required');
        }
        const data = await fetchTemplateById(templateId);
        setTemplate(data);
        reset({
          answers: data.questions.map((q) => ({
            questionId: q.id,
            value: q.type === QuestionType.CHECKBOX ? [] : '',
          })),
          emailCopy: false,
          emailAddress: '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId, reset]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000);
  };

  const onSubmit = async (data: FormValues) => {
    if (!template) return;
  
    try {
      setSubmitting(true);
      
      const answers = template.questions.map((question) => {
        const answer = data.answers.find(a => a.questionId === question.id);
        
        const baseAnswer = {
          questionId: question.id,
          textValue: null,
          integerValue: null,
          booleanValue: null,
        };
  
        if (!answer) return baseAnswer;
  
        switch (question.type) {
          case QuestionType.INTEGER:
            return {
              ...baseAnswer,
              integerValue: Number(answer.value) || 0
            };
            
          case QuestionType.CHECKBOX:
            const checkboxValues = Array.isArray(answer.value) 
              ? answer.value 
              : [answer.value].filter(Boolean);
            return {
              ...baseAnswer,
              textValue: checkboxValues.join(', ')
            };
            
          case QuestionType.SINGLE_LINE_TEXT:
          case QuestionType.MULTI_LINE_TEXT:
          case QuestionType.SINGLE_CHOICE:
            return {
              ...baseAnswer,
              textValue: String(answer.value || '')
            };
            
          default:
            return baseAnswer;
        }
      });
  
      const formData = {
        templateId: template.id,
        answers: answers,
        sendEmailCopy: data.emailCopy,
        emailAddress: data.emailCopy ? data.emailAddress : undefined,
      };
  
      // First submit the form data to your backend
      await submitForm(formData);
  
      // If email copy is requested, send 
  
      setShowSuccess(true);
      setTimeout(() => navigate(`/forms/${formData.templateId}/success`), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Form submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (question: any, index: number) => {
    const commonProps = {
      key: question.id,
      className: "mb-3",
      isInvalid: !!errors.answers?.[index]?.value,
      ...register(`answers.${index}.value`, {
        required: question.isRequired && 'This field is required',
      })
    };

    const questionHeader = (
      <div className="d-flex align-items-center mb-2">
        <span className="me-2">
          {questionTypeIcons[question.type as QuestionType] || <MdOutlineDescription />}
        </span>
        <h5 className="mb-0">
          {question.title} 
          {question.isRequired && <span className="text-danger ms-1">*</span>}
        </h5>
      </div>
    );

    switch (question.type) {
      case QuestionType.SINGLE_LINE_TEXT:
        return (
          <div className="mb-4">
            {questionHeader}
            {question.description && (
              <p className="text-muted small mb-2">
                <MdOutlineDescription className="me-1" />
                {question.description}
              </p>
            )}
            <Form.Control
              type="text"
              placeholder="Type your answer here..."
              {...commonProps}
              className="border-2 py-3"
            />
          </div>
        );

      case QuestionType.MULTI_LINE_TEXT:
        return (
          <div className="mb-4">
            {questionHeader}
            {question.description && (
              <p className="text-muted small mb-2">
                <MdOutlineDescription className="me-1" />
                {question.description}
              </p>
            )}
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Type your detailed answer here..."
              {...commonProps}
              className="border-2"
              style={{ minHeight: '120px' }}
            />
          </div>
        );

      case QuestionType.INTEGER:
        return (
          <div className="mb-4">
            {questionHeader}
            {question.description && (
              <p className="text-muted small mb-2">
                <MdOutlineDescription className="me-1" />
                {question.description}
              </p>
            )}
            <Form.Control
              type="number"
              min="0"
              placeholder="Enter a number..."
              {...register(`answers.${index}.value`, {
                required: question.isRequired && 'This field is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Must be a positive number' },
              })}
              isInvalid={!!errors.answers?.[index]?.value}
              className="border-2 py-3"
            />
          </div>
        );

      case QuestionType.CHECKBOX:
        return (
          <div className="mb-4">
            {questionHeader}
            {question.description && (
              <p className="text-muted small mb-2">
                <MdOutlineDescription className="me-1" />
                {question.description}
              </p>
            )}
            <div className="border rounded p-3 bg-light bg-opacity-10">
              {question.options?.map((option, optIndex) => (
                <Form.Check
                  key={optIndex}
                  type="checkbox"
                  id={`${question.id}-${optIndex}`}
                  label={option}
                  value={option}
                  {...register(`answers.${index}.value.${optIndex}`)}
                  className="mb-2 py-1"
                />
              ))}
            </div>
          </div>
        );

      case QuestionType.SINGLE_CHOICE:
        return (
          <div className="mb-4">
            {questionHeader}
            {question.description && (
              <p className="text-muted small mb-2">
                <MdOutlineDescription className="me-1" />
                {question.description}
              </p>
            )}
            <div className="border rounded p-3 bg-light bg-opacity-10">
              {question.options?.map((option, optIndex) => (
                <Form.Check
                  key={optIndex}
                  type="radio"
                  id={`${question.id}-${optIndex}`}
                  label={option}
                  value={option}
                  {...register(`answers.${index}.value`, {
                    required: question.isRequired && 'Please select an option',
                  })}
                  className="mb-2 py-1"
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTag = (tag: any) => {
    if (typeof tag === 'string') return tag;
    if (typeof tag === 'object' && tag !== null) {
      return tag.name || tag.title || tag.id || 'Untagged';
    }
    return 'Invalid tag';
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card className="border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: '800px' }}>
          <Placeholder as={Card.Header} animation="glow">
            <Placeholder xs={6} size="lg" bg="secondary" />
          </Placeholder>
          <Card.Body>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-4">
                <Placeholder as="h5" animation="glow">
                  <Placeholder xs={8} bg="secondary" />
                </Placeholder>
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} bg="light" />
                </Placeholder>
                <Placeholder as={Form.Control} animation="glow" bg="light" />
              </div>
            ))}
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Alert variant="danger" className="shadow-lg border-0" style={{ maxWidth: '600px' }}>
          <div className="d-flex">
            <div className="flex-shrink-0 me-3">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                <MdCheckCircle size={24} className="text-danger" />
              </div>
            </div>
            <div>
              <h4 className="alert-heading">Error loading form</h4>
              <p>{error}</p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button 
                  variant="outline-danger" 
                  onClick={() => window.location.reload()}
                  className="rounded-pill px-4"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!template) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Alert variant="warning" className="shadow-lg border-0" style={{ maxWidth: '600px' }}>
          <div className="d-flex">
            <div className="flex-shrink-0 me-3">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                <MdOutlineImage size={24} className="text-warning" />
              </div>
            </div>
            <div>
              <h4 className="alert-heading">Template not found</h4>
              <p>The requested form template could not be found.</p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button 
                  variant="outline-warning" 
                  onClick={() => navigate('/')}
                  className="rounded-pill px-4"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      </Container>
    );
  }

  if (showSuccess) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Alert variant="success" className="shadow-lg border-0" style={{ maxWidth: '600px' }}>
          <div className="d-flex">
            <div className="flex-shrink-0 me-3">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <MdCheckCircle size={24} className="text-success" />
              </div>
            </div>
            <div>
              <h4 className="alert-heading">Form Submitted Successfully!</h4>
              <p>Thank you for your submission. You'll be redirected shortly.</p>
              <ProgressBar now={100} animated variant="success" className="my-3" />
            </div>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} xl={7} xxl={6}>
          <Card className="border-0 shadow-lg overflow-hidden">
            {template.imageUrl && (
              <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                <img
                  src={template.imageUrl}
                  alt="Form header"
                  className="w-100 h-100 object-fit-cover"
                />
                <div className="position-absolute bottom-0 start-0 p-3 bg-dark bg-opacity-50 w-100">
                  <h1 className="text-white mb-0">{template.title}</h1>
                </div>
              </div>
            )}
            
            {!template.imageUrl && (
              <Card.Header className="bg-primary bg-opacity-10 py-4 border-bottom-0">
                <h1 className="h2 mb-0 text-center">{template.title}</h1>
              </Card.Header>
            )}

            <Card.Body className="p-4 p-md-5">
              <Stack gap={4}>
                {template.description && (
                  <Alert variant="light" className="border-start border-3 border-primary">
                    <p className="mb-0 fw-light">
                      <MdOutlineDescription className="me-2" size={20} />
                      {template.description}
                    </p>
                  </Alert>
                )}

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  {(template.tags || []).length > 0 && (
                    <div className="d-flex flex-wrap gap-2">
                      {(template.tags || []).map((tag, index) => (
                        <Badge key={index} bg="light" text="dark" className="rounded-pill px-3 py-2">
                          {renderTag(tag)}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {!template.isRestricted && (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="copy-tooltip">
                          {showCopyTooltip ? 'Copied!' : 'Copy form link'}
                        </Tooltip>
                      }
                    >
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="rounded-pill d-flex align-items-center gap-2"
                        onClick={copyToClipboard}
                      >
                        <MdContentCopy size={16} />
                        <span>Copy Link</span>
                      </Button>
                    </OverlayTrigger>
                  )}
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Stack gap={4}>
                    {template.questions.map((question, index) => (
                      <div key={question.id}>
                        {renderQuestionInput(question, index)}
                        
                        {errors.answers?.[index]?.value && (
                          <Alert variant="danger" className="py-2 small mb-0">
                            {errors.answers[index]?.value?.message}
                          </Alert>
                        )}
                      </div>
                    ))}

                    <div className="mt-4 pt-4 border-top">
                   
                      
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={submitting || !isValid}
                          className="rounded-pill px-4 py-2 d-flex align-items-center"
                          size="lg"
                        >
                          {submitting ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" className="me-2" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <MdSend className="me-2" />
                              Submit Form
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Stack>
                </Form>
              </Stack>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormPreview;