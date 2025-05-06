import React, { useState, useEffect } from 'react';
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Dropdown,
  Badge,
  Modal,
  Tab,
  Tabs,
  ListGroup,
  FormCheck,
  InputGroup,
  FloatingLabel,
  Spinner
} from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useForm, useFieldArray, Control, UseFormRegister } from 'react-hook-form';
import { MdDragIndicator, MdAdd, MdDelete, MdImage, MdSettings } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { TemplateService } from '../services/templateService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';


type QuestionType = 'SINGLE_LINE_TEXT' | 'MULTI_LINE_TEXT' | 'INTEGER' | 'CHECKBOX' | 'SINGLE_CHOICE';
type TemplateAccess = 'PUBLIC' | 'RESTRICTED';

interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  isRequired: boolean;
  showInTable: boolean;
  options?: string[];
  order: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface FormData {
  title: string;
  description: string;
  topic: string;
  imageUrl?: string;
  tags: string[];
  questions: Question[];
  accessType: TemplateAccess;
  allowedUsers: User[];
  isPublic: boolean;
}

const demoUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
];

const TemplateEditor = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'responses'>('questions');
  const [showSettings, setShowSettings] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  console.log(user);
  const { control, register, handleSubmit, watch, setValue, reset } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      topic: '',
      imageUrl: '',
      tags: [],
      questions: [],
      accessType: 'PUBLIC',
      allowedUsers: [],
      isPublic: true
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions'
  });

  useEffect(() => {
    if (id) {
      const loadTemplate = async () => {
        setIsLoading(true);
        try {
          const template = await TemplateService.getTemplate(id);
          setIsEditMode(true);
          reset({
            title: template.title,
            description: template.description,
            topic: template.topic,
            imageUrl: template.imageUrl || '',
            tags: template.tags.map((t: { name: string }) => t.name),
            questions: template.questions.map((q: Question) => ({
              id: q.id,
              title: q.title,
              description: q.description || '',
              type: q.type,
              isRequired: q.isRequired,
              showInTable: q.showInTable,
              options: q.options || [],
              order: q.order
            })),
            accessType: template.accessType as TemplateAccess,
            allowedUsers: template.allowedUsers || [],
            isPublic: template.isPublic
          });
          setSelectedUsers(template.allowedUsers || []);
        } catch (error) {
          console.error('Failed to load template:', error);
          toast.error('Failed to load template');
          navigate('/');
        } finally {
          setIsLoading(false);
        }
      };
      loadTemplate();
    }
  }, [id, reset, navigate]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const formattedData = {
        title: data.title,
        description: data.description,
        topic: data.topic,
        imageUrl: watch('imageUrl'), isPublic: data.accessType === 'PUBLIC',
        accessType: data.accessType,
        questions: data.questions.map((q, index) => ({
          title: q.title,
          description: q.description,
          type: q.type,
          isRequired: q.isRequired,
          showInTable: q.showInTable,
          options: q.options || [],
          order: index
        })),
        tags: data.tags,
        allowedUsers: data.allowedUsers,
        userId: user?.id
      };

      if (isEditMode && id) {
        await TemplateService.updateTemplate(id, formattedData);
        toast.success('Template updated successfully!');
      } else {
        await TemplateService.createTemplate(formattedData);
        toast.success('Template created successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setIsLoading(false);
    }
  };


  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const addQuestion = (type: QuestionType) => {
    append({
      id: Date.now().toString(),
      title: '',
      description: '',
      type,
      isRequired: false,
      showInTable: true,
      order: fields.length,
      ...(type === 'CHECKBOX' && { options: ['Option 1'] }),
      ...(type === 'SINGLE_CHOICE' && { options: ['Option 1'] })
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const uploadResponse = await TemplateService.uploadImage(formData);

      // Store the URL in form data
      setValue('imageUrl', uploadResponse.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };


  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setValue('tags', tags);
  };

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const addUser = (user: User) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      const updatedUsers = [...selectedUsers, user];
      setSelectedUsers(updatedUsers);
      setValue('allowedUsers', updatedUsers);
    }
    setSearchTerm('');
  };

  const removeUser = (userId: string) => {
    const updatedUsers = selectedUsers.filter(u => u.id !== userId);
    setSelectedUsers(updatedUsers);
    setValue('allowedUsers', updatedUsers);
  };

  const filteredUsers = demoUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && !fields.length) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Form.Control
              type="text"
              placeholder="Form title"
              className="border-0 fs-4 fw-bold"
              {...register('title', { required: 'Title is required' })}
            />
            <div>

              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Card.Header>

          <Card.Body>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k as 'questions' | 'responses')}
              className="mb-3"
            >
              <Tab eventKey="questions" title="Questions">
                <div className="mb-3">
                  <Form.Group controlId="formDescription" className="mb-3">
                    <FloatingLabel controlId="floatingDescription" label="Form description">
                      <Form.Control
                        as="textarea"
                        style={{ height: '100px' }}
                        placeholder="Form description"
                        {...register('description')}
                      />
                    </FloatingLabel>
                  </Form.Group>

                  <div className="d-flex mb-3">
                    <Button variant="outline-secondary" onClick={() => setShowSettings(true)}>
                      <MdSettings /> Form Settings
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowAccessModal(true)}
                      className="ms-2"
                    >
                      Access Settings
                    </Button>
                  </div>

                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="questions">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {fields.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="mb-3"
                                >
                                  <Card>
                                    <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                                      <div {...provided.dragHandleProps}>
                                        <MdDragIndicator size={24} />
                                      </div>
                                      <div className="d-flex">
                                        <FormCheck
                                          type="switch"
                                          id={`showInTable-${item.id}`}
                                          label="Show in table"
                                          {...register(`questions.${index}.showInTable` as const)}
                                          className="me-3"
                                        />
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() => remove(index)}
                                        >
                                          <MdDelete />
                                        </Button>
                                      </div>
                                    </Card.Header>
                                    <Card.Body>
                                      <Row className="mb-3">
                                        <Col md={6}>
                                          <Form.Control
                                            type="text"
                                            placeholder="Question"
                                            {...register(`questions.${index}.title` as const, {
                                              required: 'Question is required'
                                            })}
                                          />
                                        </Col>
                                        <Col md={6}>
                                          <Form.Select
                                            {...register(`questions.${index}.type` as const)}
                                          >
                                            <option value="SINGLE_LINE_TEXT">Short answer</option>
                                            <option value="MULTI_LINE_TEXT">Paragraph</option>
                                            <option value="INTEGER">Number</option>
                                            <option value="CHECKBOX">Checkboxes</option>
                                            <option value="SINGLE_CHOICE">Multiple choice</option>
                                          </Form.Select>
                                        </Col>
                                      </Row>
                                      <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Description (optional)"
                                        {...register(`questions.${index}.description` as const)}
                                        className="mb-3"
                                      />
                                      {(watch(`questions.${index}.type`) === 'CHECKBOX' || watch(`questions.${index}.type`) === 'SINGLE_CHOICE') && (
                                        <OptionsEditor
                                          control={control}
                                          register={register}
                                          questionIndex={index}
                                        />
                                      )}
                                      <FormCheck
                                        type="checkbox"
                                        id={`required-${item.id}`}
                                        label="Required"
                                        {...register(`questions.${index}.isRequired` as const)}
                                      />
                                    </Card.Body>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-add-question">
                      <MdAdd /> Add question
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => addQuestion('SINGLE_LINE_TEXT')}>Short answer</Dropdown.Item>
                      <Dropdown.Item onClick={() => addQuestion('MULTI_LINE_TEXT')}>Paragraph</Dropdown.Item>
                      <Dropdown.Item onClick={() => addQuestion('INTEGER')}>Number</Dropdown.Item>
                      <Dropdown.Item onClick={() => addQuestion('CHECKBOX')}>Checkboxes</Dropdown.Item>
                      <Dropdown.Item onClick={() => addQuestion('SINGLE_CHOICE')}>Multiple choice</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Tab>

            </Tabs>
          </Card.Body>
        </Card>
      </Form>

      <Modal show={showSettings} onHide={() => setShowSettings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Form Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTopic" className="mb-3">
            <Form.Label>Topic</Form.Label>
            <Form.Select {...register('topic')}>
              <option value="Education">Education</option>
              <option value="Quiz">Quiz</option>
              <option value="Survey">Survey</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formImage" className="mb-3">
            <Form.Label>Form Image</Form.Label>
            <div className="d-flex align-items-center">
              {watch('imageUrl') && (
                <img
                  src={watch('imageUrl')}
                  alt="Form preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                />
              )}
              <div>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="imageUpload"
                />
                <Button variant="outline-secondary" as="label" htmlFor="imageUpload">
                  <MdImage /> {watch('imageUrl') ? 'Change Image' : 'Upload Image'}
                </Button>
                {watch('imageUrl') && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => setValue('imageUrl', '')}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </Form.Group>

          <Form.Group controlId="formTags" className="mb-3">
            <Form.Label>Tags</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tags separated by commas"
              onChange={handleTagChange}
              value={watch('tags').join(', ')}
            />
            <div className="mt-2">
              {watch('tags').map((tag, index) => (
                <Badge key={index} bg="secondary" className="me-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowSettings(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAccessModal} onHide={() => setShowAccessModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Access Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formAccessType" className="mb-3">
            <Form.Label>Who can fill out this form?</Form.Label>
            <Form.Select {...register('accessType')}>
              <option value="PUBLIC">Any authenticated user</option>
              <option value="RESTRICTED">Only specific users</option>
            </Form.Select>
          </Form.Group>

          {watch('accessType') === 'RESTRICTED' && (
            <div className="mt-3">
              <Form.Label>Select users</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search users by name or email"
                  value={searchTerm}
                  onChange={handleUserSearch}
                />
                <Button variant="outline-secondary">
                  Search
                </Button>
              </InputGroup>

              {searchTerm && (
                <ListGroup className="mb-3">
                  {filteredUsers.map(user => (
                    <ListGroup.Item
                      key={user.id}
                      action
                      onClick={() => addUser(user)}
                    >
                      {user.name} ({user.email})
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              <div className="mb-3">
                <h6>Selected Users ({selectedUsers.length})</h6>
                {selectedUsers.length > 0 ? (
                  <ListGroup>
                    {selectedUsers.map(user => (
                      <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          {user.name} ({user.email})
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeUser(user.id)}
                        >
                          <MdDelete />
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted">No users selected</p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAccessModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowAccessModal(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

interface OptionsEditorProps {
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  questionIndex: number;
}

const OptionsEditor: React.FC<OptionsEditorProps> = ({ control, register, questionIndex }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options` as never, // Use 'as never' as a workaround
    rules: { required: "At least one option is required" }
  });

  return (
    <div className="mb-3">
      <h6>Options</h6>
      {fields.map((item, index) => (
        <InputGroup key={item.id} className="mb-2">
          <Form.Control
            type="text"
            placeholder={`Option ${index + 1}`}
            {...register(`questions.${questionIndex}.options.${index}` as const, {
              required: 'Option text is required'
            })}
          />
          <Button
            variant="outline-danger"
            onClick={() => remove(index)}
            disabled={fields.length <= 1}
          >
            <MdDelete />
          </Button>
        </InputGroup>
      ))}
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => append('')} // Append empty string
      >
        <MdAdd /> Add Option
      </Button>
    </div>
  );
};

export default TemplateEditor;