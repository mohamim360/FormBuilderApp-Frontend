import { useState, useEffect } from 'react';
import { Tab, Tabs, Container, Card, Spinner, Alert, Row, Col, Image, Badge, Button } from 'react-bootstrap';
import { FaUser, FaClipboard, FaList, FaPlus, FaUserShield, FaSalesforce } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TemplateService } from '../services/templateService';
import { fetchUserForms_dash } from '../services/formService';
import { Template, Form } from '../types/types';
import TemplateCard from '../components/TemplateCard';
import FormList from './FormList';
import AdminDashboard from './AdminDashboard';
import SalesforceForm from './SalesforceForm';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState({
    profile: false,
    templates: true,
    forms: true
  });

  const [error, setError] = useState<{
    profile: string | null;
    templates: string | null;
    forms: string | null;
  }>({
    profile: null,
    templates: null,
    forms: null
  });

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await TemplateService.getUserTemplates();
        setTemplates(data?.templates || []);
      } catch (err) {
        setError(prev => ({ ...prev, templates: err instanceof Error ? err.message : 'Failed to load templates' }));
      } finally {
        setLoading(prev => ({ ...prev, templates: false }));
      }
    };

    const loadForms = async () => {
      try {
        const data = await fetchUserForms_dash();
        setForms(data || []);
      } catch (err) {
        setError(prev => ({ ...prev, forms: err instanceof Error ? err.message : 'Failed to load forms' }));
      } finally {
        setLoading(prev => ({ ...prev, forms: false }));
      }
    };

    if (activeTab === 'templates') {
      loadTemplates();
    } else if (activeTab === 'forms') {
      loadForms();
    }
  }, [activeTab]);

  const getAvatar = () => {
    if (!user) return '';
    if (user.avatarUrl) return user.avatarUrl;
    const initials = user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff&size=150`;
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Dashboard</h1>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'profile')}
        className="mb-4"
      >
        <Tab eventKey="profile" title={<><FaUser className="me-1" /> Profile</>}>
          {loading.profile ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : error.profile ? (
            <Alert variant="danger">{error.profile}</Alert>
          ) : (
            <Row>
              <Col md={4}>
                <Card className="mb-4">
                  <Card.Body className="text-center">
                    <Image src={getAvatar()} roundedCircle className="mb-3" width={150} height={150} />
                    <h3>{user?.name}</h3>
                    <p className="text-muted">{user?.email}</p>
                    <Badge bg={user?.role === 'ADMIN' ? 'danger' : 'primary'}>
                      {user?.role}
                    </Badge>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <h5 className="mb-3">Account Information</h5>
                    <div className="mb-3">
                      <small className="text-muted">Member Since</small>
                      <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Templates Created</small>
                      <p>{templates.length}</p>
                    </div>
                    <div>
                      <small className="text-muted">Forms Submitted</small>
                      <p>{forms.length}</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={8}>
                <Card className="mb-4">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <FaSalesforce className="text-primary me-2" size={20} />
                      <h5 className="mb-0">Salesforce Integration</h5>
                    </div>
                    <p className="text-muted mb-4">
                      Connect your profile to Salesforce to sync your information.
                    </p>
                    {user && (
                      <SalesforceForm
                        userId={user.id}
                        userName={user.name}
                        userEmail={user.email}
                      />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Tab>

        <Tab eventKey="templates" title={<><FaClipboard className="me-1" /> My Templates</>}>
          {loading.templates ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : error.templates ? (
            <Alert variant="danger">{error.templates}</Alert>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Templates</h2>
                <Link to="/template" >
                  <Button variant="primary">
                    <FaPlus className="me-1" /> Create New Template
                  </Button>
                </Link>
              </div>

              {templates.length === 0 ? (
                <Card>
                  <Card.Body className="text-center py-5">
                    <h4 className="text-muted">You haven't created any templates yet</h4>
                    <Link to="/template" >
                      <Button variant="primary" className="mt-3">
                        Create Your First Template
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              ) : (
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                  {templates.map(template => (
                    <Col key={template.id}>
                      <Link
                        to={`/${template.id}`}
                        className='text-decoration-none'
                      >
                        <TemplateCard template={template} />
                      </Link>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </Tab>

        <Tab eventKey="forms" title={<><FaList className="me-1" /> My Submissions</>}>
          <FormList />
        </Tab>
        
        {user?.role === 'ADMIN' && (
          <Tab eventKey="admin" title={<><FaUserShield className="me-1" /> Admin</>}>
            <AdminDashboard />
          </Tab>
        )}
      </Tabs>
    </Container>
  );
};

export default Dashboard;