import React, { useEffect, useState } from 'react';
import {
  Container,
  Form,
  Button,
  Card,
  Badge,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { MdSend } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTemplateById, submitForm } from '../services/formService';
import { Template, QuestionType } from '../types/types';

type FormValues = {
  answers: Array<{
    questionId: string;
    value: string | number | string[] | boolean;
  }>;
  emailCopy: boolean;
};

const FormPreview: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
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
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId, reset]);

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
      };

      const createdForm = await submitForm(formData);
      navigate(`/forms/${createdForm.id}/success`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Form submission failed');
    } finally {
      setSubmitting(false);
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
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!template) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Template not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card>
        <Card.Header className="bg-light">
          <h2>{template.title}</h2>
          {template.imageUrl && (
            <div className="text-center my-3">
              <img
                src={template.imageUrl}
                alt="Form header"
                style={{ maxHeight: '200px', maxWidth: '100%' }}
                className="img-fluid"
              />
            </div>
          )}
          {template.description && <p className="mb-3">{template.description}</p>}
          <div className="mb-2">
            {(template.tags || []).map((tag, index) => (
              <Badge key={index} bg="secondary" className="me-1">
                {renderTag(tag)}
              </Badge>
            ))}
          </div>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {template.questions.map((question, index) => (
              <Form.Group key={question.id} className="mb-4">
                <Form.Label>
                  {question.title} {question.isRequired && <span className="text-danger">*</span>}
                </Form.Label>
                {question.description && (
                  <Form.Text className="d-block text-muted mb-2">
                    {question.description}
                  </Form.Text>
                )}

                {question.type === QuestionType.SINGLE_LINE_TEXT && (
                  <Form.Control
                    type="text"
                    placeholder="Your answer"
                    {...register(`answers.${index}.value`, {
                      required: question.isRequired && 'This field is required',
                    })}
                    isInvalid={!!errors.answers?.[index]?.value}
                  />
                )}

                {question.type === QuestionType.MULTI_LINE_TEXT && (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Your answer"
                    {...register(`answers.${index}.value`, {
                      required: question.isRequired && 'This field is required',
                    })}
                    isInvalid={!!errors.answers?.[index]?.value}
                  />
                )}

                {question.type === QuestionType.INTEGER && (
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder="Your answer"
                    {...register(`answers.${index}.value`, {
                      required: question.isRequired && 'This field is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Must be a positive number' },
                    })}
                    isInvalid={!!errors.answers?.[index]?.value}
                  />
                )}

                {question.type === QuestionType.CHECKBOX && question.options && (
                  <div>
                    {question.options.map((option, optIndex) => (
                      <Form.Check
                        key={optIndex}
                        type="checkbox"
                        id={`${question.id}-${optIndex}`}
                        label={option}
                        value={option}
                        {...register(`answers.${index}.value.${optIndex}`)}
                        className="mb-2"
                      />
                    ))}
                  </div>
                )}

                {question.type === QuestionType.SINGLE_CHOICE && question.options && (
                  <div>
                    {question.options.map((option, optIndex) => (
                      <Form.Check
                        key={optIndex}
                        type="radio"
                        id={`${question.id}-${optIndex}`}
                        label={option}
                        value={option}
                        {...register(`answers.${index}.value`, {
                          required: question.isRequired && 'Please select an option',
                        })}
                        className="mb-2"
                      />
                    ))}
                  </div>
                )}

                {errors.answers?.[index]?.value && (
                  <Form.Control.Feedback type="invalid">
                    {errors.answers[index]?.value?.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            ))}

            <div className="d-flex justify-content-between mt-4">
              <Form.Check
                type="checkbox"
                id="emailCopy"
                label="Email me a copy of my responses"
                {...register('emailCopy')}
              />
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" role="status" />
                    <span className="ms-2">Submitting...</span>
                  </>
                ) : (
                  <>
                    <MdSend /> Submit
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormPreview;